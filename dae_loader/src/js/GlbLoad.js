import {
    Vector3,
} from "three";

import ModelCreator from "./ModelCreator.js";
import SceneCreator from "./SceneCreator.js";

let container = document.getElementById("container");

export default function init() {
    
    const sceneCreator_ = new SceneCreator(container)
    const scene = sceneCreator_.getScene();
    // const camera = sceneCreator_.getCamera();
    // const renderer = sceneCreator_.getRenderer();

    // const specEffects = new SpecialEffects(scene, camera, renderer)

    const modelCreator_ = new ModelCreator(scene);
    modelCreator_.createBase();
    /**************************************************
    * TODO:
    *-------------------------------------------------
    * to make an object of ids and colors
    * myLegos = {1: [green, 2, pos_1],  2: [red, 4, pos_2], ...}
    * ------------------------------------------------
    ***************************************************/

    const lego_2x2_pos1 = new Vector3(1, 0, 2);
    modelCreator_.createModel("lego_2x2", lego_2x2_pos1, "lego_1", "white");
    //     createLego(lego_2x2_pos, "white", "lego_1", scene);

    const lego_2x2_pos2 = new Vector3(1, 0, 0);
    modelCreator_.createModel("lego_2x2", lego_2x2_pos2, "lego_3", "olive");
    //     createLego(lego_2x2_pos2, "olive", "lego_3", scene);

    const lego_2x4_pos1 = new Vector3(0, 2, 1);
    modelCreator_.createModel("lego_2x4", lego_2x4_pos1, "lego_2", "yellow");
    //     createLego(lego_2x4_pos,"yellow", "lego_2", scene, 4, false);

    const lego_2x6_pos1 = new Vector3(2, 2, 0);
    modelCreator_.createModel("lego_2x6", lego_2x4_pos1, "lego_4", "blue");
    
    //modelCreator_.removeLego(scene, "lego_2");
    
    console.log(scene);
    
    //     createGripper(lego_2x2_pos, scene);
    //     // console.log(scene);
    modelCreator_.changeColorLego( scene, "lego_1", 0xffffaa);
    //     console.log(scene);

}
