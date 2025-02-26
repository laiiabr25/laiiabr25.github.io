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

    const glloader = new GLTFLoader();
    glloader.load('models/instrumentos/bateria.gltf',
        function(gltf) {
            gltf.scene.position.set(0, 0, 0);
            scene.add(gltf.scene);
            console.log("BATERÍA");
            console.log(gltf);
        }
    );

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