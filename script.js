/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Three.js Setup for Crystal Shard Particles ---
    const canvas = document.querySelector('#bg-canvas');
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization

    // Lighting to make shards look 3D and premium
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Dim ambient
    scene.add(ambientLight);

    const redPointLight = new THREE.PointLight(0xff003c, 2, 50);
    redPointLight.position.set(0, 0, 10);
    scene.add(redPointLight);

    const bluePointLight = new THREE.PointLight(0x002255, 1, 60);
    bluePointLight.position.set(-20, 10, -10);
    scene.add(bluePointLight);

    // Particle Group
    const particles = new THREE.Group();
    scene.add(particles);

    // Create Shard Geometry (Octahedron looks like a crystal)
    const geometry = new THREE.OctahedronGeometry(1, 0); 
    
    // Premium Material setup
    const material = new THREE.MeshStandardMaterial({
        color: 0x8a0020,        // Dark red base
        emissive: 0x330000,     // Slight red glow
        roughness: 0.2,         // Shiny
        metalness: 0.8,         // Metallic look
        wireframe: false,
        transparent: true,
        opacity: 0.8
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff003c,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    // Generate Shards
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random positions within a volume
        mesh.position.x = (Math.random() - 0.5) * 80;
        mesh.position.y = (Math.random() - 0.5) * 80;
        mesh.position.z = (Math.random() - 0.5) * 40 - 10;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Random scaling for varied shard sizes
        const scale = Math.random() * 0.8 + 0.2;
        
        // Elongate some crystals to match the character design
        mesh.scale.set(scale, scale * (Math.random() * 2 + 1), scale);

        // Add wireframe overlay to some shards for tech aesthetic
        if(Math.random() > 0.7) {
            const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
            wireframe.scale.copy(mesh.scale);
            wireframe.scale.multiplyScalar(1.05); // slightly larger
            mesh.add(wireframe);
        }

        // Store custom data for animation logic
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.005
        };

        particles.add(mesh);
    }

    // --- Mouse Interaction & Parallax Logic ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const domParallaxWrapper = document.getElementById('parallax-wrapper');

    document.addEventListener('mousemove', (event) => {
        // Normalized coordinates from -1 to 1
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // 1. Smoothly interpolate target values for fluid parallax
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // 2. Animate Three.js Scene Parallax
        particles.rotation.y += 0.02 * (targetX - particles.rotation.y);
        particles.rotation.x += 0.02 * (targetY - particles.rotation.x);
        
        // Move red light slightly with mouse
        redPointLight.position.x += 0.05 * ((mouseX * 20) - redPointLight.position.x);
        redPointLight.position.y += 0.05 * (-(mouseY * 20) - redPointLight.position.y);

        // 3. Animate Individual Particles (Floating and Rotating)
        particles.children.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;

            // Float upwards
            mesh.position.y += mesh.userData.floatSpeed;

            // Reset position if they float too high
            if (mesh.position.y > 40) {
                mesh.position.y = -40;
                mesh.position.x = (Math.random() - 0.5) * 80;
            }
        });

        // 4. Animate DOM Elements Parallax (The Character Image)
        if(domParallaxWrapper) {
            // Apply subtle transform based on interpolated mouse position
            // CSS handles the constant floating, JS handles mouse tracking
            const translateX = targetX * -30; // Inverse movement for depth
            const translateY = targetY * -30;
            domParallaxWrapper.style.transform = `translateY(-50%) translate(${translateX}px, ${translateY}px)`;
        }

        renderer.render(scene, camera);
    }

    animate();

    // --- Window Resize Handler ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
