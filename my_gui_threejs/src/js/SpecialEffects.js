
import {
    Vector3,
    Color,
} from "three";

import { createGripper } from "./ModelCreator_2.js";

export default class SpecialEffects {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    };

    changeColorLego(name, color_) {
        const obj = this.scene.getObjectByName(name, true);
    
        // colors
        const red_color = new Color(0xCC0100);
        const green_color = new Color(0x004904);
        const blue_color = new Color(0x010C52);
        const yellow_color = new Color(0x5A4B00);
        const white_color = new Color(0x4D4D4D);
        const olive_color = new Color(0x243E02);
        const light_color = new Color(0x4DDD30);
        
        const color_dict = {
            red: red_color,
            green: green_color,
            blue: blue_color,
            yellow: yellow_color,
            white: white_color,
            olive: olive_color,
            light: light_color
        }
        
        obj.traverse((child) => {
            if (child.isMesh && child.geometry !== undefined) {
                child.material.color.set(color_dict[color_]);
                // child.material.transparent = true;
                // child.material.opacity = 1;
            }
        });
    };

    pickPlace = (lego, pick_pos, place_pos, pick_rot = false, place_rot = false) => {
        const id = requestAnimationFrame(this.pickPlace);
        const step = 10;
        const grip_pos = new Vector3(
            pick_pos.x,
            pick_pos.y,
            pick_pos.z + 5
        );
        
        createGripper(grip_pos, this.scene);

        const gripper = this.scene.getObjectByName("gripper", true);
        // Down
        while (gripper.position.y > (pick_pos.z / 0.48)) {
            gripper.position.y -= 0.1;
        };
        // if Down then Up
        if (!gripper.position.y > (pick_pos.z / 0.48)) {
            while (gripper.position.y < grip_pos) {
                gripper.position.y += 0.1;
            };
            gripper.add(lego);
            if (pick_rot) {
                gripper.rotateY(Math.PI/2);
             };
        };
        // Move to Place Position
        while (gripper.position.x != ((place_pos.y / 0.8) + 9.2)) {
            gripper.position.x += (((place_pos.y / 0.8) + 9.2) - gripper.position.x) / step;
        };

        while (gripper.position.z != ((place_pos.x / 0.8) + 2.8)) {
            gripper.position.z += ((place_pos.x / 0.8) + 2.8) / step;
        };
    
        // Place Down
        if (gripper.position.x === place_pos.y && gripper.position.z === place_pos.x) 
            {
                while (gripper.position.y > (pick_pos.z / 0.48)) {
                    gripper.position.y -= 0.1;
                }
            };
            if (place_rot) {
                gripper.rotateY(Math.PI / 2);
            };

        this.scene.add(lego);
        this.scene.remove(gripper);
        this.renderer.render(this.scene, this.camera);
        cancelAnimationFrame(id);
    };

    removeLego(scene, name) {;
        scene.remove(scene.getObjectByName(name, true));
    };
}


