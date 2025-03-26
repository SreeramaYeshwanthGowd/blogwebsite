// 3D Space/Galaxy Background Animation with Three.js
import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', function() {
    // Create container for Three.js scene
    let container = document.getElementById('background-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'background-container';
        container.className = 'background-animation';
        document.body.appendChild(container);
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 1000;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Galaxy parameters
    const params = {
        count: 10000,
        size: 0.01,
        radius: 5,
        branches: 5,
        spin: 1,
        randomness: 0.2,
        randomnessPower: 3,
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
        stars: {
            count: 2000,
            size: 0.1,
            color: '#ffffff'
        },
        nebula: {
            count: 300,
            size: 50,
            opacity: 0.05
        }
    };
    
    // Galaxy geometry and material
    let galaxyGeometry = null;
    let galaxyMaterial = null;
    let galaxyPoints = null;
    let starPoints = null;
    let nebulaPoints = null;
    
    // Mouse position for parallax effect
    const mouse = {
        x: 0,
        y: 0
    };
    
    // Create galaxy
    function generateGalaxy() {
        // Dispose of old galaxy if it exists
        if (galaxyPoints !== null) {
            galaxyGeometry.dispose();
            galaxyMaterial.dispose();
            scene.remove(galaxyPoints);
            scene.remove(starPoints);
            scene.remove(nebulaPoints);
        }
        
        // Galaxy geometry
        galaxyGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(params.count * 3);
        const colors = new Float32Array(params.count * 3);
        
        // Colors
        const insideColor = new THREE.Color(params.insideColor);
        const outsideColor = new THREE.Color(params.outsideColor);
        
        // Generate galaxy points
        for (let i = 0; i < params.count; i++) {
            const i3 = i * 3;
            
            // Position
            const radius = Math.random() * params.radius;
            const spinAngle = radius * params.spin;
            const branchAngle = (i % params.branches) / params.branches * Math.PI * 2;
            
            const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
            const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
            const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
            
            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
            
            // Color
            const mixedColor = insideColor.clone();
            mixedColor.lerp(outsideColor, radius / params.radius);
            
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }
        
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Material
        galaxyMaterial = new THREE.PointsMaterial({
            size: params.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        // Points
        galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
        scene.add(galaxyPoints);
        
        // Create stars
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(params.stars.count * 3);
        
        for (let i = 0; i < params.stars.count; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 2000;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: params.stars.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            color: params.stars.color,
            transparent: true,
            opacity: 0.8
        });
        
        starPoints = new THREE.Points(starGeometry, starMaterial);
        scene.add(starPoints);
        
        // Create nebula clouds
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaPositions = new Float32Array(params.nebula.count * 3);
        const nebulaSizes = new Float32Array(params.nebula.count);
        const nebulaColors = new Float32Array(params.nebula.count * 3);
        
        const nebulaColorOptions = [
            new THREE.Color('#4da3ff'), // Blue
            new THREE.Color('#ff4088'), // Pink
            new THREE.Color('#6c63ff'), // Purple
            new THREE.Color('#2ecc71')  // Green
        ];
        
        for (let i = 0; i < params.nebula.count; i++) {
            nebulaPositions[i * 3] = (Math.random() - 0.5) * 1000;
            nebulaPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
            nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
            
            nebulaSizes[i] = Math.random() * params.nebula.size + 10;
            
            const colorIndex = Math.floor(Math.random() * nebulaColorOptions.length);
            const color = nebulaColorOptions[colorIndex];
            
            nebulaColors[i * 3] = color.r;
            nebulaColors[i * 3 + 1] = color.g;
            nebulaColors[i * 3 + 2] = color.b;
        }
        
        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
        nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
        
        const nebulaShader = {
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float r = 0.0;
                    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                    r = dot(cxy, cxy);
                    if (r > 1.0) {
                        discard;
                    }
                    gl_FragColor = vec4(vColor, 1.0 - r);
                }
            `
        };
        
        const nebulaMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: nebulaShader.vertexShader,
            fragmentShader: nebulaShader.fragmentShader,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });
        
        nebulaPoints = new THREE.Points(nebulaGeometry, nebulaMaterial);
        nebulaPoints.material.opacity = params.nebula.opacity;
        scene.add(nebulaPoints);
    }
    
    generateGalaxy();
    
    // Track mouse movement for parallax effect
    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Track scroll position for depth effect
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate galaxy
        if (galaxyPoints) {
            galaxyPoints.rotation.y = elapsedTime * 0.05;
            
            // Parallax effect based on mouse position
            galaxyPoints.rotation.x = mouse.y * 0.2;
            galaxyPoints.rotation.z = mouse.x * 0.2;
            
            // Depth effect based on scroll
            galaxyPoints.position.z = -scrollY * 0.1;
        }
        
        // Animate stars
        if (starPoints) {
            starPoints.rotation.y = elapsedTime * 0.02;
            starPoints.rotation.x = mouse.y * 0.1;
            starPoints.rotation.z = mouse.x * 0.1;
        }
        
        // Animate nebula
        if (nebulaPoints) {
            nebulaPoints.rotation.y = elapsedTime * 0.01;
            nebulaPoints.material.opacity = params.nebula.opacity + Math.sin(elapsedTime * 0.2) * 0.01;
        }
        
        // Render
        renderer.render(scene, camera);
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Add transition effect when page loads
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});
