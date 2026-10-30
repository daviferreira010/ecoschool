/* =====================================================================
   hero3d.js — CENA 3D DO HERO (Three.js)
   ---------------------------------------------------------------------
   Uma "rede do conhecimento": um poliedro em wireframe com nós
   conectados (comunidade escolar) flutuando sobre um campo de pontos
   em ondas (referência ao Rio Doce que corta Colatina).

   - Se o Three.js não carregar ou o aparelho não suportar WebGL,
     a cena simplesmente não aparece e o hero continua funcionando.
   - Pausa automaticamente quando o hero sai da tela ou a aba fica oculta.
   - Respeita "reduzir movimento" (renderiza um quadro estático).
   ===================================================================== */
const Hero3D = (() => {
  'use strict';
  let state = null;

  function supportsWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch { return false; }
  }

  function palette() {
    const s = getComputedStyle(document.documentElement);
    const read = (name, fb) => (s.getPropertyValue(name).trim() || fb);
    return {
      primary: new THREE.Color(read('--c-hero-node', '#dce3fe')),
      accent: new THREE.Color(read('--c-hero-accent', '#6891fb')),
      wave: new THREE.Color(read('--c-hero-wave', '#6891fb'))
    };
  }

  // options.anchor: elemento (ex.: o logo) que o globo 3D deve envolver
  function init(container, options = {}) {
    const anchor = options.anchor || null;
    if (!container || typeof THREE === 'undefined' || !supportsWebGL()) return false;
    destroy();

    const reduce = Utils.prefersReducedMotion();
    const isSmall = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: !isSmall, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x010f2e, 10, 26);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9);

    const colors = palette();

    /* --- 1. Núcleo: icosaedro em wireframe + nós --- */
    const core = new THREE.Group();
    const ico = new THREE.IcosahedronGeometry(2.1, 1);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(ico),
      new THREE.LineBasicMaterial({ color: colors.primary, transparent: true, opacity: 0.55 })
    );
    const nodes = new THREE.Points(
      ico,
      new THREE.PointsMaterial({ color: colors.accent, size: 0.11, transparent: true, opacity: 0.95 })
    );
    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 0),
      new THREE.MeshBasicMaterial({ color: colors.accent, wireframe: true, transparent: true, opacity: 0.35 })
    );
    core.add(edges, nodes, inner);

    // Anel orbital de partículas
    const ringCount = isSmall ? 140 : 260;
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * Math.PI * 2;
      const r = 3.1 + (Math.random() - 0.5) * 0.35;
      ringPos[i * 3] = Math.cos(a) * r;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.18;
      ringPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    const ring = new THREE.Points(ringGeo, new THREE.PointsMaterial({ color: colors.primary, size: 0.045, transparent: true, opacity: 0.8 }));
    ring.rotation.x = 1.15;
    ring.rotation.z = 0.25;
    core.add(ring);

    /* --- 2. Campo de ondas (rio) --- */
    const cols = isSmall ? 60 : 90;
    const rows = isSmall ? 26 : 36;
    const spacing = 0.32;
    const wavePos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        wavePos[k++] = (i - cols / 2) * spacing;
        wavePos[k++] = 0;
        wavePos[k++] = (j - rows / 2) * spacing;
      }
    }
    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePos, 3));
    const wave = new THREE.Points(waveGeo, new THREE.PointsMaterial({ color: colors.wave, size: 0.035, transparent: true, opacity: 0.6 }));
    wave.position.set(0, -2.9, -2);

    /* --- 3. Pequenos sólidos flutuantes --- */
    const floaters = [];
    const shapes = [new THREE.OctahedronGeometry(0.22), new THREE.TetrahedronGeometry(0.26), new THREE.TorusGeometry(0.18, 0.05, 8, 20)];
    for (let i = 0; i < (isSmall ? 5 : 9); i++) {
      const m = new THREE.Mesh(shapes[i % shapes.length], new THREE.MeshBasicMaterial({ color: i % 2 ? colors.accent : colors.primary, wireframe: true, transparent: true, opacity: 0.35 }));
      m.position.set((Math.random() - 0.5) * 11, (Math.random() - 0.3) * 5, (Math.random() - 0.5) * 4 - 1);
      m.userData = { speed: 0.3 + Math.random() * 0.6, offset: Math.random() * 10, baseY: m.position.y };
      floaters.push(m);
      scene.add(m);
    }

    scene.add(core, wave);

    // Posição do núcleo: à direita no desktop, ao centro/fundo no celular
    // Coloca o globo exatamente atrás do elemento "âncora" (o logo da escola)
    function placeOnAnchor(w, h) {
      if (!anchor) return false;
      const r = anchor.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      const size = anchor.offsetWidth; // ignora transformações (animações)
      if (!size) return false;
      camera.position.set(0, 0.6, 9);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      const nx = ((r.left + r.width / 2 - c.left) / w) * 2 - 1;
      const ny = -((r.top + r.height / 2 - c.top) / h) * 2 + 1;
      const dir = new THREE.Vector3(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      core.position.copy(camera.position).add(dir.multiplyScalar(t));
      const worldPerPx = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / h;
      core.scale.setScalar(((size / 2) * worldPerPx * 1.34) / 2.1);
      return true;
    }

    function layout() {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (placeOnAnchor(w, h)) return;
      if (w >= 992) { core.position.set(3.2, 0.3, 0); core.scale.setScalar(1); }
      else { core.position.set(1.9, 2.9, -4.5); core.scale.setScalar(0.7); }
    }
    layout();

    /* --- interação: mouse e rolagem --- */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    const onResize = Utils.debounce(layout, 120);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);

    const onTheme = () => {
      const p = palette();
      edges.material.color = p.primary; ring.material.color = p.primary;
      nodes.material.color = p.accent; inner.material.color = p.accent;
      wave.material.color = p.wave;
      floaters.forEach((f, i) => { f.material.color = i % 2 ? p.accent : p.primary; });
      if (reduce) renderer.render(scene, camera);
    };
    window.addEventListener('hf:themechange', onTheme);

    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(); }, { threshold: 0 });
    io.observe(container);
    const onVis = () => { if (!document.hidden) loop(); };
    document.addEventListener('visibilitychange', onVis);

    const clock = new THREE.Clock();
    let raf = null;

    function frame(t) {
      // ondas
      const pos = waveGeo.attributes.position.array;
      for (let i = 0, idx = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++, idx += 3) {
          const x = pos[idx];
          const z = pos[idx + 2];
          pos[idx + 1] = Math.sin(x * 0.55 + t * 0.9) * 0.28 + Math.cos(z * 0.7 + t * 0.6) * 0.2;
        }
      }
      waveGeo.attributes.position.needsUpdate = true;

      core.rotation.y = t * 0.18;
      core.rotation.x = Math.sin(t * 0.3) * 0.15;
      inner.rotation.y = -t * 0.35;
      ring.rotation.y = t * 0.08;
      floaters.forEach((f) => {
        f.rotation.x += 0.004 * f.userData.speed * 3;
        f.rotation.y += 0.006 * f.userData.speed * 3;
        f.position.y = f.userData.baseY + Math.sin(t * f.userData.speed + f.userData.offset) * 0.35;
      });

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      camera.position.x = pointer.x * 0.3;
      camera.position.y = 0.6 - pointer.y * 0.2 - Math.min(window.scrollY / 600, 1.2);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    function loop() {
      if (raf || reduce) return;
      const tick = () => {
        if (!visible || document.hidden) { raf = null; return; }
        frame(clock.getElapsedTime());
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    if (reduce) frame(2); else loop();
    container.classList.add('is-ready');

    state = {
      destroy() {
        cancelAnimationFrame(raf); raf = null; visible = false;
        io.disconnect();
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('load', onResize);
        window.removeEventListener('hf:themechange', onTheme);
        document.removeEventListener('visibilitychange', onVis);
        scene.traverse((o) => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); });
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
    return true;
  }

  function destroy() { if (state) { state.destroy(); state = null; } }

  return { init, destroy };
})();
