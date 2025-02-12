/**
 * EscenaAnimada.js
 * 
 * Practica AGM #2. Escena basica con interfaz y animacion
 * Se trata de añadir un interfaz de usuario que permita 
 * disparar animaciones sobre los objetos de la escena con Tween
 * 
 * @author Laia Benavent Ribelles, 2025
 * 
 */

// Modulos necesarios
/*******************
 * TO DO: Cargar los modulos necesarios
 *******************/
import * as THREE from "../lib/three.module.js"
import {GLTFLoader} from "../lib/GLTFLoader.module.js"
import {OrbitControls} from "../lib/OrbitControls.module.js"

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let cameraControls;
let pentagono;
let angulo = 0;

// Acciones
init();
loadScene();
loadGUI();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    /*******************
    * TO DO: Completar el motor de render y el canvas
    *******************/
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 10);
    /*******************
    * TO DO: Añadir manejador de camara (OrbitControls)
    *******************/
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
}

function loadScene()
{
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    /*******************
    * TO DO: Misma escena que en la practica anterior
    *******************/
    // Suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    // Figuras
    const geoCubo = new THREE.BoxGeometry(2, 2, 2);
    const geoEsfera = new THREE.SphereGeometry(1, 20, 20);
    const geoCilindro = new THREE.CylinderGeometry(1, 1, 2, 20)
    const geoCono = new THREE.ConeGeometry(1, 2, 20);

    const cubo = new THREE.Mesh(geoCubo, material);
    const esfera = new THREE.Mesh(geoEsfera, material);
    const cilindro = new THREE.Mesh(geoCilindro, material);
    const cono = new THREE.Mesh(geoCono, material);

    pentagono = new THREE.Object3D();
    pentagono.position.y = 1.5;

    cubo.position.set(-2, 0, 0);
    esfera.position.set(2, 0, 0);
    cilindro.position.set(0, 0, -2);
    cono.position.set(0, 0, 2);

    scene.add(pentagono);
    pentagono.add(cubo);
    pentagono.add(esfera);
    pentagono.add(cilindro);
    pentagono.add(cono);

    // Ejes
    cubo.add(new THREE.AxesHelper(1));
    scene.add(new THREE.AxesHelper(3));

    // Soldado y robot
    const loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json',
        function(objeto) {
            const soldado = new THREE.Object3D();
            soldado.add(objeto);
            cubo.add(objeto);
            soldado.position.y = 1;
            soldado.name = 'soldado';
        }
    );

    const glloader = new GLTFLoader();
    glloader.load('models/robota/scene.gltf',
        function(gltf) {
            gltf.scene.position.y = 1;
            gltf.scene.rotation.y = -Math.PI/2;
            gltf.scene.name = 'robot';
            esfera.add(gltf.scene)
        }, undefined, function(error) {
            console.error(error);
        }
    );
}

function loadGUI()
{
    // Interfaz de usuario
    /*******************
    * TO DO: Crear la interfaz de usuario con la libreria lil-gui.js
    * - Funcion de disparo de animaciones. Las animaciones deben ir
    *   encadenadas
    * - Slider de control de radio del pentagono
    * - Checkbox para alambrico/solido
    *******************/
}

function update()
{
    /*******************
    * TO DO: Actualizar tween
    *******************/
    angulo += 0.01;
    pentagono.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}