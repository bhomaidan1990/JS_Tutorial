import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
} from "three";
  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";

import porsche from "../assets/glb/porsche.glb";

const container = document.getElementById("container");

let camera;
let scene;
let renderer;
let controls;

// Creating the scene
scene = new Scene();
scene.background = new Color(0x21252d);

export default function init() {
    
    createCamera();
    createLights();
    loadModels();
    createControls();
    createRenderer();
    
    if (WebGL.isWebGLAvailable()) {

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    
    } else {
        const warning = WebGL. getWebGLErrorMessage();
        document.getElementById('container').appendChild(warning);
    }
}
  
function createCamera() {
const fov = 35;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 1000;
camera = new PerspectiveCamera(fov, aspect, near, far);

camera.position.set(-1.5, 1.5, 10);
}

function createLights() {
const mainLight = new DirectionalLight(0xffffff, 5);
mainLight.position.set(10, 10, 10);

const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
scene.add(mainLight, hemisphereLight);
}

function loadModels() {
    const loader = new GLTFLoader();
    loader.load( porsche, function ( gltf ) {

        scene.add( gltf.scene );
    
    }, undefined, function ( error ) {
    
        console.error( error );
    } );
   
}

function createControls() {
    /* Create Controls to allow for scene control */
    controls = new OrbitControls(camera, container);
}

function createRenderer() {
renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;

container.appendChild(renderer.domElement);
}

function onWindowResize() {
camera.aspect = container.clientWidth / container.clientHeight;

// Update camera frustum
camera.updateProjectionMatrix();

renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);

init();