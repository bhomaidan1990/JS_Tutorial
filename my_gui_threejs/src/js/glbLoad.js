import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    Vector3,
} from "three";
  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createBase, createLego, removeLego } from "./modelCreator.js";
let container;
let camera;
let renderer;
let scene;
let controls;

container = document.getElementById("container");

// Creating the scene
scene = new Scene();
scene.background = new Color(0x21252d);

export default function init() {
    
    createCamera();
    createLights();

    createBase(scene);

    /**************************************************
    * TODO:
    *-------------------------------------------------
    * to make an object of ids and colors
    * myLegos = {1: [green, 2, pos_1],  2: [red, 4, pos_2], ...}
    * ------------------------------------------------
    ***************************************************/

    const lego_2x2_pos = new Vector3(1, 0, 2);
    createLego(lego_2x2_pos, "white", "lego_1", scene);

    const lego_2x2_pos2 = new Vector3(1, 0, 0);
    createLego(lego_2x2_pos2, "olive", "lego_3", scene);

    const lego_2x4_pos = new Vector3(0, 2, 1);
    createLego(lego_2x4_pos,"yellow", "lego_2", scene, 4, false);

    removeLego(scene, "lego_2");

    createControls();
    createRenderer();
  
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
  
function createCamera() {
const fov = 35;
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1;
const far = 1000;
camera = new PerspectiveCamera(fov, aspect, near, far);

camera.position.set(0.1, 60, 20);
}

function createLights() {
const mainLight = new DirectionalLight(0xffffff, 5);
mainLight.position.set(10, 10, 10);

const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
scene.add(mainLight, hemisphereLight);
}
/////////////////////////////////////////////////////

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