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
import * as THREE from "../lib/three.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
let pentagono, cubo, esfera, esfera2, cono, torus, objetoImportado;
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

    const geoCubo = new THREE.BoxGeometry(2, 2, 2);
    const geoEsfera = new THREE.SphereGeometry(1, 20, 20);
    const geoEsfera2 = new THREE.SphereGeometry(2, 20, 20);
    const geoCono = new THREE.ConeGeometry(1, 2, 20);
    const geoTorus = new THREE.TorusGeometry(1, 0.4, 16, 100);

    cubo = new THREE.Mesh(geoCubo, material);
    esfera = new THREE.Mesh(geoEsfera, material);
    esfera2 = new THREE.Mesh(geoEsfera2, material);
    cono = new THREE.Mesh(geoCono, material);
    torus = new THREE.Mesh(geoTorus, material);

    // Suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    // Importar un modelo en json
    const loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json', 
        function(objeto){
            cubo.add(objeto);
            objeto.position.y = 1;
            objetoImportado = objeto;
        }
    );

    pentagono = new THREE.Object3D();
    pentagono.position.y = 1.5;
    
    // Posicionar los objetos
    cubo.position.set(-2, 0, 0);
    esfera.position.set(2, 0, 0);
    esfera2.position.set(0, 0, -2);
    cono.position.set(0, 0, 2);
    torus.position.set(-2, 0, -2);

    // Agregar ejes de referencia
    cubo.add(new THREE.AxesHelper(1));

    scene.add(pentagono);
    pentagono.add(cubo);
    pentagono.add(esfera);
    pentagono.add(esfera2);
    pentagono.add(cono);
    pentagono.add(torus);
    
    scene.add(new THREE.AxesHelper(3));
}

function update()
{
    angulo += 0.01;
    
    // Rotar cada objeto sobre sí mismo
    cubo.rotation.y += angulo;
    esfera.rotation.y += angulo;
    esfera2.rotation.y += angulo;
    cono.rotation.y += angulo;
    torus.rotation.y += angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
