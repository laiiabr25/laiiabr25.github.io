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
let pentagono;
let angulo = 0;

// Acciones
init();
loadScene();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setClearColor( new THREE.Color(0x0000AA) );
    document.getElementById('container').appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,1000);
    camera.position.set( 0.5, 2, 7 );
    camera.lookAt( new THREE.Vector3(0,1,0) );
}

function loadScene()
{
    const material = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/
    const geoBox = new THREE.BoxGeometry( 1,1,1 );
    const geoSphere = new THREE.SphereGeometry( 0.5,20,20 );
    const geoCone = new THREE.ConeGeometry( 0.5,1,20 );
    const geoCylinder = new THREE.CylinderGeometry( 0.5,0.5,1,20 );
    const geoTorus = new THREE.TorusGeometry( 0.5,0.2,16,100 );

    const box = new THREE.Mesh( geoBox, material );
    const sphere = new THREE.Mesh( geoSphere, material );
    const cone = new THREE.Mesh( geoCone, material );
    const cylinder = new THREE.Mesh( geoCylinder, material );
    const torus = new THREE.Mesh( geoTorus, material );

    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), material );
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    const loader = new THREE.ObjectLoader();
    loader.load( 'models/soldado/soldado.json', 
        function(objeto){
            cubo.add(objeto);
            objeto.position.y = 1;
        }
    )

    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    pentagono = new THREE.Object3D();
    pentagono.position.y = 1.5;
    box.position.x = -1;
    sphere.position.x = -0.5;
    cone.position.x = 0;
    cylinder.position.x = 0.5;
    torus.position.x = 1;
    box.add( new THREE.AxesHelper(1) );

    scene.add( pentagono );
    pentagono.add( box );
    pentagono.add( sphere );
    pentagono.add( cone );
    pentagono.add( cylinder );
    pentagono.add( torus );

    scene.add( new THREE.AxesHelper(3) );

}

function update()
{
    /*******************
    * TO DO: Modificar el angulo de giro de cada objeto sobre si mismo
    * y del conjunto pentagonal sobre el objeto importado
    *******************/
    angulo += 0.01;
    pentagono.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}
