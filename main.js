import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/OutputPass.js';

let scene, camera, renderer, mesh, analyser, uniforms, bloomComposer;
let mouseX = 0, mouseY = 0;

const params = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    threshold: 0.5,
    strength: 0.4,
    radius: 0.8,
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 8, 14);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('public/track.mp3', function(buffer) {
        sound.setBuffer(buffer);
        window.addEventListener('click', function() {
            sound.play();
        });
    });

    analyser = new THREE.AudioAnalyser(sound, 32);

    uniforms = {
        u_time: { value: 0.0 },
        u_frequency: { value: 0.0 },
        u_red: { value: params.red },
        u_green: { value: params.green },
        u_blue: { value: params.blue },
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        wireframe: true
    });

    const geometry = new THREE.IcosahedronGeometry(4, 30);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);
    bloomComposer.addPass(outputPass);

    setupGUI(bloomPass);

    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
}

function setupGUI(bloomPass) {
    const gui = new dat.GUI();

    const colorsFolder = gui.addFolder('Colors');
    colorsFolder.add(params, 'red', 0, 1).onChange(value => uniforms.u_red.value = Number(value));
    colorsFolder.add(params, 'green', 0, 1).onChange(value => uniforms.u_green.value = Number(value));
    colorsFolder.add(params, 'blue', 0, 1).onChange(value => uniforms.u_blue.value = Number(value));

    const bloomFolder = gui.addFolder('Bloom');
    bloomFolder.add(params, 'threshold', 0, 1).onChange(value => bloomPass.threshold = Number(value));
    bloomFolder.add(params, 'strength', 0, 3).onChange(value => bloomPass.strength = Number(value));
    bloomFolder.add(params, 'radius', 0, 1).onChange(value => bloomPass.radius = Number(value));
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;
    uniforms.u_time.value = time;
    uniforms.u_frequency.value = analyser.getAverageFrequency();

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    bloomComposer.render();
}

init();
animate();
