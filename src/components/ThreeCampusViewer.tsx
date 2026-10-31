import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Compass,
  Sun,
  Moon,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Maximize2,
  Info,
} from 'lucide-react';

interface ThreeCampusViewerProps {
  onClose?: () => void;
}

export const ThreeCampusViewer: React.FC<ThreeCampusViewerProps> = ({ onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activePreset, setActivePreset] = useState<'aerial' | 'tech' | 'greenhouse' | 'vet'>('aerial');
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('day');
  const [wireframe, setWireframe] = useState(false);
  const [selectedBuildingInfo, setSelectedBuildingInfo] = useState<string | null>(
    'EAV Kivumu Virtual Campus: Click any building to focus or use view presets below.'
  );

  // References to mutable Three.js items
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const windmillBladeRef = useRef<THREE.Group | null>(null);
  const allMaterialsRef = useRef<THREE.Material[]>([]);

  // Camera targets for smooth damping
  const targetCamPos = useRef(new THREE.Vector3(38, 28, 48));
  const targetLookAt = useRef(new THREE.Vector3(0, 4, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard for performance
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene & Fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xd9ebf5);
    scene.fog = new THREE.FogExp2(0xd9ebf5, 0.012);

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      250
    );
    camera.position.set(38, 28, 48);
    cameraRef.current = camera;

    // 4. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 5. Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Do not go below ground
    controls.minDistance = 8;
    controls.maxDistance = 120;
    controls.target.set(0, 4, 0);
    controlsRef.current = controls;

    // 7. Lighting: Warm Key Light + Cool Hemisphere Fill
    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    dirLight.position.set(35, 45, 25);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 5;
    dirLight.shadow.camera.far = 120;
    const d = 40;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const hemiLight = new THREE.HemisphereLight(0xe4f2fb, 0x486043, 1.2);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Keep track of materials for wireframe toggle
    const materials: THREE.Material[] = [];
    allMaterialsRef.current = materials;

    function registerMat<T extends THREE.Material>(m: T): T {
      materials.push(m);
      return m;
    }

    // Common PBR Materials
    const groundMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x4f7c45,
        roughness: 0.85,
        metalness: 0.05,
      })
    );
    const concreteMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xd7dcd9,
        roughness: 0.6,
        metalness: 0.1,
      })
    );
    const brickMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xa9513e,
        roughness: 0.7,
        metalness: 0.05,
      })
    );
    const darkRoofMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        roughness: 0.4,
        metalness: 0.3,
      })
    );
    const glassMat = registerMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x8cd6ff,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        metalness: 0.1,
        transmission: isSoftwareGl ? 0 : 0.85,
        ior: 1.5,
      })
    );
    const steelMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.25,
        metalness: 0.85,
      })
    );
    const goldAccentMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.2,
        metalness: 0.9,
      })
    );
    const foliageMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x22543d,
        roughness: 0.8,
        metalness: 0.0,
      })
    );
    const waterMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.15,
        metalness: 0.2,
      })
    );

    // ==========================================
    // 8. PROCEDURAL 3D MODELS (Composite 3-12 parts)
    // ==========================================

    // A. Terraced Terrain & Lake Kivumu Basin
    const terrainGroup = new THREE.Group();
    const mainIslandGeo = new THREE.CylinderGeometry(46, 50, 3, 32);
    const mainIsland = new THREE.Mesh(mainIslandGeo, groundMat);
    mainIsland.position.y = -1.5;
    mainIsland.receiveShadow = !isSoftwareGl;
    terrainGroup.add(mainIsland);

    // Lake Kivu water reflection pond
    const lakeGeo = new THREE.CylinderGeometry(15, 15, 0.4, 24);
    const lake = new THREE.Mesh(lakeGeo, waterMat);
    lake.position.set(-26, 0.1, -18);
    terrainGroup.add(lake);

    // Paved central plaza
    const plazaGeo = new THREE.BoxGeometry(28, 0.15, 20);
    const plaza = new THREE.Mesh(plazaGeo, concreteMat);
    plaza.position.set(0, 0.08, 0);
    plaza.receiveShadow = !isSoftwareGl;
    terrainGroup.add(plaza);

    scene.add(terrainGroup);

    // B. Hero Building 1: Central Smart Tech & Bio Pavilion (SWD & Admin)
    const pavilion = new THREE.Group();
    pavilion.position.set(0, 0, -4);

    // Part 1: Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 12), concreteMat);
    plinth.position.y = 0.4;
    plinth.castShadow = !isSoftwareGl;
    plinth.receiveShadow = !isSoftwareGl;
    pavilion.add(plinth);

    // Part 2: Main Walls (Brick)
    const walls = new THREE.Mesh(new THREE.BoxGeometry(14, 5.2, 10), brickMat);
    walls.position.y = 3.4;
    walls.castShadow = !isSoftwareGl;
    walls.receiveShadow = !isSoftwareGl;
    pavilion.add(walls);

    // Part 3: Front Glass Curtain Wall (Computer Labs)
    const curtain = new THREE.Mesh(new THREE.BoxGeometry(10, 4.4, 0.6), glassMat);
    curtain.position.set(0, 3.4, 5.1);
    pavilion.add(curtain);

    // Part 4: High-Tech Overhanging Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(17, 0.6, 13), darkRoofMat);
    roof.position.y = 6.2;
    roof.castShadow = !isSoftwareGl;
    pavilion.add(roof);

    // Part 5: Solar Panel Array (6 modules on roof)
    const solarArray = new THREE.Group();
    for (let i = -2; i <= 2; i++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.12, 3.5),
        registerMat(
          new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.1,
            metalness: 0.9,
          })
        )
      );
      panel.position.set(i * 2.8, 6.6, 0);
      panel.rotation.x = -0.15;
      solarArray.add(panel);
    }
    pavilion.add(solarArray);

    // Part 6: Entrance Colonnade & Portico
    for (let x = -4; x <= 4; x += 2.6) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 4.2, 12), concreteMat);
      col.position.set(x, 2.9, 6.2);
      col.castShadow = !isSoftwareGl;
      pavilion.add(col);
    }

    // Part 7: Flagpole with Rwandan Banner Colors
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 8.5, 8), steelMat);
    pole.position.set(5.5, 4.25, 6.8);
    pavilion.add(pole);

    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.0, 0.05),
      registerMat(
        new THREE.MeshStandardMaterial({
          color: 0x00a1de, // Blue
          roughness: 0.5,
        })
      )
    );
    flag.position.set(6.4, 7.8, 6.8);
    pavilion.add(flag);

    // Soft contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(19, 15);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    pavilion.add(shadow);

    scene.add(pavilion);

    // C. Hero Building 2: Smart Automated Demo Greenhouse (Agriculture Dept)
    const greenhouse = new THREE.Group();
    greenhouse.position.set(-16, 0, 7);

    // Part 1: Concrete base curb
    const ghBase = new THREE.Mesh(new THREE.BoxGeometry(12, 0.6, 8), concreteMat);
    ghBase.position.y = 0.3;
    ghBase.receiveShadow = !isSoftwareGl;
    greenhouse.add(ghBase);

    // Part 2: Translucent Arched Poly-roof
    const archGeo = new THREE.CylinderGeometry(4.2, 4.2, 11.6, 16, 1, false, 0, Math.PI);
    const archRoof = new THREE.Mesh(archGeo, glassMat);
    archRoof.position.set(0, 3.4, 0);
    archRoof.rotation.z = Math.PI / 2;
    greenhouse.add(archRoof);

    // Part 3: Steel Frame Trusses (5 ribs)
    for (let z = -3.5; z <= 3.5; z += 1.75) {
      const rib = new THREE.Mesh(
        new THREE.TorusGeometry(4.25, 0.08, 6, 16, Math.PI),
        steelMat
      );
      rib.position.set(0, 3.4, z);
      rib.rotation.y = Math.PI / 2;
      greenhouse.add(rib);
    }

    // Part 4: Internal Hydroponic Raised Planter Beds
    for (let x of [-2.4, 2.4]) {
      const bed = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.5, 6.8),
        registerMat(new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 }))
      );
      bed.position.set(x, 0.6, 0);
      greenhouse.add(bed);

      // Crops inside
      const crops = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.4, 6.4),
        registerMat(new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 }))
      );
      crops.position.set(x, 0.95, 0);
      greenhouse.add(crops);
    }

    // Contact shadow
    const ghShadow = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), shadowMat);
    ghShadow.rotation.x = -Math.PI / 2;
    ghShadow.position.y = 0.02;
    greenhouse.add(ghShadow);

    scene.add(greenhouse);

    // D. Hero Building 3: Veterinary Teaching Unit & Barn (Veterinary Dept)
    const vetUnit = new THREE.Group();
    vetUnit.position.set(16, 0, 7);

    // Part 1: Clinic Floor
    const vetFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.5, 10), concreteMat);
    vetFloor.position.y = 0.25;
    vetUnit.add(vetFloor);

    // Part 2: Barn Timber Siding
    const barnWalls = new THREE.Mesh(
      new THREE.BoxGeometry(10.5, 4.2, 8.5),
      registerMat(
        new THREE.MeshStandardMaterial({
          color: 0x854d0e,
          roughness: 0.75,
        })
      )
    );
    barnWalls.position.y = 2.4;
    barnWalls.castShadow = !isSoftwareGl;
    vetUnit.add(barnWalls);

    // Part 3: Pitched Gabled Corrugated Roof
    const gableRoofGeo = new THREE.ConeGeometry(7.2, 2.5, 4);
    const gableRoof = new THREE.Mesh(gableRoofGeo, darkRoofMat);
    gableRoof.position.y = 5.6;
    gableRoof.rotation.y = Math.PI / 4;
    gableRoof.scale.set(1.1, 1, 0.85);
    gableRoof.castShadow = !isSoftwareGl;
    vetUnit.add(gableRoof);

    // Part 4: Cylindrical Silo with conical top
    const siloBody = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 6.5, 16), steelMat);
    siloBody.position.set(6.8, 3.25, -2);
    siloBody.castShadow = !isSoftwareGl;
    vetUnit.add(siloBody);

    const siloCap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 1.4, 16), steelMat);
    siloCap.position.set(6.8, 7.2, -2);
    vetUnit.add(siloCap);

    // Part 5: Corral Fence Railings
    for (let angle = 0; angle < Math.PI * 1.5; angle += Math.PI / 5) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), steelMat);
      post.position.set(
        Math.cos(angle) * 4.5 - 2,
        0.6,
        Math.sin(angle) * 4.5 + 4
      );
      vetUnit.add(post);
    }

    // Contact shadow
    const vetShadow = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), shadowMat);
    vetShadow.rotation.x = -Math.PI / 2;
    vetShadow.position.y = 0.02;
    vetUnit.add(vetShadow);

    scene.add(vetUnit);

    // E. Telemetry Mast & Rotating Wind Anemometer (IoT Weather Station)
    const tower = new THREE.Group();
    tower.position.set(-8, 0, -16);

    const towerLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.4, 14, 4), steelMat);
    towerLegs.position.y = 7;
    tower.add(towerLegs);

    const windBlades = new THREE.Group();
    windBlades.position.y = 14;
    for (let b = 0; b < 3; b++) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.05), goldAccentMat);
      arm.rotation.z = (b * Math.PI * 2) / 3;
      arm.position.x = Math.cos(arm.rotation.z) * 1.2;
      arm.position.y = Math.sin(arm.rotation.z) * 1.2;
      windBlades.add(arm);
    }
    tower.add(windBlades);
    windmillBladeRef.current = windBlades;

    scene.add(tower);

    // F. Low-Poly Trees Around Campus Perimeter
    const treePositions: [number, number][] = [
      [-22, -10],
      [-18, -20],
      [-5, -22],
      [12, -20],
      [22, -12],
      [24, 0],
      [22, 16],
      [-24, 14],
      [-8, 18],
      [6, 18],
    ];

    treePositions.forEach(([x, z], idx) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.35, 2.2, 6),
        registerMat(new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 }))
      );
      trunk.position.y = 1.1;
      trunk.castShadow = !isSoftwareGl;
      tree.add(trunk);

      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(1.6 + (idx % 3) * 0.3, 3.8 + (idx % 2) * 0.5, 7),
        foliageMat
      );
      leaves.position.y = 3.6;
      leaves.castShadow = !isSoftwareGl;
      tree.add(leaves);

      scene.add(tree);
    });

    // ==========================================
    // 9. ANIMATION & RENDER LOOP
    // ==========================================
    let frameId = 0;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Animate weather anemometer
      if (windmillBladeRef.current) {
        windmillBladeRef.current.rotation.z += delta * 3.5;
      }

      // Smooth camera transition using damp
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.x = THREE.MathUtils.damp(
          cameraRef.current.position.x,
          targetCamPos.current.x,
          3.0,
          delta
        );
        cameraRef.current.position.y = THREE.MathUtils.damp(
          cameraRef.current.position.y,
          targetCamPos.current.y,
          3.0,
          delta
        );
        cameraRef.current.position.z = THREE.MathUtils.damp(
          cameraRef.current.position.z,
          targetCamPos.current.z,
          3.0,
          delta
        );

        controlsRef.current.target.x = THREE.MathUtils.damp(
          controlsRef.current.target.x,
          targetLookAt.current.x,
          3.0,
          delta
        );
        controlsRef.current.target.y = THREE.MathUtils.damp(
          controlsRef.current.target.y,
          targetLookAt.current.y,
          3.0,
          delta
        );
        controlsRef.current.target.z = THREE.MathUtils.damp(
          controlsRef.current.target.z,
          targetLookAt.current.z,
          3.0,
          delta
        );

        controlsRef.current.update();
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // 10. Responsive resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Preset camera positions
  const setCameraView = (view: 'aerial' | 'tech' | 'greenhouse' | 'vet') => {
    setActivePreset(view);
    switch (view) {
      case 'aerial':
        targetCamPos.current.set(38, 28, 48);
        targetLookAt.current.set(0, 4, 0);
        setSelectedBuildingInfo('EAV Kivumu Virtual Campus: Comprehensive aerial view in Ngororero.');
        break;
      case 'tech':
        targetCamPos.current.set(0, 7, 14);
        targetLookAt.current.set(0, 4, -4);
        setSelectedBuildingInfo('Smart Tech & Bio-Lab Pavilion: Level 3-5 Software Development (SWD), robotics workbench, and administrative offices.');
        break;
      case 'greenhouse':
        targetCamPos.current.set(-16, 5, 20);
        targetLookAt.current.set(-16, 2, 7);
        setSelectedBuildingInfo('Smart Automated Greenhouse: Drip fertigation, precision climate control, and organic horticulture demonstration beds.');
        break;
      case 'vet':
        targetCamPos.current.set(16, 6, 20);
        targetLookAt.current.set(16, 3, 7);
        setSelectedBuildingInfo('Veterinary Clinical Unit: Animal diagnosis rooms, feed silage storage, and practical livestock handling paddocks.');
        break;
    }
  };

  // Adjust time of day & lighting
  const updateLighting = (mode: 'day' | 'sunset' | 'night') => {
    setLightingMode(mode);
    const scene = sceneRef.current;
    const dir = dirLightRef.current;
    const hemi = hemiLightRef.current;
    if (!scene || !dir || !hemi) return;

    if (mode === 'day') {
      scene.background = new THREE.Color(0xd9ebf5);
      scene.fog = new THREE.FogExp2(0xd9ebf5, 0.012);
      dir.color.setHex(0xfffaed);
      dir.intensity = 2.8;
      dir.position.set(35, 45, 25);
      hemi.color.setHex(0xe4f2fb);
      hemi.groundColor.setHex(0x486043);
      hemi.intensity = 1.2;
    } else if (mode === 'sunset') {
      scene.background = new THREE.Color(0xfdba74);
      scene.fog = new THREE.FogExp2(0xfdba74, 0.015);
      dir.color.setHex(0xf97316);
      dir.intensity = 3.5;
      dir.position.set(50, 15, 10);
      hemi.color.setHex(0xfeb272);
      hemi.groundColor.setHex(0x7c2d12);
      hemi.intensity = 1.0;
    } else {
      scene.background = new THREE.Color(0x090d16);
      scene.fog = new THREE.FogExp2(0x090d16, 0.018);
      dir.color.setHex(0x38bdf8);
      dir.intensity = 0.6;
      dir.position.set(20, 30, -20);
      hemi.color.setHex(0x1e293b);
      hemi.groundColor.setHex(0x020617);
      hemi.intensity = 0.5;
    }
  };

  // Toggle wireframe mode across materials
  const toggleWireframe = () => {
    const next = !wireframe;
    setWireframe(next);
    allMaterialsRef.current.forEach((m) => {
      if ('wireframe' in m) {
        (m as THREE.MeshStandardMaterial).wireframe = next;
      }
    });
  };

  return (
    <div className="relative w-full h-[600px] sm:h-[680px] bg-slate-950 overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Scene Title Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white shadow-xl max-w-sm backdrop-blur-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Three.js 3D Virtual Campus
            </h4>
          </div>
          <p className="text-xs text-slate-300 font-semibold mt-1">
            EAV Kivumu Smart School • Ngororero, Rwanda
          </p>
          <div className="mt-2 text-[11px] text-slate-400 leading-snug flex items-start gap-1.5 border-t border-slate-800 pt-1.5">
            <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
            <span>{selectedBuildingInfo}</span>
          </div>
        </div>
      </div>

      {/* Top Right: Full-screen or close action */}
      {onClose && (
        <div className="absolute top-4 right-4 z-10 pointer-events-auto">
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 shadow-lg"
            aria-label="Close 3D View"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Center: Collapsible 3D Control Dock */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-[840px] pointer-events-auto transition-transform duration-300">
        {/* Toggle Bar */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="px-3.5 py-1 rounded-t-xl bg-slate-900 text-slate-300 hover:text-white text-[11px] font-mono font-bold border-t border-x border-slate-700 shadow flex items-center gap-1.5"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hide 3D Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Surface (Solid slate-900, zero backdrop-filter for 60fps) */}
        {!hudCollapsed && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Camera Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  View:
                </span>
                <button
                  onClick={() => setCameraView('aerial')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                    activePreset === 'aerial'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Aerial Overview
                </button>
                <button
                  onClick={() => setCameraView('tech')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                    activePreset === 'tech'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Tech Pavilion
                </button>
                <button
                  onClick={() => setCameraView('greenhouse')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                    activePreset === 'greenhouse'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Smart Greenhouse
                </button>
                <button
                  onClick={() => setCameraView('vet')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                    activePreset === 'vet'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Vet Clinic
                </button>
              </div>

              {/* Lighting / Time of Day */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">
                  Sun/Atmosphere:
                </span>
                <button
                  onClick={() => updateLighting('day')}
                  className={`p-1.5 rounded-lg transition ${
                    lightingMode === 'day'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Daylight"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateLighting('sunset')}
                  className={`p-1.5 rounded-lg transition ${
                    lightingMode === 'sunset'
                      ? 'bg-orange-500 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Golden Hour Sunset"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateLighting('night')}
                  className={`p-1.5 rounded-lg transition ${
                    lightingMode === 'night'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Campus Night Glow"
                >
                  <Moon className="w-4 h-4" />
                </button>

                {/* Wireframe toggle */}
                <button
                  onClick={toggleWireframe}
                  className={`ml-2 px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition border ${
                    wireframe
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 inline mr-1" />
                  {wireframe ? 'Wireframe ON' : 'PBR Shaded'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
