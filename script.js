// Custom Cursor Logic
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

// Only enable custom cursor if not on a touch device
if(window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth follow for outline using simple math or direct translate
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add Hover Effects
    const interactables = document.querySelectorAll('a, .btn, .portfolio-box, .cert-box, .social-media a, .social-media i');
    
    interactables.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursorDot.classList.add("hovering");
            cursorOutline.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
            cursorDot.classList.remove("hovering");
            cursorOutline.classList.remove("hovering");
        });
    });
}

// Mobile Navbar Toggle
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.querySelector('i').classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
};

// Scroll Sections Active Link & Sticky Header
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');
const header = document.querySelector('header');

window.onscroll = () => {
    let top = window.scrollY;

    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });

    // Sticky header
    header.classList.toggle('sticky', top > 100);

    // Remove toggle icon and navbar when click navbar link (scroll)
    menuIcon.querySelector('i').classList.remove('fa-xmark');
    navbar.classList.remove('active');
};

// Intersection Observer for Reveal Animations
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
            // Un-comment below to trigger animation only once
            // observer.unobserve(entry.target);
        } else {
            // Remove to allow repeat animation on scroll up
            entry.target.classList.remove('active');
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Typed.js Effect
const typed = new Typed('.multiple-text', {
    strings: ['Cybersecurity Enthusiast'],
    typeSpeed: 70,
    backSpeed: 50,
    backDelay: 1500,
    loop: true
});

// ==================================
// THREE.JS 3D BACKGROUND
// ==================================
const canvasContainer = document.getElementById("canvas-container");

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0B0D06, 0.035); // Deep space fog matching dark theme

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

const coreGroup = new THREE.Group();
scene.add(coreGroup);

// 1. Cyber Geo-Sphere (Digital Core)
const solidGeo = new THREE.IcosahedronGeometry(7, 2);
const solidMat = new THREE.MeshBasicMaterial({ color: 0x0B0D06 }); 
const solidSphere = new THREE.Mesh(solidGeo, solidMat);
coreGroup.add(solidSphere);

const shellGeo = new THREE.IcosahedronGeometry(7.2, 2);
const shellMat = new THREE.MeshBasicMaterial({
    color: 0xB89B6F,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const cyberShell = new THREE.Mesh(shellGeo, shellMat);
coreGroup.add(cyberShell);

const auraGeo = new THREE.IcosahedronGeometry(8.5, 4);
const auraMat = new THREE.PointsMaterial({
    color: 0xE2D288,
    size: 0.08,
    transparent: true,
    opacity: 0.8
});
const auraPoints = new THREE.Points(auraGeo, auraMat);
coreGroup.add(auraPoints);

// 2. Moving Digital Terrain (Interactive Wavy Grid)
const planeGeo = new THREE.PlaneGeometry(150, 150, 45, 45);
const planeMat = new THREE.MeshBasicMaterial({
    color: 0xB89B6F,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const terrain = new THREE.Mesh(planeGeo, planeMat);
terrain.rotation.x = -Math.PI / 2;
terrain.position.y = -8;
scene.add(terrain);

const terrainPositions = terrain.geometry.attributes.position;

// 3. Stardust Background
const starGeo = new THREE.BufferGeometry();
const starCount = 1500;
const starPosArray = new Float32Array(starCount * 3);
for(let i = 0; i < starCount * 3; i++) {
    starPosArray[i] = (Math.random() - 0.5) * 150;     // x
    starPosArray[i+1] = (Math.random() - 0.5) * 150;   // y
    starPosArray[i+2] = (Math.random() - 0.5) * 150;   // z
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPosArray, 3));
const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    transparent: true,
    opacity: 0.3
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Mouse Interaction variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    // Parallax sensitivity
    mouseX = (event.clientX - windowHalfX) * 0.003;
    mouseY = (event.clientY - windowHalfY) * 0.003;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate core complex
    coreGroup.rotation.y = elapsedTime * 0.15;
    coreGroup.rotation.x = elapsedTime * 0.05;
    
    // Pulse aura points
    const scale = 1 + Math.sin(elapsedTime * 2) * 0.04;
    auraPoints.scale.set(scale, scale, scale);

    // Dynamic Wavy Terrain
    for (let i = 0; i < terrainPositions.count; i++) {
        const x = terrainPositions.getX(i);
        const y = terrainPositions.getY(i);
        // Sine wave moving over time 
        const wave = Math.sin(x * 0.2 + elapsedTime) * Math.cos(y * 0.2 + elapsedTime * 1.5) * 1.5;
        terrainPositions.setZ(i, wave);
    }
    terrainPositions.needsUpdate = true;

    // Stars subtle rotation
    stars.rotation.y = elapsedTime * 0.02;

    // Smooth Camera Parallax Shift based on mouse
    targetX = mouseX * 2.5;
    targetY = mouseY * 2.5;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y + 5) * 0.05; 
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==================================
// VANILLA TILT 3D CARDS
// ==================================
VanillaTilt.init(document.querySelectorAll(".portfolio-box, .cert-box, .grid-card, .resume-img-container"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    scale: 1.05
});

