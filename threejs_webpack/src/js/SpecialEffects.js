
import {
    Vector3,
    Color,
    Clock,
} from "three";

import { createGripper } from "./ModelCreator.js";

/***********************************************************
 * 
 * @param {*} scene 
 * @param {*} name 
 **********************************************************/
export function removeLego(scene, obj_name) {
    scene.remove(scene.getObjectByName(obj_name, true));
};

/***********************************************************
 * 
 * @param {*} scene 
 * @param {*} name 
 * @param {*} color_ 
 **********************************************************/
export function changeColor(scene, obj_name, color_) {
    const obj = scene.getObjectByName(obj_name, true);

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
        }
    });
};

/***********************************************************
 * 
 * @param {*} scene 
 * @param {*} obj_name 
 * @param {*} opacity_ 
 **********************************************************/
 export function changeOpacity(scene, obj_name, opacity_) {
    const obj = scene.getObjectByName(obj_name, true);

    obj.traverse((child) => {
        if (child.isMesh && child.geometry !== undefined) {
            child.material.transparent = true;
            child.material.opacity = opacity_;
        }
    });
};

export class Blinker{
    /**
     * 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     * @param {*} obj_name 
     */
    constructor(renderer, scene, camera, obj_name) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.obj_name = obj_name;
    }
    
    blink = () => { 
        this.frame_id = requestAnimationFrame(this.blink);
        changeOpacity(this.scene, this.obj_name, Math.sin(this.frame_id / 10));
        this.renderer.render(this.scene, this.camera);
    }

    stop_blinking = () => {
        cancelAnimationFrame(this.frame_id);
        changeOpacity(this.scene, this.obj_name, 1.0);
    }
}


export class PickPlace {
    /***********************************************************
     * 
     * @param {*} renderer 
     * @param {*} scene 
     * @param {*} camera 
     * @param {*} lego 
     * @param {*} place_position 
     * @param {*} place_rotation 
     ***********************************************************/
    constructor(renderer, scene, camera, lego,
        place_position, place_rotation = false) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.lego = this.scene.getObjectByName(lego);
        this.pick_position = this.lego.userData.position;
        this.place_position = place_position
        this.place_rotation = place_rotation;
        this.step = 0.05;
        this.motion_down = true;
        this.planar_motion = false;
        this.x_lock = 0;
        this.z_lock = 0;
        this.pick();
    }

    pick = () => {
        /* grip_pos in units, 
        * createGripper() function does the conversion unit => mm
        */
        this.grip_pos = new Vector3(
            this.pick_position.x,
            this.pick_position.y,
            this.pick_position.z + 5);

        /* Create the gripper,
        * (scene.add(gripper)) is done internally.
        */
        createGripper(this.scene, this.grip_pos);
        this.gripper = this.scene.getObjectByName("gripper");

        if (!this.lego.userData.rotation) {
            this.gripper.rotateY(-Math.PI / 2);
        };
    }

    place = () => {
        if (this.place_rotation) {
            this.gripper.rotateY(-Math.PI / 2);
            if (this.lego.userData.size == 4 && this.lego.userData.rotation) {
                this.lego.translateX(-0.8);
            }
            if (this.lego.userData.size == 6 && this.lego.userData.rotation) {
                this.lego.translateX(-1.6);
            }
        };
    }

    animatePickPlace = () => {
        const tolerance = 1.1 * this.step;
        let frame_id = requestAnimationFrame(this.animatePickPlace);

        if ((this.gripper.position.y > this.lego.position.y + 0.04)
            && this.motion_down && !this.planar_motion) {

            this.gripper.position.y -= this.step;
        }
        else {
            if (this.motion_down) {
                this.gripper.add(this.lego);
                this.lego.rotateY(Math.PI / 2);
                // // 2x2
                if (this.lego.userData.size === 2) {
                    this.lego.position.z += 2.4 - this.pick_position.x * 0.8;
                    this.lego.position.x += 8.8 - this.pick_position.y * 0.8;
                    this.lego.position.y -= this.pick_position.z * 0.48;
                }
                // 2x4
                else if (this.lego.userData.size === 4) {
                    if (this.lego.userData.rotation) {
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.position.x += 8.8 - this.pick_position.y * 0.8;
                        this.lego.position.z += 2.6 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                    else {
                        this.lego.position.x += 8.4 - this.pick_position.y * 0.8;
                        this.lego.position.z += 2.0 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                }
                // 2x6
                else {
                    if (this.lego.userData.rotation) {
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.position.x += 8.8 - this.pick_position.y * 0.8;
                        this.lego.position.z += 2.4 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                    else {
                        this.lego.position.z += 1.6 - this.pick_position.x * 0.8;
                        this.lego.position.x += 8.0 - this.pick_position.y * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                }
                this.motion_down = false;
            }
            if (this.gripper.position.y < this.grip_pos.z
                && !this.planar_motion) {
                this.gripper.position.y += this.step;
                if (this.gripper.position.y >= this.grip_pos.z) {
                    this.planar_motion = true;
                };
            }
            //
            if ((this.gripper.position.y >= this.grip_pos.z)
                && !this.motion_down && this.planar_motion) {
                let x_diff, z_diff;
                if (this.lego.userData.size == 4) {
                    if (this.lego.userData.rotation) {
                        x_diff = this.gripper.position.x - (this.place_position.y * 0.8 - 8.8);
                        z_diff = this.gripper.position.z - (this.place_position.x * 0.8 - 2.6);
                    }
                    else { 
                        x_diff = this.gripper.position.x - (this.place_position.y * 0.8 - 8.8);
                        z_diff = this.gripper.position.z - (this.place_position.x * 0.8 - 2.6);
                    }
                }
                else if (this.lego.userData.size == 6) {
                    if (this.lego.userData.rotation) {
                        x_diff = this.gripper.position.x - (this.place_position.y * 0.8 - 8.8);
                        z_diff = this.gripper.position.z - (this.place_position.x * 0.8 - 2.6);
                    }
                    else { 
                        x_diff = this.gripper.position.x - (this.place_position.y * 0.8 - 8.8);
                        z_diff = this.gripper.position.z - (this.place_position.x * 0.8 - 2.6); 
                    }
                }
                else {
                    x_diff = this.gripper.position.x - (this.place_position.y * 0.8 - 8.8);
                    z_diff = this.gripper.position.z - (this.place_position.x * 0.8 - 2.6);
                }
                if ((x_diff > tolerance) && this.x_lock !== 2) {
                    this.x_lock = 1;
                    this.gripper.position.x -= this.step;
                }
                else if ((x_diff < tolerance) && this.x_lock !== 1) {
                    this.x_lock = 2;
                    this.gripper.position.x += this.step;
                }
                else if ((z_diff > tolerance) && this.z_lock !== 2) {
                    this.z_lock = 1;
                    this.gripper.position.z -= this.step;
                }
                else if ((z_diff < tolerance) && this.z_lock !== 1) {
                    this.z_lock = 2;
                    this.gripper.position.z += this.step;
                }
                else {
                    cancelAnimationFrame(frame_id);
                    this.place();
                    this.animatePlace();
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
    }

    animatePlace = () => {
        this.planar_motion = false;
        let frame_id = requestAnimationFrame(this.animatePlace);
        /** TODO: to handle placing rotation */
        if ((this.gripper.position.y > (this.place_position.z * 0.48))
            && !this.motion_down) {

            this.gripper.position.y -= this.step;
        }
        else {
            this.motion_down = true;
            this.scene.add(this.lego);
                /* Position World Unit to mm conversion.*/
                this.lego.position.set(
                    this.place_position.y * 0.8 - 8.8,
                    this.place_position.z * 0.48,
                    this.place_position.x * 0.8 - 2.6
                )
            /** TODO: Move gripper up and make it vanish gradually */
            this.scene.remove(this.gripper);
            cancelAnimationFrame(frame_id);
            /********************************* 
             * Place Translation/Orientation *
             *********************************/
            // 2x4
            if (this.lego.userData.size == 4) {
                if (this.place_rotation) {
                    if (this.lego.userData.rotation) {
                        this.lego.rotateY(Math.PI / 2);
                        console.log("Place 4, 1 1");
                        this.lego.translateX(0.4);
                        this.lego.translateZ(0.2);
                    }
                    else {
                        console.log("Place 4, 1 2");
                        this.lego.translateX(-0.6);
                    }
                }
                else {
                    if (this.lego.userData.rotation) {
                        console.log("Place 4, 2 1");
                        this.lego.translateX(0.6);
                    }
                    else {
                        console.log("Place 4, 2 2");
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.translateX(-0.4);
                        this.lego.translateZ(0.2);
                    }
                }
            }
            // 2x6
            else if (this.lego.userData.size == 6) {
                if (this.place_rotation) {
                    if (this.lego.userData.rotation) {
                        console.log("Place 6, 1 1");
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.translateX(0.8);
                        this.lego.translateZ(0.2);
                    }
                    else {
                        console.log("Place 6, 1 2");
                        this.lego.translateX(-1.0);
                    }
                }
                else {
                    if (this.lego.userData.rotation) {
                        console.log("Place 6, 2 1");
                        this.lego.translateX(1.0);
                    }
                    else {
                        console.log("Place 6, 2 2");
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.translateX(-0.8);
                        this.lego.translateZ(-0.2);
                    }
                }
            }
            // 2x2 
            else { 
                if (this.place_rotation) {
                    this.lego.translateX(-0.2);
                }
                else {
                    this.lego.translateX(-0.2);
                }
            }
            this.lego.translateY(0.01);
            this.lego.userData.position = this.place_position;
        }
    }
}
