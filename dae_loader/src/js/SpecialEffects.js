
import {
    Vector3
} from "three";

import { createGripper } from "./ModelCreator.js";

export default class SpecialEffects {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.gripped_lego_pos = new Vector3(0.0, 0.0, 0.0);
    }

    displayGripper(pos) {
        // Intitial Gripper Position
        this.gripped_lego_pos = pos;

        // Create Gripper
        createGripper(this.gripped_lego_pos, this.scene);
    }

    animateObject = (obj, up, distance = 3.4) => {
        requestAnimationFrame(this.animateObject);
            if (up) {
                obj.translateOnAxis(new Vector3(0, 1, 0).normalize(), 0.1)
                if (obj.position.y > distance) {
                    up = false;
                }
            }
            else if (!up) {
                obj.translateOnAxis(new Vector3(0, 1, 0).normalize(), -0.1)
                if (obj.position.y < -distance) {
                    up = true;
                }
            }
            else {
                obj.position.set(0, 0, 0)
            }
            this.renderer.render(scene, camera);
    }

    // animateGripper = () => {
    //     const gripper = this.scene.getObjectByName("gripper", true);
    //     requestAnimationFrame(this.animateGripper);
    //     this.renderer.render(this.scene, this.camera);

    //         for (let i = 0; i < 684; i++) {
    //             gripper.position.y -= i/100;
    //         }

    //         // const init_pos = gripper.position;
    //         // console.log(gripper);
    //         // Move Gripper Down to Desired Lego Position
    //         // gripper.position.y -= 0.1;
    //         // if (gripper.position.y < 5.0) {
    //         //     gripper.position.y += 0.1;
    //         //     if (gripper.position.y > 5.0)
    //         //         this.scene.remove(this.scene.getObjectByName("gripper", true));
    //         //     console.log("gripped");
    //         // }
    // }
    
}


