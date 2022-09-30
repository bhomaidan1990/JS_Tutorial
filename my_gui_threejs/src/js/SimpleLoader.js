import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import SceneCreator from "./SceneCreator.js";
import model_path_ from "../assets/glb/Lego_2x2_green.glb";

let container_ = document.getElementById("container");

let model_container = new Object3D();
const sceneCreator_ = new SceneCreator(container_);
const scene = sceneCreator_.getScene();
const loader = new GLTFLoader();

function loadModel(){
    const onLoad = (result, model_container) => {
        const model = result.scene.children[0];
        model.position.set(0.0, 0.0, 0.0);
        model.scale.set(0.05, 0.05, 0.05);
        /* changing the model color here works perfectly!*/
        model.material.color.set(0xaaaaaa);
        model_container.add(model.clone());
        model_container.name = "myObj";
        scene.add(model_container);
    };
    loader.load(
        model_path_,
        gltf => onLoad(gltf, model_container),
    ), undefined, function (error) {
        console.log('An error happened');
        };
}

function changeColor(name, color = 0x00aa00){
    scene.getObjectByName(name)[0].material.color.set(color);    
}

export default function init() { 
    loadModel();
    changeColor("myObj");
}