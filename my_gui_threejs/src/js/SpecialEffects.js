
import {
    Vector3,
    Color,
} from "three";

import { createGripper } from "./ModelCreator.js";

/***********************************************************
 * 
 * @param {*} scene 
 * @param {*} name 
 **********************************************************/
export function removeLego(scene, name) {
    scene.remove(scene.getObjectByName(name, true));
};

/***********************************************************
 * 
 * @param {*} scene 
 * @param {*} name 
 * @param {*} color_ 
 **********************************************************/
export function changeColor(scene, name, color_) {
    const obj = scene.getObjectByName(name, true);

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
 * @param {*} name 
 * @param {*} opacity_ 
 **********************************************************/
export function changeOpacity(scene, name, opacity_) {
    const obj = scene.getObjectByName(name, true);

    obj.traverse((child) => {
        if (child.isMesh && child.geometry !== undefined) {
            child.material.transparent = true;
            child.material.opacity = opacity_;
        }
    });
};

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
        //
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        //
        this.lego = this.scene.getObjectByName(lego);
        //
        this.pick_position = new Vector3(
            Number((Math.round( ((this.lego.position.z + 2.8) / 0.8) * 100) / 100).toFixed(1)),
            Number((Math.round( ((this.lego.position.x + 9.2) / 0.8) * 100) / 100).toFixed(1)),
            Number((Math.round( (this.lego.position.y/0.48 - 0.01)   * 100) / 100).toFixed(1))
        );
        this.place_position = place_position
        this.place_rotation = place_rotation;
        this.step = 0.05;
        this.motion_down = true;
        this.planar_motion = false;
        this.x_lock = 0;
        this.z_lock = 0;
        this.pick();
    };

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
    };

    place = () => {
        if (this.place_rotation) {
            this.gripper.rotateY(-Math.PI / 2);
            if (this.lego.userData.size == 6 && this.lego.userData.rotation) {
                this.lego.translateX(-1.6);
            }
        };
    };

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
                // 2x2
                if (this.lego.userData.size === 2) {
                    if (this.lego.userData.rotation) {
                        this.lego.position.x += 9.2 - this.pick_position.y * 0.8;
                        this.lego.position.z += 2.8 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                    else {
                        this.lego.position.z += 2.8 - this.pick_position.y * 0.8;
                        this.lego.position.x += 9.2 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                }
                // 2x4
                else if (this.lego.userData.size === 4) {
                    if (this.lego.userData.rotation) {
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.position.x += 9.2 - this.pick_position.y * 0.8;
                        this.lego.position.z += 2.0 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                    else {
                        this.lego.position.x += 9.2 - this.pick_position.y * 0.8;
                        this.lego.position.z += 2.8 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                }
                // 2x6
                else {
                    if (this.lego.userData.rotation) {
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.position.x += 9.2 - this.pick_position.y * 0.8;
                        this.lego.position.z += 1.2 - this.pick_position.x * 0.8;
                        this.lego.position.y -= this.pick_position.z * 0.48;
                    }
                    else {
                        this.lego.position.z += 2.8 - this.pick_position.y * 0.8;
                        this.lego.position.x += 9.2 - this.pick_position.x * 0.8;
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

                let x_diff = this.gripper.position.x - (this.place_position.y * 0.8 - 9.2);
                let z_diff = this.gripper.position.z - (this.place_position.x * 0.8 - 2.8);

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
    };

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
                    this.place_position.y * 0.8 - 9.2,
                    this.place_position.z * 0.48,
                    this.place_position.x * 0.8 - 2.8
                )
            /** TODO: Move gripper up and make it vanish gradually */
            this.scene.remove(this.gripper);
            cancelAnimationFrame(frame_id);
            /********************************* 
             * Place Translation/Orientation *
             *********************************/
            if (this.lego.userData.size == 4) {
                if (this.place_rotation) { 
                    if (this.lego.userData.rotation) {
                        this.lego.rotateY(Math.PI / 2);
                    }
                    else { 
                        this.lego.translateX(-0.8);
                    }
                }
                else { 
                    if (this.lego.userData.rotation) {
                        // Do Nothing
                    }
                    else { 
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.translateX(-0.8);
                    }
                }
            }
            else if (this.lego.userData.size == 6) { 
                if (this.place_rotation) { 
                    if (this.lego.userData.rotation) {
                        this.lego.rotateY(Math.PI / 2);
                    }
                    else { 
                        this.lego.translateX(-1.6);
                    }
                }
                else { 
                    if (this.lego.userData.rotation) {
                        // Do Nothing
                    }
                    else { 
                        this.lego.rotateY(Math.PI / 2);
                        this.lego.translateX(-1.6);
                    }
                }
            }
        }
    };
}