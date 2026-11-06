/**
 * main.js - Core Game Controller, Event Listeners, and HUD Manager
 * 30x30 5-Floor Vertical Dungeon Explorer
 */

class GameController {
  constructor() {
    this.state = window.gameState;
    this.sound = window.soundSystem;

    // Viewport elements
    this.wrapper3d = document.getElementById('canvas-wrapper-3d');
    this.wrapperMap = document.getElementById('canvas-wrapper-map');
    this.canvas3d = document.getElementById('canvas-3d');
    this.canvasMap = document.getElementById('canvas-map');

    this.renderer3d = new DungeonRenderer3D(this.canvas3d);
    this.automap = new AutomapRenderer(this.canvasMap);

    // HUD Elements
    this.floorDisplay = document.getElementById('floor-display');
    this.directionDisplay = document.getElementById('direction-display');
    this.coordsDisplay = document.getElementById('coords-display');
    this.stepsDisplay = document.getElementById('steps-display');
    this.exploredDisplay = document.getElementById('explored-display');
    this.compassNeedle = document.getElementById('compass-needle');
    this.logContent = document.getElementById('log-content');
    this.logBox = document.getElementById('log-box');
    this.btnMapToggle = document.getElementById('btn-map-toggle');
    this.btnAudioToggle = document.getElementById('btn-audio-toggle');

    // Modals
    this.clearModal = document.getElementById('clear-modal');
    this.resetModal = document.getElementById('reset-confirm-modal');
    this.paintingModal = document.getElementById('painting-modal');
    this.paintingModalCanvas = document.getElementById('painting-modal-canvas');
    this.paintingModalTitle = document.getElementById('painting-modal-title');
    this.paintingModalArtist = document.getElementById('painting-modal-artist');
    this.paintingModalDesc = document.getElementById('painting-modal-desc');
    this.paintingModalHint = document.getElementById('painting-modal-hint');

    // Milestones tracking per floor (e.g. 25, 50, 75, 100)
    this.notifiedMilestones = new Set();
    this.lastNotifiedPaintingId = null;

    this.isActionLocked = false;
  }

  init() {
    // Attempt to load existing save game
    this.state.load();

    this.setupEventListeners();
    this.setupTouchControls();
    this.updateHUD();
    this.render();
    this.startAnimationLoop();

    const curFloorName = DUNGEON_DATA.floors[this.state.floor].name;
    this.log(`広大なる30×30マス・全5階層の立体迷宮へ足を踏み入れた。（現在: ${curFloorName}）`, 'system-msg');
  }

  setupEventListeners() {
    // First user interaction unlocks Web Audio context
    const unlockAudio = () => {
      this.sound.init();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      this.handleInput(e.code);
    });

    // Header buttons
    this.btnMapToggle.addEventListener('click', () => this.toggleMap());
    this.btnAudioToggle.addEventListener('click', () => this.toggleAudio());

    // Map floor buttons (1F - 5F)
    const floorBtns = document.querySelectorAll('.floor-btn');
    floorBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const floorIdx = parseInt(e.target.dataset.floor, 10);
        this.state.mapSelectedFloor = floorIdx;
        floorBtns.forEach(b => b.classList.toggle('active', b === e.target));
        this.render();
      });
    });

    // Clear Modal Buttons
    document.getElementById('btn-continue-explore')?.addEventListener('click', () => {
      this.clearModal.classList.add('hidden');
      this.log('迷宮の探索を続行します。全フロア100%踏破を目指そう！', 'event-msg');
    });

    document.getElementById('btn-play-again')?.addEventListener('click', () => {
      this.clearModal.classList.add('hidden');
      this.state.clearSave();
      this.updateHUD();
      this.render();
      this.log('新たな迷宮探索が始まった！', 'system-msg');
    });

    // Reset Confirmation
    document.getElementById('btn-reset-confirm')?.addEventListener('click', () => {
      this.state.clearSave();
      this.resetModal.classList.add('hidden');
      this.updateHUD();
      this.render();
      this.log('冒険をリセットしました。', 'system-msg');
    });
    document.getElementById('btn-reset-cancel')?.addEventListener('click', () => {
      this.resetModal.classList.add('hidden');
    });

    // Painting Modal Buttons
    document.getElementById('btn-close-painting')?.addEventListener('click', () => {
      this.closePaintingModal();
    });
    document.getElementById('btn-close-painting-x')?.addEventListener('click', () => {
      this.closePaintingModal();
    });
    this.paintingModal?.addEventListener('click', (e) => {
      if (e.target === this.paintingModal) {
        this.closePaintingModal();
      }
    });

    // Window resize handling
    window.addEventListener('resize', () => {
      this.render();
    });
  }

  setupTouchControls() {
    const touchButtons = document.querySelectorAll('#touch-controls .ctrl-btn');
    touchButtons.forEach(btn => {
      const code = btn.dataset.key;
      const activate = (e) => {
        e.preventDefault();
        this.handleInput(code);
      };

      btn.addEventListener('touchstart', activate, { passive: false });
      btn.addEventListener('mousedown', activate);
    });
  }

  handleInput(code) {
    // If Painting Modal is open, any action/escape/map key closes it
    if (this.paintingModal && !this.paintingModal.classList.contains('hidden')) {
      if (['Space', 'Enter', 'Escape', 'KeyM', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'KeyQ', 'KeyE'].includes(code)) {
        this.closePaintingModal();
      }
      return;
    }

    if (this.state.gameCleared && !this.clearModal.classList.contains('hidden')) {
      return;
    }

    if (this.isActionLocked) return;

    let didAct = false;

    switch (code) {
      // Turn Left
      case 'KeyQ':
      case 'ArrowLeft':
        this.state.turn(-1);
        didAct = true;
        break;

      // Turn Right
      case 'KeyE':
      case 'ArrowRight':
        this.state.turn(1);
        didAct = true;
        break;

      // Move Forward
      case 'KeyW':
      case 'ArrowUp': {
        const res = this.state.move(1);
        if (res.message) this.log(res.message, res.success ? 'event-msg' : 'warning-msg');
        if (res.success) this.checkPostMoveTriggers();
        didAct = true;
        break;
      }

      // Move Backward
      case 'KeyS':
      case 'ArrowDown': {
        const res = this.state.move(-1);
        if (res.message) this.log(res.message, res.success ? 'event-msg' : 'warning-msg');
        if (res.success) this.checkPostMoveTriggers();
        didAct = true;
        break;
      }

      // Strafe Left
      case 'KeyA': {
        const res = this.state.strafe(-1);
        if (res.message) this.log(res.message, res.success ? 'event-msg' : 'warning-msg');
        if (res.success) this.checkPostMoveTriggers();
        didAct = true;
        break;
      }

      // Strafe Right
      case 'KeyD': {
        const res = this.state.strafe(1);
        if (res.message) this.log(res.message, res.success ? 'event-msg' : 'warning-msg');
        if (res.success) this.checkPostMoveTriggers();
        didAct = true;
        break;
      }

      // Action / Search / Interact
      case 'Space':
      case 'Enter':
        this.handleSearch();
        didAct = true;
        break;

      // Toggle Map
      case 'KeyM':
        this.toggleMap();
        break;
    }

    if (didAct) {
      this.checkFrontForPaintingNotice();
      this.checkMilestones();
      this.updateHUD();
      this.render();
    }
  }

  // Handle Search / Interaction [SPACE]
  handleSearch() {
    const curFloor = DUNGEON_DATA.floors[this.state.floor];
    const dirInfo = DIRECTIONS[this.state.dir];
    const fx = this.state.x + dirInfo.dx;
    const fy = this.state.y + dirInfo.dy;
    const frontKey = `${this.state.floor},${fx},${fy}`;

    // 1. Check current standing tile interactives first (Monument / Stairs)
    const standingInteractive = curFloor.interactives[`${this.state.x},${this.state.y}`];
    if (standingInteractive) {
      if (standingInteractive.type === 'monument') {
        this.handleMonumentReached();
        return;
      }
      if (standingInteractive.type === 'stairs_down' || standingInteractive.type === 'stairs_up') {
        this.useStairs(standingInteractive);
        return;
      }
    }

    // 2. Check tile directly in front
    if (fx >= 0 && fx < curFloor.width && fy >= 0 && fy < curFloor.height) {
      const frontTile = curFloor.grid[fy][fx];
      const frontInteractive = curFloor.interactives[`${fx},${fy}`];

      // Check Secret Wall
      if (frontTile === TILES.SECRET_WALL) {
        if (!this.state.revealedSecrets.has(frontKey)) {
          this.state.revealedSecrets.add(frontKey);
          this.sound.playSecret();
          this.log('怪しい壁の隙間を押すと、隠し扉が開いた！', 'hint-msg');
          this.state.save();
          this.render();
          return;
        }
      }

      // Check Front Interactive
      if (frontInteractive) {
        if (frontInteractive.type === 'painting') {
          this.inspectPainting(frontInteractive.paintingId);
          return;
        }
        if (frontInteractive.type === 'monument') {
          this.handleMonumentReached();
          return;
        }
        if (frontInteractive.type === 'message') {
          this.sound.playTurn();
          this.log(frontInteractive.text, 'event-msg');
          return;
        }
        if (frontInteractive.type === 'stairs_down' || frontInteractive.type === 'stairs_up') {
          this.log(frontInteractive.text + '（足元のマスへ進めば階段を利用できます）', 'hint-msg');
          return;
        }
      }

      // Check Door in front (step into it)
      if (frontTile === TILES.DOOR) {
        const res = this.state.tryMoveTo(fx, fy);
        if (res.message) this.log(res.message, res.success ? 'event-msg' : 'warning-msg');
        if (res.success) this.checkPostMoveTriggers();
        this.updateHUD();
        this.render();
        return;
      }
    }

    // Check standing message
    if (standingInteractive && standingInteractive.type === 'message') {
      this.sound.playTurn();
      this.log(standingInteractive.text, 'event-msg');
      return;
    }

    // Nothing special found
    this.sound.playStep();
    this.log('周囲を慎重に調べた。足音だけが迷宮に響いている。', 'system-msg');
  }

  // Inspect Masterpiece Landmark Painting
  inspectPainting(paintingId) {
    const painting = window.paintingManager?.getPainting(paintingId);
    if (!painting) return;

    this.sound.playPaintingDiscovery();

    // Log messages
    this.log(`🖼️ 名画『${painting.title}』（${painting.artist}、${painting.year}）を鑑賞した。`, 'event-msg');
    this.log(painting.landmarkHint, 'hint-msg');

    // Populate modal texts
    if (this.paintingModalTitle) {
      this.paintingModalTitle.textContent = `${painting.title} (${painting.originalTitle})`;
    }
    if (this.paintingModalArtist) {
      this.paintingModalArtist.textContent = `${painting.artist} (${painting.year})`;
    }
    if (this.paintingModalDesc) {
      this.paintingModalDesc.textContent = painting.desc;
    }
    if (this.paintingModalHint) {
      this.paintingModalHint.textContent = `📍 ${painting.landmarkHint}`;
    }

    // Draw high-res canvas onto modal canvas
    const modalCanvas = window.paintingManager?.getModalCanvas(painting.id);
    if (modalCanvas && this.paintingModalCanvas) {
      this.paintingModalCanvas.width = modalCanvas.width;
      this.paintingModalCanvas.height = modalCanvas.height;
      const mctx = this.paintingModalCanvas.getContext('2d');
      mctx.drawImage(modalCanvas, 0, 0);
    }

    // Show modal
    if (this.paintingModal) {
      this.paintingModal.classList.remove('hidden');
    }
  }

  closePaintingModal() {
    if (this.paintingModal) {
      this.paintingModal.classList.add('hidden');
    }
  }

  checkFrontForPaintingNotice() {
    const curFloor = DUNGEON_DATA.floors[this.state.floor];
    const dirInfo = DIRECTIONS[this.state.dir];
    const fx = this.state.x + dirInfo.dx;
    const fy = this.state.y + dirInfo.dy;
    if (fx >= 0 && fx < curFloor.width && fy >= 0 && fy < curFloor.height) {
      const frontInteractive = curFloor.interactives[`${fx},${fy}`];
      if (frontInteractive && frontInteractive.type === 'painting') {
        const painting = window.paintingManager?.getPainting(frontInteractive.paintingId);
        if (painting && this.lastNotifiedPaintingId !== painting.id) {
          this.lastNotifiedPaintingId = painting.id;
          this.log(`🖼️ 正面の壁に名画『${painting.title}』が飾られている。（[SPACE]で鑑賞）`, 'hint-msg');
        }
        return;
      }
    }
    this.lastNotifiedPaintingId = null;
  }

  useStairs(stairInfo) {
    const isDown = stairInfo.type === 'stairs_down';
    this.sound.playStairs(isDown);
    this.state.floor = stairInfo.targetFloor;
    this.state.x = stairInfo.targetX;
    this.state.y = stairInfo.targetY;
    this.state.dir = stairInfo.targetDir;
    this.state.mapSelectedFloor = this.state.floor;
    this.state.markVisited(this.state.floor, this.state.x, this.state.y);
    this.state.revealSurroundings();

    const floorName = DUNGEON_DATA.floors[this.state.floor].name;
    this.log(`階段を${isDown ? '下り' : '上り'}、${floorName} へ到達した！`, 'event-msg');
    this.state.save();
    this.updateHUD();
    this.render();
  }

  checkPostMoveTriggers() {
    const curFloor = DUNGEON_DATA.floors[this.state.floor];
    const curTile = curFloor.grid[this.state.y][this.state.x];
    const standingInteractive = curFloor.interactives[`${this.state.x},${this.state.y}`];

    // Monument reached by stepping on it
    if (standingInteractive && standingInteractive.type === 'monument') {
      this.handleMonumentReached();
      return;
    }

    // Spinner trigger (rotates player randomly)
    if (curTile === TILES.SPINNER) {
      this.sound.playSpinner();
      const newDir = Math.floor(Math.random() * 4);
      this.state.dir = newDir;
      this.log('回転床の罠を踏んでしまった！視界が激しく回転した！', 'warning-msg');
      return;
    }

    // Warp trigger
    if (curTile === TILES.WARP && standingInteractive && standingInteractive.type === 'warp') {
      this.sound.playSpinner();
      this.state.floor = standingInteractive.targetFloor;
      this.state.x = standingInteractive.targetX;
      this.state.y = standingInteractive.targetY;
      this.state.dir = standingInteractive.targetDir;
      this.state.mapSelectedFloor = this.state.floor;
      this.state.markVisited(this.state.floor, this.state.x, this.state.y);
      this.state.revealSurroundings();
      this.log(standingInteractive.text, 'warning-msg');
      return;
    }

    // Stairs prompt
    if (curTile === TILES.STAIRS_DOWN || curTile === TILES.STAIRS_UP) {
      if (standingInteractive) {
        this.log(standingInteractive.text + ' [SPACE]キーで昇降できます。', 'hint-msg');
      }
      return;
    }

    // Message prompt
    if (standingInteractive && standingInteractive.type === 'message') {
      this.log(standingInteractive.text, 'event-msg');
    }

    this.checkFrontForPaintingNotice();
  }

  checkMilestones() {
    const curFloorIdx = this.state.floor;
    const floorStats = this.state.getExplorationStats(curFloorIdx);
    const milestones = [25, 50, 75, 100];

    for (const m of milestones) {
      const key = `${curFloorIdx}-${m}`;
      if (floorStats.percentage >= m && !this.notifiedMilestones.has(key)) {
        this.notifiedMilestones.add(key);
        const fName = DUNGEON_DATA.floors[curFloorIdx].name;
        this.log(`【探索マイルストーン】${fName} の踏破率が ${m}% に達した！`, 'relic-msg');
      }
    }
  }

  handleMonumentReached() {
    this.state.gameCleared = true;
    if (!this.state.clearedTime) {
      this.state.clearedTime = Date.now();
    }
    this.sound.playVictory();
    this.showClearModal();
    this.log('★ 天頂碑へ到達！全5階層の立体迷宮を踏破した！おめでとうございます！ ★', 'relic-msg');
    this.state.save();
  }

  showClearModal() {
    const elapsedSec = Math.floor(((this.state.clearedTime || Date.now()) - this.state.startTime) / 1000);
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const stats = this.state.getExplorationStats();

    document.getElementById('final-steps').textContent = this.state.steps;
    document.getElementById('final-explored').textContent = `${stats.percentage}%`;
    document.getElementById('final-time').textContent = timeStr;

    this.clearModal.classList.remove('hidden');
  }

  toggleMap() {
    if (this.state.viewMode === '3D') {
      this.state.viewMode = 'MAP';
      this.state.mapSelectedFloor = this.state.floor;
      this.wrapper3d.classList.remove('active');
      this.wrapperMap.classList.add('active');
      this.btnMapToggle.innerHTML = '👁️ 3D [M]';
    } else {
      this.state.viewMode = '3D';
      this.wrapperMap.classList.remove('active');
      this.wrapper3d.classList.add('active');
      this.btnMapToggle.innerHTML = '🗺️ MAP [M]';
    }
    this.sound.playTurn();
    this.render();
  }

  toggleAudio() {
    const enabled = this.sound.toggle();
    this.btnAudioToggle.textContent = enabled ? '🔊' : '🔇';
    this.log(`効果音: ${enabled ? '有効' : 'ミュート'}`, 'system-msg');
  }

  updateHUD() {
    const dirInfo = DIRECTIONS[this.state.dir];
    const overallStats = this.state.getExplorationStats();

    this.floorDisplay.textContent = `${this.state.floor + 1}F`;
    this.directionDisplay.textContent = `DIR: ${dirInfo.name}`;
    this.coordsDisplay.textContent = `X:${String(this.state.x).padStart(2, '0')} Y:${String(this.state.y).padStart(2, '0')}`;
    this.stepsDisplay.textContent = `STEPS: ${this.state.steps}`;
    this.exploredDisplay.textContent = `踏破率: ${overallStats.percentage}%`;
    this.compassNeedle.textContent = dirInfo.short;

    // Update floor buttons in automap
    const floorBtns = document.querySelectorAll('.floor-btn');
    floorBtns.forEach(btn => {
      const fIdx = parseInt(btn.dataset.floor, 10);
      btn.classList.toggle('active', fIdx === (this.state.mapSelectedFloor ?? this.state.floor));
    });
  }

  startAnimationLoop() {
    const loop = (timestamp) => {
      if (this.state.viewMode === '3D' && !document.hidden) {
        this.renderer3d.render(this.state, timestamp);
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  render(time) {
    if (this.state.viewMode === '3D') {
      this.renderer3d.render(this.state, time);
    } else {
      this.automap.render(this.state);
    }
  }

  log(text, className = 'system-msg') {
    const p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    this.logContent.appendChild(p);

    // Keep log to max 40 entries
    while (this.logContent.children.length > 40) {
      this.logContent.removeChild(this.logContent.firstChild);
    }

    // Scroll to bottom
    this.logBox.scrollTop = this.logBox.scrollHeight;
  }
}

// Start Game on load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameController();
  window.game.init();
});
