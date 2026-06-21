import * as THREE from 'three';
import { gsap } from 'gsap';

export default function createProjectWindow(
    scene,
    width  = 4,
    height = 2.5,
    tilt   = { x: -0.2, y: 0.1 }
) {
    const group = new THREE.Group();
    group.position.set(0, 0, 0);
    scene.add(group);

    // ---- HELPER: rounded rect shape geometry ----
    function createRoundedRectGeometry(w, h, radius, segments = 10) {
        const shape  = new THREE.Shape();
        const hw = w / 2, hh = h / 2;
        shape.moveTo(-hw + radius, -hh);
        shape.lineTo(hw - radius, -hh);
        shape.quadraticCurveTo(hw, -hh, hw, -hh + radius);
        shape.lineTo(hw, hh - radius);
        shape.quadraticCurveTo(hw, hh, hw - radius, hh);
        shape.lineTo(-hw + radius, hh);
        shape.quadraticCurveTo(-hw, hh, -hw, hh - radius);
        shape.lineTo(-hw, -hh + radius);
        shape.quadraticCurveTo(-hw, -hh, -hw + radius, -hh);
        return new THREE.ShapeGeometry(shape, segments);
    }

    // ---- PANEL (dark background) ----
    const panelGeom = createRoundedRectGeometry(width, height, 0.12);
    const panelMat  = new THREE.MeshBasicMaterial({
        color: 0x08111e,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
    });
    const panel = new THREE.Mesh(panelGeom, panelMat);
    panel.rotation.x = tilt.x;
    panel.rotation.y = tilt.y;
    group.add(panel);

    // ---- GLOW (accent outline behind panel) ----
    const glowGeom = createRoundedRectGeometry(width + 0.18, height + 0.12, 0.16);
    const glowMat  = new THREE.MeshBasicMaterial({
        color: 0x897eff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    glowMesh.position.set(0, 0, -0.02);
    panel.add(glowMesh);

    // ---- ROUNDED MASK TEXTURE ----
    function createRoundedMaskTexture(w, h, radius) {
        const c    = document.createElement('canvas');
        c.width    = 1024;
        c.height   = 512;
        const ctx  = c.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = 'white';
        const sx = c.width / w, sy = c.height / h;
        const r  = radius * Math.min(sx, sy);
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(c.width - r, 0);
        ctx.quadraticCurveTo(c.width, 0, c.width, r);
        ctx.lineTo(c.width, c.height - r);
        ctx.quadraticCurveTo(c.width, c.height, c.width - r, c.height);
        ctx.lineTo(r, c.height);
        ctx.quadraticCurveTo(0, c.height, 0, c.height - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fill();
        const tex = new THREE.CanvasTexture(c);
        tex.minFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        return tex;
    }

    const maskTexture = createRoundedMaskTexture(width, height, 0.12);

    // ---- PLACEHOLDER ----
    function createPlaceholderTexture(text = 'Choisissez un projet') {
        const c   = document.createElement('canvas');
        c.width   = 1024;
        c.height  = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#0d1520';
        ctx.fillRect(0, 0, c.width, c.height);
        // subtle grid
        ctx.strokeStyle = 'rgba(137,126,255,0.12)';
        ctx.lineWidth = 1;
        for (let x = 0; x < c.width; x += 48)  { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,c.height); ctx.stroke(); }
        for (let y = 0; y < c.height; y += 48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(c.width,y); ctx.stroke(); }
        // crosshair
        ctx.strokeStyle = 'rgba(137,126,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(c.width/2, c.height/2 - 40); ctx.lineTo(c.width/2, c.height/2 + 40); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(c.width/2 - 40, c.height/2); ctx.lineTo(c.width/2 + 40, c.height/2); ctx.stroke();
        ctx.beginPath(); ctx.arc(c.width/2, c.height/2, 20, 0, Math.PI * 2); ctx.stroke();
        // label
        ctx.fillStyle  = 'rgba(137,126,255,0.7)';
        ctx.font       = 'bold 32px monospace';
        ctx.textAlign  = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, c.width / 2, c.height / 2 + 80);
        const tex = new THREE.CanvasTexture(c);
        tex.minFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        return tex;
    }

    const placeholderTexture = createPlaceholderTexture();
    let placeholderMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({
            map: placeholderTexture,
            alphaMap: maskTexture,
            transparent: true,
            opacity: 1,
            depthTest: false,
            depthWrite: false,
        })
    );
    placeholderMesh.position.set(0, 0, 0.02);
    panel.add(placeholderMesh);

    function showPlaceholder() { if (placeholderMesh) placeholderMesh.visible = true; }
    function hidePlaceholder() { if (placeholderMesh) placeholderMesh.visible = false; }

    // ---- PREVIEW IMAGE ----
    const loader = new THREE.TextureLoader();
    let previewMesh  = null;
    let loadTicket   = 0; // incremented on every new request; stale callbacks check against it

    function disposeMesh(mesh) {
        panel.remove(mesh);
        if (mesh.material.map) mesh.material.map.dispose();
        mesh.geometry.dispose();
        mesh.material.dispose();
    }

    function createOrUpdatePreview(texture) {
        // Dispose any existing mesh first
        if (previewMesh) { disposeMesh(previewMesh); previewMesh = null; }

        previewMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: texture,
                alphaMap: maskTexture,
                transparent: true,
                opacity: 0,
                depthTest: false,
                depthWrite: false,
            })
        );
        previewMesh.position.set(0, 0, 0.02);
        panel.add(previewMesh);
        gsap.to(previewMesh.material, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }

    function updatePreview(url) {
        if (!url) return showPlaceholder();
        hidePlaceholder();
        const ticket = ++loadTicket;
        loader.load(
            url,
            (texture) => {
                if (ticket !== loadTicket) { texture.dispose(); return; } // stale — a newer request won
                createOrUpdatePreview(texture);
            },
            undefined,
            () => { if (ticket === loadTicket) showPlaceholder(); }
        );
    }

    function clearPreview() {
        ++loadTicket; // invalidate any in-flight load

        if (previewMesh) {
            const stale = previewMesh;
            previewMesh = null; // null immediately so a concurrent updatePreview can set its own mesh

            gsap.to(stale.material, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                    disposeMesh(stale);
                    if (!previewMesh) showPlaceholder(); // only show placeholder if no new preview arrived
                },
            });
        } else {
            showPlaceholder();
        }
    }

    // ---- OPEN / CLOSE ----
    let floatTween = null;

    function open(duration = 1) {
        group.visible = true;
        group.position.y = -0.15;

        gsap.to(panelMat,  { opacity: 1,    duration, ease: 'power2.out' });
        gsap.to(glowMat,   { opacity: 0.18, duration: duration * 1.2, ease: 'power2.out' });
        gsap.to(group.position, { y: 0, duration, ease: 'power2.out' });

        // Gentle perpetual float
        floatTween = gsap.to(group.position, {
            y: 0.1,
            duration: 2.8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: duration,
        });
    }

    function close(duration = 0.7) {
        if (floatTween) { floatTween.kill(); floatTween = null; }
        gsap.to(group.position, { y: -0.15, duration: duration * 0.8, ease: 'power2.inOut' });
        gsap.to(panelMat, { opacity: 0, duration, ease: 'power2.inOut' });
        gsap.to(glowMat,  { opacity: 0, duration: duration * 0.8, ease: 'power2.inOut',
            onComplete: () => { group.visible = false; group.position.y = 0; }
        });
    }

    function destroy() {
        if (floatTween) floatTween.kill();
        if (previewMesh)     { disposeMesh(previewMesh);     previewMesh = null; }
        if (placeholderMesh) { disposeMesh(placeholderMesh); placeholderMesh = null; }
        panel.geometry.dispose();
        panelMat.dispose();
        glowMesh.geometry.dispose();
        glowMat.dispose();
        scene.remove(group);
    }

    return { group, open, close, updatePreview, clearPreview, showPlaceholder, hidePlaceholder, destroy };
}
