import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    Vector3,
    Object3D,
} from "three";
  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

/* BasePlate Dimensions 6.4 x ?? x 6.4 */
import BasePlate from "../assets/glb/BasePlate_16x16.glb";
/* Lego Dimensions: (0.8 x 0.48 x 0.8) */
import Lego_2x2 from "../assets/glb/Lego_2x2.glb";
import Lego_2x4 from "../assets/glb/Lego_2x4.glb";

let container;
let camera;
let renderer;
let scene;
let controls;

container = document.getElementById("container");

// Creating the scene
scene = new Scene();
scene.background = new Color(0x21252d);

const Base_Plate = new Object3D();
const L_2_G = new Object3D();
const L_4_G = new Object3D();

const base_pos1 = new Vector3(0.0, 0.0, 0.0);
const base_pos2 = new Vector3(6.4, 0.0, 0.0);
const base_pos3 = new Vector3(0.0, 0.0, 6.4);
const base_pos4 = new Vector3(6.4, 0.0, 0.0);
    
export default function init() {
    
    createCamera();
    createLights();
    loadModels();

    createBase(base_pos1);
    createBase(base_pos2);
    createBase(base_pos3);
    createBase(base_pos4);

    createLego();

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
/*change coordinate system from ZXY to XYZ*/
// camera.up = new Vector3( 0, 0, 1 );
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
    Base_Plate.add(model);
    scene.add(model);
};

const multiLoad_2 = (result, position) => {
    const model = result.scene.children[0];
    model.position.copy(position);
    model.scale.set(0.05, 0.05, 0.05);
    L_2_G.add(model);
    // scene.add(model);
};

const multiLoad_4 = (result, position) => {
    const model = result.scene.children[0];
    model.position.copy(position);
    model.scale.set(0.05, 0.05, 0.05);
    L_4_G.add(model);
    // scene.add(model);
};
    
const baseplatePosition = new Vector3(0.0, 0.0, 0.0);
loader.load(
    BasePlate,
    gltf => oneLoad(gltf, baseplatePosition),
),function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
},
function ( error ) {
    console.log( 'An error happened' );
};

const lego_2x2_Position = new Vector3(0.4, 0.48, 0.0);
loader.load(
    Lego_2x2,
    gltf => multiLoad_2(gltf, lego_2x2_Position),
),function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
},
function ( error ) {
    console.log( 'An error happened' );
};

const lego_2x4_Position = new Vector3(0.0, 0.0, 0.0);
loader.load(
    Lego_2x4,
    gltf => multiLoad_4(gltf, lego_2x4_Position),
),function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
},
function ( error ) {
    console.log( 'An error happened' );
};
}

function createBase(pos=null) {
    const base = SkeletonUtils.clone(Base_Plate);
    if (pos === null) {
        pos = new Vector3(0.0, 0.0, 0.0);
    }
    base.translateX(pos.x);
    base.translateY(pos.y);
    base.translateZ(pos.z);

    scene.add(base);
}

function createLego(pos=null, rot=null, color="#FFFFFF", size=2) {
    
    let pos_shift = 0.0;
    const lego = new Object3D();
    if (size == 2) {
        lego.add(SkeletonUtils.clone(L_2_G));
    }
    else if (size == 4) {
        lego.add(SkeletonUtils.clone(L_4_G));
        pos_shift = 0.4;
    }
    else { 
        console.log("Lego Size Must Be 2 or 4");
        throw 'Lego Size Must Be 2 or 4!';
    }
    
    if (pos === null) {
        pos = new Vector3(0.0, 0.0, 0.0);
    }
    lego.translateX(pos.x + pos_shift);
    lego.translateY(pos.y);
    lego.translateZ(pos.z);

    if (rot === null) {
        rot = new Vector3(0.0, 0.0, 0.0);
    }
    lego.rotateX(rot.x);
    lego.rotateY(rot.y);
    lego.rotateZ(rot.z);

    /* xx color to be done xx */
    console.log(color)

    scene.add(lego);
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