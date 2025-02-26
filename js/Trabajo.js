import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js"

let renderer, scene, camera;
let cameraControls;
let bateria, bombo, caja, tom1, tom2, tomFloor, soporteH, hiHat, soporteC, crash, soporteR, ride;
let angulo = 0;

init();
loadScene();
render();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 10);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function loadScene() {
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    bateria = new THREE.Object3D();
    scene.add(bateria);

    bombo = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2, 32), material);
    bombo.rotation.x = Math.PI / 2;
    bombo.position.set(0, 1, 0);
    bateria.add(bombo);

    caja = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32), material);
    caja.position.set(0, 2.2, -2);
    bateria.add(caja);

    tom1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 32), material);
    tom1.position.set(-1, 2.8, -0.5);
    bateria.add(tom1);
    
    tom2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 32), material);
    tom2.position.set(1, 2.8, -0.5);
    bateria.add(tom2);

    tomFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.7, 32), material);
    tomFloor.position.set(-2, 1.5, -1.5);
    bateria.add(tomFloor);

    soporteH = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 16), material);
    soporteH.position.set(-3, 1, -1.5);
    bateria.add(soporteH);
    
    hiHat = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32), material);
    hiHat.position.set(-3, 2.2, -1.5);
    bateria.add(hiHat);

    soporteC = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 16), material);
    soporteC.position.set(3, 1.5, -1.5);
    bateria.add(soporteC);
    
    crash = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32), material);
    crash.position.set(3, 3.2, -1.5);
    bateria.add(crash);

    soporteR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 16), material);
    soporteR.position.set(2, 1.5, 2);
    bateria.add(soporteR);
    
    ride = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.1, 32), material);
    ride.position.set(2, 3.2, 2);
    bateria.add(ride);

    scene.add(new THREE.AxesHelper(3));
}

function update() {
    angulo += 0.01;
    //bateria.rotation.y = angulo;
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}