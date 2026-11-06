/**
 * state.js - Game State, Exploration Memory, Automap & Persistence
 * 30x30 5-Floor Vertical Dungeon Explorer
 */

const STORAGE_KEY = 'DUNGEON_EXPLORER_V2';

const DIRECTIONS = [
  { name: 'NORTH', short: 'N', dx: 0, dy: -1 },
  { name: 'EAST',  short: 'E', dx: 1, dy: 0 },
  { name: 'SOUTH', short: 'S', dx: 0, dy: 1 },
  { name: 'WEST',  short: 'W', dx: -1, dy: 0 }
];

class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.floor = 0; // 1F
    this.x = DUNGEON_DATA.floors[0].start.x;
    this.y = DUNGEON_DATA.floors[0].start.y;
    this.dir = DUNGEON_DATA.floors[0].start.dir; // South

    this.openedDoors = new Set(); // 'floor,x,y'
    this.revealedSecrets = new Set(); // 'floor,x,y'
    
    // Visited tiles per floor: visited[floor][y][x] = true/false
    this.visited = DUNGEON_DATA.floors.map(f => {
      const arr = [];
      for (let y = 0; y < f.height; y++) {
        arr.push(new Array(f.width).fill(false));
      }
      return arr;
    });

    this.steps = 0;
    this.startTime = Date.now();
    this.clearedTime = null;
    this.gameCleared = false;
    this.viewMode = '3D'; // '3D' or 'MAP'
    this.mapSelectedFloor = 0;

    // Mark initial position and surroundings
    this.markVisited(this.floor, this.x, this.y);
    this.revealSurroundings();
  }

  markVisited(floor, x, y) {
    if (this.visited[floor] && this.visited[floor][y] && this.visited[floor][y][x] !== undefined) {
      this.visited[floor][y][x] = true;
    }
  }

  // Turn left or right (delta: -1 or +1)
  turn(delta) {
    this.dir = (this.dir + delta + 4) % 4;
    window.soundSystem.playTurn();
    this.revealSurroundings();
    this.save();
  }

  // Move forward (+1) or backward (-1)
  move(stepDelta) {
    const dirInfo = DIRECTIONS[this.dir];
    const targetX = this.x + dirInfo.dx * stepDelta;
    const targetY = this.y + dirInfo.dy * stepDelta;
    return this.tryMoveTo(targetX, targetY);
  }

  // Strafe left (-1) or right (+1)
  strafe(strafeDelta) {
    const strafeDir = (this.dir + (strafeDelta > 0 ? 1 : 3)) % 4;
    const dirInfo = DIRECTIONS[strafeDir];
    const targetX = this.x + dirInfo.dx;
    const targetY = this.y + dirInfo.dy;
    return this.tryMoveTo(targetX, targetY);
  }

  tryMoveTo(targetX, targetY) {
    const curFloorData = DUNGEON_DATA.floors[this.floor];
    
    // Bounds check
    if (targetX < 0 || targetX >= curFloorData.width || targetY < 0 || targetY >= curFloorData.height) {
      window.soundSystem.playBump();
      return { success: false, reason: 'wall' };
    }

    const tile = curFloorData.grid[targetY][targetX];
    const tileKey = `${this.floor},${targetX},${targetY}`;

    // Wall collision
    if (tile === TILES.WALL) {
      window.soundSystem.playBump();
      return { success: false, reason: 'wall' };
    }

    // Secret wall collision (unless revealed)
    if (tile === TILES.SECRET_WALL && !this.revealedSecrets.has(tileKey)) {
      window.soundSystem.playBump();
      return { success: false, reason: 'wall' };
    }

    // Door
    if (tile === TILES.DOOR) {
      if (!this.openedDoors.has(tileKey)) {
        this.openedDoors.add(tileKey);
        window.soundSystem.playDoorOpen();
      } else {
        window.soundSystem.playStep();
      }
      this.executeMove(targetX, targetY);
      return { success: true, message: '扉を開けて進んだ。' };
    }

    // Open floor / Stairs / Spinner / Warp
    window.soundSystem.playStep();
    this.executeMove(targetX, targetY);
    return { success: true };
  }

  executeMove(targetX, targetY) {
    this.x = targetX;
    this.y = targetY;
    this.steps++;
    this.markVisited(this.floor, this.x, this.y);

    // Line-of-sight & surrounding tiles
    this.revealSurroundings();

    this.save();
  }

  revealSurroundings() {
    const curFloorData = DUNGEON_DATA.floors[this.floor];

    const isBlockingTile = (x, y) => {
      if (x < 0 || x >= curFloorData.width || y < 0 || y >= curFloorData.height) return true;
      const tile = curFloorData.grid[y][x];
      const key = `${this.floor},${x},${y}`;
      if (tile === TILES.WALL) return true;
      if (tile === TILES.SECRET_WALL && !this.revealedSecrets.has(key)) return true;
      if ((tile === TILES.DOOR || tile === TILES.DOOR_IRON || 
           tile === TILES.DOOR_SILVER || tile === TILES.DOOR_GOLD) && 
          !this.openedDoors.has(key)) {
        return true;
      }
      return false;
    };

    const hasLineOfSight = (x0, y0, x1, y1) => {
      let dx = Math.abs(x1 - x0);
      let dy = Math.abs(y1 - y0);
      let sx = (x0 < x1) ? 1 : -1;
      let sy = (y0 < y1) ? 1 : -1;
      let err = dx - dy;

      let cx = x0;
      let cy = y0;

      while (cx !== x1 || cy !== y1) {
        if (cx !== x0 || cy !== y0) {
          if (isBlockingTile(cx, cy)) {
            return false;
          }
        }
        let e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          cx += sx;
        }
        if (e2 < dx) {
          err += dx;
          cy += sy;
        }
      }
      return true;
    };

    // 1. Reveal 3x3 immediately around player (unconditional)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = this.x + dx;
        const ny = this.y + dy;
        if (nx >= 0 && nx < curFloorData.width && ny >= 0 && ny < curFloorData.height) {
          this.markVisited(this.floor, nx, ny);
        }
      }
    }

    // 2. Reveal expansive Field-of-View Cone in front of player (up to 5 tiles distance)
    const fwd = DIRECTIONS[this.dir];
    const right = DIRECTIONS[(this.dir + 1) % 4];

    // Lateral vision width per distance:
    // d=1: lat -1..1 (3 tiles wide)
    // d=2: lat -2..2 (5 tiles wide)
    // d=3: lat -3..3 (7 tiles wide)
    // d=4: lat -3..3 (7 tiles wide)
    // d=5: lat -2..2 (5 tiles wide)
    const latSpans = [0, 1, 2, 3, 3, 2];

    for (let dist = 1; dist <= 5; dist++) {
      const maxLat = latSpans[dist] || 1;
      for (let lat = -maxLat; lat <= maxLat; lat++) {
        const tx = this.x + fwd.dx * dist + right.dx * lat;
        const ty = this.y + fwd.dy * dist + right.dy * lat;

        if (tx >= 0 && tx < curFloorData.width && ty >= 0 && ty < curFloorData.height) {
          if (hasLineOfSight(this.x, this.y, tx, ty)) {
            this.markVisited(this.floor, tx, ty);
          }
        }
      }
    }
  }

  // Calculate exploration percentage for current floor & overall
  getExplorationStats(floorIdx = null) {
    if (floorIdx !== null && floorIdx !== undefined) {
      const f = DUNGEON_DATA.floors[floorIdx];
      let visitedCount = 0;
      let totalNonWall = 0;
      for (let y = 0; y < f.height; y++) {
        for (let x = 0; x < f.width; x++) {
          if (f.grid[y][x] !== TILES.WALL) {
            totalNonWall++;
            if (this.visited[floorIdx][y][x]) {
              visitedCount++;
            }
          }
        }
      }
      return {
        visited: visitedCount,
        total: totalNonWall,
        percentage: Math.min(100, Math.round((visitedCount / Math.max(1, totalNonWall)) * 100))
      };
    }

    // Overall stats across all 5 floors
    let totalVisited = 0;
    let totalTiles = 0;

    DUNGEON_DATA.floors.forEach((f, fIdx) => {
      for (let y = 0; y < f.height; y++) {
        for (let x = 0; x < f.width; x++) {
          if (f.grid[y][x] !== TILES.WALL) {
            totalTiles++;
            if (this.visited[fIdx][y][x]) {
              totalVisited++;
            }
          }
        }
      }
    });

    const percent = Math.min(100, Math.round((totalVisited / Math.max(1, totalTiles)) * 100));
    return {
      visited: totalVisited,
      total: totalTiles,
      percentage: percent
    };
  }

  // Save to LocalStorage
  save() {
    try {
      const data = {
        floor: this.floor,
        x: this.x,
        y: this.y,
        dir: this.dir,
        openedDoors: Array.from(this.openedDoors),
        revealedSecrets: Array.from(this.revealedSecrets),
        visited: this.visited,
        steps: this.steps,
        startTime: this.startTime,
        clearedTime: this.clearedTime,
        gameCleared: this.gameCleared
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  // Load from LocalStorage
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;
      const data = JSON.parse(saved);

      if (data.visited && data.visited.length === DUNGEON_DATA.floors.length) {
        this.floor = data.floor ?? 0;
        this.x = data.x ?? 1;
        this.y = data.y ?? 1;
        this.dir = data.dir ?? 0;
        this.openedDoors = new Set(data.openedDoors || []);
        this.revealedSecrets = new Set(data.revealedSecrets || []);
        this.visited = data.visited;
        this.steps = data.steps || 0;
        this.startTime = data.startTime || Date.now();
        this.clearedTime = data.clearedTime || null;
        this.gameCleared = data.gameCleared || false;

        this.markVisited(this.floor, this.x, this.y);
        this.revealSurroundings();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to load save data', e);
      return false;
    }
  }

  clearSave() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Also remove old key if present
      localStorage.removeItem('LABYRINTH_SAVE_V1');
    } catch (e) {
      console.warn('Failed to clear save', e);
    }
    this.reset();
  }
}

window.gameState = new GameState();
