// Liquid Gradient Background - Three.js
// Adapted with Cassie.codes color palette
// Original concept: cameronknight on CodePen

class TouchTexture {
  constructor() {
    this.size = 64;
    this.maxAge = 64;
    this.radius = 0.2 * this.size;
    this.speed = 1 / this.maxAge;
    this.trail = [];
    this.last = null;
    this.initTexture();
  }

  initTexture() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const speed = this.speed;
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      const f = point.force * speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  addTouch(point) {
    let force = 0, vx = 0, vy = 0;
    const last = this.last;
    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / d;
      vy = dy / d;
      force = Math.min(dd * 10000, 1.5);
    }
    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point) {
    const pos = {
      x: point.x * this.size,
      y: (1 - point.y) * this.size
    };
    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;
    const radius = this.radius;
    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// ─── Main App ───
function initLiquidGradient() {
  const container = document.getElementById("liquid-bg");
  if (!container) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 50;
  const scene = new THREE.Scene();

  // ─── Cassie.codes color palette ───
  const CASSIE = {
    mint: [0.435, 0.863, 0.749],    // #6fdcbf
    lilac: [0.682, 0.561, 0.859],    // #ae8fdb
    rose: [0.863, 0.518, 0.608],     // #dc849b
    sherbet: [0.996, 0.973, 0.706],  // #fef8b4
    peach: [0.949, 0.765, 0.753],    // #f2c3c0
    marshmellow: [0.839, 0.584, 0.714], // #d695b6
    light: [0.969, 0.969, 0.969],    // #f7f7f7
    bg: [0.933, 0.922, 0.937],       // #eeebef
  };

  const clock = new THREE.Clock();
  const touchTexture = new TouchTexture();

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uColor1: { value: new THREE.Vector3(...CASSIE.lilac) },
    uColor2: { value: new THREE.Vector3(...CASSIE.mint) },
    uColor3: { value: new THREE.Vector3(...CASSIE.rose) },
    uColor4: { value: new THREE.Vector3(...CASSIE.peach) },
    uColor5: { value: new THREE.Vector3(...CASSIE.marshmellow) },
    uColor6: { value: new THREE.Vector3(...CASSIE.sherbet) },
    uSpeed: { value: 0.35 },
    uIntensity: { value: 0.45 },
    uTouchTexture: { value: touchTexture.texture },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.);
      vUv = uv;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor1, uColor2, uColor3, uColor4, uColor5, uColor6;
    uniform float uSpeed, uIntensity;
    uniform sampler2D uTouchTexture;
    varying vec2 vUv;

    float grain(vec2 uv, float time) {
      vec2 u = uv * uResolution * 0.5;
      return fract(sin(dot(u + time, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
    }

    void main() {
      vec2 uv = vUv;

      // Touch distortion
      vec4 touch = texture2D(uTouchTexture, uv);
      float vx = -(touch.r * 2.0 - 1.0);
      float vy = -(touch.g * 2.0 - 1.0);
      float intensity = touch.b;
      uv.x += vx * 0.15 * intensity;
      uv.y += vy * 0.15 * intensity;

      // Multiple animated gradient centers
      vec2 c1 = vec2(0.5 + sin(uTime * uSpeed * 0.4) * 0.35, 0.5 + cos(uTime * uSpeed * 0.5) * 0.35);
      vec2 c2 = vec2(0.5 + cos(uTime * uSpeed * 0.55) * 0.4, 0.5 + sin(uTime * uSpeed * 0.45) * 0.4);
      vec2 c3 = vec2(0.5 + sin(uTime * uSpeed * 0.35) * 0.38, 0.5 + cos(uTime * uSpeed * 0.6) * 0.38);
      vec2 c4 = vec2(0.5 + cos(uTime * uSpeed * 0.5) * 0.33, 0.5 + sin(uTime * uSpeed * 0.42) * 0.42);
      vec2 c5 = vec2(0.5 + sin(uTime * uSpeed * 0.58) * 0.36, 0.5 + cos(uTime * uSpeed * 0.52) * 0.37);
      vec2 c6 = vec2(0.5 + cos(uTime * uSpeed * 0.48) * 0.41, 0.5 + sin(uTime * uSpeed * 0.55) * 0.39);

      float d1 = length(uv - c1);
      float d2 = length(uv - c2);
      float d3 = length(uv - c3);
      float d4 = length(uv - c4);
      float d5 = length(uv - c5);
      float d6 = length(uv - c6);

      float r = 0.65;
      float i1 = 1.0 - smoothstep(0.0, r, d1);
      float i2 = 1.0 - smoothstep(0.0, r, d2);
      float i3 = 1.0 - smoothstep(0.0, r, d3);
      float i4 = 1.0 - smoothstep(0.0, r, d4);
      float i5 = 1.0 - smoothstep(0.0, r, d5);
      float i6 = 1.0 - smoothstep(0.0, r, d6);

      vec3 color = vec3(0.0);
      color += uColor1 * i1 * (0.5 + 0.5 * sin(uTime * uSpeed));
      color += uColor2 * i2 * (0.5 + 0.5 * cos(uTime * uSpeed * 1.2));
      color += uColor3 * i3 * (0.5 + 0.5 * sin(uTime * uSpeed * 0.8));
      color += uColor4 * i4 * (0.5 + 0.5 * cos(uTime * uSpeed * 1.3));
      color += uColor5 * i5 * (0.5 + 0.5 * sin(uTime * uSpeed * 1.1));
      color += uColor6 * i6 * (0.5 + 0.5 * cos(uTime * uSpeed * 0.9));

      color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;

      // Keep it subtle - mix with base
      float brightness = length(color);
      color = mix(vec3(0.933, 0.922, 0.937), color, min(brightness * 0.35, 0.35));

      // Grain
      color += grain(uv, uTime) * 0.03;

      color = clamp(color, vec3(0.0), vec3(1.0));

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const geometry = new THREE.PlaneGeometry(
    (camera.position.z * Math.tan(THREE.MathUtils.degToRad(45 / 2))) * 2,
    (camera.position.z * Math.tan(THREE.MathUtils.degToRad(45 / 2))) * 2 / (window.innerWidth / window.innerHeight),
    1, 1
  );

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ─── Resize ───
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    uniforms.uResolution.value.set(w, h);
    const vFov = 45 * Math.PI / 180;
    const height = 2 * Math.tan(vFov / 2) * camera.position.z;
    const width = height * (w / h);
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(width, height, 1, 1);
  }
  window.addEventListener("resize", onResize);

  // ─── Mouse/Touch ───
  function onMouseMove(e) {
    touchTexture.addTouch({ x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight });
  }
  function onTouchMove(e) {
    if (e.touches.length) {
      touchTexture.addTouch({ x: e.touches[0].clientX / window.innerWidth, y: 1 - e.touches[0].clientY / window.innerHeight });
    }
  }
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });

  // ─── Animation loop ───
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    uniforms.uTime.value += delta;
    touchTexture.update();
    renderer.render(scene, camera);
  }
  animate();

  onResize();
}

// Load Three.js then init
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")
  .then(() => initLiquidGradient())
  .catch(() => console.log("Three.js failed to load — gradient disabled"));
