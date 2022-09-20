import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    Vector3,
    Clock,
    AnimationMixer
} from "three";
  
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import BasePlate from "../assets/glb/BasePlate_16x16.glb";
import Lego_2x2 from "../assets/glb/Lego_2x2.glb";
import Lego_2x4 from "../assets/glb/Lego_2x4.glb";

  let container;
  let camera;
  let renderer;
  let scene;
  let controls;
  
  const mixers = [];
  const clock = new Clock();
  
  export default function init() {
    container = document.getElementById("container");
  
    // Creating the scene
    scene = new Scene();
    scene.background = new Color("skyblue");
  
    createCamera();
    createLights();
    loadModels();
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
  
    const onLoad = (result, position) => {
      const model = result.scene.children[0];
      model.position.copy(position);
      model.scale.set(0.05, 0.05, 0.05);
  
      const mixer = new AnimationMixer(model);
      mixers.push(mixer);
  
      const animation = result.animations[0];
      const action = mixer.clipAction(animation);
      action.play();
  
      scene.add(model);
    };
  
    const onProgress = progress => {};
  
    const parrotPosition = new Vector3(0, 0, 2.5);
    loader.load(
        BasePlate,
      gltf => onLoad(gltf, parrotPosition),
      onProgress
    );
  
    const flamingoPosition = new Vector3(7.5, 0, -10);
    loader.load(
        Lego_2x2,
      gltf => onLoad(gltf, flamingoPosition),
      onProgress
    );
  
    const storkPosition = new Vector3(0, -2.5, -10);
    loader.load(
        Lego_2x4,
      gltf => onLoad(gltf, storkPosition),
      onProgress
    );
  }
  
  function createRenderer() {
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
  
    container.appendChild(renderer.domElement);
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
  
//   init();
  
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
  
    // Update camera frustum
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener("resize", onWindowResize, false);
  