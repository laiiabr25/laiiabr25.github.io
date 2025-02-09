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
import * as THREE from "../lib/three.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let pentagono, cubo, esfera, cilindro, cono, torus;
let angulo = 0;

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
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 10);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
}

function loadScene()
{
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/    
    const geoCubo = new THREE.BoxGeometry(2, 2, 2);
    const geoEsfera = new THREE.SphereGeometry(1, 20, 20);
    const geoCilindro = new THREE.CylinderGeometry(1, 1, 2, 5)
    const geoCono = new THREE.ConeGeometry(1, 2, 20);
    const geoTorus = new THREE.TorusGeometry(1, 0.4, 16, 100);

    cubo = new THREE.Mesh(geoCubo, material);
    esfera = new THREE.Mesh(geoEsfera, material);
    cilindro = new THREE.Mesh(geoCilindro, material);
    cono = new THREE.Mesh(geoCono, material);
    torus = new THREE.Mesh(geoTorus, material);

    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    const loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json', 
        function(objeto){
            cubo.add(objeto);
            objeto.position.y = 1;
        }
    );

    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    pentagono = new THREE.Object3D();
    pentagono.position.y = 1.5;
    
    cubo.position.set(-2, 0, 0);
    esfera.position.set(2, 0, 0);
    cilindro.position.set(0, -2, 0);
    cono.position.set(0, 0, 2);
    torus.position.set(-2, 0, -2);

    cubo.add(new THREE.AxesHelper(1));

    scene.add(pentagono);
    pentagono.add(cubo);
    pentagono.add(esfera);
    pentagono.add(cilindro);
    pentagono.add(cono);
    pentagono.add(torus);
    
    scene.add(new THREE.AxesHelper(3));
}

function update()
{
    /*******************
    * TO DO: Modificar el angulo de giro de cada objeto sobre si mismo
    * y del conjunto pentagonal sobre el objeto importado
    *******************/
    angulo += 0.01;
    pentagono.rotation.y = angulo;
    cubo.rotacion.y = angulo;
    esfera.rotacion.y = angulo;
    cilindro.rotacion.y = angulo;
    cono.rotacion.y = angulo;
    torus.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
