import {
    Vector3,
} from "three";

// import { createBase, createLego, removeLego, changeColorLego, createGripper } from "./ModelCreator.js";
import { createBase, removeLego, changeColorLego, createGripper } from "./ModelCreator_2.js";
import CreateLego from "./LegoCreator.js";
import SceneCreator from "./SceneCreator.js";

let container;

container = document.getElementById("container");

export default function init() {
    
    const sceneCreator_ = new SceneCreator(container)
    const scene = sceneCreator_.getScene();
    const camera = sceneCreator_.getCamera();
    const renderer = sceneCreator_.getRenderer();

    // const specEffects = new SpecialEffects(scene, camera, renderer)

    createBase(scene);
    
    /**************************************************
    * TODO:
    *-------------------------------------------------
    * to make an object of ids and colors
    * myLegos = {1: [green, 2, pos_1],  2: [red, 4, pos_2], ...}
    * ------------------------------------------------
    ***************************************************/
    
    //(scene, size, color, name, position, rotation = false)
    const lego_2x2_pos1 = new Vector3(2, 0, 0);
    new CreateLego(scene, 2, "red", "lego_1", lego_2x2_pos1, false);

    const lego_2x4_pos1 = new Vector3(3, 0, 0);
    new CreateLego(scene, 4, "olive", "lego_3", lego_2x4_pos1, true);

    const lego_2x6_pos1 = new Vector3(0, 0, 0);
    new CreateLego(scene, 6, "light", "lego_4", lego_2x6_pos1, false);

    const lego_2x2_pos2 = new Vector3(5, 2, 0);
    new CreateLego(scene, 2, "yellow", "lego_2", lego_2x2_pos2, false);

    const lego_2x2_pos3 = new Vector3(5, 2, 1);
    new CreateLego(scene, 2, "blue", "lego_2", lego_2x2_pos3, false);

    removeLego(scene, "lego_1");

    // changeColorLego(scene, "lego_3", "blue");
    // const grip_pos = new Vector3(0, 0, 2);
    // createGripper(grip_pos, scene);
    // console.log(scene);
}
