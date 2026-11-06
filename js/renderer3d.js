/**
 * renderer3d.js - High Quality Pseudo-3D Dungeon Renderer
 * Features:
 * - Dimensional Stone Brickwork with Bevels, Highlights & Mortar Grooves
 * - Fully Perspective-Correct Side Wall Brickwork
 * - Cobblestone Floor & Beamed Stone Ceiling
 * - Animated Wall Torches with Ambient Glow & Dynamic Light Flickering
 * - Thematic Visual Styles per Floor (B1F Classic, B2F Ice/Sapphire, B3F Obsidian/Amethyst)
 * - Rich Medieval Archways & Decorated Metal/Wood Doors
 * - Deep Atmospheric Fog & Vignette
 */

// Deterministic hash / noise function for consistent brick variation & details
function getTileHash(floor, x, y, seed = 0) {
  let h = ((floor + 1) * 73856093) ^ (x * 19349663) ^ (y * 83492791) ^ (seed * 2654435761);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Color theme per floor (1F to 5F)
const FLOOR_THEMES = [
  // Floor 0: 1F - 始まりの石造回廊 (Classic Medieval Stone Dungeon)
  {
    name: '1F',
    stoneBase: '#1a2230',
    stoneLight: '#2c3b52',
    stoneDark: '#0e141e',
    stoneTint: '#212c3e',
    mortar: '#090d14',
    mortarEdge: '#05070a',
    wireframe: '#38bdf8',
    fogColor: '#05070a',
    ceilingTop: '#040608',
    ceilingBottom: '#101722',
    floorTop: '#0b1018',
    floorBottom: '#020305',
    cobbleLight: 'rgba(56, 189, 248, 0.12)',
    cobbleDark: 'rgba(5, 7, 10, 0.6)',
    torchFireInner: '#fef08a',
    torchFireMid: '#f97316',
    torchFireOuter: 'rgba(239, 68, 68, 0.7)',
    torchGlow: 'rgba(249, 115, 22, 0.18)',
    torchGlowSoft: 'rgba(251, 146, 60, 0.05)',
    beamColor: '#1e293b'
  },
  // Floor 1: 2F - 苔むす翡翠の回廊 (Ancient Overgrown Jade & Emerald)
  {
    name: '2F',
    stoneBase: '#12241d',
    stoneLight: '#1f3d32',
    stoneDark: '#0a1612',
    stoneTint: '#172f26',
    mortar: '#060f0b',
    mortarEdge: '#030806',
    wireframe: '#34d399',
    fogColor: '#030806',
    ceilingTop: '#020604',
    ceilingBottom: '#0e1f18',
    floorTop: '#091812',
    floorBottom: '#020504',
    cobbleLight: 'rgba(52, 211, 153, 0.14)',
    cobbleDark: 'rgba(3, 8, 6, 0.6)',
    torchFireInner: '#ecfdf5',
    torchFireMid: '#10b981',
    torchFireOuter: 'rgba(5, 150, 105, 0.7)',
    torchGlow: 'rgba(16, 185, 129, 0.20)',
    torchGlowSoft: 'rgba(52, 211, 153, 0.06)',
    beamColor: '#173024'
  },
  // Floor 2: 3F - 蒼冷の氷晶回廊 (Crystalline Ice & Sapphire)
  {
    name: '3F',
    stoneBase: '#112233',
    stoneLight: '#1d3c58',
    stoneDark: '#0a1420',
    stoneTint: '#172d42',
    mortar: '#060d15',
    mortarEdge: '#03080e',
    wireframe: '#06b6d4',
    fogColor: '#03080e',
    ceilingTop: '#020509',
    ceilingBottom: '#0c1a29',
    floorTop: '#081320',
    floorBottom: '#020407',
    cobbleLight: 'rgba(6, 182, 212, 0.14)',
    cobbleDark: 'rgba(3, 8, 14, 0.6)',
    torchFireInner: '#e0f2fe',
    torchFireMid: '#0284c7',
    torchFireOuter: 'rgba(14, 165, 233, 0.7)',
    torchGlow: 'rgba(14, 165, 233, 0.20)',
    torchGlowSoft: 'rgba(56, 189, 248, 0.06)',
    beamColor: '#15293d'
  },
  // Floor 3: 4F - 熾火の赤鉄回廊 (Volcanic Basalt & Crimson Flame)
  {
    name: '4F',
    stoneBase: '#261614',
    stoneLight: '#422421',
    stoneDark: '#140a09',
    stoneTint: '#331c19',
    mortar: '#0f0605',
    mortarEdge: '#080302',
    wireframe: '#f87171',
    fogColor: '#080302',
    ceilingTop: '#060202',
    ceilingBottom: '#210e0c',
    floorTop: '#170908',
    floorBottom: '#050202',
    cobbleLight: 'rgba(248, 113, 113, 0.14)',
    cobbleDark: 'rgba(8, 3, 2, 0.65)',
    torchFireInner: '#fff1f2',
    torchFireMid: '#ef4444',
    torchFireOuter: 'rgba(220, 38, 38, 0.8)',
    torchGlow: 'rgba(239, 68, 68, 0.25)',
    torchGlowSoft: 'rgba(248, 113, 113, 0.08)',
    beamColor: '#361b17'
  },
  // Floor 4: 5F - 星幽のアメジスト聖殿 (Astral Zenith & Royal Gold)
  {
    name: '5F',
    stoneBase: '#1c1526',
    stoneLight: '#322245',
    stoneDark: '#0e0a15',
    stoneTint: '#261b35',
    mortar: '#09060d',
    mortarEdge: '#050308',
    wireframe: '#c084fc',
    fogColor: '#050308',
    ceilingTop: '#030205',
    ceilingBottom: '#150f20',
    floorTop: '#100b1a',
    floorBottom: '#020104',
    cobbleLight: 'rgba(192, 132, 252, 0.16)',
    cobbleDark: 'rgba(5, 3, 8, 0.65)',
    torchFireInner: '#fef08a',
    torchFireMid: '#c084fc',
    torchFireOuter: 'rgba(168, 85, 247, 0.75)',
    torchGlow: 'rgba(192, 132, 252, 0.25)',
    torchGlowSoft: 'rgba(251, 191, 36, 0.08)',
    beamColor: '#2b1c3c'
  }
];

class DungeonRenderer3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.cx = this.width / 2;
    this.cy = this.height / 2;

    // Palette
    this.colors = {
      bg: '#05070a',
      doorFill: '#1c1510',
      doorLine: '#fbbf24',
      ironDoorLine: '#94a3b8',
      silverDoorLine: '#e2e8f0',
      goldDoorLine: '#f59e0b',
      chestLine: '#f59e0b',
      chestFill: '#241a0d',
      relicGlow: '#38bdf8',
      stairsLine: '#c084fc',
      spinnerLine: '#a855f7',
      warpLine: '#ec4899'
    };

    // Perspective depth planes (distance 0 to 6)
    // Box bounds: [halfWidth, halfHeight]
    this.depths = [
      { w: 320, h: 200 }, // d=0 (player cell boundary: 640x400)
      { w: 184, h: 130 }, // d=1 (368x260)
      { w: 108, h: 82  }, // d=2 (216x164)
      { w: 64,  h: 52  }, // d=3 (128x104)
      { w: 38,  h: 32  }, // d=4 (76x64)
      { w: 20,  h: 18  }, // d=5 (40x36)
      { w: 6,   h: 6   }  // d=6 (far vanishing plane)
    ];

    this.lastRenderTime = 0;
  }

  getScreenBounds(d, lat) {
    const plane = this.depths[Math.min(d, this.depths.length - 1)];
    const cellWidth = plane.w * 2;
    const x0 = this.cx - plane.w + lat * cellWidth;
    const x1 = x0 + cellWidth;
    const y0 = this.cy - plane.h;
    const y1 = this.cy + plane.h;
    return { x0, x1, y0, y1, w: cellWidth, h: plane.h * 2 };
  }

  getTheme(floorIdx) {
    return FLOOR_THEMES[floorIdx] || FLOOR_THEMES[0];
  }

  render(state, time = 0) {
    this.lastRenderTime = time || performance.now();
    const ctx = this.ctx;
    const curFloor = DUNGEON_DATA.floors[state.floor];
    const theme = this.getTheme(state.floor);
    const px = state.x;
    const py = state.y;
    const dir = state.dir;

    const fwd = DIRECTIONS[dir];
    const right = DIRECTIONS[(dir + 1) % 4];

    // Clear background
    ctx.fillStyle = theme.fogColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // 1. Draw Ceiling and Floor base with rich perspective cobblestone & beams
    this.renderCeilingAndFloor(theme, this.lastRenderTime);

    // Helper to get tile and interactive at relative offset (d, lat)
    const getCellAt = (d, lat) => {
      const wx = px + fwd.dx * d + right.dx * lat;
      const wy = py + fwd.dy * d + right.dy * lat;
      if (wx < 0 || wx >= curFloor.width || wy < 0 || wy >= curFloor.height) {
        return { tile: TILES.WALL, key: `${state.floor},${wx},${wy}`, x: wx, y: wy, out: true };
      }
      return {
        tile: curFloor.grid[wy][wx],
        interactive: curFloor.interactives[`${wx},${wy}`],
        key: `${state.floor},${wx},${wy}`,
        x: wx,
        y: wy,
        out: false
      };
    };

    // 2. Render cells from furthest depth to closest (Painter's algorithm: d = 5 down to 0)
    for (let d = 5; d >= 0; d--) {
      // For each depth, render outer lateral columns then center: [-3, 3, -2, 2, -1, 1, 0]
      const laterals = [-3, 3, -2, 2, -1, 1, 0];
      for (const lat of laterals) {
        this.renderCell(d, lat, getCellAt, state, theme);
      }
    }

    // 3. Render Wall Torches on corridor walls (d=1 and d=3) to create atmospheric lighting
    this.renderTorches(state, getCellAt, theme, this.lastRenderTime);

    // 4. Cinematic Vignette & Subtle Scanline overlay
    this.renderAtmosphericOverlay(theme);
  }

  // --- Ceiling & Floor Rendering ---

  renderCeilingAndFloor(theme, time) {
    const ctx = this.ctx;
    const far = this.depths[6];

    // Ceiling gradient
    const ceilGrad = ctx.createLinearGradient(0, 0, 0, this.cy);
    ceilGrad.addColorStop(0, theme.ceilingTop);
    ceilGrad.addColorStop(1, theme.ceilingBottom);
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(0, 0, this.width, this.cy);

    // Floor gradient
    const floorGrad = ctx.createLinearGradient(0, this.cy, 0, this.height);
    floorGrad.addColorStop(0, theme.floorTop);
    floorGrad.addColorStop(1, theme.floorBottom);
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, this.cy, this.width, this.height - this.cy);

    // Ceiling Beams / Arch Structure
    ctx.save();
    for (let d = 5; d >= 1; d--) {
      const p = this.depths[d];
      const pPrev = this.depths[d - 1];
      const beamY = this.cy - p.h;
      const beamH = Math.max(2, (pPrev.h - p.h) * 0.12);

      // Horizontal arch stone beam
      ctx.fillStyle = theme.beamColor;
      ctx.fillRect(this.cx - p.w, beamY - beamH, p.w * 2, beamH);

      // Highlight on bottom edge of beam
      ctx.strokeStyle = theme.stoneLight;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.cx - p.w, beamY);
      ctx.lineTo(this.cx + p.w, beamY);
      ctx.stroke();
    }

    // Vanishing perspective lines for Ceiling
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.cx - far.w, this.cy - far.h);
    ctx.moveTo(this.width, 0);
    ctx.lineTo(this.cx + far.w, this.cy - far.h);
    ctx.moveTo(this.cx * 0.5, 0);
    ctx.lineTo(this.cx - far.w * 0.3, this.cy - far.h);
    ctx.moveTo(this.cx * 1.5, 0);
    ctx.lineTo(this.cx + far.w * 0.3, this.cy - far.h);
    ctx.stroke();

    // Floor Cobblestones Grid
    // 1. Perspective longitudinal lines from bottom to vanishing points
    ctx.strokeStyle = theme.cobbleLight;
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Outer edge lines
    ctx.moveTo(0, this.height);
    ctx.lineTo(this.cx - far.w, this.cy + far.h);
    ctx.moveTo(this.width, this.height);
    ctx.lineTo(this.cx + far.w, this.cy + far.h);

    // Center corridor lines
    const p0 = this.depths[0];
    const colDivs = [-0.6, -0.2, 0.2, 0.6];
    for (const c of colDivs) {
      ctx.moveTo(this.cx + p0.w * c, this.height);
      ctx.lineTo(this.cx + far.w * c, this.cy + far.h);
    }
    ctx.stroke();

    // 2. Transverse cobblestone seams across depths
    for (let d = 0; d <= 5; d++) {
      const p = this.depths[d];
      const y = this.cy + p.h;

      // Primary depth seam
      ctx.strokeStyle = theme.stoneDark;
      ctx.lineWidth = d === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(this.cx - p.w * 1.5, y);
      ctx.lineTo(this.cx + p.w * 1.5, y);
      ctx.stroke();

      // Highlight line just below seam for 3D slab thickness
      ctx.strokeStyle = theme.stoneLight;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.cx - p.w * 1.5, y + 1);
      ctx.lineTo(this.cx + p.w * 1.5, y + 1);
      ctx.stroke();

      // Intermediate sub-slabs if close enough
      if (d < 2) {
        const nextP = this.depths[d + 1];
        const midY = (y + (this.cy + nextP.h)) / 2;
        ctx.strokeStyle = theme.cobbleDark;
        ctx.beginPath();
        ctx.moveTo(this.cx - p.w, midY);
        ctx.lineTo(this.cx + p.w, midY);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // --- Main Cell Dispatcher ---

  renderCell(d, lat, getCellAt, state, theme) {
    const cell = getCellAt(d, lat);
    const tile = cell.tile;

    // Check if tile is a solid wall or revealed secret wall
    const isSolidWall = (tile === TILES.WALL) || 
      (tile === TILES.SECRET_WALL && !state.revealedSecrets.has(cell.key));

    const isDoorTile = (tile === TILES.DOOR || tile === TILES.DOOR_IRON || 
                        tile === TILES.DOOR_SILVER || tile === TILES.DOOR_GOLD);
    const isDoorOpen = isDoorTile && state.openedDoors.has(cell.key);

    // If this cell is a solid wall facing the player, draw front wall
    if (isSolidWall) {
      this.drawFrontWall(d, lat, cell, theme);
      return;
    }

    // Side Walls: check neighboring cells facing toward the player's central sight line
    // For cells on player's left (lat <= 0), their left boundary (lat - 1) faces inward toward center
    if (lat <= 0) {
      const leftCell = getCellAt(d, lat - 1);
      const leftIsWall = (leftCell.tile === TILES.WALL) || 
        (leftCell.tile === TILES.SECRET_WALL && !state.revealedSecrets.has(leftCell.key));
      if (leftIsWall) {
        this.drawSideWall(d, lat, -1, leftCell, theme);
      } else if (leftCell.tile === TILES.DOOR || leftCell.tile === TILES.DOOR_IRON || 
                 leftCell.tile === TILES.DOOR_SILVER || leftCell.tile === TILES.DOOR_GOLD) {
        this.drawSideDoor(d, lat, -1, leftCell, state, theme);
      }
    }

    // For cells on player's right (lat >= 0), their right boundary (lat + 1) faces inward toward center
    if (lat >= 0) {
      const rightCell = getCellAt(d, lat + 1);
      const rightIsWall = (rightCell.tile === TILES.WALL) || 
        (rightCell.tile === TILES.SECRET_WALL && !state.revealedSecrets.has(rightCell.key));
      if (rightIsWall) {
        this.drawSideWall(d, lat, 1, rightCell, theme);
      } else if (rightCell.tile === TILES.DOOR || rightCell.tile === TILES.DOOR_IRON || 
                 rightCell.tile === TILES.DOOR_SILVER || rightCell.tile === TILES.DOOR_GOLD) {
        this.drawSideDoor(d, lat, 1, rightCell, state, theme);
      }
    }

    // Door on front wall
    if (isDoorTile) {
      this.drawFrontDoor(d, lat, tile, isDoorOpen, theme);
    }

    // Secret Wall (revealed passage)
    if (tile === TILES.SECRET_WALL && state.revealedSecrets.has(cell.key)) {
      this.drawSecretDoorFrame(d, lat, theme);
    }

    // Floor Markings / Stairs / Traps in this cell
    if (tile === TILES.STAIRS_DOWN) {
      this.drawStairsDown(d, lat, theme);
    } else if (tile === TILES.STAIRS_UP) {
      this.drawStairsUp(d, lat, theme);
    } else if (tile === TILES.SPINNER) {
      this.drawSpinnerTile(d, lat, theme);
    } else if (tile === TILES.WARP) {
      this.drawWarpTile(d, lat, theme);
    }

    // Interactive elements on floor: Relics, Chests, Exit Gate
    if (cell.interactive) {
      this.drawInteractive(d, lat, cell.interactive, state, theme);
    }
  }

  // --- Beautiful Front Wall Rendering ---

  drawFrontWall(d, lat, cell, theme) {
    if (d > 5) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);

    // Off-screen culling
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;

    // Depth attenuation factor (1.0 close up, drops to 0.18 far away)
    const depthDim = Math.max(0.18, 1.0 - d * 0.16);

    // Base Wall Background Fill
    ctx.fillStyle = theme.stoneDark;
    ctx.fillRect(cur.x0, cur.y0, cur.w, cur.h);

    // Number of brick rows & columns based on depth
    const rows = d === 0 ? 5 : (d === 1 ? 4 : (d <= 3 ? 3 : 2));
    const rowH = cur.h / rows;
    const cols = d <= 1 ? 4 : (d <= 3 ? 3 : 2);
    const colW = cur.w / cols;

    // Cornice (Top Architrave) & Baseboard (Bottom Trim)
    const trimH = Math.max(2, rowH * 0.18);
    // Top Cornice
    ctx.fillStyle = theme.stoneTint;
    ctx.fillRect(cur.x0, cur.y0, cur.w, trimH);
    ctx.strokeStyle = theme.stoneLight;
    ctx.lineWidth = 1;
    ctx.strokeRect(cur.x0, cur.y0, cur.w, trimH);

    // Bottom Baseboard
    ctx.fillStyle = theme.stoneTint;
    ctx.fillRect(cur.x0, cur.y1 - trimH, cur.w, trimH);
    ctx.strokeStyle = theme.stoneDark;
    ctx.strokeRect(cur.x0, cur.y1 - trimH, cur.w, trimH);

    // Draw individual stone bricks with bevels & textures
    const mortarGap = d === 0 ? 3 : (d === 1 ? 2 : 1.2);

    for (let r = 0; r < rows; r++) {
      const by = cur.y0 + r * rowH;
      const isAltRow = (r % 2 === 1);
      const rowOffset = isAltRow ? colW * 0.5 : 0;

      for (let c = -1; c <= cols; c++) {
        const bx = cur.x0 + c * colW + rowOffset;
        // Clip to current wall bounding box
        const xStart = Math.max(cur.x0, bx);
        const xEnd = Math.min(cur.x1, bx + colW);
        const bw = xEnd - xStart;
        if (bw <= 2) continue;

        const brickX = xStart + mortarGap * 0.5;
        const brickY = by + mortarGap * 0.5;
        const brickW = bw - mortarGap;
        const brickH = rowH - mortarGap;

        if (brickW <= 1 || brickH <= 1) continue;

        // Hash for stone individuality (slight tone variance)
        const stoneNoise = getTileHash(cell.x || 0, cell.y || 0, r * 10 + c);
        
        // Brick fill color variation
        if (stoneNoise > 0.6) {
          ctx.fillStyle = theme.stoneLight;
        } else if (stoneNoise < 0.3) {
          ctx.fillStyle = theme.stoneDark;
        } else {
          ctx.fillStyle = theme.stoneBase;
        }
        ctx.fillRect(brickX, brickY, brickW, brickH);

        // Dimensional Stone Bevel (Light on Top & Left, Shadow on Bottom & Right)
        if (d <= 2) {
          // Top & Left Highlight
          ctx.strokeStyle = theme.stoneLight;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(brickX, brickY + brickH);
          ctx.lineTo(brickX, brickY);
          ctx.lineTo(brickX + brickW, brickY);
          ctx.stroke();

          // Bottom & Right Deep Shadow
          ctx.strokeStyle = theme.mortarEdge;
          ctx.beginPath();
          ctx.moveTo(brickX + brickW, brickY);
          ctx.lineTo(brickX + brickW, brickY + brickH);
          ctx.lineTo(brickX, brickY + brickH);
          ctx.stroke();

          // Random Crack detail for ancient atmosphere
          if (stoneNoise > 0.85 && d <= 1) {
            ctx.strokeStyle = theme.mortarEdge;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(brickX + brickW * 0.3, brickY + 2);
            ctx.lineTo(brickX + brickW * 0.45, brickY + brickH * 0.5);
            ctx.lineTo(brickX + brickW * 0.4, brickY + brickH - 2);
            ctx.stroke();
          }
        }
      }
    }

    // Outer Wall Frame (Mortar boundary)
    ctx.strokeStyle = theme.mortar;
    ctx.lineWidth = d === 0 ? 3 : (d <= 2 ? 2 : 1);
    ctx.strokeRect(cur.x0, cur.y0, cur.w, cur.h);

    // Glowing Neon / Mystic Wireframe Edge
    ctx.strokeStyle = theme.wireframe;
    ctx.lineWidth = d === 0 ? 2 : 1;
    ctx.globalAlpha = 0.55 * depthDim;
    ctx.strokeRect(cur.x0, cur.y0, cur.w, cur.h);
    ctx.globalAlpha = 1.0;

    // Atmospheric Depth Fog overlay
    if (d >= 1) {
      ctx.fillStyle = theme.fogColor;
      const fogAlphas = [0, 0.15, 0.30, 0.48, 0.65, 0.82];
      ctx.globalAlpha = fogAlphas[d] !== undefined ? fogAlphas[d] : 0.85;
      ctx.fillRect(cur.x0, cur.y0, cur.w, cur.h);
      ctx.globalAlpha = 1.0;
    }

    // Check for Famous Masterpiece Painting Landmark on Front Wall
    if (cell.interactive && cell.interactive.type === 'painting') {
      this.drawFrontWallPainting(d, lat, cell, theme);
    }
  }

  // --- Beautiful Perspective Side Wall Rendering ---

  drawSideWall(d, lat, side, cell, theme) {
    if (d >= 5) return;
    const ctx = this.ctx;
    const near = this.getScreenBounds(d, lat);
    const far = this.getScreenBounds(d + 1, lat);

    const xNear = side < 0 ? near.x0 : near.x1;
    const xFar  = side < 0 ? far.x0  : far.x1;

    // Off-screen culling
    if ((xNear < -50 && xFar < -50) || (xNear > this.width + 50 && xFar > this.width + 50)) return;

    // Base trapezoid fill
    ctx.fillStyle = theme.stoneDark;
    ctx.beginPath();
    ctx.moveTo(xNear, near.y0);
    ctx.lineTo(xFar, far.y0);
    ctx.lineTo(xFar, far.y1);
    ctx.lineTo(xNear, near.y1);
    ctx.closePath();
    ctx.fill();

    // Perspective Brickwork on Side Wall
    const rows = d <= 1 ? 4 : (d <= 3 ? 3 : 2);
    const depthCols = d <= 1 ? 3 : (d <= 3 ? 2 : 1);

    ctx.save();
    // Clip to the trapezoid so brick lines don't leak out
    ctx.beginPath();
    ctx.moveTo(xNear, near.y0);
    ctx.lineTo(xFar, far.y0);
    ctx.lineTo(xFar, far.y1);
    ctx.lineTo(xNear, near.y1);
    ctx.closePath();
    ctx.clip();

    // 1. Perspective Horizontal Brick Rows (connecting near Y to far Y)
    for (let r = 0; r <= rows; r++) {
      const t = r / rows;
      const yN = near.y0 + (near.y1 - near.y0) * t;
      const yF = far.y0 + (far.y1 - far.y0) * t;

      // Mortar groove line
      ctx.strokeStyle = theme.mortar;
      ctx.lineWidth = d === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(xNear, yN);
      ctx.lineTo(xFar, yF);
      ctx.stroke();

      // Stone Highlight on row edge
      if (r < rows && d <= 2) {
        ctx.strokeStyle = theme.stoneLight;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xNear, yN + 1);
        ctx.lineTo(xFar, yF + 1);
        ctx.stroke();
      }
    }

    // 2. Perspective Vertical Brick Dividers
    for (let c = 1; c <= depthCols; c++) {
      // Perspective interpolation parameter
      const u = c / (depthCols + 1);
      const colX = xNear + (xFar - xNear) * u;
      const topY = near.y0 + (far.y0 - near.y0) * u;
      const botY = near.y1 + (far.y1 - near.y1) * u;

      for (let r = 0; r < rows; r++) {
        // Stagger every other row
        const isStagger = (r % 2 === 1);
        const shiftU = isStagger ? (0.5 / (depthCols + 1)) : 0;
        const curU = Math.min(0.95, Math.max(0.05, u + shiftU));

        const seamX = xNear + (xFar - xNear) * curU;
        const seamTopY = near.y0 + (far.y0 - near.y0) * curU + ((near.y1 - near.y0) + (far.y1 - far.y0 - (near.y1 - near.y0)) * curU) * (r / rows);
        const seamBotY = seamTopY + ((near.y1 - near.y0) + (far.y1 - far.y0 - (near.y1 - near.y0)) * curU) / rows;

        ctx.strokeStyle = theme.mortar;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(seamX, seamTopY);
        ctx.lineTo(seamX, seamBotY);
        ctx.stroke();

        // Subtle bevel shadow
        if (d <= 2) {
          ctx.strokeStyle = theme.mortarEdge;
          ctx.beginPath();
          ctx.moveTo(seamX + (side < 0 ? 1 : -1), seamTopY);
          ctx.lineTo(seamX + (side < 0 ? 1 : -1), seamBotY);
          ctx.stroke();
        }
      }
    }

    ctx.restore();

    // Outline Wireframe & Edge Bevel
    ctx.strokeStyle = theme.wireframe;
    ctx.lineWidth = d === 0 ? 2 : 1;
    ctx.globalAlpha = Math.max(0.2, 0.55 - d * 0.08);
    ctx.beginPath();
    ctx.moveTo(xNear, near.y0);
    ctx.lineTo(xFar, far.y0);
    ctx.lineTo(xFar, far.y1);
    ctx.lineTo(xNear, near.y1);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Side Wall Atmospheric Fog
    if (d >= 1) {
      ctx.fillStyle = theme.fogColor;
      const fogAlphas = [0, 0.18, 0.35, 0.52, 0.68, 0.82];
      ctx.globalAlpha = fogAlphas[d] !== undefined ? fogAlphas[d] : 0.85;
      ctx.beginPath();
      ctx.moveTo(xNear, near.y0);
      ctx.lineTo(xFar, far.y0);
      ctx.lineTo(xFar, far.y1);
      ctx.lineTo(xNear, near.y1);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Check for Famous Masterpiece Painting Landmark on Side Wall
    if (cell.interactive && cell.interactive.type === 'painting') {
      this.drawSideWallPainting(d, lat, side, cell, theme);
    }
  }

  // --- Masterpiece Landmark Painting Rendering ---

  drawFrontWallPainting(d, lat, cell, theme) {
    if (d > 4) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;

    const painting = window.paintingManager?.getPainting(cell.interactive.paintingId);
    if (!painting) return;

    const pCanvas = window.paintingManager.getCanvas(painting.id);
    if (!pCanvas) return;

    // Center position of the wall
    const cx = cur.x0 + cur.w * 0.5;
    const cy = cur.y0 + cur.h * 0.46; // eye-level slightly above center

    // Calculate frame dimensions based on wall depth and painting aspect ratio
    const isLandscape = painting.aspect === 'landscape';
    const frameW = cur.w * (isLandscape ? 0.60 : 0.44);
    const frameH = cur.h * (isLandscape ? 0.44 : 0.58);
    const fx0 = cx - frameW * 0.5;
    const fy0 = cy - frameH * 0.5;

    ctx.save();

    // 1. Gallery Spot Light Aura on Wall (Warm golden glow)
    const spotR = Math.max(20, frameW * 0.85);
    const spotGrad = ctx.createRadialGradient(cx, fy0 + frameH * 0.35, 6, cx, fy0 + frameH * 0.35, spotR);
    spotGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
    spotGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
    spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(cur.x0, cur.y0, cur.w, cur.h);

    // 2. Brass Picture Light Fixture mounted above frame (d <= 2)
    if (d <= 2) {
      const lampW = frameW * 0.52;
      const lampH = Math.max(3, 7 - d * 2);
      const lampY = fy0 - lampH - Math.max(2, 6 - d * 2);
      // Brass lamp casing
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - lampW * 0.5, lampY, lampW, lampH);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - lampW * 0.5, lampY, lampW, lampH);
      // Mounting bracket
      ctx.strokeStyle = '#92400e';
      ctx.beginPath();
      ctx.moveTo(cx, lampY + lampH);
      ctx.lineTo(cx, fy0);
      ctx.stroke();
    }

    // 3. Frame Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    const shadowOff = Math.max(2, 8 - d * 1.5);
    ctx.fillRect(fx0 + shadowOff, fy0 + shadowOff, frameW, frameH);

    // 4. Antique Gold Frame Outer Molding
    const borderThickness = Math.max(2, Math.round(frameW * 0.08));
    
    // Gold gradient for frame
    const frameGrad = ctx.createLinearGradient(fx0, fy0, fx0 + frameW, fy0 + frameH);
    frameGrad.addColorStop(0, '#fef08a'); // Top-left highlight
    frameGrad.addColorStop(0.25, '#d97706'); // Gold body
    frameGrad.addColorStop(0.7, '#92400e'); // Deep bronze
    frameGrad.addColorStop(1, '#78350f'); // Shadow
    ctx.fillStyle = frameGrad;
    ctx.fillRect(fx0, fy0, frameW, frameH);

    // Inner bevel shadow & carving line
    if (borderThickness >= 4) {
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.strokeRect(fx0 + 1, fy0 + 1, frameW - 2, frameH - 2);

      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(fx0 + borderThickness * 0.5, fy0 + borderThickness * 0.5, 
                     frameW - borderThickness, frameH - borderThickness);
    }

    // Inner Velvet Mat
    const matThickness = Math.max(1, Math.round(borderThickness * 0.4));
    const matX = fx0 + borderThickness;
    const matY = fy0 + borderThickness;
    const matW = frameW - borderThickness * 2;
    const matH = frameH - borderThickness * 2;

    ctx.fillStyle = '#17120e';
    ctx.fillRect(matX, matY, matW, matH);

    // 5. The Artwork Canvas (Draw cached masterpiece)
    const artX = matX + matThickness;
    const artY = matY + matThickness;
    const artW = Math.max(2, matW - matThickness * 2);
    const artH = Math.max(2, matH - matThickness * 2);

    ctx.drawImage(pCanvas, artX, artY, artW, artH);

    // Inner Canvas edge line
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(artX, artY, artW, artH);

    // 6. Brass Title Plaque beneath frame (for d <= 1)
    if (d <= 1) {
      const plaqueW = Math.min(frameW * 0.85, 140);
      const plaqueH = 14;
      const plaqueX = cx - plaqueW * 0.5;
      const plaqueY = fy0 + frameH + 3;

      const pGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX, plaqueY + plaqueH);
      pGrad.addColorStop(0, '#fef08a');
      pGrad.addColorStop(0.5, '#d97706');
      pGrad.addColorStop(1, '#92400e');
      ctx.fillStyle = pGrad;
      ctx.fillRect(plaqueX, plaqueY, plaqueW, plaqueH);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      ctx.strokeRect(plaqueX, plaqueY, plaqueW, plaqueH);

      // Inscribed text
      ctx.fillStyle = '#1c1510';
      ctx.font = `bold ${d === 0 ? 10 : 8}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(painting.title, cx, plaqueY + plaqueH * 0.5);
    }

    // 7. Depth Fog over Painting
    if (d >= 1) {
      ctx.fillStyle = theme.fogColor;
      const fogAlphas = [0, 0.12, 0.25, 0.42, 0.60, 0.80];
      ctx.globalAlpha = fogAlphas[d] !== undefined ? fogAlphas[d] : 0.6;
      ctx.fillRect(fx0, fy0, frameW, frameH + (d <= 1 ? 18 : 0));
      ctx.globalAlpha = 1.0;
    }

    ctx.restore();
  }

  drawSideWallPainting(d, lat, side, cell, theme) {
    if (d > 2) return; // Only render on close side walls
    const ctx = this.ctx;
    const near = this.getScreenBounds(d, lat);
    const far = this.getScreenBounds(d + 1, lat);

    const xNear = side < 0 ? near.x0 : near.x1;
    const xFar  = side < 0 ? far.x0  : far.x1;

    const painting = window.paintingManager?.getPainting(cell.interactive.paintingId);
    if (!painting) return;

    const pCanvas = window.paintingManager.getCanvas(painting.id);
    if (!pCanvas) return;

    ctx.save();

    // Clip to the side wall polygon
    ctx.beginPath();
    ctx.moveTo(xNear, near.y0);
    ctx.lineTo(xFar, far.y0);
    ctx.lineTo(xFar, far.y1);
    ctx.lineTo(xNear, near.y1);
    ctx.closePath();
    ctx.clip();

    // Perspective interpolation for center of side wall (u = 0.32 to 0.68)
    const u0 = 0.32;
    const u1 = 0.68;
    const frameX0 = xNear + (xFar - xNear) * u0;
    const frameX1 = xNear + (xFar - xNear) * u1;

    const yTop0 = near.y0 + (far.y0 - near.y0) * u0;
    const yTop1 = near.y0 + (far.y0 - near.y0) * u1;
    const yBot0 = near.y1 + (far.y1 - near.y1) * u0;
    const yBot1 = near.y1 + (far.y1 - near.y1) * u1;

    const wallH0 = yBot0 - yTop0;
    const wallH1 = yBot1 - yTop1;

    // Paint quad vertically centered
    const pyTop0 = yTop0 + wallH0 * 0.28;
    const pyBot0 = yTop0 + wallH0 * 0.72;
    const pyTop1 = yTop1 + wallH1 * 0.28;
    const pyBot1 = yTop1 + wallH1 * 0.72;

    // Outer Gold frame trapezoid
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(frameX0, pyTop0);
    ctx.lineTo(frameX1, pyTop1);
    ctx.lineTo(frameX1, pyBot1);
    ctx.lineTo(frameX0, pyBot0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = d === 0 ? 2 : 1;
    ctx.stroke();

    // Inner painting area
    const padU = 0.04;
    const ix0 = xNear + (xFar - xNear) * (u0 + padU);
    const ix1 = xNear + (xFar - xNear) * (u1 - padU);
    const iyTop0 = yTop0 + wallH0 * 0.33;
    const iyBot0 = yTop0 + wallH0 * 0.67;
    const iyTop1 = yTop1 + wallH1 * 0.33;
    const iyBot1 = yTop1 + wallH1 * 0.67;

    // Clip inner art trapezoid
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ix0, iyTop0);
    ctx.lineTo(ix1, iyTop1);
    ctx.lineTo(ix1, iyBot1);
    ctx.lineTo(ix0, iyBot0);
    ctx.closePath();
    ctx.clip();

    // Draw painting image over bounding box
    const minX = Math.min(ix0, ix1);
    const maxX = Math.max(ix0, ix1);
    const minY = Math.min(iyTop0, iyTop1);
    const maxY = Math.max(iyBot0, iyBot1);
    ctx.drawImage(pCanvas, minX, minY, maxX - minX, maxY - minY);

    ctx.restore();

    // Side Wall Fog over painting
    if (d >= 1) {
      ctx.fillStyle = theme.fogColor;
      ctx.globalAlpha = d === 1 ? 0.25 : 0.45;
      ctx.beginPath();
      ctx.moveTo(frameX0, pyTop0);
      ctx.lineTo(frameX1, pyTop1);
      ctx.lineTo(frameX1, pyBot1);
      ctx.lineTo(frameX0, pyBot0);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    ctx.restore();
  }

  // --- Atmospheric Wall Torches with Ambient Glow ---

  renderTorches(state, getCellAt, theme, time) {
    // Draw torches on side walls at distance d=1 and d=3 if adjacent is a solid wall
    for (const d of [1, 3]) {
      const cellL = getCellAt(d, -1);
      const cellR = getCellAt(d, 1);
      const hasLeftWall = (cellL.tile === TILES.WALL) || (cellL.tile === TILES.SECRET_WALL && !state.revealedSecrets.has(cellL.key));
      const hasRightWall = (cellR.tile === TILES.WALL) || (cellR.tile === TILES.SECRET_WALL && !state.revealedSecrets.has(cellR.key));

      const near = this.getScreenBounds(d, 0);
      const far = this.getScreenBounds(d + 1, 0);
      const scale = d === 1 ? 1.0 : 0.55;

      // Left Torch
      if (hasLeftWall) {
        const tx = near.x0 + (far.x0 - near.x0) * 0.45;
        const ty = (near.y0 + far.y0) * 0.5 + (d === 1 ? 24 : 12);
        this.drawSingleTorch(tx, ty, -1, theme, time, d * 10, scale);
      }

      // Right Torch
      if (hasRightWall) {
        const tx = near.x1 + (far.x1 - near.x1) * 0.45;
        const ty = (near.y0 + far.y0) * 0.5 + (d === 1 ? 24 : 12);
        this.drawSingleTorch(tx, ty, 1, theme, time, 42 + d * 10, scale);
      }
    }
  }

  drawSingleTorch(x, y, side, theme, time, seedOffset, scale = 1.0) {
    const ctx = this.ctx;
    // Dynamic flickering flame
    const flicker = Math.sin((time + seedOffset * 100) * 0.012) * 2 + Math.cos((time + seedOffset * 70) * 0.023) * 1.5;
    const glowRadius = (60 + flicker * 3) * scale;

    // 1. Ambient Radial Glow on stone wall
    const grad = ctx.createRadialGradient(x, y, 2, x, y, glowRadius);
    grad.addColorStop(0, theme.torchGlow);
    grad.addColorStop(0.5, theme.torchGlowSoft);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Iron Sconce Bracket
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = Math.max(1.5, 3 * scale);
    ctx.beginPath();
    const wallAnchorX = x - side * (12 * scale);
    ctx.moveTo(wallAnchorX, y + 8 * scale);
    ctx.lineTo(x, y + 10 * scale);
    ctx.lineTo(x, y + 2 * scale);
    ctx.stroke();

    // Iron ring socket
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 3 * scale, y - 1 * scale, 6 * scale, 4 * scale);

    // 3. Wooden Torch Handle
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 2 * scale, y - 8 * scale, 4 * scale, 8 * scale);

    // 4. Flickering Flame (Multi-layer teardrop)
    const flameH = (14 + flicker) * scale;
    const flameW = (7 + flicker * 0.5) * scale;

    // Outer flame (Red/Orange/Purple)
    ctx.fillStyle = theme.torchFireOuter;
    ctx.beginPath();
    ctx.moveTo(x - flameW * 0.5, y - 7 * scale);
    ctx.quadraticCurveTo(x - flameW, y - 14 * scale, x + flicker * 0.3 * scale, y - 7 * scale - flameH);
    ctx.quadraticCurveTo(x + flameW, y - 14 * scale, x + flameW * 0.5, y - 7 * scale);
    ctx.closePath();
    ctx.fill();

    // Mid flame (Bright Orange/Cyan/Magenta)
    ctx.fillStyle = theme.torchFireMid;
    ctx.beginPath();
    ctx.moveTo(x - flameW * 0.3, y - 7 * scale);
    ctx.quadraticCurveTo(x - flameW * 0.6, y - 12 * scale, x + flicker * 0.2 * scale, y - 7 * scale - flameH * 0.75);
    ctx.quadraticCurveTo(x + flameW * 0.6, y - 12 * scale, x + flameW * 0.3, y - 7 * scale);
    ctx.closePath();
    ctx.fill();

    // Inner Core flame (Intense Yellow/White)
    ctx.fillStyle = theme.torchFireInner;
    ctx.beginPath();
    ctx.moveTo(x - flameW * 0.15, y - 7 * scale);
    ctx.quadraticCurveTo(x - flameW * 0.3, y - 10 * scale, x, y - 7 * scale - flameH * 0.45);
    ctx.quadraticCurveTo(x + flameW * 0.3, y - 10 * scale, x + flameW * 0.15, y - 7 * scale);
    ctx.closePath();
    ctx.fill();
  }

  // --- High Quality Doors & Archways ---

  drawFrontDoor(d, lat, tileType, isOpen, theme) {
    if (d > 5) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);

    // Off-screen culling
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;

    const doorW = cur.w * 0.56;
    const doorH = cur.h * 0.82;
    const doorX = cur.x0 + (cur.w - doorW) / 2;
    const doorY = cur.y1 - doorH;

    // 1. Stone Arch Frame (Architrave with Keystone)
    const framePad = d <= 1 ? 6 : (d <= 3 ? 4 : 2);
    ctx.fillStyle = theme.stoneTint;
    ctx.fillRect(doorX - framePad, doorY - framePad, doorW + framePad * 2, doorH + framePad);

    let frameColor = this.colors.doorLine;
    if (tileType === TILES.DOOR_IRON) frameColor = this.colors.ironDoorLine;
    if (tileType === TILES.DOOR_SILVER) frameColor = this.colors.silverDoorLine;
    if (tileType === TILES.DOOR_GOLD) frameColor = this.colors.goldDoorLine;

    // Keystone at top center of frame
    const ksW = framePad * 3;
    const ksH = framePad * 1.8;
    ctx.fillStyle = frameColor;
    ctx.fillRect(doorX + doorW / 2 - ksW / 2, doorY - framePad - 2, ksW, ksH);

    ctx.strokeStyle = frameColor;
    ctx.lineWidth = d <= 1 ? 2 : 1;
    ctx.strokeRect(doorX - framePad, doorY - framePad, doorW + framePad * 2, doorH + framePad);

    if (isOpen) {
      // Open Doorway (deep dark corridor with angled door panel)
      ctx.fillStyle = '#020305';
      ctx.fillRect(doorX, doorY, doorW, doorH);

      // Angled Open Door Leaf (Showing door thickness & perspective)
      ctx.fillStyle = this.colors.doorFill;
      ctx.beginPath();
      ctx.moveTo(doorX, doorY);
      ctx.lineTo(doorX + doorW * 0.24, doorY + (d <= 1 ? 8 : 4));
      ctx.lineTo(doorX + doorW * 0.24, cur.y1 - (d <= 1 ? 6 : 3));
      ctx.lineTo(doorX, cur.y1);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = frameColor;
      ctx.stroke();
    } else {
      // Closed Heavy Medieval Door
      ctx.fillStyle = this.colors.doorFill;
      ctx.fillRect(doorX, doorY, doorW, doorH);

      // Vertical Wood Planks
      const planks = d <= 2 ? 4 : 2;
      const plankW = doorW / planks;
      ctx.strokeStyle = '#0e0b08';
      ctx.lineWidth = 1;
      for (let p = 1; p < planks; p++) {
        const px = doorX + p * plankW;
        ctx.beginPath();
        ctx.moveTo(px, doorY);
        ctx.lineTo(px, doorY + doorH);
        ctx.stroke();
      }

      // Heavy Iron Horizontal Straps / Hinges
      const strapY1 = doorY + doorH * 0.22;
      const strapY2 = doorY + doorH * 0.72;
      const strapH = Math.max(2, doorH * 0.08);

      const drawStrap = (sy) => {
        ctx.fillStyle = frameColor;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(doorX + 2, sy, doorW - 4, strapH);
        ctx.globalAlpha = 1.0;

        // Rivets / Studs along strap
        if (d <= 2) {
          ctx.fillStyle = '#0f172a';
          for (let rx = doorX + 8; rx < doorX + doorW - 6; rx += doorW * 0.22) {
            ctx.beginPath();
            ctx.arc(rx, sy + strapH / 2, d <= 1 ? 2 : 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };

      drawStrap(strapY1);
      drawStrap(strapY2);

      // Antique Ring Handle / Escutcheon
      if (d <= 3) {
        const midY = doorY + doorH * 0.52;
        const handleX = doorX + doorW * 0.78;

        ctx.strokeStyle = frameColor;
        ctx.lineWidth = d <= 1 ? 2 : 1;
        ctx.beginPath();
        ctx.arc(handleX, midY, d <= 1 ? 5 : 2.5, 0, Math.PI * 2);
        ctx.stroke();

        // Keyhole Escutcheon Plate
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(handleX - 2, midY - 6, 4, 4);
      }

      // Lock Badge / Crest for Special Keyed Doors
      if (tileType === TILES.DOOR_IRON || tileType === TILES.DOOR_SILVER || tileType === TILES.DOOR_GOLD) {
        const midY = doorY + doorH * 0.52;
        const crestSize = Math.max(8, doorW * 0.35);
        ctx.fillStyle = '#0a0d14';
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(doorX + doorW / 2, midY - 4, crestSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (d <= 3) {
          ctx.font = `${Math.max(8, Math.floor(18 - d * 3))}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = frameColor;
          ctx.fillText('🔒', doorX + doorW / 2, midY - 3);
        }
      }
    }

    // Door atmospheric fog for depth
    if (d >= 1) {
      ctx.fillStyle = theme.fogColor;
      const fogAlphas = [0, 0.15, 0.30, 0.48, 0.65, 0.82];
      ctx.globalAlpha = fogAlphas[d] !== undefined ? fogAlphas[d] : 0.85;
      ctx.fillRect(doorX - framePad, doorY - framePad, doorW + framePad * 2, doorH + framePad);
      ctx.globalAlpha = 1.0;
    }
  }

  drawSideDoor(d, lat, side, cell, state, theme) {
    if (d >= 5) return;
    const ctx = this.ctx;
    const near = this.getScreenBounds(d, lat);
    const far = this.getScreenBounds(d + 1, lat);
    const xNear = side < 0 ? near.x0 : near.x1;
    const xFar  = side < 0 ? far.x0  : far.x1;

    // Off-screen culling
    if ((xNear < -50 && xFar < -50) || (xNear > this.width + 50 && xFar > this.width + 50)) return;

    // Draw door frame cutout in side wall
    ctx.strokeStyle = this.colors.doorLine;
    ctx.lineWidth = d <= 1 ? 1.5 : 1.0;
    ctx.beginPath();
    const dX1 = xNear + (xFar - xNear) * 0.22;
    const dX2 = xNear + (xFar - xNear) * 0.78;
    const dY0 = (near.y0 + far.y0) / 2 + (d <= 1 ? 10 : 5);
    const dY1 = (near.y1 + far.y1) / 2;

    ctx.moveTo(dX1, dY1);
    ctx.lineTo(dX1, dY0);
    ctx.lineTo(dX2, dY0);
    ctx.lineTo(dX2, dY1);
    ctx.stroke();

    // Side door wood panel fill
    ctx.fillStyle = this.colors.doorFill;
    ctx.beginPath();
    ctx.moveTo(dX1, dY1);
    ctx.lineTo(dX1, dY0);
    ctx.lineTo(dX2, dY0);
    ctx.lineTo(dX2, dY1);
    ctx.closePath();
    ctx.fill();
  }

  drawSecretDoorFrame(d, lat, theme) {
    if (d > 5) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = d <= 1 ? 2 : 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cur.x0 + cur.w * 0.18, cur.y0 + cur.h * 0.18, cur.w * 0.64, cur.h * 0.82);
    ctx.setLineDash([]);
  }

  // --- Stairs ---

  drawStairsDown(d, lat, theme) {
    if (d > 5) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;

    const sx0 = cur.x0 + cur.w * 0.22;
    const sx1 = cur.x1 - cur.w * 0.22;
    const sy = cur.y1;
    const scale = Math.max(0.2, 1.0 - d * 0.16);
    const pitH = Math.max(4, 24 * scale);

    // Stairway pit hole in stone floor
    ctx.fillStyle = '#020408';
    ctx.fillRect(sx0, sy - pitH, sx1 - sx0, pitH);

    ctx.strokeStyle = this.colors.stairsLine;
    ctx.lineWidth = d <= 1 ? 2 : 1;
    // Step lines descending into floor with 3D step faces
    const stepCount = d <= 2 ? 5 : 3;
    for (let i = 0; i < stepCount; i++) {
      const stepY = sy - pitH + (i * pitH / stepCount);
      const stepX0 = sx0 + i * (3.5 * scale);
      const stepX1 = sx1 - i * (3.5 * scale);

      // Tread highlight
      ctx.strokeStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.moveTo(stepX0, stepY);
      ctx.lineTo(stepX1, stepY);
      ctx.stroke();

      // Riser shadow
      ctx.fillStyle = '#1e1035';
      ctx.fillRect(stepX0, stepY, stepX1 - stepX0, Math.max(1, 2 * scale));
    }

    if (d <= 2) {
      ctx.font = `bold ${Math.max(8, 11 - d * 2)}px monospace`;
      ctx.fillStyle = this.colors.stairsLine;
      ctx.textAlign = 'center';
      ctx.fillText('▼ STAIRS DOWN', cur.x0 + cur.w / 2, sy - pitH - 4);
    }
  }

  drawStairsUp(d, lat, theme) {
    if (d > 5) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;

    const sx0 = cur.x0 + cur.w * 0.22;
    const sx1 = cur.x1 - cur.w * 0.22;
    const sy = cur.y1;
    const scale = Math.max(0.2, 1.0 - d * 0.16);

    ctx.strokeStyle = this.colors.stairsLine;
    ctx.lineWidth = d <= 1 ? 2 : 1;
    // Step lines ascending up
    const stepCount = d <= 2 ? 5 : 3;
    for (let i = 0; i < stepCount; i++) {
      const stepY = sy - i * (9 * scale);
      const stepX0 = sx0 + i * (4 * scale);
      const stepX1 = sx1 - i * (4 * scale);

      ctx.fillStyle = '#2e1065';
      ctx.fillRect(stepX0, stepY, stepX1 - stepX0, Math.max(1, 4 * scale));

      ctx.strokeStyle = '#f3e8ff';
      ctx.beginPath();
      ctx.moveTo(stepX0, stepY);
      ctx.lineTo(stepX1, stepY);
      ctx.stroke();
    }

    if (d <= 2) {
      ctx.font = `bold ${Math.max(8, 11 - d * 2)}px monospace`;
      ctx.fillStyle = this.colors.stairsLine;
      ctx.textAlign = 'center';
      ctx.fillText('▲ STAIRS UP', cur.x0 + cur.w / 2, sy - (stepCount * 9 * scale) - 6);
    }
  }

  // --- Special Floor Gimmicks ---

  drawSpinnerTile(d, lat, theme) {
    if (d > 4) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;
    const midX = cur.x0 + cur.w / 2;
    const midY = cur.y1 - cur.h * 0.15;
    const rx = cur.w * 0.32;
    const ry = cur.h * 0.09;

    ctx.strokeStyle = this.colors.spinnerLine;
    ctx.lineWidth = d <= 1 ? 2 : 1;
    ctx.beginPath();
    ctx.ellipse(midX, midY, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Spiral / Spinner arrows
    if (d <= 2) {
      ctx.beginPath();
      ctx.arc(midX, midY, rx * 0.5, 0, Math.PI * 1.5);
      ctx.stroke();
    }
  }

  drawWarpTile(d, lat, theme) {
    if (d > 4) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;
    const midX = cur.x0 + cur.w / 2;
    const midY = cur.y1 - cur.h * 0.15;
    const rx = cur.w * 0.36;
    const ry = cur.h * 0.10;

    ctx.strokeStyle = this.colors.warpLine;
    ctx.lineWidth = d <= 1 ? 2 : 1;
    ctx.beginPath();
    ctx.ellipse(midX, midY, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
    ctx.fill();
  }

  // --- Interactive Objects (Chests, Relics, Exit) ---

  drawInteractive(d, lat, item, state, theme) {
    if (d > 4) return;
    const ctx = this.ctx;
    const cur = this.getScreenBounds(d, lat);
    if (cur.x1 < -50 || cur.x0 > this.width + 50) return;
    const centerX = cur.x0 + cur.w / 2;
    const baseY = cur.y1 - 6;

    if (item.type === 'monument') {
      this.drawZenithMonument(centerX, baseY, d);
    } else if (item.type === 'chest') {
      const tileKey = `${state.floor},${item.x || (state.x + DIRECTIONS[state.dir].dx * d)},${item.y || (state.y + DIRECTIONS[state.dir].dy * d)}`;
      const isOpened = state.openedChests.has(tileKey);
      this.drawChest(centerX, baseY, d, isOpened);
    } else if (item.type === 'exit') {
      this.drawExitGate(centerX, baseY, d);
    }
  }

  drawZenithMonument(x, y, d) {
    const ctx = this.ctx;
    const scale = Math.max(0.4, 1.4 - d * 0.3);
    const w = 48 * scale;
    const h = 72 * scale;

    // Glowing base pedestal
    ctx.fillStyle = '#1c1526';
    ctx.fillRect(x - w / 2, y - h * 0.35, w, h * 0.35);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2, y - h * 0.35, w, h * 0.35);

    // Golden trim
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - w * 0.45, y - h * 0.3, w * 0.9, h * 0.25);

    // Floating Zenith Crystal / Obelisk
    const time = this.lastRenderTime || performance.now();
    const floatY = y - h * 0.55 + Math.sin(time / 280) * (6 * scale);

    // Radiant Aura
    const grad = ctx.createRadialGradient(x, floatY, 4 * scale, x, floatY, 32 * scale);
    grad.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
    grad.addColorStop(0.4, 'rgba(192, 132, 252, 0.6)');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, floatY, 32 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Diamond Obelisk shape
    ctx.fillStyle = '#fdf4ff';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, floatY - 24 * scale);
    ctx.lineTo(x + 14 * scale, floatY);
    ctx.lineTo(x, floatY + 24 * scale);
    ctx.lineTo(x - 14 * scale, floatY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Monument title
    ctx.font = `bold ${Math.floor(11 * scale)}px monospace`;
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.fillText('★ ASTRAL ZENITH ★', x, y - h - 10 * scale);
  }

  drawChest(x, y, d, isOpened) {
    const ctx = this.ctx;
    const scale = Math.max(0.4, 1.25 - d * 0.3);
    const w = 44 * scale;
    const h = 28 * scale;

    ctx.fillStyle = isOpened ? '#18120c' : this.colors.chestFill;
    ctx.fillRect(x - w / 2, y - h, w, h);

    ctx.strokeStyle = this.colors.chestLine;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2, y - h, w, h);

    if (isOpened) {
      // Open lid showing treasure glow
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y - h);
      ctx.lineTo(x - w / 2 - 5, y - h - 12 * scale);
      ctx.lineTo(x + w / 2 + 5, y - h - 12 * scale);
      ctx.lineTo(x + w / 2, y - h);
      ctx.stroke();

      // Gold shimmer inside
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(x - w * 0.3, y - h + 2, w * 0.6, 6 * scale);
    } else {
      // Curved lid top
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y - h);
      ctx.quadraticCurveTo(x, y - h - 8 * scale, x + w / 2, y - h);
      ctx.stroke();

      // Metal strap & Lock
      ctx.strokeRect(x - w / 2, y - h * 0.45, w, 5 * scale);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(x - 3 * scale, y - h * 0.55, 6 * scale, 8 * scale);
    }
  }

  drawRelicPedestal(x, y, d, relicId) {
    const ctx = this.ctx;
    const scale = Math.max(0.4, 1.3 - d * 0.3);
    const w = 36 * scale;
    const h = 30 * scale;

    // Stone Pedestal with sculpted trims
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2, y - h, w, h);

    // Floating animation
    const time = this.lastRenderTime || performance.now();
    const floatY = y - h - 16 * scale + Math.sin(time / 260) * (5 * scale);
    
    // Radiant Halo Glow
    const grad = ctx.createRadialGradient(x, floatY, 2, x, floatY, 22 * scale);
    grad.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
    grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.3)');
    grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, floatY, 22 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Relic Emoji Icon
    const relicObj = RELICS.find(r => r.id === relicId);
    ctx.font = `${Math.floor(22 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(relicObj ? relicObj.icon : '✨', x, floatY);
  }

  drawEmptyPedestal(x, y, d) {
    const ctx = this.ctx;
    const scale = Math.max(0.4, 1.3 - d * 0.3);
    const w = 36 * scale;
    const h = 30 * scale;

    ctx.fillStyle = '#090d14';
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - w / 2, y - h, w, h);
  }

  drawExitGate(x, y, d) {
    const ctx = this.ctx;
    const scale = Math.max(0.5, 1.4 - d * 0.3);
    const w = 64 * scale;
    const h = 84 * scale;

    // Stone Archway
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - w / 2, y - h, w, h);

    // Heavy Gate Bars
    for (let i = -w / 2 + 8; i < w / 2; i += 10 * scale) {
      ctx.beginPath();
      ctx.moveTo(x + i, y - h);
      ctx.lineTo(x + i, y);
      ctx.stroke();
    }

    ctx.font = `bold ${Math.floor(12 * scale)}px monospace`;
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.fillText('★ EXIT GATE ★', x, y - h - 10);
  }

  // --- Atmospheric Overlays (Vignette & Scanlines) ---

  renderAtmosphericOverlay(theme) {
    const ctx = this.ctx;

    // Soft Cinematic Vignette
    const vignette = ctx.createRadialGradient(
      this.cx, this.cy, this.height * 0.35,
      this.cx, this.cy, this.width * 0.65
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Retro Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let y = 0; y < this.height; y += 4) {
      ctx.fillRect(0, y, this.width, 1);
    }
  }
}
