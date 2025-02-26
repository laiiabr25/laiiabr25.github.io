// Importar Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
let bateria;
let angulo = 0;

// Acciones
init();
loadScene();
render();

// Configuración del motor de render, la escena y la cámara
function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 7);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
}

// Crear los instrumentos e introducirlos en la escena
function loadScene()
{
    // Crear el nodo padre "Batería"
    bateria = new THREE.Group();
    scene.add(bateria);

    // Crear el material para los elementos de la "Batería"
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    // Crear el "Bombo"
    const bomboGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
    const bombo = new THREE.Mesh(bomboGeometry, material)
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

    // Suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI/2;
    scene.add(suelo);

    // Posicionar la cámara
    camera.position.z = 8;
    camera.position.y = 4;
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    // Ajustar el render al cmabiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function update()
{
    angulo += 0.01;
    bateraia.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}