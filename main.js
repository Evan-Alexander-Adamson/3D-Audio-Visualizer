import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, mesh, analyser, uniforms, bloomComposer;
let mouseX = 0, mouseY = 0;
let audioContext, source;

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
    renderer.toneMapping = THREE.ReinhardToneMapping;
    document.body.appendChild(renderer.domElement);

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

    bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    setupGUI(bloomPass);

    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Set up audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Set up start button listener
    document.getElementById('startAudio').addEventListener('click', startAudio);

    animate();
}

function startAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
            source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            document.getElementById('startAudio').disabled = true;
        })
        .catch(function(err) {
            console.error('Error accessing microphone:', err);
        });
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
    
    if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        uniforms.u_frequency.value = average;
    }

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    bloomComposer.render();
}

init();
