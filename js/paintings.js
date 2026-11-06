/**
 * paintings.js - Famous Masterpiece Landmark Paintings for Dungeon Explorer
 * Procedurally rendered classic masterpieces in high-definition offline Canvas 2D
 */

const PAINTINGS_DATA = [
  // --- 1F: 始まりの石造回廊 ---
  {
    id: 'mona_lisa',
    title: 'モナ・リザ',
    originalTitle: 'Mona Lisa (La Gioconda)',
    artist: 'レオナルド・ダ・ヴィンチ',
    year: '1503年〜1519年頃',
    floor: 0,
    x: 9,
    y: 3,
    aspect: 'portrait', // 3:4
    landmarkHint: '【1F北東の目印】入口から南東へ抜けた回廊の要所。ここから南へ進むと中央大扉へ通じる。',
    desc: 'ルネサンスの巨匠ダ・ヴィンチの最高傑作。スフマート（ぼかし技法）によって描かれた神秘的な微笑みと、背景の空気遠近法による雄大な山水が迷宮の石壁に静かに息づいている。',
    draw: function(ctx, w, h) {
      // Background landscape (Sfumato atmospheric perspective)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      skyGrad.addColorStop(0, '#586b66');
      skyGrad.addColorStop(0.5, '#768778');
      skyGrad.addColorStop(1, '#97a389');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.45);

      // Distant mountains (blue-green hazy)
      ctx.fillStyle = '#4d645e';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.35);
      ctx.lineTo(w * 0.25, h * 0.22);
      ctx.lineTo(w * 0.5, h * 0.32);
      ctx.lineTo(w * 0.75, h * 0.2);
      ctx.lineTo(w, h * 0.3);
      ctx.lineTo(w, h * 0.45);
      ctx.lineTo(0, h * 0.45);
      ctx.fill();

      // Winding river & arched bridge
      ctx.strokeStyle = '#8fa38d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.8, h * 0.38);
      ctx.quadraticCurveTo(w * 0.65, h * 0.4, w * 0.7, h * 0.45);
      ctx.stroke();

      // Low balcony & balustrade
      ctx.fillStyle = '#2c3327';
      ctx.fillRect(0, h * 0.42, w, h * 0.1);

      // Mona Lisa Silhouette & Garments
      // Dark dress / veil
      ctx.fillStyle = '#171c15';
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.28);
      ctx.bezierCurveTo(w * 0.28, h * 0.36, w * 0.2, h * 0.55, w * 0.1, h);
      ctx.lineTo(w * 0.9, h);
      ctx.bezierCurveTo(w * 0.8, h * 0.55, w * 0.72, h * 0.36, w * 0.5, h * 0.28);
      ctx.fill();

      // Chest & neck skin
      ctx.fillStyle = '#c7ab88';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.36, w * 0.14, h * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dress neckline with delicate gold embroidery
      ctx.fillStyle = '#22281e';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.40, w * 0.16, h * 0.06, 0, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#cba358';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.38, w * 0.13, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Face
      ctx.fillStyle = '#cfb091';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.28, w * 0.12, h * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wavy dark hair and transparent veil
      ctx.fillStyle = 'rgba(23, 20, 16, 0.92)';
      // Hair left
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.16);
      ctx.bezierCurveTo(w * 0.34, h * 0.22, w * 0.32, h * 0.38, w * 0.36, h * 0.52);
      ctx.bezierCurveTo(w * 0.39, h * 0.45, w * 0.4, h * 0.3, w * 0.42, h * 0.25);
      ctx.fill();
      // Hair right
      ctx.beginPath();
      ctx.moveTo(w * 0.58, h * 0.16);
      ctx.bezierCurveTo(w * 0.66, h * 0.22, w * 0.68, h * 0.38, w * 0.64, h * 0.52);
      ctx.bezierCurveTo(w * 0.61, h * 0.45, w * 0.6, h * 0.3, w * 0.58, h * 0.25);
      ctx.fill();

      // Facial shadows (Sfumato)
      const shadowGrad = ctx.createRadialGradient(w * 0.5, h * 0.3, 2, w * 0.5, h * 0.3, w * 0.12);
      shadowGrad.addColorStop(0, 'rgba(164, 126, 92, 0)');
      shadowGrad.addColorStop(0.8, 'rgba(142, 102, 72, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(80, 56, 38, 0.6)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.28, w * 0.12, h * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#2f241d';
      ctx.beginPath();
      ctx.ellipse(w * 0.45, h * 0.26, 3, 1.5, -0.05, 0, Math.PI * 2);
      ctx.ellipse(w * 0.55, h * 0.26, 3, 1.5, 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Nose shadow
      ctx.strokeStyle = 'rgba(142, 102, 72, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.25);
      ctx.lineTo(w * 0.49, h * 0.31);
      ctx.lineTo(w * 0.52, h * 0.32);
      ctx.stroke();

      // The Enigmatic Smile
      ctx.strokeStyle = 'rgba(150, 75, 60, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.35);
      ctx.quadraticCurveTo(w * 0.5, h * 0.362, w * 0.55, h * 0.348);
      ctx.stroke();

      // Folded hands in foreground
      ctx.fillStyle = '#c7ab88';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.78, w * 0.22, h * 0.08, 0.1, 0, Math.PI * 2);
      ctx.fill();
      // Fingers contour
      ctx.strokeStyle = 'rgba(100, 70, 50, 0.4)';
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.46 + i * 8, h * 0.75);
        ctx.lineTo(w * 0.48 + i * 8, h * 0.82);
        ctx.stroke();
      }

      // Sepia warm antique glaze
      ctx.fillStyle = 'rgba(195, 150, 80, 0.12)';
      ctx.fillRect(0, 0, w, h);
    }
  },

  {
    id: 'pearl_earring',
    title: '真珠の耳飾りの少女',
    originalTitle: 'Girl with a Pearl Earring',
    artist: 'ヨハネス・フェルメール',
    year: '1665年頃',
    floor: 0,
    x: 20,
    y: 5,
    aspect: 'portrait',
    landmarkHint: '【1F中央北の目印】中央庭園へ至る扉の手前の回廊。青と黄色のターバンが闇に輝いている。',
    desc: '「オランダのモナ・リザ」とも称されるフェルメールの傑作。漆黒の闇から振り返る少女の眼差し、高価なウルトラマリンのターバン、そして光を浴びて一際輝く巨大な真珠が息を呑むほど美しい。',
    draw: function(ctx, w, h) {
      // Pitch black Vermeer background
      ctx.fillStyle = '#07090b';
      ctx.fillRect(0, 0, w, h);

      // Yellow-ochre jacket / coat
      ctx.fillStyle = '#8f7743';
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.52);
      ctx.bezierCurveTo(w * 0.25, h * 0.62, w * 0.1, h * 0.8, 0, h);
      ctx.lineTo(w * 0.85, h);
      ctx.bezierCurveTo(w * 0.8, h * 0.75, w * 0.7, h * 0.6, w * 0.55, h * 0.54);
      ctx.fill();

      // Pure white collar highlight
      ctx.fillStyle = '#f1ede4';
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.5);
      ctx.lineTo(w * 0.48, h * 0.55);
      ctx.lineTo(w * 0.42, h * 0.62);
      ctx.lineTo(w * 0.34, h * 0.54);
      ctx.fill();

      // Vibrant Ultramarine Turban (Blue band)
      ctx.fillStyle = '#1e4b85';
      ctx.beginPath();
      ctx.ellipse(w * 0.46, h * 0.28, w * 0.24, h * 0.16, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Golden yellow turban drape falling back
      ctx.fillStyle = '#caa338';
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.24);
      ctx.bezierCurveTo(w * 0.65, h * 0.28, w * 0.72, h * 0.45, w * 0.68, h * 0.72);
      ctx.bezierCurveTo(w * 0.6, h * 0.65, w * 0.55, h * 0.45, w * 0.52, h * 0.36);
      ctx.fill();

      // Pale porcelain skin
      ctx.fillStyle = '#ebd5c0';
      ctx.beginPath();
      ctx.ellipse(w * 0.44, h * 0.36, w * 0.14, h * 0.15, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Soft shadow on face curve
      const faceShadow = ctx.createRadialGradient(w * 0.38, h * 0.36, 5, w * 0.44, h * 0.36, w * 0.14);
      faceShadow.addColorStop(0, 'rgba(235, 213, 192, 0)');
      faceShadow.addColorStop(0.7, 'rgba(180, 140, 115, 0.35)');
      faceShadow.addColorStop(1, 'rgba(90, 60, 45, 0.7)');
      ctx.fillStyle = faceShadow;
      ctx.beginPath();
      ctx.ellipse(w * 0.44, h * 0.36, w * 0.14, h * 0.15, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Big captivating eye
      ctx.fillStyle = '#2a221b';
      ctx.beginPath();
      ctx.arc(w * 0.47, h * 0.34, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Eye highlight reflection
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(w * 0.46, h * 0.33, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Moist pink lips parted slightly
      ctx.fillStyle = '#c75858';
      ctx.beginPath();
      ctx.ellipse(w * 0.44, h * 0.44, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Lip light gleam
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w * 0.43, h * 0.43, 1.5, 1);

      // ★ THE PEARL EARRING ★
      // Drop shadow of pearl
      ctx.fillStyle = 'rgba(10, 10, 10, 0.6)';
      ctx.beginPath();
      ctx.ellipse(w * 0.35, h * 0.45, 6, 8, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Pearl body (soft grey gradient)
      const pearlGrad = ctx.createRadialGradient(w * 0.33, h * 0.42, 1, w * 0.34, h * 0.44, 7);
      pearlGrad.addColorStop(0, '#ffffff');
      pearlGrad.addColorStop(0.3, '#d4dade');
      pearlGrad.addColorStop(0.7, '#85929e');
      pearlGrad.addColorStop(1, '#34495e');
      ctx.fillStyle = pearlGrad;
      ctx.beginPath();
      ctx.ellipse(w * 0.34, h * 0.43, 5, 7.5, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Pearl brilliant white highlight reflection (Vermeer's magical dot)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(w * 0.33, h * 0.40, 2.2, 0, Math.PI * 2);
      ctx.fill();
      // Bottom reflected light from white collar
      ctx.fillStyle = 'rgba(240, 230, 220, 0.65)';
      ctx.beginPath();
      ctx.arc(w * 0.35, h * 0.47, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  {
    id: 'liberty',
    title: '民衆を導く自由の女神',
    originalTitle: 'Liberty Leading the People',
    artist: 'ウジェーヌ・ドラクロワ',
    year: '1830年',
    floor: 0,
    x: 3,
    y: 21,
    aspect: 'landscape', // 4:3
    landmarkHint: '【1F南西の目印】2Fへと続く南西大階段の手前の角。翻るフランス三色旗が昇降口の道標だ。',
    desc: 'フランス7月革命を題材にしたロマン主義の金字塔。煙煙漂う戦火の中、自由の象徴マリアンヌがトリコロール旗を掲げて前進する。階段を目指す冒険者の闘志を鼓舞する。',
    draw: function(ctx, w, h) {
      // Battlefield smoke sky (warm grey to ochre)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#4b4845');
      skyGrad.addColorStop(0.4, '#807768');
      skyGrad.addColorStop(0.7, '#ab9d86');
      skyGrad.addColorStop(1, '#2b231b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant Notre-Dame towers in smoke
      ctx.fillStyle = 'rgba(70, 65, 60, 0.5)';
      ctx.fillRect(w * 0.82, h * 0.32, w * 0.04, h * 0.14);
      ctx.fillRect(w * 0.88, h * 0.32, w * 0.04, h * 0.14);

      // Gunpowder smoke clouds
      ctx.fillStyle = 'rgba(215, 205, 185, 0.25)';
      ctx.beginPath();
      ctx.arc(w * 0.7, h * 0.45, w * 0.2, 0, Math.PI * 2);
      ctx.arc(w * 0.3, h * 0.5, w * 0.22, 0, Math.PI * 2);
      ctx.fill();

      // Fallen barricade timber and stone heap in foreground
      ctx.fillStyle = '#221914';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.8);
      ctx.lineTo(w * 0.4, h * 0.7);
      ctx.lineTo(w * 0.65, h * 0.75);
      ctx.lineTo(w, h * 0.82);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Fallen soldier on bottom left
      ctx.fillStyle = '#f0ede6';
      ctx.fillRect(w * 0.12, h * 0.85, w * 0.14, h * 0.05);
      ctx.fillStyle = '#1c2438';
      ctx.fillRect(w * 0.08, h * 0.88, w * 0.18, h * 0.04);

      // Lady Liberty (Marianne) Figure
      // Yellow drapery dress
      ctx.fillStyle = '#c49a45';
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.42);
      ctx.lineTo(w * 0.42, h * 0.72);
      ctx.lineTo(w * 0.58, h * 0.74);
      ctx.lineTo(w * 0.56, h * 0.46);
      ctx.fill();

      // Torso & Face (Profile looking back)
      ctx.fillStyle = '#dbb993';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.32, w * 0.05, h * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      // Phrygian red cap
      ctx.fillStyle = '#a62b2b';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.27, w * 0.045, h * 0.03, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Right arm raised high holding the Tricolore flag
      ctx.strokeStyle = '#dbb993';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(w * 0.52, h * 0.36);
      ctx.lineTo(w * 0.62, h * 0.18);
      ctx.stroke();

      // Flag pole
      ctx.strokeStyle = '#5a4632';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.58, h * 0.35);
      ctx.lineTo(w * 0.72, h * 0.04);
      ctx.stroke();

      // ★ The Tricolour Flag (Blue, White, Red) billowing in the wind ★
      const fx = w * 0.64;
      const fy = h * 0.05;
      const fw = w * 0.28;
      const fh = h * 0.22;

      // Blue stripe
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(fx, fy + 5);
      ctx.lineTo(fx + fw * 0.33, fy);
      ctx.lineTo(fx + fw * 0.33, fy + fh);
      ctx.lineTo(fx, fy + fh + 8);
      ctx.fill();

      // White stripe
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(fx + fw * 0.33, fy);
      ctx.lineTo(fx + fw * 0.66, fy + 3);
      ctx.lineTo(fx + fw * 0.66, fy + fh + 3);
      ctx.lineTo(fx + fw * 0.33, fy + fh);
      ctx.fill();

      // Red stripe
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(fx + fw * 0.66, fy + 3);
      ctx.lineTo(fx + fw, fy - 2);
      ctx.lineTo(fx + fw - 8, fy + fh - 4);
      ctx.lineTo(fx + fw * 0.66, fy + fh + 3);
      ctx.fill();

      // Man in top hat with musket on the left
      ctx.fillStyle = '#171c22';
      // Top hat
      ctx.fillRect(w * 0.26, h * 0.42, w * 0.06, h * 0.08);
      ctx.fillRect(w * 0.24, h * 0.49, w * 0.1, h * 0.02);
      // Coat
      ctx.fillRect(w * 0.25, h * 0.52, w * 0.09, h * 0.22);

      // Boy with pistols on the right (Gavroche inspiration)
      ctx.fillStyle = '#222831';
      ctx.fillRect(w * 0.72, h * 0.52, w * 0.07, h * 0.2);
      ctx.fillStyle = '#dbb993';
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.48, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // --- 2F: 苔むす翡翠の回廊 ---
  {
    id: 'gleaners',
    title: '落穂拾い',
    originalTitle: 'The Gleaners (Des glaneuses)',
    artist: 'ジャン＝フランソワ・ミレー',
    year: '1857年',
    floor: 1,
    x: 9,
    y: 13,
    aspect: 'landscape',
    landmarkHint: '【2F西回廊の目印】西の大部屋の要所。ここから北へ進めば3Fへの冷気の階段がある。',
    desc: 'バルビゾン派ミレーの代表作。夕暮れの大地に佇み、収穫後の畑で落ち穂を拾い集める3人の貧しい農婦たち。大地と共にある素朴な崇高さが苔むす回廊の静寂と重なる。',
    draw: function(ctx, w, h) {
      // Soft pale sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      skyGrad.addColorStop(0, '#7ba0bb');
      skyGrad.addColorStop(0.6, '#b4c9c9');
      skyGrad.addColorStop(1, '#d8d4b2');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.45);

      // Distant golden wheat fields & haystacks
      ctx.fillStyle = '#caa358';
      ctx.fillRect(0, h * 0.42, w, h * 0.58);

      // Huge rounded haystacks in distance
      ctx.fillStyle = '#a67d32';
      ctx.beginPath();
      ctx.arc(w * 0.7, h * 0.42, w * 0.14, Math.PI, 0);
      ctx.arc(w * 0.88, h * 0.43, w * 0.12, Math.PI, 0);
      ctx.fill();

      // Harvest wagons and farm supervisor on horseback
      ctx.fillStyle = '#5c4524';
      ctx.fillRect(w * 0.5, h * 0.38, w * 0.06, h * 0.04);
      ctx.fillRect(w * 0.38, h * 0.37, 4, 8); // Horse rider silhouette

      // Foreground field stubble texture
      ctx.fillStyle = '#9b7b3b';
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      // Three Peasant Women bending over
      // Woman 1 (Left - Blue cap, brown skirt)
      ctx.fillStyle = '#415a77'; // bonnet
      ctx.beginPath();
      ctx.ellipse(w * 0.24, h * 0.65, 7, 6, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8d7350'; // bent back
      ctx.beginPath();
      ctx.ellipse(w * 0.28, h * 0.70, w * 0.09, h * 0.07, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2f3e46'; // skirt
      ctx.beginPath();
      ctx.ellipse(w * 0.25, h * 0.82, w * 0.07, h * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Woman 2 (Center - Red cap, white sleeves, blue skirt)
      ctx.fillStyle = '#a63a3a'; // red bonnet
      ctx.beginPath();
      ctx.ellipse(w * 0.48, h * 0.66, 7, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c7b396'; // blouse
      ctx.beginPath();
      ctx.ellipse(w * 0.52, h * 0.71, w * 0.08, h * 0.06, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#355070'; // blue skirt
      ctx.beginPath();
      ctx.ellipse(w * 0.51, h * 0.83, w * 0.07, h * 0.11, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Woman 3 (Right - Ochre cap, standing slightly more upright)
      ctx.fillStyle = '#b58332'; // bonnet
      ctx.beginPath();
      ctx.ellipse(w * 0.74, h * 0.58, 6, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7a6042'; // back
      ctx.beginPath();
      ctx.ellipse(w * 0.75, h * 0.68, w * 0.07, h * 0.09, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3d405b'; // skirt
      ctx.beginPath();
      ctx.ellipse(w * 0.77, h * 0.82, w * 0.06, h * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  {
    id: 'parasol',
    title: '散歩、日傘をさす女',
    originalTitle: 'Woman with a Parasol - Madame Monet and Her Son',
    artist: 'クロード・モネ',
    year: '1875年',
    floor: 1,
    x: 20,
    y: 13,
    aspect: 'portrait',
    landmarkHint: '【2F東回廊の目印】翡翠の東回廊の中央地点。爽やかな風と光が漂う名画。',
    desc: '印象派モネが描いた妻カミーユと息子ジャン。夏の草原に立つ日傘の女性を仰ぎ見るような構図で捉え、陽光と風のきらめきがキャンバスいっぱいに躍動している。',
    draw: function(ctx, w, h) {
      // Luminous blue summer sky with windblown clouds
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      skyGrad.addColorStop(0, '#5390d9');
      skyGrad.addColorStop(0.5, '#72b0ea');
      skyGrad.addColorStop(1, '#c0dcf7');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.7);

      // Wispy white impressionist clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.ellipse(w * 0.3, h * 0.2, w * 0.25, h * 0.06, -0.1, 0, Math.PI * 2);
      ctx.ellipse(w * 0.7, h * 0.15, w * 0.28, h * 0.08, 0.1, 0, Math.PI * 2);
      ctx.ellipse(w * 0.5, h * 0.35, w * 0.35, h * 0.07, -0.05, 0, Math.PI * 2);
      ctx.fill();

      // Green grass hill in foreground
      ctx.fillStyle = '#4f772d';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.68);
      ctx.quadraticCurveTo(w * 0.5, h * 0.62, w, h * 0.72);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Grass strokes with wild poppies
      ctx.strokeStyle = '#6a994e';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 30; i++) {
        const gx = (i * 29) % w;
        const gy = h * 0.7 + (i * 17) % (h * 0.28);
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + 4, gy - 12);
        ctx.stroke();
      }
      // Red poppy specks
      ctx.fillStyle = '#e63946';
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc((i * 47) % w, h * 0.75 + (i * 23) % (h * 0.2), 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Madame Monet figure in billowing white dress
      // Flowing white dress
      ctx.fillStyle = '#edf2f4';
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.38);
      ctx.bezierCurveTo(w * 0.42, h * 0.48, w * 0.34, h * 0.62, w * 0.36, h * 0.76);
      ctx.lineTo(w * 0.7, h * 0.74);
      ctx.bezierCurveTo(w * 0.64, h * 0.6, w * 0.58, h * 0.46, w * 0.53, h * 0.38);
      ctx.fill();

      // Shadow in dress folds (lavender & soft green reflection)
      ctx.fillStyle = 'rgba(140, 160, 185, 0.4)';
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.48);
      ctx.lineTo(w * 0.42, h * 0.74);
      ctx.lineTo(w * 0.55, h * 0.73);
      ctx.fill();

      // Head and fluttering veil
      ctx.fillStyle = '#ecd1b4';
      ctx.beginPath();
      ctx.arc(w * 0.52, h * 0.32, 10, 0, Math.PI * 2);
      ctx.fill();
      // White veil
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.ellipse(w * 0.46, h * 0.33, 14, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Green Parasol tilted against the sky
      ctx.fillStyle = '#386641';
      ctx.beginPath();
      ctx.ellipse(w * 0.42, h * 0.22, w * 0.18, h * 0.08, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // Light green underside of umbrella reflecting light
      ctx.fillStyle = '#90be6d';
      ctx.beginPath();
      ctx.ellipse(w * 0.44, h * 0.24, w * 0.15, h * 0.05, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Son Jean in background on right
      ctx.fillStyle = '#fdf0d5';
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.62, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b7094c';
      ctx.fillRect(w * 0.75, h * 0.65, 7, 14);
    }
  },

  {
    id: 'birth_of_venus',
    title: 'ヴィーナスの誕生',
    originalTitle: 'The Birth of Venus (Nascita di Venere)',
    artist: 'サンドロ・ボッティチェッリ',
    year: '1485年頃',
    floor: 1,
    x: 19,
    y: 14,
    aspect: 'landscape',
    landmarkHint: '【2F中央秘室の目印】3Fから降り立った孤立した翡翠の聖域に飾られた至高の美。',
    desc: 'ルネサンス初期フィレンツェの至宝。巨大なホタテ貝の上に立つ愛と美の女神ヴィーナス。風の神ゼピュロスが吹き寄せる薔薇の花びらの中、優美な曲線美が秘室に満ちている。',
    draw: function(ctx, w, h) {
      // Soft turquoise sea and pale sky
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#a3c4bc');
      bgGrad.addColorStop(0.5, '#417b7e');
      bgGrad.addColorStop(1, '#2c5d63');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Orange grove coast on the right
      ctx.fillStyle = '#1b3b22';
      ctx.beginPath();
      ctx.moveTo(w * 0.78, h * 0.25);
      ctx.lineTo(w, h * 0.2);
      ctx.lineTo(w, h * 0.8);
      ctx.lineTo(w * 0.85, h * 0.8);
      ctx.fill();

      // Giant pink scallop shell
      ctx.fillStyle = '#f2cc8f';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.85, w * 0.24, h * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      // Shell ribs
      ctx.strokeStyle = '#d4a373';
      ctx.lineWidth = 2;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.94);
        ctx.lineTo(w * 0.5 + i * 16, h * 0.78);
        ctx.stroke();
      }

      // Venus Figure (Graceful Contrapposto)
      // Pale golden skin
      ctx.fillStyle = '#fceade';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.54, w * 0.05, h * 0.22, 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Long cascading golden hair
      ctx.fillStyle = '#e0a96d';
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.32);
      ctx.bezierCurveTo(w * 0.42, h * 0.4, w * 0.38, h * 0.6, w * 0.44, h * 0.78);
      ctx.bezierCurveTo(w * 0.48, h * 0.72, w * 0.46, h * 0.5, w * 0.52, h * 0.35);
      ctx.fill();

      // Head
      ctx.fillStyle = '#fceade';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.3, 10, 0, Math.PI * 2);
      ctx.fill();

      // Zephyr & Chloris on the left blowing winds
      ctx.fillStyle = '#4a6fa5';
      ctx.beginPath();
      ctx.ellipse(w * 0.18, h * 0.36, w * 0.12, h * 0.1, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Floating pink roses
      ctx.fillStyle = '#ffb4a2';
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(w * 0.28 + (i * 19) % 80, h * 0.3 + (i * 13) % 60, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Spring Goddess (Hora) on right holding cloak
      ctx.fillStyle = '#e76f51';
      ctx.beginPath();
      ctx.moveTo(w * 0.72, h * 0.4);
      ctx.lineTo(w * 0.64, h * 0.5);
      ctx.lineTo(w * 0.74, h * 0.78);
      ctx.lineTo(w * 0.82, h * 0.75);
      ctx.fill();
    }
  },

  // --- 3F: 蒼冷の氷晶回廊 ---
  {
    id: 'starry_night',
    title: '星月夜',
    originalTitle: 'The Starry Night (De sterrennacht)',
    artist: 'フィンセント・ファン・ゴッホ',
    year: '1889年',
    floor: 2,
    x: 14,
    y: 1,
    aspect: 'landscape',
    landmarkHint: '【3F北の大回廊の目印】東西の回廊を結ぶ氷晶の架け橋の中央。うねる夜空と星の光が広がる。',
    desc: 'サン＝レミの療養院でゴッホが描いた情熱と孤独の最高傑作。深青の夜空に激しく渦巻く大気、黄金に燃える星々と三日月、そして天へと燃え上がる漆黒の糸杉が凍てつく氷晶の迷宮を照らす。',
    draw: function(ctx, w, h) {
      // Deep cobalt and ultramarine swirling night sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.75);
      skyGrad.addColorStop(0, '#0c1831');
      skyGrad.addColorStop(0.5, '#16315c');
      skyGrad.addColorStop(1, '#1b4982');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.75);

      // Dynamic swirling atmospheric winds (Van Gogh impasto strokes)
      ctx.strokeStyle = '#4ea8de';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.4);
      ctx.bezierCurveTo(w * 0.35, h * 0.15, w * 0.45, h * 0.55, w * 0.7, h * 0.32);
      ctx.stroke();

      ctx.strokeStyle = '#90e0ef';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.35);
      ctx.bezierCurveTo(w * 0.4, h * 0.2, w * 0.55, h * 0.5, w * 0.85, h * 0.25);
      ctx.stroke();

      // Swirling center vortex
      ctx.strokeStyle = '#caf0f8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(w * 0.52, h * 0.32, w * 0.12, 0.5, Math.PI * 1.8);
      ctx.stroke();

      // ★ Glowing Golden Crescent Moon (Top Right) ★
      const mx = w * 0.86;
      const my = h * 0.18;
      // Radiant yellow aura
      const moonAura = ctx.createRadialGradient(mx, my, 8, mx, my, 40);
      moonAura.addColorStop(0, 'rgba(255, 230, 100, 0.95)');
      moonAura.addColorStop(0.5, 'rgba(255, 183, 3, 0.4)');
      moonAura.addColorStop(1, 'rgba(255, 183, 3, 0)');
      ctx.fillStyle = moonAura;
      ctx.beginPath();
      ctx.arc(mx, my, 40, 0, Math.PI * 2);
      ctx.fill();

      // Crescent Moon shape
      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.arc(mx, my, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#16315c';
      ctx.beginPath();
      ctx.arc(mx - 6, my - 4, 14, 0, Math.PI * 2);
      ctx.fill();

      // Brilliant Swirling Stars
      const stars = [
        { x: 0.18, y: 0.22, r: 18, c: '#ffd166' },
        { x: 0.34, y: 0.15, r: 14, c: '#ffe3a8' },
        { x: 0.65, y: 0.18, r: 16, c: '#ffd166' },
        { x: 0.42, y: 0.42, r: 12, c: '#fff3b0' },
        { x: 0.76, y: 0.38, r: 14, c: '#ffd166' },
        { x: 0.92, y: 0.46, r: 10, c: '#ffe3a8' },
        { x: 0.08, y: 0.52, r: 12, c: '#ffd166' }
      ];
      stars.forEach(s => {
        const sx = w * s.x;
        const sy = h * s.y;
        // Star Halo
        const starGrad = ctx.createRadialGradient(sx, sy, 2, sx, sy, s.r);
        starGrad.addColorStop(0, '#ffffff');
        starGrad.addColorStop(0.3, s.c);
        starGrad.addColorStop(0.8, 'rgba(255, 209, 102, 0.3)');
        starGrad.addColorStop(1, 'rgba(255, 209, 102, 0)');
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Rolling Alpilles Mountains on horizon
      ctx.fillStyle = '#0f2744';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.quadraticCurveTo(w * 0.35, h * 0.62, w * 0.65, h * 0.68);
      ctx.quadraticCurveTo(w * 0.85, h * 0.64, w, h * 0.7);
      ctx.lineTo(w, h * 0.85);
      ctx.lineTo(0, h * 0.85);
      ctx.fill();

      // Saint-Rémy Village rooftops & church steeple
      ctx.fillStyle = '#0a1626';
      ctx.fillRect(0, h * 0.75, w, h * 0.25);
      // Little houses with glowing yellow windows
      ctx.fillStyle = '#1e385c';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(w * 0.38 + i * 26, h * 0.76, 20, 14);
      }
      // Church Steeple piercing the sky
      ctx.fillStyle = '#08111c';
      ctx.beginPath();
      ctx.moveTo(w * 0.54, h * 0.52);
      ctx.lineTo(w * 0.51, h * 0.8);
      ctx.lineTo(w * 0.57, h * 0.8);
      ctx.closePath();
      ctx.fill();

      // ★ Massive Flaming Cypress Tree (Left Foreground) ★
      ctx.fillStyle = '#050f0d';
      ctx.beginPath();
      ctx.moveTo(w * 0.16, h * 0.16);
      ctx.bezierCurveTo(w * 0.24, h * 0.38, w * 0.26, h * 0.68, w * 0.28, h);
      ctx.lineTo(w * 0.04, h);
      ctx.bezierCurveTo(w * 0.06, h * 0.7, w * 0.08, h * 0.42, w * 0.16, h * 0.16);
      ctx.fill();
      // Second cypress branch
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.34);
      ctx.bezierCurveTo(w * 0.26, h * 0.45, w * 0.27, h * 0.65, w * 0.28, h * 0.85);
      ctx.fill();
    }
  },

  {
    id: 'great_wave',
    title: '冨嶽三十六景 神奈川沖浪裏',
    originalTitle: 'The Great Wave off Kanagawa',
    artist: '葛飾北斎',
    year: '1831年頃',
    floor: 2,
    x: 7,
    y: 15,
    aspect: 'landscape',
    landmarkHint: '【3F空間跳躍の目印】魔方陣ワープの手前の壁。激しいうねる藍色の巨波が目印だ！',
    desc: '世界の美術史に計り知れない影響を与えた浮世絵の巨匠・北斎の不滅の傑作。ベロ藍で描かれたダイナミックな大波の鉤爪と、波の奥に静然とそびえる富士山の動と静の対比が圧巻。',
    draw: function(ctx, w, h) {
      // Sky (pale cream to soft grey at top)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
      skyGrad.addColorStop(0, '#b8b4a8');
      skyGrad.addColorStop(0.5, '#e5dec9');
      skyGrad.addColorStop(1, '#f4eedb');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Sacred Mount Fuji (small, calm in the center trough)
      const fujiX = w * 0.58;
      const fujiY = h * 0.64;
      // Fuji base (Prussian blue)
      ctx.fillStyle = '#102a43';
      ctx.beginPath();
      ctx.moveTo(fujiX - 32, fujiY + 28);
      ctx.lineTo(fujiX, fujiY);
      ctx.lineTo(fujiX + 32, fujiY + 28);
      ctx.fill();
      // Fuji snow crown
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(fujiX - 12, fujiY + 11);
      ctx.lineTo(fujiX, fujiY);
      ctx.lineTo(fujiX + 12, fujiY + 11);
      ctx.lineTo(fujiX + 6, fujiY + 8);
      ctx.lineTo(fujiX, fujiY + 12);
      ctx.lineTo(fujiX - 6, fujiY + 8);
      ctx.closePath();
      ctx.fill();

      // Lower undulating ocean waves
      ctx.fillStyle = '#102a43';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.75);
      ctx.quadraticCurveTo(w * 0.4, h * 0.88, w * 0.7, h * 0.72);
      ctx.quadraticCurveTo(w * 0.85, h * 0.65, w, h * 0.78);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Narrow Oshiokuri-bune boats riding the swell
      ctx.fillStyle = '#d4a373';
      ctx.beginPath();
      ctx.ellipse(w * 0.48, h * 0.76, 36, 4, -0.2, 0, Math.PI * 2);
      ctx.ellipse(w * 0.74, h * 0.84, 40, 5, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Secondary rearing wave on right
      ctx.fillStyle = '#183b56';
      ctx.beginPath();
      ctx.moveTo(w * 0.65, h);
      ctx.bezierCurveTo(w * 0.72, h * 0.65, w * 0.84, h * 0.55, w * 0.95, h * 0.52);
      ctx.lineTo(w, h);
      ctx.fill();

      // ★ THE COLOSSAL GREAT WAVE (Left Crest) ★
      // Deep Prussian Blue body
      ctx.fillStyle = '#0b2038';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.45);
      ctx.bezierCurveTo(w * 0.12, h * 0.38, w * 0.18, h * 0.18, w * 0.38, h * 0.14);
      ctx.bezierCurveTo(w * 0.48, h * 0.12, w * 0.54, h * 0.28, w * 0.46, h * 0.42);
      ctx.bezierCurveTo(w * 0.36, h * 0.55, w * 0.22, h * 0.58, w * 0.14, h * 0.7);
      ctx.lineTo(0, h * 0.8);
      ctx.fill();

      // Lighter blue wave shading
      ctx.fillStyle = '#266089';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.bezierCurveTo(w * 0.1, h * 0.46, w * 0.2, h * 0.32, w * 0.34, h * 0.24);
      ctx.bezierCurveTo(w * 0.4, h * 0.22, w * 0.42, h * 0.35, w * 0.34, h * 0.48);
      ctx.fill();

      // White Wave Foam & Claw-like Splatters
      ctx.fillStyle = '#ffffff';
      // Crest foam
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.14, 14, 0, Math.PI * 2);
      ctx.arc(w * 0.46, h * 0.18, 12, 0, Math.PI * 2);
      ctx.arc(w * 0.5, h * 0.25, 10, 0, Math.PI * 2);
      ctx.arc(w * 0.46, h * 0.36, 12, 0, Math.PI * 2);
      ctx.fill();

      // Claw foam fingers reaching down
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      const claws = [
        [0.34, 0.12, 0.36, 0.08],
        [0.40, 0.11, 0.44, 0.08],
        [0.46, 0.14, 0.52, 0.12],
        [0.48, 0.20, 0.56, 0.20],
        [0.48, 0.28, 0.54, 0.32],
        [0.44, 0.38, 0.48, 0.44]
      ];
      claws.forEach(c => {
        ctx.beginPath();
        ctx.moveTo(w * c[0], h * c[1]);
        ctx.lineTo(w * c[2], h * c[3]);
        ctx.stroke();
      });

      // Scattered foam spray droplets
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 28; i++) {
        const dx = w * (0.35 + (i * 13 % 40) / 100);
        const dy = h * (0.1 + (i * 17 % 50) / 100);
        ctx.beginPath();
        ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Traditional Hokusai signature box on top-left
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w * 0.08, h * 0.06, 14, 38);
      ctx.strokeStyle = '#102a43';
      ctx.lineWidth = 1;
      ctx.strokeRect(w * 0.08, h * 0.06, 14, 38);
    }
  },

  {
    id: 'the_scream',
    title: '叫び',
    originalTitle: 'The Scream (Skrik)',
    artist: 'エドヴァルド・ムンク',
    year: '1893年',
    floor: 2,
    x: 4,
    y: 20,
    aspect: 'portrait',
    landmarkHint: '【3F南西の目印】4Fへの上り階段へと向かう回廊。燃える夕焼けと叫ぶ人物が道標だ。',
    desc: '表現主義ムンクの不朽の名作。「自然をつらぬく果てしない叫び」を聞いて耳をふさぐ人物。燃える血のような夕空と青黒いフィヨルドが、過酷な迷宮の緊張感を際立たせる。',
    draw: function(ctx, w, h) {
      // Fiery undulating blood-red & orange evening sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      skyGrad.addColorStop(0, '#d90429');
      skyGrad.addColorStop(0.35, '#f77f00');
      skyGrad.addColorStop(0.7, '#fcbf49');
      skyGrad.addColorStop(1, '#e85d04');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.45);

      // Wavy bands of sunset fire
      ctx.strokeStyle = '#b7094c';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.12);
      ctx.bezierCurveTo(w * 0.35, h * 0.08, w * 0.65, h * 0.22, w, h * 0.16);
      ctx.stroke();

      ctx.strokeStyle = '#ffba08';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.25);
      ctx.bezierCurveTo(w * 0.4, h * 0.32, w * 0.6, h * 0.18, w, h * 0.28);
      ctx.stroke();

      // Deep dark blue / greenish-black fjord and hills
      ctx.fillStyle = '#031926';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.42);
      ctx.bezierCurveTo(w * 0.45, h * 0.38, w * 0.75, h * 0.52, w, h * 0.46);
      ctx.lineTo(w, h * 0.68);
      ctx.bezierCurveTo(w * 0.6, h * 0.62, w * 0.3, h * 0.72, 0, h * 0.62);
      ctx.fill();

      // Slanted brown railing of the bridge (steep perspective)
      ctx.fillStyle = '#5c4033';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.lineTo(w * 0.35, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Wooden bridge diagonal railing bars
      ctx.strokeStyle = '#8b5a2b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.lineTo(w * 0.42, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, h * 0.64);
      ctx.lineTo(w * 0.48, h);
      ctx.stroke();

      // Two dark silhouettes of walking companions in distance
      ctx.fillStyle = '#1a110a';
      ctx.fillRect(w * 0.06, h * 0.58, 6, 20);
      ctx.fillRect(w * 0.12, h * 0.62, 6, 22);

      // ★ The Screaming Figure in Center Foreground ★
      // Dark undulating robe / ghost-like body
      ctx.fillStyle = '#192734';
      ctx.beginPath();
      ctx.moveTo(w * 0.52, h * 0.62);
      ctx.bezierCurveTo(w * 0.44, h * 0.72, w * 0.48, h * 0.88, w * 0.58, h);
      ctx.lineTo(w * 0.88, h);
      ctx.bezierCurveTo(w * 0.82, h * 0.82, w * 0.76, h * 0.7, w * 0.68, h * 0.62);
      ctx.fill();

      // Sinuous pale yellow/greenish face
      ctx.fillStyle = '#d4c79b';
      ctx.beginPath();
      ctx.ellipse(w * 0.6, h * 0.52, w * 0.12, h * 0.11, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Hands clasped against head/ears
      ctx.fillStyle = '#c5b584';
      ctx.beginPath();
      ctx.ellipse(w * 0.48, h * 0.54, 7, 14, 0.2, 0, Math.PI * 2);
      ctx.ellipse(w * 0.72, h * 0.53, 7, 14, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Hollow horrified oval eyes
      ctx.fillStyle = '#261c14';
      ctx.beginPath();
      ctx.ellipse(w * 0.56, h * 0.49, 4, 6, 0.1, 0, Math.PI * 2);
      ctx.ellipse(w * 0.65, h * 0.48, 4, 6, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Nostril slits
      ctx.beginPath();
      ctx.arc(w * 0.59, h * 0.54, 1.5, 0, Math.PI * 2);
      ctx.arc(w * 0.62, h * 0.54, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Gaping screaming mouth
      ctx.fillStyle = '#1c0f08';
      ctx.beginPath();
      ctx.ellipse(w * 0.61, h * 0.60, 6, 11, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // --- 4F: 熾火の赤鉄回廊 ---
  {
    id: 'the_kiss',
    title: '接吻',
    originalTitle: 'The Kiss (Der Kuss)',
    artist: 'グスタフ・クリムト',
    year: '1907年〜1908年',
    floor: 3,
    x: 14,
    y: 18,
    aspect: 'portrait',
    landmarkHint: '【4F中央十字路の目印】黄金と赤鉄の十字路。この絵画から北へ進むと回転床、南へ進むと隠し階段。',
    desc: 'ウィーン分離派クリムトの黄金時代を象徴する最高傑作。金箔が眩く煌めく神秘的な空間で、抱き合い口づけを交わす二人。色鮮やかな幾何学模様と花の絨毯が赤鉄回廊に華やぎを与える。',
    draw: function(ctx, w, h) {
      // Golden speckled ochre background
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.7);
      bgGrad.addColorStop(0, '#e5b842');
      bgGrad.addColorStop(0.5, '#ab8024');
      bgGrad.addColorStop(1, '#4a3610');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Gold leaf stipples & spirals
      ctx.fillStyle = 'rgba(255, 235, 150, 0.6)';
      for (let i = 0; i < 40; i++) {
        ctx.fillRect((i * 37) % w, (i * 29) % h, 2, 2);
      }

      // Carpet of wild flowers & ivy cliff edge at the bottom
      ctx.fillStyle = '#2d5a27';
      ctx.fillRect(w * 0.15, h * 0.78, w * 0.7, h * 0.22);
      // Colorful little flower specks
      const fColors = ['#f72585', '#7209b7', '#4cc9f0', '#fee440', '#ffffff'];
      for (let i = 0; i < 35; i++) {
        ctx.fillStyle = fColors[i % fColors.length];
        ctx.beginPath();
        ctx.arc(w * 0.18 + (i * 17) % (w * 0.64), h * 0.8 + (i * 13) % (h * 0.18), 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ★ The Embracing Golden Cloak ★
      ctx.fillStyle = '#f5c342';
      ctx.beginPath();
      ctx.moveTo(w * 0.36, h * 0.28);
      ctx.bezierCurveTo(w * 0.24, h * 0.42, w * 0.2, h * 0.68, w * 0.28, h * 0.82);
      ctx.lineTo(w * 0.72, h * 0.82);
      ctx.bezierCurveTo(w * 0.8, h * 0.68, w * 0.76, h * 0.42, w * 0.64, h * 0.28);
      ctx.closePath();
      ctx.fill();

      // Man's Cloak Pattern (Black, white & grey geometric rectangles)
      ctx.fillStyle = '#1c1b18';
      for (let i = 0; i < 14; i++) {
        const rx = w * 0.32 + (i * 11) % (w * 0.2);
        const ry = h * 0.36 + (i * 23) % (h * 0.4);
        ctx.fillRect(rx, ry, 12, 6);
        ctx.fillStyle = (i % 2 === 0) ? '#ffffff' : '#1c1b18';
      }

      // Woman's Cloak Pattern (Colorful concentric circles & swirling floral discs)
      const cColors = ['#e63946', '#457b9d', '#2a9d8f', '#ffb703'];
      for (let i = 0; i < 16; i++) {
        const cx = w * 0.52 + (i * 13) % (w * 0.18);
        const cy = h * 0.42 + (i * 19) % (h * 0.36);
        ctx.fillStyle = cColors[i % cColors.length];
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // The Man's Head (Wreath of ivy, bent down)
      ctx.fillStyle = '#8f6843';
      ctx.beginPath();
      ctx.arc(w * 0.48, h * 0.22, 12, 0, Math.PI * 2);
      ctx.fill();
      // Green leaf crown
      ctx.fillStyle = '#386641';
      for (let i = -3; i <= 3; i++) {
        ctx.fillRect(w * 0.48 + i * 3, h * 0.18, 3, 3);
      }

      // The Woman's Face (Tilted upward in pure bliss)
      ctx.fillStyle = '#fceade';
      ctx.beginPath();
      ctx.ellipse(w * 0.56, h * 0.26, 9, 12, 0.4, 0, Math.PI * 2);
      ctx.fill();
      // Closed peaceful eyes
      ctx.strokeStyle = '#5a3d28';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(w * 0.57, h * 0.25, 2.5, 0.2, Math.PI - 0.2);
      ctx.stroke();
      // Delicate lips
      ctx.fillStyle = '#e63946';
      ctx.fillRect(w * 0.54, h * 0.29, 3, 2);

      // Gold aura halo around lovers' heads
      ctx.strokeStyle = '#ffeaa7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(w * 0.52, h * 0.24, w * 0.18, h * 0.12, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  {
    id: 'persistence_of_memory',
    title: '記憶の固執',
    originalTitle: 'The Persistence of Memory',
    artist: 'サルバドール・ダリ',
    year: '1931年',
    floor: 3,
    x: 14,
    y: 12,
    aspect: 'landscape',
    landmarkHint: '【4F回転床の手前の目印】時間の歪みを象徴する柔らかい時計。ここから先は足元の床が回転する！',
    desc: 'シュルレアリスムの旗手ダリの金字塔。時間が溶け出したかのようなぐにゃりと曲がった柔らかい時計たち。足元を狂わせる回転床の手前で、冒険者に方角と意識の覚醒を促す。',
    draw: function(ctx, w, h) {
      // Golden desolate beach & glowing Mediterranean sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      skyGrad.addColorStop(0, '#f3c68f');
      skyGrad.addColorStop(0.5, '#eddcd2');
      skyGrad.addColorStop(1, '#669bbc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.5);

      // Deep blue calm sea & distant amber Port Lligat cliffs
      ctx.fillStyle = '#1d3557';
      ctx.fillRect(0, h * 0.36, w, h * 0.14);
      // Cliffs on the right
      ctx.fillStyle = '#e0a96d';
      ctx.beginPath();
      ctx.moveTo(w * 0.72, h * 0.36);
      ctx.lineTo(w * 0.85, h * 0.22);
      ctx.lineTo(w, h * 0.26);
      ctx.lineTo(w, h * 0.48);
      ctx.lineTo(w * 0.68, h * 0.48);
      ctx.fill();

      // Foreground dark desolate sand plane
      ctx.fillStyle = '#4a3b32';
      ctx.fillRect(0, h * 0.48, w, h * 0.52);

      // Geometric wooden block table on bottom left
      ctx.fillStyle = '#2b2118';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.lineTo(w * 0.32, h * 0.52);
      ctx.lineTo(w * 0.32, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // Dead olive tree trunk rising from table
      ctx.strokeStyle = '#1b140e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.12, h * 0.53);
      ctx.lineTo(w * 0.14, h * 0.26);
      ctx.lineTo(w * 0.28, h * 0.24);
      ctx.stroke();

      // ★ Melting Pocket Watch 1 (Draped over tree branch) ★
      ctx.fillStyle = '#90e0ef';
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.24);
      ctx.bezierCurveTo(w * 0.28, h * 0.25, w * 0.26, h * 0.38, w * 0.24, h * 0.42);
      ctx.lineTo(w * 0.18, h * 0.4);
      ctx.bezierCurveTo(w * 0.19, h * 0.32, w * 0.17, h * 0.25, w * 0.22, h * 0.24);
      ctx.fill();
      ctx.strokeStyle = '#0077b6';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ★ Melting Pocket Watch 2 (Draped over table edge) ★
      ctx.fillStyle = '#caf0f8';
      ctx.beginPath();
      ctx.moveTo(w * 0.16, h * 0.52);
      ctx.lineTo(w * 0.28, h * 0.52);
      ctx.bezierCurveTo(w * 0.30, h * 0.62, w * 0.26, h * 0.72, w * 0.20, h * 0.72);
      ctx.bezierCurveTo(w * 0.15, h * 0.68, w * 0.14, h * 0.58, w * 0.16, h * 0.52);
      ctx.fill();
      ctx.strokeStyle = '#023e8a';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      // Watch hands distorted
      ctx.strokeStyle = '#1d3557';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.58);
      ctx.lineTo(w * 0.24, h * 0.66);
      ctx.stroke();

      // Red pocket watch on table swarmed by black ants
      ctx.fillStyle = '#b7094c';
      ctx.beginPath();
      ctx.arc(w * 0.1, h * 0.62, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(w * 0.08 + (i * 3) % 12, h * 0.6 + (i * 2) % 10, 1.5, 1.5);
      }

      // ★ Strange sleeping fleshy creature on the ground with Melting Watch 3 ★
      ctx.fillStyle = '#d4c7b8';
      ctx.beginPath();
      ctx.ellipse(w * 0.56, h * 0.72, w * 0.18, h * 0.1, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Long dramatic closed eyelashes
      ctx.strokeStyle = '#1a110a';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.52 + i * 4, h * 0.74);
        ctx.lineTo(w * 0.50 + i * 4, h * 0.79);
        ctx.stroke();
      }

      // Melting watch draped over the creature
      ctx.fillStyle = '#90e0ef';
      ctx.beginPath();
      ctx.ellipse(w * 0.55, h * 0.68, w * 0.08, h * 0.05, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0077b6';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  },

  {
    id: 'night_watch',
    title: '夜警',
    originalTitle: 'The Night Watch (De Nachtwacht)',
    artist: 'レンブラント・ファン・レイン',
    year: '1642年',
    floor: 3,
    x: 14,
    y: 1,
    aspect: 'landscape',
    landmarkHint: '【4F北聖堂の目印】最上層5F・星幽の聖殿へと続く光の階段の手前。光と影の衛兵たちが護る。',
    desc: '明暗の魔術師レンブラントの最高傑作。アムステルダム火縄銃手組合の出動を描いた劇的な集団肖像画。暗闇から劇的な光の中に踏み出す隊長たちと輝く少女が、聖殿への登攀を見守る。',
    draw: function(ctx, w, h) {
      // Deep dramatic Chiaroscuro darkness
      ctx.fillStyle = '#080605';
      ctx.fillRect(0, 0, w, h);

      // Architectural arch in deep background shadow
      ctx.strokeStyle = '#221913';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.45, w * 0.35, Math.PI, 0);
      ctx.stroke();

      // Background pikemen spears and civic flags rising in shadows
      ctx.strokeStyle = '#4a3726';
      ctx.lineWidth = 2;
      const spears = [0.15, 0.28, 0.72, 0.84, 0.9];
      spears.forEach(sx => {
        ctx.beginPath();
        ctx.moveTo(w * sx, h * 0.6);
        ctx.lineTo(w * (sx + 0.06), h * 0.08);
        ctx.stroke();
      });

      // Billowing red/orange flag on right
      ctx.fillStyle = '#8f3b1b';
      ctx.beginPath();
      ctx.moveTo(w * 0.78, h * 0.12);
      ctx.lineTo(w * 0.94, h * 0.08);
      ctx.lineTo(w * 0.88, h * 0.28);
      ctx.lineTo(w * 0.75, h * 0.24);
      ctx.fill();

      // ★ Luminous Glowing Girl in Gold (Left background) ★
      const girlAura = ctx.createRadialGradient(w * 0.35, h * 0.55, 2, w * 0.35, h * 0.55, 30);
      girlAura.addColorStop(0, 'rgba(255, 235, 130, 0.9)');
      girlAura.addColorStop(0.5, 'rgba(218, 165, 32, 0.4)');
      girlAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = girlAura;
      ctx.beginPath();
      ctx.arc(w * 0.35, h * 0.55, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff3b0';
      ctx.fillRect(w * 0.33, h * 0.48, 10, 24);

      // ★ Captain Frans Banninck Cocq (Center - Black uniform, Red sash) ★
      // Pitch black formal military coat
      ctx.fillStyle = '#0f1013';
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.35);
      ctx.lineTo(w * 0.38, h * 0.82);
      ctx.lineTo(w * 0.54, h * 0.82);
      ctx.lineTo(w * 0.52, h * 0.36);
      ctx.fill();

      // Brilliant Scarlet Red Sash
      ctx.fillStyle = '#b7094c';
      ctx.beginPath();
      ctx.moveTo(w * 0.44, h * 0.38);
      ctx.lineTo(w * 0.52, h * 0.65);
      ctx.lineTo(w * 0.48, h * 0.68);
      ctx.lineTo(w * 0.42, h * 0.4);
      ctx.fill();

      // White ruff collar (illuminated)
      ctx.fillStyle = '#f8f9fa';
      ctx.beginPath();
      ctx.ellipse(w * 0.46, h * 0.34, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Captain's face under wide-brimmed black hat
      ctx.fillStyle = '#cfb091';
      ctx.beginPath();
      ctx.arc(w * 0.46, h * 0.28, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(w * 0.4, h * 0.22, 16, 5);

      // Extending forward left hand casting dramatic shadow
      ctx.strokeStyle = '#cfb091';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.45);
      ctx.lineTo(w * 0.55, h * 0.5);
      ctx.stroke();

      // ★ Lieutenant Willem van Ruytenburch (Right - Radiant Gold/Yellow Uniform) ★
      ctx.fillStyle = '#e5b842';
      ctx.beginPath();
      ctx.moveTo(w * 0.55, h * 0.38);
      ctx.lineTo(w * 0.52, h * 0.82);
      ctx.lineTo(w * 0.68, h * 0.82);
      ctx.lineTo(w * 0.66, h * 0.38);
      ctx.fill();

      // White gorget & feather hat
      ctx.fillStyle = '#f8f9fa';
      ctx.beginPath();
      ctx.arc(w * 0.6, h * 0.36, 6, 0, Math.PI * 2);
      ctx.fill();
      // Golden Partisan weapon
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.64, h * 0.78);
      ctx.lineTo(w * 0.62, h * 0.25);
      ctx.stroke();
    }
  },

  // --- 5F: 星幽のアメジスト聖殿 ---
  {
    id: 'last_supper',
    title: '最後の晩餐',
    originalTitle: 'The Last Supper (Il Cenacolo)',
    artist: 'レオナルド・ダ・ヴィンチ',
    year: '1495年〜1498年',
    floor: 4,
    x: 14,
    y: 23,
    aspect: 'landscape',
    landmarkHint: '【5F天頂の南祭壇の目印】星幽の天頂碑の直前。完璧な透視遠近法が天頂の間へと誘う。',
    desc: 'レオナルド・ダ・ヴィンチによるルネサンス盛期の最高峰壁画。「あなたたちのうちの一人が私を裏切る」と告げた劇的な瞬間。中央のキリストにすべての遠近法線が収束する。',
    draw: function(ctx, w, h) {
      // Perspective room walls & coffered ceiling
      ctx.fillStyle = '#1c1526';
      ctx.fillRect(0, 0, w, h);

      // Deep perspective ceiling beams converging to center
      ctx.strokeStyle = '#4a3b5c';
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= 6; i++) {
        ctx.beginPath();
        ctx.moveTo(w * (i / 6), 0);
        ctx.lineTo(w * (0.35 + i * 0.05), h * 0.35);
        ctx.stroke();
      }

      // Three back windows looking out into serene landscape
      ctx.fillStyle = '#6b9080';
      ctx.fillRect(w * 0.35, h * 0.22, w * 0.08, h * 0.16);
      ctx.fillRect(w * 0.45, h * 0.20, w * 0.10, h * 0.18); // Arched center window
      ctx.fillRect(w * 0.57, h * 0.22, w * 0.08, h * 0.16);

      // Long communion table with white tablecloth
      ctx.fillStyle = '#f4f1de';
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.62);
      ctx.lineTo(w * 0.9, h * 0.62);
      ctx.lineTo(w * 0.92, h * 0.78);
      ctx.lineTo(w * 0.08, h * 0.78);
      ctx.fill();
      // Tablecloth fold shadows
      ctx.strokeStyle = '#c5baaf';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.12 + i * (w * 0.76 / 19), h * 0.62);
        ctx.lineTo(w * 0.11 + i * (w * 0.76 / 19), h * 0.78);
        ctx.stroke();
      }

      // ★ Jesus Christ in the Center (Red tunic, Blue cloak, Open arms) ★
      // Calming red robe
      ctx.fillStyle = '#b7094c';
      ctx.beginPath();
      ctx.moveTo(w * 0.47, h * 0.44);
      ctx.lineTo(w * 0.44, h * 0.62);
      ctx.lineTo(w * 0.56, h * 0.62);
      ctx.lineTo(w * 0.53, h * 0.44);
      ctx.fill();
      // Blue mantle over shoulder
      ctx.fillStyle = '#1d3557';
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.46);
      ctx.lineTo(w * 0.42, h * 0.62);
      ctx.lineTo(w * 0.49, h * 0.62);
      ctx.fill();
      // Head framed against center window light
      ctx.fillStyle = '#e2c2aa';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.4, 7, 0, Math.PI * 2);
      ctx.fill();

      // Twelve Apostles grouped in 4 dynamic clusters of 3
      const clusterColors = ['#457b9d', '#e76f51', '#2a9d8f', '#e9c46a'];
      // Group 1 (Far Left)
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = clusterColors[i];
        ctx.beginPath();
        ctx.arc(w * 0.15 + i * 16, h * 0.45, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Group 2 (Left of Jesus: Judas leaning back clutching purse, Peter, John)
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = (i === 1) ? '#264653' : clusterColors[(i + 1) % 4];
        ctx.beginPath();
        ctx.arc(w * 0.32 + i * 16, h * 0.44, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Group 3 (Right of Jesus: Thomas pointing up, James, Philip)
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = clusterColors[(i + 2) % 4];
        ctx.beginPath();
        ctx.arc(w * 0.58 + i * 16, h * 0.44, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Group 4 (Far Right: Matthew, Thaddeus, Simon)
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = clusterColors[(i + 3) % 4];
        ctx.beginPath();
        ctx.arc(w * 0.75 + i * 16, h * 0.45, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  {
    id: 'sunflowers',
    title: 'ひまわり',
    originalTitle: 'Sunflowers (Tournesols)',
    artist: 'フィンセント・ファン・ゴッホ',
    year: '1888年',
    floor: 4,
    x: 2,
    y: 14,
    aspect: 'portrait',
    landmarkHint: '【5F西の外周回廊の目印】紫のアメジスト聖殿に灯る太陽の輝き。西の迷宮回廊の目印。',
    desc: '南仏アルルで友ゴーギャンを迎えるためにゴッホが描いた情熱の花々。鮮烈な黄色のシンフォニーがキャンバスから溢れ出す。厚塗りの筆致に込められた生命のエネルギーが探索者を勇気づける。',
    draw: function(ctx, w, h) {
      // Warm glowing yellow wall background
      ctx.fillStyle = '#ffde59';
      ctx.fillRect(0, 0, w, h * 0.6);

      // Ochre yellow table surface
      ctx.fillStyle = '#d4a340';
      ctx.fillRect(0, h * 0.6, w, h * 0.4);
      // Table dividing line
      ctx.strokeStyle = '#8c6518';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.lineTo(w, h * 0.6);
      ctx.stroke();

      // Two-toned clay sunflower vase
      // Top half (yellow)
      ctx.fillStyle = '#f8d254';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.65, w * 0.22, h * 0.14, 0, Math.PI, 0);
      ctx.fill();
      // Bottom half (ochre)
      ctx.fillStyle = '#ca8a22';
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.65, w * 0.22, h * 0.16, 0, 0, Math.PI);
      ctx.fill();
      // Van Gogh signature line
      ctx.fillStyle = '#1d3557';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('Vincent', w * 0.44, h * 0.66);

      // Lush bouquet of blooming Sunflowers
      const flowers = [
        { x: 0.5, y: 0.38, r: 18, eye: '#6b4724', petal: '#f4a261' },
        { x: 0.36, y: 0.32, r: 16, eye: '#403d39', petal: '#e9c46a' },
        { x: 0.64, y: 0.30, r: 16, eye: '#583101', petal: '#f77f00' },
        { x: 0.28, y: 0.44, r: 15, eye: '#723c70', petal: '#ffd166' },
        { x: 0.72, y: 0.42, r: 15, eye: '#2d6a4f', petal: '#fcbf49' },
        { x: 0.42, y: 0.22, r: 14, eye: '#582f0e', petal: '#ffe3a8' },
        { x: 0.58, y: 0.20, r: 14, eye: '#43281c', petal: '#f4a261' },
        { x: 0.5, y: 0.48, r: 15, eye: '#3d2612', petal: '#ffb703' }
      ];

      flowers.forEach(f => {
        const fx = w * f.x;
        const fy = h * f.y;

        // Radiating petals
        ctx.fillStyle = f.petal;
        const petalCount = 14;
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2;
          const px = fx + Math.cos(angle) * f.r;
          const py = fy + Math.sin(angle) * f.r;
          ctx.beginPath();
          ctx.ellipse(px, py, 6, 3, angle, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center seed disk
        ctx.fillStyle = f.eye;
        ctx.beginPath();
        ctx.arc(fx, fy, f.r * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Seed texture ring
        ctx.strokeStyle = '#2b1b0e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(fx, fy, f.r * 0.35, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
  },

  {
    id: 'school_of_athens',
    title: 'アテネの学堂',
    originalTitle: 'The School of Athens (Scuola di Atene)',
    artist: 'ラファエロ・サンティ',
    year: '1509年〜1511年',
    floor: 4,
    x: 27,
    y: 14,
    aspect: 'landscape',
    landmarkHint: '【5F東の外周回廊の目印】星幽の聖殿・東の大回廊のランドマーク。古代の賢者たちが集う。',
    desc: '盛期ルネサンスの申し子ラファエロの最高傑作。ヴァチカン宮殿「署名の間」を飾る大フレスコ画。天を指すプラトンと地を指すアリストテレスを中心に、知の探求者たちが壮麗な神殿に集う。',
    draw: function(ctx, w, h) {
      // Grand classical Roman vaulted architecture
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
      bgGrad.addColorStop(0, '#c7d2fe');
      bgGrad.addColorStop(0.5, '#e0e7ff');
      bgGrad.addColorStop(1, '#e5e5e5');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Huge coffered Roman arch in center
      ctx.strokeStyle = '#8d7b68';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.45, w * 0.32, Math.PI, 0);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.45, w * 0.24, Math.PI, 0);
      ctx.stroke();

      // Statues of Apollo & Athena in side wall niches
      ctx.fillStyle = '#b7a99a';
      ctx.fillRect(w * 0.12, h * 0.25, w * 0.06, h * 0.22);
      ctx.fillRect(w * 0.82, h * 0.25, w * 0.06, h * 0.22);

      // Marble steps leading down into foreground
      ctx.fillStyle = '#d6ccc2';
      ctx.fillRect(0, h * 0.55, w, h * 0.45);
      // Horizontal marble stair lines
      ctx.strokeStyle = '#a5978b';
      ctx.lineWidth = 2;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h * (0.55 + i * 0.08));
        ctx.lineTo(w, h * (0.55 + i * 0.08));
        ctx.stroke();
      }

      // ★ Plato (pointing up to heavens, red cloak) & Aristotle (hand to earth, blue cloak) ★
      // Plato
      ctx.fillStyle = '#b7094c';
      ctx.fillRect(w * 0.46, h * 0.40, w * 0.035, h * 0.18);
      ctx.fillStyle = '#cfb091';
      ctx.beginPath();
      ctx.arc(w * 0.475, h * 0.36, 6, 0, Math.PI * 2);
      ctx.fill();
      // White beard
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w * 0.465, h * 0.38, 5, 5);

      // Aristotle
      ctx.fillStyle = '#1d3557';
      ctx.fillRect(w * 0.51, h * 0.40, w * 0.035, h * 0.18);
      ctx.fillStyle = '#cfb091';
      ctx.beginPath();
      ctx.arc(w * 0.525, h * 0.36, 6, 0, Math.PI * 2);
      ctx.fill();

      // Diogenes lying on the steps
      ctx.fillStyle = '#457b9d';
      ctx.beginPath();
      ctx.ellipse(w * 0.54, h * 0.65, 14, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Euclid demonstrating geometry with compass on bottom right
      ctx.fillStyle = '#a62b2b';
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.72, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b2d42';
      ctx.fillRect(w * 0.80, h * 0.76, 12, 16);

      // Pythagoras writing in a book on bottom left
      ctx.fillStyle = '#e9c46a';
      ctx.beginPath();
      ctx.arc(w * 0.22, h * 0.72, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#264653';
      ctx.fillRect(w * 0.20, h * 0.76, 14, 16);
    }
  }
];

// Painting Manager to pre-render and cache offline Canvas objects
class PaintingManager {
  constructor() {
    this.paintings = PAINTINGS_DATA;
    this.cache = new Map(); // id -> HTMLCanvasElement
    this.modalCache = new Map(); // id -> HTMLCanvasElement
    this.initCache();
  }

  initCache() {
    this.paintings.forEach(p => {
      // Standard resolution for 3D wall projection
      const baseW = p.aspect === 'landscape' ? 320 : 240;
      const baseH = p.aspect === 'landscape' ? 240 : 320;
      const c = document.createElement('canvas');
      c.width = baseW;
      c.height = baseH;
      const ctx = c.getContext('2d');
      p.draw(ctx, baseW, baseH);
      this.cache.set(p.id, c);

      // High resolution for Modal Viewer
      const modalW = p.aspect === 'landscape' ? 480 : 360;
      const modalH = p.aspect === 'landscape' ? 360 : 480;
      const mc = document.createElement('canvas');
      mc.width = modalW;
      mc.height = modalH;
      const mctx = mc.getContext('2d');
      p.draw(mctx, modalW, modalH);
      this.modalCache.set(p.id, mc);
    });
  }

  getPainting(id) {
    return this.paintings.find(p => p.id === id);
  }

  getPaintingAt(floor, x, y) {
    return this.paintings.find(p => p.floor === floor && p.x === x && p.y === y);
  }

  getCanvas(id) {
    return this.cache.get(id);
  }

  getModalCanvas(id) {
    return this.modalCache.get(id);
  }
}

// Global instance
window.paintingManager = new PaintingManager();
