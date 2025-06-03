import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";

let renderer, scene, camera;

init();
loadScene();
render();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.8, 0.8, 0.8);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    scene.add(new THREE.AxesHelper(5));

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function loadScene() {
    escenario = new THREE.Object3D();
    scene.add(escenario);

    const instrumentos = ['bateria', 'clarinete', 'clave', 'flauta', 'guitarra', 'marimba', 'piano', 'saxo', 'trombon', 'trompa', 'trompeta', 'violin'];

    const loader = new GLTFLoader();
    const spacing = 4;
    let fila = 0;
    let columna = 0;
    const maxColumnas = 4;

    instrumentos.forEach((nombre, index) => {
        loader.load(`../models/instrumentos/${nombre}/scene.gltf`, gltf => {
            const instrumento = gltf.scene;
            
            // Centrado y escalado uniforme
            const bbox = new THREE.Box3().setFromObject(instrumento);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            instrumento.position.sub(center); // Centrar

            const scaleFactor = 2 / size.y; // Alto normalizado a 2 unidades
            instrumento.scale.setScalar(scaleFactor);

            // Posición en cuadrícula
            columna = index % maxColumnas;
            fila = Math.floor(index / maxColumnas);
            const offsetX = (columna - (maxColumnas - 1) / 2) * spacing;
            const offsetZ = fila * -spacing;

            const wrapper = new THREE.Object3D();
            wrapper.add(instrumento);
            wrapper.position.set(offsetX, 0, offsetZ);

            escenario.add(wrapper);
        });
    });
}

function update() {
    // Preparado para animaciones futuras
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}