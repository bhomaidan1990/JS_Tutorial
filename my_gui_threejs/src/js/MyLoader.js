import {
    Vector3,
} from "three";

import { createBase} from "./ModelCreator.js";
import CreateLego from "./LegoCreator.js";
import SceneCreator from "./SceneCreator.js";
import {changeColor, changeOpacity, removeLego, Blinker, PickPlace} from "./SpecialEffects.js";

let container = document.getElementById("container");

export default function init() {
    
    const sceneCreator_ = new SceneCreator(container)
    const scene = sceneCreator_.getScene();
    const camera = sceneCreator_.getCamera();
    const renderer = sceneCreator_.getRenderer();

    // const sE_ = new SpecialEffects(scene, camera, renderer)

    createBase(scene);
    
    /**************************************************
    * TODO:
    *-------------------------------------------------
    * to make an object of ids and colors
    * my_lego = {1: [green, 2, pos_1],  2: [red, 4, pos_2], ...}
    * ------------------------------------------------
    ***************************************************/
    
    //(scene, size, color, name, position, rotation = false)
    const lego_2x2_pos1 = new Vector3(7, 4, 0);
    new CreateLego(scene, 2, "red", "lego_1", lego_2x2_pos1);

    const lego_2x2_pos2 = new Vector3(10, 10, 0);
    new CreateLego(scene, 2, "red", "lego_2", lego_2x2_pos2);

    const lego_2x4_pos1 = new Vector3(4, 7, 0);
    new CreateLego(scene, 4, "olive", "lego_4", lego_2x4_pos1, true);

    const lego_2x6_pos1 = new Vector3(2, 4, 0);
    new CreateLego(scene, 6, "light", "lego_6", lego_2x6_pos1, true);

    const lego_2x2_pos3 = new Vector3(5, 4, 0);
    new CreateLego(scene, 2, "yellow", "lego3", lego_2x2_pos3);

    const lego_2x2_pos4 = new Vector3(5, 2, 0);
    new CreateLego(scene, 2, "blue", "lego_5", lego_2x2_pos4);

    // changeColor(scene, "lego_1", "yellow");
    // changeOpacity(scene, "lego_2", 0.8);
    // removeLego(scene, "lego_2");

    const place_pos = new Vector3(9, 20, 0);

    const pp_ = new PickPlace(renderer, scene, camera,
        "lego_4", place_pos, false);
    pp_.animatePickPlace();

    const blinker_ = new Blinker(renderer, scene, camera,
        "lego_5");
    blinker_.blink();
    blinker_.stop_blinking();
}
