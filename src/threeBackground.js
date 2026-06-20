import * as THREE from 'three';
import { EffectComposer, RenderPass, ShaderPass } from 'three-stdlib';
import { gsap } from 'gsap';

// Per-particle organic drift: each particle gets unique phase offsets and speed
function makeDriftData(count) {
    const phases = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        phases[i * 3]     = Math.random() * Math.PI * 2;
        phases[i * 3 + 1] = Math.random() * Math.PI * 2;
        phases[i * 3 + 2] = Math.random() * Math.PI * 2;
        speeds[i] = 0.15 + Math.random() * 0.35;
    }
    return { phases, speeds };
}

// Smooth particle texture: soft radial gradient → no hard edge
function makeParticleTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0,   'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    return tex;
}

export default function initThreeBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return null;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 5.5; // start slightly closer for cinematic pullback

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x131413, 1);

    const particleTex = makeParticleTexture();
    const cWhite  = new THREE.Color(0xf9f9f9);
    const cAccent = new THREE.Color(0x897eff);
    const cSoft   = new THREE.Color(0xc4beff);

    // ---- LAYER 1: main field (many, small) ----
    const MAIN_COUNT = 850;
    const mainPos    = new Float32Array(MAIN_COUNT * 3);
    const mainColors = new Float32Array(MAIN_COUNT * 3);

    for (let i = 0; i < MAIN_COUNT; i++) {
        const i3 = i * 3;
        mainPos[i3]     = (Math.random() - 0.5) * 13;
        mainPos[i3 + 1] = (Math.random() - 0.5) * 8;
        mainPos[i3 + 2] = (Math.random() - 0.5) * 9;
        const mix = Math.random();
        const c = mix < 0.65
            ? cWhite.clone().lerp(cSoft, mix * 0.8)
            : cAccent.clone().lerp(cSoft, Math.random() * 0.5);
        mainColors[i3] = c.r; mainColors[i3 + 1] = c.g; mainColors[i3 + 2] = c.b;
    }
    const mainGeom = new THREE.BufferGeometry();
    mainGeom.setAttribute('position', new THREE.BufferAttribute(mainPos, 3));
    mainGeom.setAttribute('color',    new THREE.BufferAttribute(mainColors, 3));
    const mainMat = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: particleTex,
        sizeAttenuation: true,
    });
    const mainParticles = new THREE.Points(mainGeom, mainMat);
    scene.add(mainParticles);

    // ---- LAYER 2: accent particles (fewer, larger, brighter purple) ----
    const ACCENT_COUNT = 160;
    const accentPos    = new Float32Array(ACCENT_COUNT * 3);
    const accentColors = new Float32Array(ACCENT_COUNT * 3);

    for (let i = 0; i < ACCENT_COUNT; i++) {
        const i3 = i * 3;
        // Distributed in a loose ellipse around center + scattered outer ones
        const angle = Math.random() * Math.PI * 2;
        const r = 0.5 + Math.random() * 4.5;
        accentPos[i3]     = Math.cos(angle) * r + (Math.random() - 0.5) * 3;
        accentPos[i3 + 1] = Math.sin(angle) * r * 0.55 + (Math.random() - 0.5) * 2;
        accentPos[i3 + 2] = (Math.random() - 0.5) * 6;
        const c = cAccent.clone().lerp(cSoft, Math.random() * 0.4);
        accentColors[i3] = c.r; accentColors[i3 + 1] = c.g; accentColors[i3 + 2] = c.b;
    }
    const accentGeom = new THREE.BufferGeometry();
    accentGeom.setAttribute('position', new THREE.BufferAttribute(accentPos, 3));
    accentGeom.setAttribute('color',    new THREE.BufferAttribute(accentColors, 3));
    const accentMat = new THREE.PointsMaterial({
        size: 0.11,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: particleTex,
        sizeAttenuation: true,
    });
    const accentParticles = new THREE.Points(accentGeom, accentMat);
    scene.add(accentParticles);

    // Store initial positions for drift computation
    const mainInitial   = mainPos.slice();
    const accentInitial = accentPos.slice();

    // Drift data per particle
    const mainDrift   = makeDriftData(MAIN_COUNT);
    const accentDrift = makeDriftData(ACCENT_COUNT);

    // ---- PARALLAX ----
    const mouse = new THREE.Vector2(0, 0);
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    const baseCameraPos = new THREE.Vector3(0, 0, 6);

    gsap.ticker.add(() => {
        const isZoomedIn = camera.position.z < 4;
        const strength = isZoomedIn ? 0.08 : 0.45;
        camera.position.x += (baseCameraPos.x + mouse.x * strength - camera.position.x) * 0.05;
        camera.position.y += (baseCameraPos.y + mouse.y * strength - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    });

    // Cinematic startup pullback: camera glides from z=5.5 → z=6
    gsap.to(camera.position, { z: 6, duration: 2.8, ease: 'power1.out', delay: 1 });

    // ---- POSTPROCESSING ----
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Film Grain
    const grainPass = new ShaderPass({
        uniforms: {
            tDiffuse:  { value: null },
            time:      { value: 0 },
            intensity: { value: 0.06 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float time;
            uniform float intensity;
            varying vec2 vUv;
            float random(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                float grain = random(vUv * time) * 2.0 - 1.0;
                color.rgb += grain * intensity;
                gl_FragColor = color;
            }
        `,
    });
    composer.addPass(grainPass);

    // Scanlines
    const scanlinePass = new ShaderPass({
        uniforms: {
            tDiffuse:   { value: null },
            time:       { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            intensity:  { value: 0.1 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float time;
            uniform vec2 resolution;
            uniform float intensity;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                float scanline = sin(vUv.y * resolution.y * 1.5 + time * 5.0) * intensity;
                color.rgb -= scanline;
                gl_FragColor = color;
            }
        `,
    });
    composer.addPass(scanlinePass);

    // Chromatic Aberration — subtle normally, increases on zoom
    const chromaticPass = new ShaderPass({
        uniforms: {
            tDiffuse:  { value: null },
            intensity: { value: 0.0015 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float intensity;
            varying vec2 vUv;
            void main() {
                vec2 offset = intensity * (vUv - 0.5);
                float r = texture2D(tDiffuse, vUv - offset).r;
                float g = texture2D(tDiffuse, vUv).g;
                float b = texture2D(tDiffuse, vUv + offset).b;
                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `,
    });
    composer.addPass(chromaticPass);

    // Vignette
    const vignettePass = new ShaderPass({
        uniforms: {
            tDiffuse: { value: null },
            offset:   { value: 1.0 },
            darkness: { value: 1.2 },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float offset;
            uniform float darkness;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                vec2 uv = vUv - 0.5;
                color.rgb *= smoothstep(0.8, offset * 0.799, length(uv) * darkness);
                gl_FragColor = color;
            }
        `,
    });
    composer.addPass(vignettePass);

    // ---- ANIMATION LOOP ----
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // -- Main particle drift (organic multi-frequency oscillation)
        const mArr = mainGeom.attributes.position.array;
        for (let i = 0; i < MAIN_COUNT; i++) {
            const i3 = i * 3;
            const s  = mainDrift.speeds[i];
            const px = mainDrift.phases[i3];
            const py = mainDrift.phases[i3 + 1];
            const pz = mainDrift.phases[i3 + 2];
            mArr[i3]     = mainInitial[i3]     + Math.sin(t * s * 0.3 + px) * 0.14 + Math.sin(t * s * 0.07 + pz) * 0.28;
            mArr[i3 + 1] = mainInitial[i3 + 1] + Math.cos(t * s * 0.4 + py) * 0.11 + Math.cos(t * s * 0.09 + px) * 0.19;
            mArr[i3 + 2] = mainInitial[i3 + 2] + Math.sin(t * s * 0.2 + pz) * 0.07;
        }
        mainGeom.attributes.position.needsUpdate = true;

        // -- Accent particle drift (slower, wider arcs)
        const aArr = accentGeom.attributes.position.array;
        for (let i = 0; i < ACCENT_COUNT; i++) {
            const i3 = i * 3;
            const s  = accentDrift.speeds[i];
            const px = accentDrift.phases[i3];
            const py = accentDrift.phases[i3 + 1];
            const pz = accentDrift.phases[i3 + 2];
            aArr[i3]     = accentInitial[i3]     + Math.sin(t * s * 0.2 + px) * 0.28 + Math.sin(t * s * 0.05 + pz) * 0.42;
            aArr[i3 + 1] = accentInitial[i3 + 1] + Math.cos(t * s * 0.25 + py) * 0.20 + Math.cos(t * s * 0.06 + px) * 0.28;
            aArr[i3 + 2] = accentInitial[i3 + 2] + Math.sin(t * s * 0.15 + pz) * 0.10;
        }
        accentGeom.attributes.position.needsUpdate = true;

        // -- Shader uniform updates
        grainPass.uniforms.time.value    = t * 60.0;
        scanlinePass.uniforms.time.value = t;

        // Dynamic vignette + chromatic aberration based on zoom depth
        const z = camera.position.z;
        vignettePass.uniforms.darkness.value  = THREE.MathUtils.mapLinear(z, 2.5, 6, 0.35, 1.2);
        chromaticPass.uniforms.intensity.value = THREE.MathUtils.mapLinear(z, 2.5, 6, 0.007, 0.0015);

        composer.render();
    }

    animate();

    // Single resize handler
    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        scanlinePass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return {
        camera, scene, renderer, composer,
        particles: mainParticles,
        grainPass, scanlinePass, vignettePass, chromaticPass,
        baseCameraPos,
    };
}
