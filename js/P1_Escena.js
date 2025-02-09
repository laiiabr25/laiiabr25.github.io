/**
 * Escena.js
 * 
 * Practica AGM #1. Escena basica en three.js
 * Seis objetos organizados en un grafo de escena con
 * transformaciones, animacion basica y modelos importados
 * 
 * @author Laia Benavent Ribelles, 2025
 * 
 */

// Modulos necesarios
/*******************
 * TO DO: Cargar los modulos necesarios
 *******************/
import * as THREE from "../lib/three.module.js"

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let pentagono, objetos = [], angulo = 0

// Acciones
init();
loadScene();
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
    
    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 7);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    // Ajustar el tamaño al cambiar la ventana
    window.addEventListener('resize', updateAspectRatio);
}

function loadScene()
{
    const material = new THREE.MeshNormalMaterial();

    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10,10, 10,10), new THREE.MeshPhongMaterial({ color: 0x888888 }));
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/
    const box = new THREE.BoxGeometry(1, 1, 1);
    const sphere = new THREE.SphereGeometry(0.5, 20, 20);
    const cone = new THREE.ConeGeometry(0.5, 1, 20);
    const cylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 20);
    const torus = new THREE.TorusGeometry(0.5, 0.2, 16, 100);

    const boxpent = new THREE.Mesh(box, material);
    const spherepent = new THREE.Mesh(sphere, material);
    const conepent = new THREE.Mesh(cone, material);
    const cylinderpent = new THREE.Mesh(cylinder, material);
    const toruspent = new THREE.Mesh(torus, material);

    pentagono = new THREE.Object3D();
    
    pentagono.position.y = 1.5;
    boxpent.position.x = -1;
    spherepent.position.x = -1;
    conepent.position.x = -1;
    cylinderpent.position.x = -1;
    toruspent.position.x = -1;

    scene.add(pentagono);
    pentagono.add(boxpent);
    pentagono.add(spherepent);
    pentagono.add(conepent);
    pentagono.add(cylinderpent);
    pentagono.add(toruspent);

    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    const loader = new THREE.ObjectLoader();
    loader.load("models/soldado/soldado.json",
        function(objeto) {
            objeto.position.set(0, 0, 0);
            objeto.scale.set(0.8, 0.8, 0.8);
            pentagono.add(objeto);
        }
    );

    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    scene.add(new THREE.AxesHelper(3));
}

function update()
{
    /*******************
    * TO DO: Modificar el angulo de giro de cada objeto sobre si mismo
    * y del conjunto pentagonal sobre el objeto importado
    *******************/
    angulo += 0.01;

    // Rotación individual de cada objeto
    objetos.forEach(obj => {
        obj.rotation.y += angulo;
    });
    
    // Rotación del conjunto del pentágono
    pentagono.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}