// Importar las librerías necesarias
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js"
import {OrbitControls} from "../lib/OrbitControls.module.js"

// Variables globales para la escena, cámara y renderizado
let renderer, scene, camera;
let cameraControls;
// Variable para ainmar la rotación de los insrumentos
let angulo = 0;
// Variables para guardar el modelo del instrumento
let instrumentoActual = null;
let claveSol = null;
let instrumentoSeleccionado = null;
// Lista de instrumentos disponibles
let listaInstrumentos = [ "bateria", "clarinete", "flauta", "guitarra_acustica", "guitarra_electrica", "marimba", "piano", "saxo", "trombon", "trompa", "trompeta", "violin" ];

// Inicializar la escena, cargar los objetos y comenzar el renderizado
init();
loadScene();
render();

// Función para configurar el renderer, la escena y la cámara
function init() {
    // Configurar el renderer (motor de renderizado)
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Crear la escena y establecer el color de fondo
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Configurar la cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 10);
    camera.lookAt(new THREE.Vector3(0, 1, 0)); // Apuntar al centro de la escena

    // Controles de órbita para mover la cámara con el mouse
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);

    // Evento para ajustar el tamaño del canvas cuando se redimensiona la ventana
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Crear la interfaz de usuario con la lista de instrumentos
    crearListaInstrumentos();
}

// Función para cargar los elementos de la escena
function loadScene() {
    // Material en modo alámbrico (wireframe) para visualizar mejor las geometrías
    const material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });

    // Crear el suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    // Agregar los ejes para la referencia
    scene.add(new THREE.AxesHelper(3));

    // Cargar la clave de sol al inicio
    cargarClaveSol();
}

// Función para cargar la clave de sol
function cargarClaveSol() {
    const loader = new GLTFLoader();

    loader.load(`models/instrumentos/clave/scene.gltf`, function(gltf) {
        claveSol = gltf.scene;
        // Calcular los límites del modelo
        const box = new THREE.Box3().setFromObject(claveSol);
        const center = box.getCenter(new THREE.Vector3());
        // Centrar el modelo en el origen de coordenadas
        claveSol.position.sub(center);
        // Escalar si es necesario
        claveSol.scale.set(1, 1, 1);
        scene.add(claveSol);
    }, undefined, function(error) {
        console.error("Error al cargar el modelo:", error);
    });
}

// Función para cargar un instrumento según su nombre
function cargarInstrumento(nombre) {
    const loader = new GLTFLoader();

    // Si se selecciona el mismo instrumento, se quita y se muestra la clave de sol
    if (instrumentoSeleccionado === nombre) {
        if (instrumentoActual) {
            scene.remove(instrumentoActual);
            instrumentoActual = null;
        }
        instrumentoSeleccionado = null;
        scene.add(claveSol);
        return;
    }

    // Si hay un instrumento cargado en la escena, se elimina antes de cargar otro
    if (instrumentoActual) {
        scene.remove(instrumentoActual);
    }

    // Quitar la clave de sol al seleccionar un instrumento
    if (claveSol) {
        scene.remove(claveSol);
    }

    // Cargar el modelo GLTF correspondiente al instrumento seleccionado
    loader.load(`models/instrumentos/${nombre}/scene.gltf`, function(gltf) {
        instrumentoActual = gltf.scene; // Guardar el modelo cargado
        instrumentoActual.position.set(0, 0, 0);
        instrumentoActual.scale.set(0.5, 0.5, 0.5);
        scene.add(instrumentoActual);
        instrumentoSeleccionado = nombre; // Guardar el nombre del instrumento cargado
    }, undefined, function(error) {
        console.error("Error al cargar el modelo:", error);
    });
}

// Función de actualización para animarla rotación del instrumento
function update() {
    angulo += 0.01;
}

// Función de renderizado continuo
function render() {
    requestAnimationFrame(render); // Llamar al render en cada frame
    update(); // Actualizar la animación
    renderer.render(scene, camera); // Renderizar la escena con la cámara actual
}

// Función para crear la lista de instrumentos en la interfaz gráfica
function crearListaInstrumentos() {
    const lista = document.createElement("ul"); // Crear la lista HTML
    lista.style.position = "absolute";
    lista.style.right = "20px";
    lista.style.top = "20px";
    lista.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    lista.style.padding = "10px";
    lista.style.borderRadius = "5px";
    lista.style.listStyle = "none"; // Quitar los estilos de lista

    // Generar cada elemento de la lista con los instrumentos disponibles
    listaInstrumentos.forEach((nombre) => {
        const item = document.createElement("li"); // Crear un ítem de la lista
        item.textContent = nombre;
        item.style.cursor = "pointer";
        item.style.marginBottom = "5px";
        // Agregar un evento para que al hacer clic se cargue el instrumento
        item.addEventListener("click", () => cargarInstrumento(nombre));
        lista.appendChild(item); // Agregar el ítem a la lista
    });

    // Agregar la lista al documento HTML
    document.body.appendChild(lista);
}