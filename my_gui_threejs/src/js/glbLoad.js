import {
    Vector3,
} from "three";

import { createBase, createLego, removeLego, createGripper } from "./ModelCreator.js";
import SceneCreator from "./SceneCreator.js";

let container;

container = document.getElementById("container");

export default function init() {
    
    const sceneCreator_ = new SceneCreator(container)
    const scene = sceneCreator_.getScene();
    const camera = sceneCreator_.getCamera();
    const renderer = sceneCreator_.getRenderer();

    const specEffects = new SpecialEffects(scene, camera, renderer)

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

    createGripper(lego_2x2_pos, scene);
}
