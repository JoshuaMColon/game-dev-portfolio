"use client";

/**
 * WebGL wipe between blockout captures. The carousel owns the index; this
 * stage only animates to it. I letterbox so a capture is never cropped,
 * and I draw only while a transition runs instead of every frame. If WebGL
 * is missing or the context is lost, onFail lets the carousel keep the
 * plain fade on the img underneath.
 */

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { gsap } from "gsap";

export type MorphTransition = "melt" | "ripple" | "shear" | "swirl";
const MODES: Record<MorphTransition, number> = { melt: 0, ripple: 1, shear: 2, swirl: 3 };

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform vec2 uPointer;
uniform vec3 uTint;
varying vec2 vUv;
const float PI = 3.14159265359;

float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; } return v; }
mat2 rot(float a) { float s = sin(a); float c = cos(a); return mat2(c, -s, s, c); }

// Fit the whole image inside the frame (letterbox) rather than cropping it.
vec2 containUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  if (rA > iA) s.x = rA / iA; else s.y = iA / rA;
  return (uv - 0.5) * s + 0.5;
}
vec3 sampleFit(sampler2D t, vec2 uv) {
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return texture2D(t, clamp(uv, 0.0, 1.0)).rgb * inside;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);
  vec2 uv = vUv;
  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uMode == 3) {
    vec2 c = uv - 0.5; float r = length(c); float ang = env * uIntensity * 3.5 * (1.0 - r);
    uvC = rot(ang) * c + 0.5; uvN = rot(-ang) * c + 0.5;
  } else if (uMode == 1) {
    float d = distance(uv, uPointer); float ring = p * 1.6;
    float wave = sin((d - ring) * 30.0) * env;
    vec2 disp = normalize(uv - uPointer + 1e-4) * wave * uIntensity * 0.25;
    uvC = uv + disp; uvN = uv + disp * 0.6;
    m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
  } else if (uMode == 2) {
    float slices = 14.0;
    float row = floor(uv.y * slices);
    float rnd = hash11(row);
    vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
    uvC = uv + disp; uvN = uv + disp;
    float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
    float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
    m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
  } else {
    float nn = fbm(uv * uScale); float warp = fbm(uv * uScale * 1.7);
    vec2 g = vec2(nn, warp) - 0.5;
    uvC = uv + g * uIntensity * 0.5 * p; uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
    m = smoothstep(nn - 0.15, nn + 0.15, p);
  }

  vec2 sC = containUV(uvC, uResolution, uCurrentSize);
  vec2 sN = containUV(uvN, uResolution, uNextSize);
  float ca = uAberration * env * 0.03;
  vec3 colC = vec3(sampleFit(tCurrent, sC + vec2(ca, 0.0)).r, sampleFit(tCurrent, sC).g, sampleFit(tCurrent, sC - vec2(ca, 0.0)).b);
  vec3 colN = vec3(sampleFit(tNext, sN + vec2(ca, 0.0)).r, sampleFit(tNext, sN).g, sampleFit(tNext, sN - vec2(ca, 0.0)).b);
  vec3 col = mix(colC, colN, m);

  // Security-feed glitch: scanlines and a phosphor tint that only exist mid-transition.
  float scan = step(0.5, fract(vUv.y * uResolution.y / 3.0));
  col *= 1.0 - env * 0.22 * scan;
  col = mix(col, uTint * (0.35 + dot(col, vec3(0.33))), env * 0.18);

  gl_FragColor = vec4(col, 1.0);
}
`;

type Opts = { transition: MorphTransition; duration: number; intensity: number; aberration: number };

class MorphEngine {
  private renderer: Renderer;
  private gl: Renderer["gl"];
  private program: Program;
  private mesh: Mesh;
  private textures: (Texture | null)[];
  private loading: (Promise<Texture> | null)[];
  private sizes: [number, number][];
  private current: number;
  private tween: gsap.core.Tween | null = null;
  private pending = -1;
  private ro: ResizeObserver;
  private dead = false;

  constructor(
    private container: HTMLElement,
    private urls: string[],
    start: number,
    private opts: Opts,
    private onReady: () => void,
    private onFail: () => void,
  ) {
    // Cap DPR at 2. A 3x phone would triple the fragment cost for a wipe
    // that lasts under a second, and antialias is off for the same reason.
    this.renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    if (!this.gl) throw new Error("WebGL unavailable");
    this.gl.clearColor(0, 0, 0, 1);
    const canvas = this.gl.canvas as HTMLCanvasElement;
    canvas.className = "absolute inset-0 block h-full w-full";
    canvas.setAttribute("aria-hidden", "true");
    canvas.addEventListener("webglcontextlost", this.lost, false);
    container.appendChild(canvas);

    this.current = start;
    this.textures = urls.map(() => null);
    this.loading = urls.map(() => null);
    this.sizes = urls.map(() => [16, 9] as [number, number]);
    const blank = new Texture(this.gl, { image: new Uint8Array([0, 0, 0, 255]), width: 1, height: 1, generateMipmaps: false });

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tCurrent: { value: blank },
        tNext: { value: blank },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: [16, 9] },
        uNextSize: { value: [16, 9] },
        uProgress: { value: 0 },
        uDir: { value: 1 },
        uMode: { value: MODES[opts.transition] },
        uIntensity: { value: opts.intensity },
        uScale: { value: 2.4 },
        uAberration: { value: opts.aberration },
        uPointer: { value: [0.5, 0.5] },
        uTint: { value: [0.498, 0.859, 0.682] },
      },
    });
    this.mesh = new Mesh(this.gl, { geometry: new Triangle(this.gl), program: this.program });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();

    this.load(start).then((t) => {
      if (this.dead) return;
      this.program.uniforms.tCurrent.value = t;
      this.program.uniforms.uCurrentSize.value = this.sizes[start];
      this.render();
      this.onReady();
      // Warm the neighbours so the first transition does not wait on the network.
      const n = urls.length;
      this.load((start + 1) % n);
      this.load((start - 1 + n) % n);
    }, this.onFail);
  }

  private lost = (e: Event) => {
    e.preventDefault();
    this.onFail();
  };

  private load(i: number): Promise<Texture> {
    const existing = this.loading[i];
    if (existing) return existing;
    const p = new Promise<Texture>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (this.dead) return reject(new Error("destroyed"));
        const t = new Texture(this.gl, { image: img, generateMipmaps: false });
        this.textures[i] = t;
        this.sizes[i] = [img.naturalWidth || 16, img.naturalHeight || 9];
        resolve(t);
      };
      img.onerror = () => reject(new Error(`Failed to load ${this.urls[i]}`));
      img.src = this.urls[i];
    });
    this.loading[i] = p;
    return p;
  }

  private resize() {
    const r = this.container.getBoundingClientRect();
    this.renderer.setSize(Math.max(r.width, 1), Math.max(r.height, 1));
    this.program.uniforms.uResolution.value = [this.gl.canvas.width, this.gl.canvas.height];
    this.render();
  }

  private render() {
    if (!this.dead) this.renderer.render({ scene: this.mesh });
  }

  private commit(target: number) {
    this.current = target;
    this.pending = -1;
    const u = this.program.uniforms;
    u.tCurrent.value = this.textures[target];
    u.uCurrentSize.value = this.sizes[target];
    u.uProgress.value = 0;
    this.tween = null;
    this.render();
  }

  setPointer(x: number, y: number) {
    this.program.uniforms.uPointer.value = [x, y];
  }

  async show(target: number, dir: number) {
    if (this.dead) return;
    // A new request while one is running: finish the running one instantly.
    if (this.tween && this.pending >= 0) {
      this.tween.kill();
      this.commit(this.pending);
    }
    if (target === this.current) return;
    this.pending = target;
    let tex: Texture;
    try {
      tex = await this.load(target);
    } catch {
      return;
    }
    if (this.dead || this.pending !== target) return;
    const n = this.urls.length;
    this.load((target + dir + n) % n).catch(() => {});
    const u = this.program.uniforms;
    u.tCurrent.value = this.textures[this.current];
    u.uCurrentSize.value = this.sizes[this.current];
    u.tNext.value = tex;
    u.uNextSize.value = this.sizes[target];
    u.uDir.value = dir;
    u.uProgress.value = 0;
    this.tween = gsap.to(u.uProgress, {
      value: 1,
      duration: this.opts.duration,
      ease: "power2.inOut",
      onUpdate: () => this.render(),
      onComplete: () => this.commit(target),
    });
  }

  destroy() {
    this.dead = true;
    this.tween?.kill();
    this.ro.disconnect();
    const canvas = this.gl.canvas as HTMLCanvasElement;
    canvas.removeEventListener("webglcontextlost", this.lost);
    this.textures.forEach((t) => t?.texture && this.gl.deleteTexture(t.texture));
    if (this.program.program) this.gl.deleteProgram(this.program.program);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  }
}

type MorphStageProps = {
  urls: string[];
  index: number;
  dir: number;
  transition?: MorphTransition;
  duration?: number;
  intensity?: number;
  aberration?: number;
  /** Last pointer position on the slide (0–1, y up), used as the ripple origin. */
  pointer?: [number, number];
  onReady: () => void;
  onFail: () => void;
};

export default function MorphStage({
  urls,
  index,
  dir,
  transition = "shear",
  duration = 0.9,
  intensity = 0.55,
  aberration = 0.6,
  pointer,
  onReady,
  onFail,
}: MorphStageProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const engine = useRef<MorphEngine | null>(null);
  const startIndex = useRef(index);
  const cb = useRef({ onReady, onFail });
  cb.current = { onReady, onFail };

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let e: MorphEngine | null = null;
    try {
      e = new MorphEngine(
        el,
        urls,
        startIndex.current,
        { transition, duration, intensity, aberration },
        () => cb.current.onReady(),
        () => cb.current.onFail(),
      );
    } catch {
      cb.current.onFail();
      return;
    }
    engine.current = e;
    return () => {
      e?.destroy();
      engine.current = null;
    };
    // The engine is rebuilt only when the image set changes (e.g. a new tab).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls]);

  useEffect(() => {
    if (pointer) engine.current?.setPointer(pointer[0], pointer[1]);
    engine.current?.show(index, dir);
  }, [index, dir, pointer]);

  return <div ref={host} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
