// Importar Modulos necesarios
import * as THREE from "../lib/three.module.js";

// Variables globales
let renderer, scene, camera;
let bateria;
let angulo = 0;

// Inicialización
init();
loadScene();
render();

function init() {
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 7);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    // Ajustar tamaño del render al cambiar la ventana
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function loadScene() {
    // Crear el material para los objetos
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    // Construir el suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    // Crear el nodo padre "Batería"
    bateria = new THREE.Object3D();
    bateria.position.y = 1.5;
    scene.add(bateria);

    // Crear el "Bombo"
    const bomboGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    const bombo = new THREE.Mesh(bomboGeometry, material);
    bombo.position.set(0, 1, 0);
    bateria.add(bombo);

    // Crear la "Caja"
    const cajaGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const caja = new THREE.Mesh(cajaGeometry, material);
    caja.position.set(2, 2, 0);
    bateria.add(caja);

    // Crear un "Platillo" con su soporte
    const platilloSoporte = new THREE.Group();
    const soporteGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const soporte = new THREE.Mesh(soporteGeometry, material);
    soporte.position.set(0, 1, 0);
    platilloSoporte.add(soporte);

    const platilloGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const platillo = new THREE.Mesh(platilloGeometry, material);
    platillo.position.set(0, 2, 0);
    platilloSoporte.add(platillo);

    platilloSoporte.position.set(-2, 1, 0);
    bateria.add(platilloSoporte);

    // Añadir ejes
    scene.add(new THREE.AxesHelper(3));
}

function update() {
    angulo += 0.01;
    bateria.rotation.y = angulo;
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}