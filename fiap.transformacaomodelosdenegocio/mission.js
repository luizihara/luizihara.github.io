(() => {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0 };
    const warpState = { level: reducedMotion ? 0 : .12, target: reducedMotion ? 0 : .12 };
    let warpTimer;
    let warpClassTimer;
    window.addEventListener('pointermove', (event) => {
        pointer.x = (event.clientX / window.innerWidth - .5) * 2;
        pointer.y = (event.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });

    const hyperdriveButton = document.getElementById('hyperdrive');
    const triggerHyperdrive = () => {
        if (reducedMotion) return;
        window.clearTimeout(warpTimer); window.clearTimeout(warpClassTimer);
        warpState.target = 1;
        document.body.classList.remove('warping');
        void document.body.offsetWidth;
        document.body.classList.add('warping');
        hyperdriveButton?.classList.add('active');
        const label = hyperdriveButton?.querySelector('span');
        if (label) label.textContent = 'HIPERDRIVE ATIVO';
        warpTimer = window.setTimeout(() => { warpState.target = .12; }, 1550);
        warpClassTimer = window.setTimeout(() => {
            document.body.classList.remove('warping');
            hyperdriveButton?.classList.remove('active');
            if (label) label.textContent = 'ATIVAR HIPERESPAÇO';
        }, 2300);
    };
    hyperdriveButton?.addEventListener('click', triggerHyperdrive);

    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        reveals.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index % 3, 2) * 75}ms`;
            revealObserver.observe(item);
        });
    } else {
        reveals.forEach((item) => item.classList.add('is-visible'));
    }

    const revealHashTarget = () => {
        if (!window.location.hash) return;
        const target = document.querySelector(window.location.hash);
        if (!target) return;
        if (target.classList.contains('reveal')) target.classList.add('is-visible');
        target.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
    };
    window.addEventListener('hashchange', revealHashTarget);
    window.requestAnimationFrame(revealHashTarget);

    const railLinks = [...document.querySelectorAll('.mission-rail a')];
    const missions = [...document.querySelectorAll('.mission[data-question]')];
    const progress = document.getElementById('rail-progress');
    const updateScrollState = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? window.scrollY / max : 0;
        if (progress) progress.style.height = `${Math.min(100, Math.max(0, ratio * 100))}%`;
        let current = '';
        missions.forEach((mission) => {
            if (mission.getBoundingClientRect().top <= window.innerHeight * .44) current = mission.id;
        });
        railLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    };
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    const visitToast = document.getElementById('visit-toast');
    const visitClose = document.getElementById('visit-close');
    window.setTimeout(() => visitToast?.classList.add('visible'), 900);
    visitClose?.addEventListener('click', () => visitToast.classList.remove('visible'));

    document.querySelectorAll('.planet-label').forEach((button) => {
        button.addEventListener('click', () => {
            document.getElementById(`case-${button.dataset.case}`)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        });
    });

    const fallbackCanvas = (canvas, palette, mode = 'stars') => {
        if (!canvas) return;
        const context = canvas.getContext('2d');
        const points = Array.from({ length: mode === 'stars' ? 220 : 70 }, (_, index) => ({
            x: Math.random(), y: Math.random(), z: Math.random(), phase: Math.random() * Math.PI * 2,
            color: palette[index % palette.length]
        }));
        const draw = (time = 0) => {
            const width = canvas.clientWidth || window.innerWidth;
            const height = canvas.clientHeight || window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
                canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
            }
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.clearRect(0, 0, width, height);
            points.forEach((point, index) => {
                const pulse = .45 + Math.sin(time * .0015 + point.phase) * .25;
                const radius = mode === 'stars' ? 0.4 + point.z * 1.25 : 1.2 + (index % 5);
                context.globalAlpha = Math.max(.18, pulse);
                context.fillStyle = point.color;
                context.beginPath(); context.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2); context.fill();
            });
            if (mode !== 'stars') {
                context.globalAlpha = .55; context.strokeStyle = palette[0]; context.lineWidth = 1;
                context.beginPath(); context.ellipse(width / 2, height / 2, width * .34, height * .12, time * .0001, 0, Math.PI * 2); context.stroke();
                context.beginPath(); context.ellipse(width / 2, height / 2, width * .24, height * .28, -time * .00008, 0, Math.PI * 2); context.stroke();
            }
            context.globalAlpha = 1;
            if (!reducedMotion) requestAnimationFrame(draw);
        };
        draw();
    };

    if (!window.THREE) {
        fallbackCanvas(document.getElementById('galaxy'), ['#ffffff', '#7484b4', '#ffe81f']);
        fallbackCanvas(document.getElementById('case-universe'), ['#aa6bff', '#ff5757', '#72ffad'], 'orbits');
        fallbackCanvas(document.getElementById('scale-scene'), ['#ffe81f', '#69d9ff', '#72ffad'], 'orbits');
        return;
    }

    const THREE = window.THREE;
    const clock = new THREE.Clock();
    let pageVisible = true;
    document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });

    const makeRenderer = (canvas, alpha = true) => {
        const renderer = new THREE.WebGLRenderer({ canvas, alpha, antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        return renderer;
    };

    const makeStars = (count, spread, colors, size = .12) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colorValues = new Float32Array(count * 3);
        for (let index = 0; index < count; index += 1) {
            const radius = spread * (.25 + Math.random() * .75);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[index * 3 + 2] = radius * Math.cos(phi);
            const color = new THREE.Color(colors[index % colors.length]);
            colorValues[index * 3] = color.r; colorValues[index * 3 + 1] = color.g; colorValues[index * 3 + 2] = color.b;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorValues, 3));
        return new THREE.Points(geometry, new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity: .86, blending: THREE.AdditiveBlending, depthWrite: false }));
    };

    const fitRenderer = (renderer, camera, canvas) => {
        const width = Math.max(1, canvas.clientWidth);
        const height = Math.max(1, canvas.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const setupGalaxy = () => {
        const canvas = document.getElementById('galaxy');
        if (!canvas) return;
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x03040a, .0035);
        const camera = new THREE.PerspectiveCamera(58, 1, .1, 900);
        camera.position.z = 65;
        const renderer = makeRenderer(canvas);
        const stars = makeStars(1500, 155, [0xffffff, 0xaab8ed, 0xffe81f, 0x69d9ff], .23);
        scene.add(stars);
        const dust = makeStars(420, 95, [0x5533aa, 0x173f75, 0x151b38], .55);
        dust.material.opacity = .28;
        scene.add(dust);

        const streakCount = 280;
        const streakPositions = new Float32Array(streakCount * 6);
        const streakColors = new Float32Array(streakCount * 6);
        const streakMeta = [];
        const streakPalette = [new THREE.Color(0xffffff), new THREE.Color(0x8fdfff), new THREE.Color(0xffe81f)];
        for (let index = 0; index < streakCount; index += 1) {
            const meta = { x: (Math.random() - .5) * 175, y: (Math.random() - .5) * 105, z: -160 + Math.random() * 210, speed: .55 + Math.random() * 1.4 };
            streakMeta.push(meta);
            const color = streakPalette[index % streakPalette.length];
            for (let point = 0; point < 2; point += 1) {
                streakColors[index * 6 + point * 3] = color.r;
                streakColors[index * 6 + point * 3 + 1] = color.g;
                streakColors[index * 6 + point * 3 + 2] = color.b;
            }
        }
        const streakGeometry = new THREE.BufferGeometry();
        streakGeometry.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
        streakGeometry.setAttribute('color', new THREE.BufferAttribute(streakColors, 3));
        const streakMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .15, blending: THREE.AdditiveBlending, depthWrite: false });
        const streaks = new THREE.LineSegments(streakGeometry, streakMaterial); scene.add(streaks);

        const cometGroup = new THREE.Group();
        const comets = Array.from({ length: 4 }, (_, index) => {
            const color = [0x69d9ff, 0xffffff, 0xffe81f, 0xaa6bff][index];
            const comet = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(-8 - index * 2, 3 + index, -2)]), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .42, blending: THREE.AdditiveBlending }));
            comet.position.set(-90 + Math.random() * 150, 25 + Math.random() * 50, -30 - Math.random() * 45);
            comet.userData.speed = 7 + Math.random() * 4; comet.userData.offset = index * 37;
            cometGroup.add(comet); return comet;
        });
        scene.add(cometGroup);

        const resize = () => fitRenderer(renderer, camera, canvas);
        window.addEventListener('resize', resize, { passive: true }); resize();
        const render = () => {
            if (!pageVisible) { requestAnimationFrame(render); return; }
            const time = clock.getElapsedTime();
            const scrollRatio = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            warpState.level += (warpState.target - warpState.level) * .055;
            stars.rotation.y = time * (.005 + warpState.level * .014) + scrollRatio * .35;
            stars.rotation.x = scrollRatio * .12;
            dust.rotation.y = -time * .003 - scrollRatio * .22;
            streakMeta.forEach((meta, index) => {
                meta.z += meta.speed * (.16 + warpState.level * 4.9);
                if (meta.z > 57) { meta.z = -160; meta.x = (Math.random() - .5) * 175; meta.y = (Math.random() - .5) * 105; }
                const base = index * 6;
                const length = .35 + warpState.level * (9 + meta.speed * 4.5);
                streakPositions[base] = meta.x; streakPositions[base + 1] = meta.y; streakPositions[base + 2] = meta.z;
                streakPositions[base + 3] = meta.x; streakPositions[base + 4] = meta.y; streakPositions[base + 5] = meta.z - length;
            });
            streakGeometry.attributes.position.needsUpdate = true;
            streakMaterial.opacity = .08 + warpState.level * .72;
            comets.forEach((comet, index) => {
                comet.position.x += comet.userData.speed * (.14 + warpState.level * .2);
                comet.position.y -= comet.userData.speed * .035;
                comet.material.opacity = .18 + Math.sin(time * 2.2 + index) * .12 + warpState.level * .25;
                if (comet.position.x > 100) comet.position.set(-110, 30 + ((time * 17 + comet.userData.offset) % 55), -30 - index * 12);
            });
            camera.position.x += (pointer.x * 2.7 - camera.position.x) * .025;
            camera.position.y += ((-pointer.y * 1.8 + Math.sin(time * .08) * 1.2 - scrollRatio * 8) - camera.position.y) * .035;
            camera.position.z = 65 - Math.sin(scrollRatio * Math.PI) * 7 - warpState.level * 3.5;
            camera.rotation.z += ((pointer.x * -.006) - camera.rotation.z) * .03;
            renderer.render(scene, camera);
            if (!reducedMotion) requestAnimationFrame(render);
        };
        render();
    };

    const setupCaseUniverse = () => {
        const canvas = document.getElementById('case-universe');
        if (!canvas) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, .1, 200);
        camera.position.set(0, 6, 39);
        const renderer = makeRenderer(canvas);
        const universe = new THREE.Group();
        universe.rotation.x = -.22;
        scene.add(universe);

        scene.add(new THREE.AmbientLight(0x6677aa, 1.4));
        const key = new THREE.PointLight(0xffed66, 55, 90); key.position.set(0, 3, 9); scene.add(key);
        const rim = new THREE.DirectionalLight(0x5ba9ff, 2.8); rim.position.set(-8, 8, 10); scene.add(rim);
        const centerGlow = new THREE.Mesh(new THREE.IcosahedronGeometry(2.35, 2), new THREE.MeshBasicMaterial({ color: 0xffe81f, wireframe: true, transparent: true, opacity: .62 }));
        const centerCore = new THREE.Mesh(new THREE.SphereGeometry(.8, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        centerGlow.add(centerCore); universe.add(centerGlow);
        const halo = new THREE.Mesh(new THREE.SphereGeometry(3.2, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffe81f, transparent: true, opacity: .05, blending: THREE.AdditiveBlending })); universe.add(halo);
        const energyRings = [3.2, 4.15, 5.1].map((radius, index) => {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .025 + index * .008, 8, 96), new THREE.MeshBasicMaterial({ color: [0xffe81f, 0x69d9ff, 0xffffff][index], transparent: true, opacity: .34 - index * .07, blending: THREE.AdditiveBlending }));
            ring.rotation.set(.55 + index * .42, index * .7, index * .38); universe.add(ring); return ring;
        });
        const coreSparks = makeStars(120, 7.2, [0xffffff, 0xffe81f, 0x69d9ff], .16);
        coreSparks.material.opacity = .78; universe.add(coreSparks);

        const ringMaterial = (color) => new THREE.LineBasicMaterial({ color, transparent: true, opacity: .32, blending: THREE.AdditiveBlending });
        const makeOrbit = (radius, squash, color, rotation) => {
            const curve = new THREE.EllipseCurve(0, 0, radius, radius * squash, 0, Math.PI * 2, false, 0);
            const points = curve.getPoints(160).map((point) => new THREE.Vector3(point.x, point.y, 0));
            const orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), ringMaterial(color));
            orbit.rotation.set(rotation[0], rotation[1], rotation[2]); universe.add(orbit); return orbit;
        };
        makeOrbit(8.2, .52, 0xaa6bff, [.64, .05, -.22]);
        makeOrbit(12.1, .42, 0xff5757, [-.25, .3, .18]);
        makeOrbit(15.8, .33, 0x72ffad, [.4, -.22, -.12]);

        const planetSpecs = [
            { radius: 1.55, distance: 8.2, speed: .25, color: 0x7b43db, emissive: 0x1c0747, phase: 2.35, tilt: .64 },
            { radius: 1.95, distance: 12.1, speed: -.17, color: 0xe13b46, emissive: 0x4a0710, phase: .15, tilt: -.25 },
            { radius: 1.78, distance: 15.8, speed: .11, color: 0x55d78b, emissive: 0x063d20, phase: 4.2, tilt: .4 }
        ];
        const planets = planetSpecs.map((spec, index) => {
            const group = new THREE.Group();
            const material = new THREE.MeshStandardMaterial({ color: spec.color, emissive: spec.emissive, emissiveIntensity: .8, roughness: .72, metalness: .25 });
            const mesh = new THREE.Mesh(new THREE.SphereGeometry(spec.radius, 42, 42), material);
            mesh.rotation.z = .22 + index * .14; group.add(mesh);
            const wire = new THREE.Mesh(new THREE.SphereGeometry(spec.radius * 1.018, 16, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: .09 })); group.add(wire);
            const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(spec.radius * 1.13, 32, 24), new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: .065, blending: THREE.AdditiveBlending, side: THREE.BackSide })); group.add(atmosphere);
            const fieldRing = new THREE.Mesh(new THREE.TorusGeometry(spec.radius * 1.62, .018, 6, 72), new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: .44, blending: THREE.AdditiveBlending }));
            fieldRing.rotation.set(Math.PI / 2.5 + index * .18, index * .4, 0); group.add(fieldRing);
            const moonPivot = new THREE.Group();
            const moon = new THREE.Mesh(new THREE.SphereGeometry(.18 + index * .05, 16, 16), new THREE.MeshBasicMaterial({ color: index === 0 ? 0xcab6ff : index === 1 ? 0xffb19f : 0xa4ffd0 }));
            moon.position.x = spec.radius * 2.15; moonPivot.add(moon); group.add(moonPivot);
            if (index === 1) {
                const ring = new THREE.Mesh(new THREE.RingGeometry(spec.radius * 1.32, spec.radius * 1.58, 56), new THREE.MeshBasicMaterial({ color: spec.color, side: THREE.DoubleSide, transparent: true, opacity: .4 }));
                ring.rotation.x = Math.PI / 2.7; group.add(ring);
            }
            universe.add(group); return { group, mesh, wire, atmosphere, fieldRing, moonPivot, spec };
        });
        universe.add(makeStars(240, 28, [0xffffff, 0x8ca6ff, 0xffe81f], .09));

        let dragging = false; let previousX = 0; let previousY = 0; let targetY = 0; let targetX = -.22;
        canvas.addEventListener('pointerdown', (event) => { dragging = true; previousX = event.clientX; previousY = event.clientY; canvas.setPointerCapture(event.pointerId); });
        canvas.addEventListener('pointermove', (event) => { if (!dragging) return; targetY += (event.clientX - previousX) * .008; targetX += (event.clientY - previousY) * .005; targetX = Math.max(-.65, Math.min(.45, targetX)); previousX = event.clientX; previousY = event.clientY; });
        canvas.addEventListener('pointerup', () => { dragging = false; });
        canvas.addEventListener('pointercancel', () => { dragging = false; });
        const resize = () => fitRenderer(renderer, camera, canvas);
        new ResizeObserver(resize).observe(canvas); resize();
        const render = () => {
            if (!pageVisible) { requestAnimationFrame(render); return; }
            const time = performance.now() * .001;
            if (!dragging && !reducedMotion) targetY += .0015;
            universe.rotation.y += (targetY - universe.rotation.y) * .06;
            universe.rotation.x += (targetX - universe.rotation.x) * .06;
            centerGlow.rotation.x = time * .28; centerGlow.rotation.y = time * .45;
            halo.scale.setScalar(1 + Math.sin(time * 1.8) * .08);
            energyRings.forEach((ring, index) => { ring.rotation.x += .0018 + index * .0008; ring.rotation.y += (index % 2 ? -.003 : .0025); ring.scale.setScalar(1 + Math.sin(time * 1.7 + index * .8) * .035); });
            coreSparks.rotation.y = -time * .28; coreSparks.rotation.z = time * .1;
            planets.forEach(({ group, mesh, wire, atmosphere, fieldRing, moonPivot, spec }, index) => {
                const angle = spec.phase + time * spec.speed;
                group.position.set(Math.cos(angle) * spec.distance, Math.sin(angle) * spec.distance * (.36 + index * .04), Math.sin(angle * .8) * 2.2);
                mesh.rotation.y = time * (.18 + index * .05); wire.rotation.y = -time * .12;
                atmosphere.scale.setScalar(1 + Math.sin(time * 2.1 + index) * .018);
                fieldRing.rotation.z = time * (index % 2 ? -.36 : .3);
                moonPivot.rotation.y = time * (.65 + index * .17); moonPivot.rotation.z = .35 + index * .2;
            });
            camera.position.x += (pointer.x * 1.35 - camera.position.x) * .025;
            camera.position.y += ((6 - pointer.y * .8) - camera.position.y) * .025;
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
            if (!reducedMotion) requestAnimationFrame(render);
        };
        render();
    };

    const setupScaleScene = () => {
        const canvas = document.getElementById('scale-scene');
        if (!canvas) return;
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050812, .026);
        const camera = new THREE.PerspectiveCamera(38, 1, .1, 160); camera.position.set(0, 4, 32);
        const renderer = makeRenderer(canvas);
        scene.add(new THREE.AmbientLight(0x4f68a9, 1.4));
        const light = new THREE.PointLight(0xffe81f, 50, 55); light.position.set(2, 5, 8); scene.add(light);
        const structure = new THREE.Group(); structure.rotation.x = -.16; scene.add(structure);
        const colors = [0x69d9ff, 0x69d9ff, 0xffe81f, 0xffe81f, 0x72ffad];
        const nodes = [];
        colors.forEach((color, index) => {
            const y = (index - 2) * 4.4;
            const platform = new THREE.Mesh(new THREE.CylinderGeometry(5.5 - index * .35, 5.5 - index * .35, .18, 64, 1, true), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .12, transparent: true, opacity: .22, wireframe: true }));
            platform.position.y = y; structure.add(platform);
            const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.64 + index * .08, 1), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .35, roughness: .38, metalness: .45 }));
            const angle = index * 1.42; core.position.set(Math.cos(angle) * (3.8 - index * .25), y, Math.sin(angle) * (3.8 - index * .25)); structure.add(core); nodes.push(core);
            const nodeRing = new THREE.Mesh(new THREE.TorusGeometry(1.1 + index * .06, .025, 6, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .48, blending: THREE.AdditiveBlending }));
            nodeRing.position.copy(core.position); nodeRing.rotation.set(Math.PI / 2, 0, index * .5); structure.add(nodeRing); core.userData.ring = nodeRing;
            const column = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, y, 0), core.position.clone()]), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .45 })); structure.add(column);
        });
        const spineGeometry = new THREE.BufferGeometry().setFromPoints(nodes.map((node) => node.position));
        structure.add(new THREE.Line(spineGeometry, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .38 })));
        const axis = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 22, 8), new THREE.MeshBasicMaterial({ color: 0xffe81f, transparent: true, opacity: .25 })); structure.add(axis);
        const scanPlane = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 6.6, .025, 64), new THREE.MeshBasicMaterial({ color: 0x69d9ff, transparent: true, opacity: .1, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
        scanPlane.position.y = -10; structure.add(scanPlane);
        const dataCount = 70;
        const dataPositions = new Float32Array(dataCount * 3);
        const dataMeta = [];
        for (let index = 0; index < dataCount; index += 1) {
            const phase = Math.random() * Math.PI * 2;
            const radius = 1.3 + Math.random() * 4.8;
            const y = -11 + Math.random() * 22;
            dataMeta.push({ phase, radius, y, speed: .35 + Math.random() * .8 });
            dataPositions[index * 3] = Math.cos(phase) * radius; dataPositions[index * 3 + 1] = y; dataPositions[index * 3 + 2] = Math.sin(phase) * radius;
        }
        const dataGeometry = new THREE.BufferGeometry(); dataGeometry.setAttribute('position', new THREE.BufferAttribute(dataPositions, 3));
        const dataFlow = new THREE.Points(dataGeometry, new THREE.PointsMaterial({ color: 0x69d9ff, size: .13, transparent: true, opacity: .72, blending: THREE.AdditiveBlending, depthWrite: false }));
        structure.add(dataFlow);
        structure.add(makeStars(160, 20, [0xffffff, 0x69d9ff, 0xffe81f, 0x72ffad], .1));
        const resize = () => fitRenderer(renderer, camera, canvas); new ResizeObserver(resize).observe(canvas); resize();
        const render = () => {
            if (!pageVisible) { requestAnimationFrame(render); return; }
            const time = performance.now() * .001;
            structure.rotation.y = time * .18;
            nodes.forEach((node, index) => {
                node.rotation.x = time * (.25 + index * .04); node.rotation.y = time * (.36 + index * .03); node.scale.setScalar(1 + Math.sin(time * 1.6 + index) * .1);
                node.userData.ring.rotation.z = time * (index % 2 ? -.7 : .55) + index; node.userData.ring.scale.setScalar(1 + Math.sin(time * 2 + index) * .12);
            });
            dataMeta.forEach((meta, index) => {
                meta.y += meta.speed * .035;
                if (meta.y > 11) meta.y = -11;
                const angle = meta.phase + time * (.12 + meta.speed * .06);
                dataPositions[index * 3] = Math.cos(angle) * meta.radius; dataPositions[index * 3 + 1] = meta.y; dataPositions[index * 3 + 2] = Math.sin(angle) * meta.radius;
            });
            dataGeometry.attributes.position.needsUpdate = true;
            scanPlane.position.y = -10 + ((time * 1.7) % 20);
            scanPlane.material.opacity = .055 + Math.sin(time * 2.5) * .025;
            camera.position.x += (pointer.x * 2.2 - camera.position.x) * .025;
            camera.position.y += ((4 - pointer.y * 1.25 + Math.sin(time * .28) * 1.2) - camera.position.y) * .03;
            camera.lookAt(0, 0, 0); renderer.render(scene, camera);
            if (!reducedMotion) requestAnimationFrame(render);
        };
        render();
    };

    try { setupGalaxy(); } catch (error) { fallbackCanvas(document.getElementById('galaxy'), ['#ffffff', '#7484b4', '#ffe81f']); }
    try { setupCaseUniverse(); } catch (error) { fallbackCanvas(document.getElementById('case-universe'), ['#aa6bff', '#ff5757', '#72ffad'], 'orbits'); }
    try { setupScaleScene(); } catch (error) { fallbackCanvas(document.getElementById('scale-scene'), ['#ffe81f', '#69d9ff', '#72ffad'], 'orbits'); }
})();
