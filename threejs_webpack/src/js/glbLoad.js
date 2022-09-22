import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    Vector3,
    Clock,
    Object3D,
} from "three";
  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import BasePlate from "../assets/glb/BasePlate_16x16.glb";
/* Lego Dimensions: (0.8 x 0.8 x 0.48) */
import Lego_2x2 from "../assets/glb/Lego_2x2.glb";
import Lego_2x4 from "../assets/glb/Lego_2x4.glb";
import Lego_2x6 from "../assets/glb/Lego_2x6.glb";

let container;
let camera;
let renderer;
let scene;
let controls;

const mixers = [];
const clock = new Clock();

const L_2_G = new Object3D( );
const L_4_G = new Object3D();

export default function init() {
    container = document.getElementById("container");
    
    // Creating the scene
    scene = new Scene();
    scene.background = new Color("skyblue");
  
    createCamera();
    createLights();
    loadModels();
    duplicateModel();
    duplicateModel4();
    createControls();
    createRenderer();
  
    renderer.setAnimationLoop(() => {
        update();
        render();
    });
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

const oneLoad = (result, position) => {
    const model = result.scene.children[0];
    model.position.copy(position);
    model.scale.set(0.05, 0.05, 0.05);

    scene.add(model);
};

const multiLoad_2 = (result, position) => {
    const model = result.scene.children[0];
    model.position.copy(position);
    model.scale.set(0.05, 0.05, 0.05);

    //
    L_2_G.add(model.clone())

    scene.add(model);
};

const multiLoad_4 = (result, position) => {
    const model = result.scene.children[0];
    model.position.copy(position);
    model.scale.set(0.05, 0.05, 0.05);

    //
    L_4_G.add(model.clone())

    scene.add(model);
};
    
const baseplatePosition = new Vector3(0.0, 0.0, 0.0);
loader.load(
    BasePlate,
    gltf => oneLoad(gltf, baseplatePosition),
);

const lego_2x2_Position = new Vector3(0.4, 0.48, 0.0);
loader.load(
    Lego_2x2,
    gltf => multiLoad_2(gltf, lego_2x2_Position),
);

const lego_2x4_Position = new Vector3(0.0, 0.0, 0.0);
loader.load(
    Lego_2x4,
    gltf => multiLoad_4(gltf, lego_2x4_Position),
);

const lego_2x6_Position = new Vector3(0.4, 0.0, 0.8);
loader.load(
    Lego_2x6,
    gltf => oneLoad(gltf, lego_2x6_Position),
);
}

// /* */ 
function duplicateModel() {
    
    L_2_G.translateX(0.8)
    L_2_G.translateY(0.0)//0.48
    L_2_G.translateZ(0.8)

    scene.add(L_2_G);
}

function duplicateModel4() {

    L_4_G.translateX(-1.2)
    L_4_G.translateY(0.0)//0.48
    L_4_G.translateZ(1.2)

    L_4_G.rotateY(Math.PI / 2);

    scene.add(L_4_G);
}

function createControls() {
    controls = new OrbitControls(camera, container);
}

function update() {
    const delta = clock.getDelta();
    mixers.forEach(mixer => mixer.update(delta));
  }
  
  function render() {
    renderer.render(scene, camera);
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