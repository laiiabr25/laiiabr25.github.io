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
let esferaCubo;
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
    //renderer.setClearColor(new THREE.Color(0x0000AA));
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 7);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    // Ajustar tamaño de ventana
    window.addEventlistener('resize', updateAspectRatio);
}

function loadScene()
{
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    const geoCubo = new THREE.BoxGeometry(2, 2, 2);
    const geoEsfera = new THREE.SphereGeometry(1, 20, 2 );

    const cubo = new THREE.Mesh(geoCubo, material);
    const esfera = new THREE.Mesh(geoEsfera, material);

    // Suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10,10, 10,10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    // Importar un modelo en json
    const loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json', 
        function(objeto){
            cubo.add(objeto);
            objeto.position.y = 1;
        }
    )

    esferaCubo = new THREE.Object3D();
    esferaCubo.position.y = 1.5;
    cubo.position.x = -1;
    esfera.position.x = 1;
    cubo.add(new THREE.AxesHelper(1));

    scene.add(esferaCubo);
    esferaCubo.add(cubo);
    esferaCubo.add(esfera);
 
    scene.add(new THREE.AxesHelper(3));

}

function update()
{
    angulo += 0.01;
    esferaCubo.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
