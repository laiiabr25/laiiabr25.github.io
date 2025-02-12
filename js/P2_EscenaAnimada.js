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
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let cameraControls, effectController;
let pentagono, cubo, esfera, cilindro, cono, torus;
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
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    const geoCubo = new THREE.BoxGeometry(2, 2, 2);
    const geoEsfera = new THREE.SphereGeometry(1, 20, 20);
    const geoCilindro = new THREE.CylinderGeometry(1, 1, 2, 20)
    const geoCono = new THREE.ConeGeometry(1, 2, 20);
    const geoTorus = new THREE.TorusGeometry(1, 0.4, 16, 100);

    cubo = new THREE.Mesh(geoCubo, material);
    esfera = new THREE.Mesh(geoEsfera, material);
    cilindro = new THREE.Mesh(geoCilindro, material);
    cono = new THREE.Mesh(geoCono, material);
    torus = new THREE.Mesh(geoTorus, material);

    const loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json', 
        function(objeto) {
            const soldado = new THREE.Object3D();
            soldado.add(objeto);
            cubo.add(soldado);
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
            esfera.add(gltf.scene);
        },
        undefined,
        function(error) {
            console.error(error);
        }
    );

    pentagono = new THREE.Object3D();
    pentagono.position.y = 1.5;
    
    cubo.position.set(-2, 0, 0);
    esfera.position.set(2, 0, 0);
    cilindro.position.set(0, 0, -2);
    cono.position.set(0, 0, 2);
    torus.position.set(0, 0, 0);

    cubo.add(new THREE.AxesHelper(1));

    scene.add(pentagono);
    pentagono.add(cubo);
    pentagono.add(esfera);
    pentagono.add(cilindro);
    pentagono.add(cono);
    pentagono.add(torus);
    
    scene.add(new THREE.AxesHelper(3));
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

    // Definición de los controles
    effectController = {
        animar: function() { animarObjetos(); },
        radioPentagono: 2,
        alambres: true
    };

    // Creación de la interfaz
    const gui = new GUI();

    // Construcción del menú
    const h = gui.addFolder("Menú de control");
    h.add(effectController, "animar").name("Disparar animación");
    h.add(effectController, "radioPentagono", 1, 5, 0.1).name("Radio Pentágono").onChange(updatePentagono);
    h.add(effectController, "alambres").name("Modo alámbrico").onChange(updateMaterial)
}

function updatePentagono()
{
    const r = effectController.radioPentagono;

    cubo.position.set(-r, 0, 0);
    esfera.position.set(r, 0, 0);
    cilindro.position.set(0, 0, -r);
    cono.position.set(0, 0, r);
    torus.position.set(-r, 0, -r);
}

function updateMaterial()
{
    const wireframe = effectController.alambres;

    cubo.material.wireframe = wireframe;
    esfera.material.wireframe = wireframe;
    cilindro.material.wireframe = wireframe;
    cono.material.wireframe = wireframe;
    torus.material.wireframe = wireframe;
}

function animarObjetos()
{
    new TWEEN.Tween(cubo.position).to({ y: [3,1] }, 2000).easing(TWEEN.Easing.Bounce.Out).start();
    new TWEEN.Tween(esfera.rotation).to({ y: Math.PI * 2}, 2000).easing(TWEEN.Easing.Quadratic.InOut).start();
    new TWEEN.Tween(cilindro.scale).to({ x: 1.5, y: 1.5, z: 1.5}, 2000).yoyo(true).repeat(1).start();
    new TWEEN.Tween(cono.position).to({ x: 0, z: 0}, 2000).easing(TWEEN.Easing.Elastic.Out).start();
    new TWEEN.Tween(torus.rotation).to({ y: torus.rotation.y + Math.PI * 2}, 2000).easing(TWEEN.Easing.Quadratic.InOut).start();
    const soldado = scene.getObjectByName('soldado');
    new TWEEN.Tween(soldado.position).to({ x: [0,0], y: [3.1], z: [0,0] }, 2000).interpolation(TWEEN.Interpolation.Bezier).easing(TWEEN.Easing.Bounce.Out).start();
    const robot = scene.getObjectByName('robot');
    new TWEEN.Tween(robot.rotation).to({ x: [0,0], y: [Math.PI, -Math.PI/2], z: [0,0] }, 5000).interpolation(TWEEN.Interpolation.Linear).easing(TWEEN.Easing.Exponential.InOut).start();
}

function update()
{
    /*******************
    * TO DO: Actualizar tween
    *******************/
    TWEEN.update();
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}