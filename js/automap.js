/**
 * automap.js - 2D Automap Renderer with Fog of War
 * Optimized for 30x30 5-Floor Vertical Dungeon
 */

class AutomapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  render(state) {
    const ctx = this.ctx;
    const viewFloorIdx = state.mapSelectedFloor !== undefined ? state.mapSelectedFloor : state.floor;
    const floorData = DUNGEON_DATA.floors[viewFloorIdx];
    const visitedGrid = state.visited[viewFloorIdx];

    // Background
    ctx.fillStyle = '#06080c';
    ctx.fillRect(0, 0, this.width, this.height);

    // Compute grid scale to fit canvas centered
    const maxDim = Math.max(floorData.width, floorData.height);
    const availableSize = Math.min(this.width - 40, this.height - 70);
    const tileSize = Math.floor(availableSize / maxDim);
    const mapW = floorData.width * tileSize;
    const mapH = floorData.height * tileSize;
    const offsetX = Math.floor((this.width - mapW) / 2);
    const offsetY = Math.floor((this.height - 30 - mapH) / 2) + 20;

    // Floor title and exploration percent
    this.drawHeader(ctx, floorData.name, visitedGrid, floorData);

    // Grid outer border
    ctx.strokeStyle = '#243247';
    ctx.lineWidth = 1;
    ctx.strokeRect(offsetX - 2, offsetY - 2, mapW + 4, mapH + 4);

    // Helper to check if a tile is a solid wall
    const isSolidWall = (x, y) => {
      if (x < 0 || x >= floorData.width || y < 0 || y >= floorData.height) return true;
      const t = floorData.grid[y][x];
      if (t === TILES.WALL) return true;
      if (t === TILES.SECRET_WALL) {
        const key = `${viewFloorIdx},${x},${y}`;
        return !state.revealedSecrets.has(key);
      }
      return false;
    };

    // Draw each cell
    for (let y = 0; y < floorData.height; y++) {
      for (let x = 0; x < floorData.width; x++) {
        const isVisited = visitedGrid[y][x];
        const cx = offsetX + x * tileSize;
        const cy = offsetY + y * tileSize;

        if (!isVisited) {
          // Unexplored fog of war
          ctx.fillStyle = '#0a0d13';
          ctx.fillRect(cx, cy, tileSize, tileSize);
          continue;
        }

        const tile = floorData.grid[y][x];
        const tileKey = `${viewFloorIdx},${x},${y}`;
        const interactive = floorData.interactives[`${x},${y}`];
        const isWall = isSolidWall(x, y);

        if (isWall) {
          // Explored wall cell: deep slate background
          ctx.fillStyle = '#080c14';
          ctx.fillRect(cx, cy, tileSize, tileSize);

          // Draw painting landmark if mounted on this wall
          if (interactive && interactive.type === 'painting') {
            this.drawPaintingMapIcon(ctx, cx, cy, tileSize);
          }
        } else {
          // Explored floor
          ctx.fillStyle = '#111927';
          ctx.fillRect(cx, cy, tileSize, tileSize);

          // Subtle grid cell border
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(cx, cy, tileSize, tileSize);

          // Render features
          if (tile === TILES.SECRET_WALL) {
            // Revealed secret wall passage
            ctx.fillStyle = '#0f2922';
            ctx.fillRect(cx, cy, tileSize, tileSize);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1;
            ctx.strokeRect(cx + 1, cy + 1, tileSize - 2, tileSize - 2);
            ctx.fillStyle = '#10b981';
            ctx.font = `bold ${Math.max(8, Math.floor(tileSize * 0.6))}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', cx + tileSize / 2, cy + tileSize / 2);
          } else if (tile === TILES.DOOR) {
            this.drawDoorCell(ctx, cx, cy, tileSize, state.openedDoors.has(tileKey));
          } else if (tile === TILES.STAIRS_DOWN) {
            this.drawStairsIcon(ctx, cx, cy, tileSize, 'down');
          } else if (tile === TILES.STAIRS_UP) {
            this.drawStairsIcon(ctx, cx, cy, tileSize, 'up');
          } else if (tile === TILES.SPINNER) {
            this.drawSpinnerIcon(ctx, cx, cy, tileSize);
          } else if (tile === TILES.WARP) {
            this.drawWarpIcon(ctx, cx, cy, tileSize);
          }

          // Draw Interactive (Monument, Signs)
          if (interactive) {
            this.drawInteractiveIcon(ctx, cx, cy, tileSize, interactive, tileKey, state);
          }
        }
      }
    }

    // Draw sharp wall lines along boundaries between explored floors and walls
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'square';
    ctx.beginPath();

    for (let y = 0; y < floorData.height; y++) {
      for (let x = 0; x < floorData.width; x++) {
        if (!visitedGrid[y][x]) continue;
        if (isSolidWall(x, y)) continue;

        const cx = offsetX + x * tileSize;
        const cy = offsetY + y * tileSize;

        // North edge
        if (isSolidWall(x, y - 1)) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + tileSize, cy);
        }
        // South edge
        if (isSolidWall(x, y + 1)) {
          ctx.moveTo(cx, cy + tileSize);
          ctx.lineTo(cx + tileSize, cy + tileSize);
        }
        // West edge
        if (isSolidWall(x - 1, y)) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy + tileSize);
        }
        // East edge
        if (isSolidWall(x + 1, y)) {
          ctx.moveTo(cx + tileSize, cy);
          ctx.lineTo(cx + tileSize, cy + tileSize);
        }
      }
    }
    ctx.stroke();

    // Draw Player if viewing current floor
    if (viewFloorIdx === state.floor) {
      const px = offsetX + state.x * tileSize + tileSize / 2;
      const py = offsetY + state.y * tileSize + tileSize / 2;
      this.drawPlayerMarker(ctx, px, py, tileSize, state.dir);
    }
  }

  drawHeader(ctx, floorName, visitedGrid, floorData) {
    let visitedCount = 0;
    let totalNonWall = 0;
    for (let y = 0; y < floorData.height; y++) {
      for (let x = 0; x < floorData.width; x++) {
        if (floorData.grid[y][x] !== TILES.WALL) {
          totalNonWall++;
          if (visitedGrid[y][x]) visitedCount++;
        }
      }
    }
    const percent = Math.round((visitedCount / Math.max(1, totalNonWall)) * 100);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`MAP: ${floorName}`, 20, 22);

    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'right';
    ctx.fillText(`フロア踏破率: ${percent}%`, this.width - 20, 22);
  }

  drawDoorCell(ctx, cx, cy, s, isOpen) {
    ctx.fillStyle = '#141c2b';
    ctx.fillRect(cx, cy, s, s);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = isOpen ? 1 : 1.5;
    ctx.strokeRect(cx + 1, cy + 1, s - 2, s - 2);

    if (isOpen) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fillRect(cx + 2, cy + 2, s - 4, s - 4);
    } else {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(cx + s / 2 - 1, cy + 1, 2, s - 2);
    }
  }

  drawStairsIcon(ctx, cx, cy, s, type) {
    ctx.fillStyle = type === 'up' ? '#38bdf8' : '#c084fc';
    const fontSize = Math.max(9, Math.floor(s * 0.9));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type === 'down' ? '▼' : '▲', cx + s / 2, cy + s / 2);
  }

  drawSpinnerIcon(ctx, cx, cy, s) {
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx + s / 2, cy + s / 2, Math.max(2, s * 0.35), 0, Math.PI * 1.5);
    ctx.stroke();
  }

  drawWarpIcon(ctx, cx, cy, s) {
    ctx.fillStyle = '#ec4899';
    const fontSize = Math.max(9, Math.floor(s * 0.8));
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌀', cx + s / 2, cy + s / 2);
  }

  drawInteractiveIcon(ctx, cx, cy, s, item, tileKey, state) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (item.type === 'monument') {
      const fontSize = Math.max(10, Math.floor(s * 0.9));
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText('🌟', cx + s / 2, cy + s / 2);
    } else if (item.type === 'painting') {
      this.drawPaintingMapIcon(ctx, cx, cy, s);
    }
  }

  drawPaintingMapIcon(ctx, cx, cy, s) {
    // Golden miniature picture frame icon on automap
    const framePad = Math.max(1, Math.floor(s * 0.15));
    const fx = cx + framePad;
    const fy = cy + framePad;
    const fw = s - framePad * 2;
    const fh = s - framePad * 2;

    // Glowing golden frame
    ctx.fillStyle = '#b45309';
    ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.strokeRect(fx, fy, fw, fh);

    // Inner canvas with art palette / gem
    if (s >= 11) {
      const fontSize = Math.max(8, Math.floor(s * 0.75));
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎨', cx + s / 2, cy + s / 2);
    } else {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(fx + 2, fy + 2, fw - 4, fh - 4);
    }
  }

  drawPlayerMarker(ctx, px, py, s, dir) {
    ctx.save();
    ctx.translate(px, py);

    // Rotate according to direction (0: North, 1: East, 2: South, 3: West)
    const angle = dir * (Math.PI / 2);
    ctx.rotate(angle);

    // Bright glowing triangle arrow
    const radius = Math.max(4, s * 0.55);
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius * 0.75, radius * 0.75);
    ctx.lineTo(0, radius * 0.35);
    ctx.lineTo(-radius * 0.75, radius * 0.75);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
