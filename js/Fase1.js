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
    camera.position.set(4, 3, 6);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
}

function loadScene() {
    let instrumentGroup = new THREE.Object3D();
    instrumentGroup.position.y = 1;

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 16), new THREE.MeshBasicMaterial({wireframe: true}));
    const soporte = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), new THREE.MeshBasicMaterial({wireframe: true}));
    soporte.position.y = 1;

    instrumentGroup.add(base);
    instrumentGroup.add(soporte);
    scene.add(instrumentGroup);

    const loader = new GLTFLoader();
    loader.load('../models/instrumentos/violin/scene.gltf', gltf => {
        const violin = gltf.scene;
        violin.scale.set(1, 1, 1);
        violin.position.y = 2.5;
        violin.traverse(obj => {
            if (obj.isMesh) obj.material.wireframe = true;
        });
        instrumentGroup.add(violin);
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