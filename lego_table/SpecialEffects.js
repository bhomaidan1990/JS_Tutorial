
import {
    Vector3
} from "three";

import { createGripper } from "./ModelCreator.js";

class SpecialEffects { 
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
     }

    animateGripper = (pos, step = 0.1) => {
    
        requestAnimationFrame(animateGripper)
    
        // Intitial Gripper Position
        const  initial_gripper_position = Vector3(pos.x, pos.y + 10, pos.z);
        // Create Gripper
        createGripper(initial_gripper_position, self.scene)
    
        // Move Gripper Down to Desired Lego Position
        gripper.translateOnAxis(pos, -step)
        if (gripper.position.y < pos.y){
            gripper.translateOnAxis(pos, step);
            if (gripper.position.y > initial_gripper_position.y)
                self.scene.remove(self.scene.getObjectByName("gripper", true));
        }

       this.renderer.render(this.scene, this.camera)
    }
}
