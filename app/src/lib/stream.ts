import * as THREE from 'three';
import gsap from 'gsap';

/* ─────────────────────────────────────────────────────────────────────────────
 *  The token river.
 *  Raw data drifts in from the left, gets squeezed through a gate (the agents),
 *  and leaves as rows of clean cells. A few bad records never make it through.
 * ──────────────────────────────────────────────────────────────────────────── */

export type StreamMode = 'rage' | 'calm';

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+10.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0*fract(p*C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
  vec3 g;
  g.x = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m, g);
}
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

const VERT = /* glsl */ `
${NOISE}
uniform float uTime;
uniform float uTravel;
uniform float uSpan;
uniform float uGate;
uniform float uOrder;
uniform float uWarp;
uniform float uPR;
uniform float uCols;
attribute vec3 aCell;   // x phase 0..1, row -1..1, layer -1..1
attribute vec4 aSeed;
attribute float aDirty;
varying float vAlpha;
varying float vOrder;
varying float vHot;
varying float vDirty;

void main(){
  float span = uSpan * 2.0;
  float x = -uSpan + mod(aCell.x * span + uTravel, span);

  // where it ends up: rows of a table, a few layers deep
  vec3 ordered = vec3(x, aCell.y * 1.55, aCell.z * 0.9);

  // where it starts: each row is a tangled strand that the gate pulls straight
  float strand = aCell.y * 7.3 + aCell.z * 3.1;
  float n1 = snoise(vec2(x * 0.14 + strand * 5.0, uTime * 0.07 + strand));
  float n2 = snoise(vec2(x * 0.14 + strand * 5.0 + 40.0, uTime * 0.07 - strand));
  vec3 jitter = (aSeed.xyz - 0.5) * vec3(0.16, 0.1, 0.1);
  vec3 raw = vec3(x, ordered.y * 0.4 + n1 * 2.4, ordered.z * 0.4 + n2 * 2.4) + jitter;
  float funnel = smoothstep(uGate - 9.0, uGate - 0.2, x);
  raw.yz *= mix(1.0, 0.45, funnel);

  float t = smoothstep(uGate - 0.3, uGate + 2.4, x);
  t = max(t, uOrder) * (1.0 - aDirty);
  vec3 p = mix(raw, ordered, t);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;

  // attention: a beam sweeps the clean side, and a few cells light up
  float beamX = uGate + 1.0 + mod(uTime * 2.6, uSpan - uGate + 2.0);
  float beam = exp(-pow((x - beamX) * 1.6, 2.0));
  float col = floor(aCell.x * uCols);
  float pick = step(0.986, hash12(vec2(col * 1.7 + aCell.y * 13.0 + aCell.z * 5.0, floor(uTime * 0.7 + aSeed.x))));
  vHot = clamp(beam * 0.85 + pick, 0.0, 1.0) * t;

  float size = mix(0.45 + aSeed.y * 0.7, 0.95, t) * (1.0 + vHot * 0.7);
  gl_PointSize = min(size * (26.0 / depth), 7.0) * uPR * (1.0 + uWarp * 1.5);

  float ends = smoothstep(-uSpan, -uSpan + 4.0, x) * (1.0 - smoothstep(uSpan - 4.0, uSpan, x));
  // bad records burn out as they reach the gate
  float burn = aDirty * smoothstep(uGate - 1.6, uGate + 0.1, x);
  vAlpha = ends * smoothstep(1.5, 5.0, depth) * (1.0 - burn) * mix((0.2 + aSeed.w * 0.35) * mix(0.3, 1.0, funnel), 1.0, t);
  vOrder = t;
  vDirty = aDirty * (0.45 + 0.55 * funnel);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uAccent;
uniform vec3 uSeal;
uniform float uDim;
varying float vAlpha;
varying float vOrder;
varying float vHot;
varying float vDirty;

void main(){
  vec2 c = gl_PointCoord - 0.5;
  float round_ = 1.0 - smoothstep(0.34, 0.5, length(c));
  float square = 1.0 - smoothstep(0.36, 0.5, max(abs(c.x), abs(c.y)));
  float shape = mix(round_, square, vOrder);
  vec3 col = mix(uInk, uAccent, vHot);
  col = mix(col, uSeal, vDirty);
  float a = shape * vAlpha * uDim * mix(0.75, 1.0, vHot);
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
}
`;

const RING_VERT = /* glsl */ `
uniform float uSpin;
attribute float aT;
varying float vT;
void main(){
  vT = aT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const RING_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uAlpha;
uniform float uDash;
uniform float uSpin;
varying float vT;
void main(){
  float a = uAlpha;
  if (uDash > 0.0) {
    float d = fract(vT * uDash + uSpin);
    a *= step(0.5, d);
  }
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

const PALETTE = {
  rage: { ink: '#efe9e0', accent: '#ff5b1f', seal: '#e5484d' },
  calm: { ink: '#121316', accent: '#2747e0', seal: '#e5484d' },
} as const;

/** A camera framing for one part of the page. */
export interface Shot {
  pos: [number, number, number];
  look: [number, number, number];
  dim: number;
  order: number;
  labels: number;
}

export const SHOTS: Record<string, Shot> = {
  hero: { pos: [-3.4, 1.3, 15], look: [1.0, -0.1, 0], dim: 0.9, order: 0, labels: 0 },
  voice: { pos: [-2.5, 7.5, 9.5], look: [0.5, 0, 0], dim: 0.42, order: 0, labels: 0 },
  work: { pos: [9, 2.4, 8.5], look: [4, 0, 0], dim: 0.36, order: 0, labels: 0 },
  transformer: { pos: [-3.6, 0.9, 7.6], look: [1.6, 0, 0], dim: 0.6, order: 0, labels: 0 },
  stack: { pos: [1, 10.5, 4.5], look: [1, 0, 0], dim: 0.36, order: 0.85, labels: 0 },
  numbers: { pos: [0, 12, 2.5], look: [0, 0, 0], dim: 0.42, order: 1, labels: 0 },
  contact: { pos: [-3.4, 1.3, 15], look: [2.4, -0.1, 0], dim: 0.85, order: 0, labels: 0 },
};

export interface ShotKey {
  p: number;
  shot: Shot;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export class Stream {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private points: THREE.Points;
  private rings: THREE.Line[] = [];
  private canvas: HTMLCanvasElement;
  private uniforms: Record<string, THREE.IUniform>;
  private ringUniforms: Record<string, THREE.IUniform>[] = [];
  private keys: ShotKey[] = [{ p: 0, shot: SHOTS.hero }];
  private scroll = 0;
  private eased = 0;
  private mouse = new THREE.Vector2();
  private mouseEased = new THREE.Vector2();
  private look = new THREE.Vector3();
  private last = performance.now();
  private time = 0;
  private travel = 0;
  private speed = { v: 1 };
  private fovKick = { v: 0 };
  private baseFov = 40;
  private paused = false;
  private pixelRatio: number;
  private slowTime = 0;
  private fastTime = 0;
  private reducedMotion: boolean;
  private labels: { el: HTMLElement; at: THREE.Vector3; half: number }[] = [];
  private labelHost: HTMLElement | null = null;
  private tmp = new THREE.Vector3();
  private gate = 2.2;

  constructor(container: HTMLElement, mode: StreamMode) {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 760;

    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.pixelRatio = Math.min(window.devicePixelRatio, 1.75);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(this.baseFov, 1, 0.1, 200);

    // the lattice every record settles into, plus a handful of bad ones
    const cols = small ? 56 : 92;
    const rows = small ? 10 : 14;
    const layers = small ? 3 : 5;
    const clean = cols * rows * layers;
    const dirty = Math.round(clean * 0.07);
    const total = clean + dirty;
    const cell = new Float32Array(total * 3);
    const seed = new Float32Array(total * 4);
    const bad = new Float32Array(total);
    let i = 0;
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++)
        for (let l = 0; l < layers; l++, i++) {
          cell[i * 3] = c / cols;
          cell[i * 3 + 1] = rows > 1 ? (r / (rows - 1)) * 2 - 1 : 0;
          cell[i * 3 + 2] = layers > 1 ? (l / (layers - 1)) * 2 - 1 : 0;
        }
    for (; i < total; i++) {
      cell[i * 3] = Math.random();
      cell[i * 3 + 1] = Math.random() * 2 - 1;
      cell[i * 3 + 2] = Math.random() * 2 - 1;
      bad[i] = 1;
    }
    for (let k = 0; k < total * 4; k++) seed[k] = Math.random();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    geo.setAttribute('aCell', new THREE.BufferAttribute(cell, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    geo.setAttribute('aDirty', new THREE.BufferAttribute(bad, 1));

    const pal = PALETTE[mode];
    this.uniforms = {
      uTime: { value: 0 },
      uTravel: { value: 0 },
      uSpan: { value: 16 },
      uGate: { value: this.gate },
      uOrder: { value: 0 },
      uWarp: { value: 0 },
      uPR: { value: this.pixelRatio },
      uCols: { value: cols },
      uDim: { value: 1 },
      uInk: { value: new THREE.Color(pal.ink) },
      uAccent: { value: new THREE.Color(pal.accent) },
      uSeal: { value: new THREE.Color(pal.seal) },
    };
    this.points = new THREE.Points(
      geo,
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: this.uniforms,
        transparent: true,
        depthWrite: false,
        blending: mode === 'rage' ? THREE.AdditiveBlending : THREE.NormalBlending,
      })
    );
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    // the gate: an aperture ring, a dashed inner ring that turns, and ticks
    this.addRing(2.35, 0, 0.55, pal.ink);
    this.addRing(2.05, 64, 0.35, pal.accent);
    this.addTicks(2.45, 2.75, pal.ink);

    this.resize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.renderer.setAnimationLoop(() => this.frame());
  }

  private ringMaterial(color: string, alpha: number, dash: number) {
    const u = {
      uColor: { value: new THREE.Color(color) },
      uAlpha: { value: alpha },
      uBase: { value: alpha },
      uDash: { value: dash },
      uSpin: { value: 0 },
    };
    this.ringUniforms.push(u);
    return new THREE.ShaderMaterial({
      vertexShader: RING_VERT,
      fragmentShader: RING_FRAG,
      uniforms: u,
      transparent: true,
      depthWrite: false,
    });
  }

  private addRing(r: number, dash: number, alpha: number, color: string) {
    const n = 220;
    const pos = new Float32Array((n + 1) * 3);
    const t = new Float32Array(n + 1);
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * Math.PI * 2;
      pos[k * 3] = this.gate;
      pos[k * 3 + 1] = Math.cos(a) * r;
      pos[k * 3 + 2] = Math.sin(a) * r;
      t[k] = k / n;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.BufferAttribute(t, 1));
    const line = new THREE.Line(g, this.ringMaterial(color, alpha, dash));
    line.frustumCulled = false;
    this.rings.push(line);
    this.scene.add(line);
  }

  private addTicks(r0: number, r1: number, color: string) {
    const n = 60;
    const pos: number[] = [];
    const t: number[] = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      const long = k % 5 === 0 ? r1 : r0 + (r1 - r0) * 0.4;
      pos.push(this.gate, Math.cos(a) * r0, Math.sin(a) * r0, this.gate, Math.cos(a) * long, Math.sin(a) * long);
      t.push(0, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.Float32BufferAttribute(t, 1));
    const ticks = new THREE.LineSegments(g, this.ringMaterial(color, 0.4, 0));
    ticks.frustumCulled = false;
    this.rings.push(ticks);
    this.scene.add(ticks);
  }

  /** Scroll keys: where on the page (0..1) each shot is fully in frame. */
  setKeys(keys: ShotKey[]) {
    if (keys.length) this.keys = keys.sort((a, b) => a.p - b.p);
  }

  setScroll(p: number) {
    this.scroll = Math.min(1, Math.max(0, p));
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    this.last = performance.now();
  }

  /** DOM labels pinned to points in the scene (they fade with the shot). */
  setLabels(host: HTMLElement, labels: { el: HTMLElement; at: [number, number, number] }[]) {
    this.labelHost = host;
    this.labels = labels.map((l) => ({ el: l.el, at: new THREE.Vector3(...l.at), half: 0 }));
  }

  get gateX() {
    return this.gate;
  }

  setMode(mode: StreamMode) {
    const pal = PALETTE[mode];
    const dur = this.reducedMotion ? 0.01 : 1.6;
    const mat = this.points.material as THREE.ShaderMaterial;
    // additive light reads as glow on night, but would vanish on paper
    mat.blending = mode === 'rage' ? THREE.AdditiveBlending : THREE.NormalBlending;
    mat.needsUpdate = true;
    const to = (c: THREE.Color, hex: string) => {
      const target = new THREE.Color(hex);
      gsap.to(c, { r: target.r, g: target.g, b: target.b, duration: dur, ease: 'power2.inOut', overwrite: true });
    };
    to(this.uniforms.uInk.value, pal.ink);
    to(this.uniforms.uAccent.value, pal.accent);
    to(this.uniforms.uSeal.value, pal.seal);
    this.ringUniforms.forEach((u, k) => to(u.uColor.value, k === 1 ? pal.accent : pal.ink));
  }

  /** Arriving from the film: the stream comes out of warp. */
  arrive() {
    if (this.reducedMotion) return;
    this.speed.v = 26;
    this.fovKick.v = 46;
    this.uniforms.uWarp.value = 1;
    gsap.to(this.speed, { v: 1, duration: 2.4, ease: 'expo.out' });
    gsap.to(this.fovKick, { v: 0, duration: 2.2, ease: 'expo.out' });
    gsap.to(this.uniforms.uWarp, { value: 0, duration: 1.8, ease: 'expo.out' });
  }

  /** Leaving for the film: everything rushes back into warp. */
  depart(): Promise<void> {
    return new Promise((resolve) => {
      if (this.reducedMotion) return resolve();
      gsap.to(this.speed, { v: 30, duration: 1.1, ease: 'power3.in', onComplete: resolve });
      gsap.to(this.fovKick, { v: 50, duration: 1.1, ease: 'power3.in' });
      gsap.to(this.uniforms.uWarp, { value: 1, duration: 1.1, ease: 'power3.in' });
    });
  }

  private onResize = () => this.resize();

  private onPointer = (e: PointerEvent) => {
    this.mouse.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };

  private onVisibility = () => {
    this.last = performance.now();
  };

  private resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // tall screens need a wider lens to keep the gate in frame
    this.baseFov = w / h < 0.8 ? 62 : w / h < 1.2 ? 50 : 40;
    this.camera.updateProjectionMatrix();
    this.labels.forEach((l) => (l.half = 0));
  }

  private adapt(dt: number) {
    if (dt > 0.026) {
      this.slowTime += dt;
      this.fastTime = 0;
    } else if (dt < 0.014) {
      this.fastTime += dt;
      this.slowTime = 0;
    }
    const max = Math.min(window.devicePixelRatio, 1.75);
    if (this.slowTime > 1.5 && this.pixelRatio > 0.6) {
      this.pixelRatio = Math.max(0.6, this.pixelRatio - 0.25);
      this.slowTime = 0;
    } else if (this.fastTime > 6 && this.pixelRatio < max) {
      this.pixelRatio = Math.min(max, this.pixelRatio + 0.25);
      this.fastTime = 0;
    } else {
      return;
    }
    this.renderer.setPixelRatio(this.pixelRatio);
    this.resize();
    this.uniforms.uPR.value = this.pixelRatio;
  }

  private shotAt(p: number): Shot {
    const k = this.keys;
    if (p <= k[0].p) return k[0].shot;
    if (p >= k[k.length - 1].p) return k[k.length - 1].shot;
    let i = 0;
    while (i < k.length - 2 && p > k[i + 1].p) i++;
    const a = k[i];
    const b = k[i + 1];
    const t = smooth(Math.min(1, Math.max(0, (p - a.p) / Math.max(1e-4, b.p - a.p))));
    const mix = (x: number, y: number) => x + (y - x) * t;
    return {
      pos: [mix(a.shot.pos[0], b.shot.pos[0]), mix(a.shot.pos[1], b.shot.pos[1]), mix(a.shot.pos[2], b.shot.pos[2])],
      look: [mix(a.shot.look[0], b.shot.look[0]), mix(a.shot.look[1], b.shot.look[1]), mix(a.shot.look[2], b.shot.look[2])],
      dim: mix(a.shot.dim, b.shot.dim),
      order: mix(a.shot.order, b.shot.order),
      labels: mix(a.shot.labels, b.shot.labels),
    };
  }

  private frame() {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    if (this.paused || document.hidden) return;
    this.adapt(dt);

    const motion = this.reducedMotion ? 0.15 : 1;
    this.time += dt * motion;
    this.travel += dt * 0.9 * this.speed.v * motion;
    this.eased += (this.scroll - this.eased) * Math.min(1, dt * 4);
    this.mouseEased.lerp(this.mouse, Math.min(1, dt * 2.5));

    const shot = this.shotAt(this.eased);
    const u = this.uniforms;
    u.uTime.value = this.time;
    u.uTravel.value = this.travel;
    u.uDim.value = shot.dim;
    u.uOrder.value = shot.order;

    const cam = this.camera;
    cam.position.set(shot.pos[0] + this.mouseEased.x * 0.7, shot.pos[1] - this.mouseEased.y * 0.45, shot.pos[2]);
    this.look.set(shot.look[0], shot.look[1], shot.look[2]);
    cam.lookAt(this.look);
    const fov = this.baseFov + this.fovKick.v;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    const spin = (this.time * 0.035) % 1;
    this.ringUniforms.forEach((r) => {
      r.uSpin.value = spin;
      r.uAlpha.value = r.uBase.value * shot.dim;
    });

    this.renderer.render(this.scene, cam);
    this.placeLabels(shot.labels);
  }

  private placeLabels(vis: number) {
    if (!this.labelHost) return;
    this.labelHost.style.opacity = vis.toFixed(3);
    if (vis < 0.01) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const l of this.labels) {
      // labels hang off their point but never leave the screen
      if (!l.half) l.half = l.el.offsetWidth / 2 + 16;
      this.tmp.copy(l.at).project(this.camera);
      const x = Math.min(w - l.half, Math.max(l.half, (this.tmp.x * 0.5 + 0.5) * w));
      const y = (-this.tmp.y * 0.5 + 0.5) * h;
      l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
    this.rings.forEach((r) => {
      r.geometry.dispose();
      (r.material as THREE.Material).dispose();
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.remove();
  }
}

export const supportsWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};
