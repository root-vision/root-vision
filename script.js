import * as THREE from 'three';

// --------------------------------------------------------
// 1. SCENE SETUP & ATMOSPHERE
// --------------------------------------------------------
const container = document.getElementById('canvas-container');
const bgText = document.getElementById('bg-text');

const scene = new THREE.Scene();
// Deep black fog, exponential to hide objects mathematically in the distance
scene.fog = new THREE.FogExp2(0x000000, 0.06);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --------------------------------------------------------
// 2. LIGHTING (The Cold Gray / Deep Red Matrix)
// --------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0x0a0a0a); // Abyssal Gray
scene.add(ambientLight);

// Primary sharp directional light (Cold Edge Light)
const dirLight = new THREE.DirectionalLight(0x8c8c8c, 3.5);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// Internal entity arterial glow
const coreLight = new THREE.PointLight(0x8b0000, 5.0, 10);
coreLight.position.set(0, -1, 2);
scene.add(coreLight);

// --------------------------------------------------------
// 3. THE ENTITY (Procedural Canon Construction)
// --------------------------------------------------------
const entityGroup = new THREE.Group();
scene.add(entityGroup);

// Materials
const armorMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a0000,       // Arterial Red
    roughness: 0.6,
    metalness: 0.8,
    flatShading: true      // Mandatory for the sharp geometric look
});

const voidMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff1a1a });

// A. The Hood (Sharp Pyramid rotated to face forward with a point)
const hoodGeo = new THREE.ConeGeometry(2.2, 4.5, 4);
const hood = new THREE.Mesh(hoodGeo, armorMaterial);
hood.rotation.y = Math.PI / 4; 
hood.position.y = 1.5;
entityGroup.add(hood);

// B. The Facial Void (Black geometry inside the hood)
const faceVoidGeo = new THREE.ConeGeometry(2.0, 4.2, 4);
const faceVoid = new THREE.Mesh(faceVoidGeo, voidMaterial);
faceVoid.rotation.y = Math.PI / 4;
faceVoid.position.set(0, 1.4, 0.1); // Slightly forward to mask the inside
entityGroup.add(faceVoid);

// C. The Optical Signatures (Predatory Eyes)
const eyeGeo = new THREE.PlaneGeometry(0.1, 0.4);
const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
leftEye.position.set(-0.3, 1.2, 1.5);
leftEye.rotation.z = Math.PI / 6; // Angled aggressively
const rightEye = leftEye.clone();
rightEye.position.set(0.3, 1.2, 1.5);
rightEye.rotation.z = -Math.PI / 6;
entityGroup.add(leftEye, rightEye);

// D. The Torso / Shoulders (Procedural Fragmentation)
// Generating a jagged, tectonic shoulder structure using overlapping tetrahedrons
const shoulderPieces = [];
const pieceCount = 15;

for (let i = 0; i < pieceCount; i++) {
    const scale = 1 + Math.random() * 1.5;
    const pieceGeo = new THREE.TetrahedronGeometry(scale, 0);
    const piece = new THREE.Mesh(pieceGeo, armorMaterial);
    
    // Spread them out to form a wide base below the hood
    const xDist = (Math.random() - 0.5) * 6;
    const yDist = -1 - Math.random() * 3;
    const zDist = (Math.random() - 0.5) * 2;
    
    piece.position.set(xDist, yDist, zDist);
    piece.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    
    entityGroup.add(piece);
    shoulderPieces.push({
        mesh: piece,
        baseY: yDist,
        phase: Math.random() * Math.PI * 2
    });
}

// --------------------------------------------------------
// 4. FLOATING GLASS SHARDS (InstancedMesh for Performance)
// --------------------------------------------------------
const shardCount = 250;
const shardGeo = new THREE.TetrahedronGeometry(0.4, 0);
// Stretch the tetrahedron to make it look like a razor-sharp shard
shardGeo.scale(1, 2.5, 0.5); 

const shardMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x220000,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.5,
    flatShading: true
});

const shardMesh = new THREE.InstancedMesh(shardGeo, shardMaterial, shardCount);
const dummy = new THREE.Object3D();
const shardData = [];

for (let i = 0; i < shardCount; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20 - 5; // Push some into the fog
    
    dummy.position.set(x, y, z);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    
    // Scale randomization
    const s = 0.2 + Math.random() * 0.8;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    shardMesh.setMatrixAt(i, dummy.matrix);

    // Store unique rotation and float speeds
    shardData.push({
        x: x, y: y, z: z,
        rxSpeed: (Math.random() - 0.5) * 0.01,
        rySpeed: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.002 + Math.random() * 0.005,
        phase: Math.random() * Math.PI * 2,
        scale: s
    });
}
scene.add(shardMesh);

// --------------------------------------------------------
// 5. VOLUMETRIC FOG PARTICLES
// --------------------------------------------------------
const fogGeo = new THREE.BufferGeometry();
const fogCount = 400;
const fogPositions = new Float32Array(fogCount * 3);

for(let i = 0; i < fogCount * 3; i++) {
    fogPositions[i] = (Math.random() - 0.5) * 40;
}
fogGeo.setAttribute('position', new THREE.BufferAttribute(fogPositions, 3));

// Generate a procedural soft radial gradient for the fog texture
const canvas = document.createElement('canvas');
canvas.width = 64; canvas.height = 64;
const ctx = canvas.getContext('2d');
const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
gradient.addColorStop(0, 'rgba(30, 0, 0, 0.8)'); // Deep red core
gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 64, 64);
const fogTexture = new THREE.CanvasTexture(canvas);

const fogMaterial = new THREE.PointsMaterial({
    size: 8,
    map: fogTexture,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const fogParticles = new THREE.Points(fogGeo, fogMaterial);
scene.add(fogParticles);

// --------------------------------------------------------
// 6. INTERACTION & PARALLAX MATH
// --------------------------------------------------------
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates (-1 to 1)
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
});

// --------------------------------------------------------
// 7. THE MASTER RENDER LOOP
// --------------------------------------------------------
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // A. Delayed Mouse Interpolation (The Heavy Parallax)
    // Using 0.015 ensures the movement feels slow, large, and predatory
    targetX += (mouseX - targetX) * 0.015;
    targetY += (mouseY - targetY) * 0.015;

    camera.position.x = targetX * 3;
    camera.position.y = -targetY * 1.5;
    camera.lookAt(scene.position);

    // Parallax on DOM background text
    bgText.style.transform = `translate(-50%, -50%) translate(${-targetX * 20}px, ${-targetY * 10}px)`;

    // B. Entity Procedural Breathing
    // The geometry expands and contracts imperceptibly
    const breath = Math.sin(elapsedTime * 1.2);
    entityGroup.position.y = breath * 0.05;
    
    // The entity slowly turns its head to watch the cursor
    entityGroup.rotation.y = targetX * 0.4;
    entityGroup.rotation.x = -targetY * 0.2;

    // Shoulder pieces slide organically (tectonic breathing)
    shoulderPieces.forEach(p => {
        p.mesh.position.y = p.baseY + Math.sin(elapsedTime * 1.0 + p.phase) * 0.1;
    });

    // C. Glass Shard Physics
    for (let i = 0; i < shardCount; i++) {
        const data = shardData[i];
        
        // Slow continuous rotation
        dummy.position.set(data.x, data.y, data.z);
        dummy.rotation.x += data.rxSpeed;
        dummy.rotation.y += data.rySpeed;

        // Subtle floating on Y axis
        dummy.position.y += Math.sin(elapsedTime + data.phase) * data.floatSpeed;

        dummy.scale.set(data.scale, data.scale, data.scale);
        dummy.updateMatrix();
        shardMesh.setMatrixAt(i, dummy.matrix);
    }
    shardMesh.instanceMatrix.needsUpdate = true;

    // D. Fog Drift
    const positions = fogParticles.geometry.attributes.position.array;
    for(let i = 0; i < fogCount; i++) {
        const i3 = i * 3;
        positions[i3] -= 0.01; // Drift left
        positions[i3 + 1] += Math.sin(elapsedTime * 0.5 + i) * 0.005; // Slight rise/fall
        // Reset if it drifts too far left
        if(positions[i3] < -20) positions[i3] = 20;
    }
    fogParticles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// --------------------------------------------------------
// 8. RESIZE HANDLING
// --------------------------------------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Ignite Engine
animate();
