import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";

let renderer, scene, camera, cameraControls;
let instrumentoActual =  null;
let instrumentoSeleccionado = null;
let listaInstrumentos = [ "bateria", "clarinete", "flauta", "guitarra_acustica", "marimba", "piano", "saxo", "trombon", "trompa", "trompeta", "violin" ];

init();
loadScene();
cargarInstrumento("clave");
render();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.TextureLoader().load("images/musical_background.jpg");

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 10);
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    crearListaInstrumentos();
}

function loadScene() {
    const textura = new THREE.TextureLoader().load("images/wood512.jpg");
    const material = new THREE.MeshStandardMaterial({ map: textura });

    const luzAmbiente = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(luzAmbiente);

    const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
    luzDireccional.position.set(5, 10, 7.5);
    luzDireccional.castShadow = true;
    luzDireccional.shadow.mapSize.width = 1024;
    luzDireccional.shadow.mapSize.height = 1204;
    scene.add(luzDireccional);

    const tarima = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 10), material);
    tarima.position.y = -0.25;
    tarima.receiveShadow = true;
    scene.add(tarima);
}

function cargarInstrumento(nombre) {
    if (instrumentoSeleccionado === nombre) {
        resetearInstrumento();
        return;
    }

    const loader = new GLTFLoader();

    const loadingMessage = document.createElement("div");
    loadingMessage.textContent = `Cargando... ${nombre}`;
    loadingMessage.style.position = "absolute";
    loadingMessage.style.top = "20%";
    loadingMessage.style.left = "50%";
    loadingMessage.style.transform = "translate(-50%, -50%)";
    loadingMessage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    loadingMessage.style.color = "white";
    loadingMessage.style.padding = "10px";
    loadingMessage.style.borderRadius = "5px";
    
    document.body.appendChild(loadingMessage);

    loader.load(`models/instrumentos/${nombre}/scene.gltf`, function(gltf) {
        if (instrumentoActual) {
            scene.remove(instrumentoActual)
        }
        instrumentoActual = gltf.scene;
        instrumentoActual.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (nombre === "clave") {
                   node.material = new THREE.MeshStandardMaterial({ color: "black", wireframe: true, linewidth: 3, side: THREE.DoubleSide });
                }
                node.material.metalness = 0.5;
                node.material.roughness = 0.3;
            }
        });
        ajustarInstrumento(instrumentoActual, nombre);
        scene.add(instrumentoActual);
        instrumentoSeleccionado = nombre;
        document.body.removeChild(loadingMessage);
    }, undefined, function(error) {
        console.error("Error al cargar el modelo:", error);
        document.body.removeChild(loadingMessage);
    });
}

function ajustarInstrumento(objeto, nombre) {
    const box = new THREE.Box3().setFromObject(objeto);
    const size = box.getSize(new THREE.Vector3());

    if (nombre === "clave") {
        instrumentoActual.scale.set(5 / size.y, 5 / size.y, 5 / size.y);
    }
    else if (nombre === "bateria") {
        instrumentoActual.rotation.y = Math.PI;
        instrumentoActual.scale.set(3.5 / size.y, 3.5 / size.y, 3.5 / size.y)
    }
    else if (nombre === "clarinete") {
        instrumentoActual.rotation.set(0, 0, 0);
        instrumentoActual.rotation.x = Math.PI / 2;
        instrumentoActual.rotation.y = Math.PI;
        instrumentoActual.scale.set(0.5 / size.y, 0.5 / size.y, 0.5 / size.y);
    }
    else if (nombre === "flauta") {
        instrumentoActual.rotation.set(0, 0, 0);
        instrumentoActual.rotation.x = Math.PI / 2;
        instrumentoActual.scale.set(0.2 / size.y, 0.2 / size.y, 0.2 / size.y);
    }
    else if (nombre === "marimba") {
        instrumentoActual.scale.set(2.5 / size.y, 2.5 / size.y, 2.5 / size.y);
    }
    else if (nombre === "trombon") {
        instrumentoActual.rotation.x = Math.PI / 2;
        instrumentoActual.rotation.y = Math.PI / 2;
        instrumentoActual.scale.set(0.7 / size.y, 0.7 / size.y, 0.7 / size.y);
    }
    else if (nombre === "trompa") {
        instrumentoActual.scale.set(2.5 / size.y, 2.5 / size.y, 2.5 / size.y);
    }
    else if (nombre === "trompeta") {
        instrumentoActual.scale.set(1.5 / size.y, 1.5 / size.y, 1.5 / size.y);
    }
    else if (nombre === "violin") {
        instrumentoActual.rotation.set(Math.PI / 2, 0, 0);
        instrumentoActual.scale.set(0.5 / size.y, 0.5 / size.y, 0.5 / size.y);
    }
    else {
        instrumentoActual.scale.set(4 / size.y, 4 / size.y, 4 / size.y);
    }

    const boxScaled = new THREE.Box3().setFromObject(instrumentoActual);
    const center = boxScaled.getCenter(new THREE.Vector3());

    instrumentoActual.position.set(-center.x, -boxScaled.min.y, -center.z);
}

function resetearInstrumento() {
    scene.remove(instrumentoActual);
    instrumentoActual = null;
    instrumentoSeleccionado = null;
    cargarInstrumento("clave");
}

function update() {
    
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

function crearListaInstrumentos() {
    const lista = document.createElement("ul");
    lista.style.position = "absolute";
    lista.style.right = "20px";
    lista.style.top = "20px";
    lista.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    lista.style.padding = "10px";
    lista.style.borderRadius = "5px";
    lista.style.listStyle = "none";

    listaInstrumentos.forEach((nombre) => {
        const item = document.createElement("li");
        item.textContent = nombre;
        item.style.cursor = "pointer";
        item.style.marginBottom = "5px";
        item.addEventListener("click", () => cargarInstrumento(nombre));
        lista.appendChild(item);
    });

    document.body.appendChild(lista);
}