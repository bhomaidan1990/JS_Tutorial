import {Vector3} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* BasePlate Dimensions 6.4 x ?? x 6.4 */
import BasePlate from "../assets/glb/BasePlate_16x16.glb";
/* Lego Dimensions: (0.8 x 0.48 x 0.8) */
import Lego_2x2 from "../assets/glb/Lego_2x2.glb";
import Lego_2x4 from "../assets/glb/Lego_2x4.glb";


export function loadModel(pos, model_path, scene, orient="") {
    if (pos === null) {
        pos = new Vector3(0.0, 0.0, 0.0);
     }

    const loader = new GLTFLoader();
        
    const onLoad = (result, position, rotation) => {
        const model = result.scene.children[0];
        model.position.copy(position);
        model.rotation.copy(rotation);
        model.scale.set(0.05, 0.05, 0.05);
        scene.add(model);
    };
    
    loader.load(
        model_path,
        gltf => onLoad(gltf, pos, rot),
    ), undefined,
        function (error) {
        console.log( 'An error happened' );
    };
}