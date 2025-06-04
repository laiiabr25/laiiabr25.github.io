import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";

let renderer, scene, camera, cameraControls;
let instrumentoActual =  null;
let instrumentoSeleccionado = null;
let listaInstrumentos = [ "bateria", "clarinete", "flauta", "guitarra_acustica", "marimba", "piano", "saxo", "trombon", "trompa", "trompeta", "violin" ];
let rotadorInstrumento = new THREE.Object3D();
let sonidoActual = null;

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

    const entorno = new THREE.CubeTextureLoader().load([
        "images/posx.jpg", "images/negx.jpg",
        "images/posy.jpg", "images/negy.jpg",
        "images/posz.jpg", "images/ngez.jpg"
    ]);
    scene.environment = entorno;

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

    scene.add(rotadorInstrumento);

    crearListaInstrumentos();
}

function loadScene() {
    const textura = new THREE.TextureLoader().load("images/wood512.jpg");
    const material = new THREE.MeshStandardMaterial({ map: textura });

    const luzAmbiente = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(luzAmbiente);

    const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
    luzDireccional.position.set(5, 10, 7.5);
    luzDireccional.castShadow = true;
    luzDireccional.shadow.mapSize.set(2048, 2048);
    luzDireccional.shadow.bias = -0.0001;
    scene.add(luzDireccional);

    const tarima = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 10), material);
    tarima.position.y = -0.25;
    tarima.receiveShadow = true;
    scene.add(tarima);

    const paredes = [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/posx.jpg"), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/negx.jpg"), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/posy.jpg"), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/negy.jpg"), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/posz.jpg"), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/negz.jpg"), side: THREE.BackSide})
    ];
    const habitacion = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), paredes);
    scene.add(habitacion);
}

function cargarInstrumento(nombre) {
    if (instrumentoSeleccionado === nombre) {
        resetearInstrumento();
        return;
    }

    const rutaBase = `models/instrumentos/${nombre}/`;
    const loader = new GLTFLoader();
    loader.setPath(rutaBase);

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

    loader.load("scene.gltf", function(gltf) {
        if (instrumentoActual) {
            instrumentoActual.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            rotadorInstrumento.remove(instrumentoActual)
        }
        instrumentoActual = gltf.scene;
        instrumentoActual.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (nombre === "clave") {
                    node.material = new THREE.MeshStandardMaterial({color: "black", wireframe: true, side: THREE.DoubleSide});
                } else {
                    if (!node.material.map) {
                        node.material = new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.4, roughness: 0.5});
                    }
                    node.material.envMap = scene.environment;
                    node.material.envMapIntensity = 1;
                    node.material.needsUpdate = true;
                }
            }
        });
        ajustarInstrumento(instrumentoActual, nombre);
        rotadorInstrumento.add(instrumentoActual);
        if (sonidoActual) {
            sonidoActual.pause();
            sonidoActual.currentTime = 0;
        }
        if (nombre != "clave") {
            sonidoActual = new Audio(`sounds/${nombre}.mp3`);
            sonidoActual.play();
        }
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

    const scale = {
        clave: 5,
        clarinete: 0.5,
        bateria: 3.5,
        flauta: 0.2,
        marimba: 2.5,
        trombon: 0.7,
        trompa: 2.5,
        trompeta: 1.5,
        violin: 0.5
    } [nombre] || 4;
    instrumentoActual.scale.set(scale / size.y, scale / size.y, scale / size.y);

    if (nombre === "bateria") {
        instrumentoActual.rotation.y = Math.PI;
    } else if (nombre === "clarinete" || nombre === "flauta") {
        instrumentoActual.rotation.set(0, 0, 0);
        instrumentoActual.rotation.x = Math.PI / 2;
        if (nombre === "clarinete") {
            instrumentoActual.rotation.y = Math.PI;
        }
    } else if (nombre === "trombon") {
        instrumentoActual.rotation.x = Math.PI / 2;
        instrumentoActual.rotation.y = Math.PI / 2;
    } else if (nombre === "violin") {
        instrumentoActual.rotation.set(Math.PI / 2, 0, 0);
    }

    /*if (nombre === "clave") {
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
    }*/

    const boxScaled = new THREE.Box3().setFromObject(instrumentoActual);
    const center = boxScaled.getCenter(new THREE.Vector3());

    instrumentoActual.position.set(-center.x, -boxScaled.min.y, -center.z);
}

function resetearInstrumento() {
    if (instrumentoActual) {
        instrumentoActual.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        rotadorInstrumento.remove(instrumentoActual);
    }
    instrumentoActual = null;
    instrumentoSeleccionado = null;
    cargarInstrumento("clave");
}

function update() {
    rotadorInstrumento.rotation.y += 0.005;
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