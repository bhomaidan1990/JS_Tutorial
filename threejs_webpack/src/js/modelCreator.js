import { Vector3, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* BasePlate Dimensions 6.4 x ?? x 6.4 */
import base_plate_path from "../assets/glb/BasePlate_16x16.glb";
/* Lego Dimensions: (0.8 x 0.48 x 0.8) */
import lego_2x2_red_path from "../assets/glb/Lego_2x2_red.glb";
import lego_2x2_green_path from "../assets/glb/Lego_2x2_green.glb";
import lego_2x2_blue_path from "../assets/glb/Lego_2x2_blue.glb";
import lego_2x2_yellow_path from "../assets/glb/Lego_2x2_yellow.glb";
import lego_2x2_white_path from "../assets/glb/Lego_2x2_white.glb";
import lego_2x2_olive_path from "../assets/glb/Lego_2x2_olive.glb";
import lego_2x2_light_path from "../assets/glb/Lego_2x2_light.glb";

import lego_2x4_red_path from "../assets/glb/Lego_2x4_red.glb";
import lego_2x4_blue_path from "../assets/glb/Lego_2x4_blue.glb";
import lego_2x4_yellow_path from "../assets/glb/Lego_2x4_yellow.glb";

class ModelCreator {
    /******************************************************************************************
    * Class: ModelCreator                                                                     *
    * To load glTF model and clone multiple instances.                                        *
    * @author: Belal HMEDAN, LIG/Marvin, France, 2022.                                        *
    * ---                                                                                     *
    * Parameters:                                                                             *
    * ---                                                                                     *
    * @param: model_path, string, the path to the glTF model.                                 *
    * @param: model_containers, array of Object3D, clones of the model.                       *
    * @param: model_positions, array of Vector3, model positions.                             *
    * @param: model_rotations, array of bool, model rotation, LEGO 2x4 specific option.       *
    * @param: model_colors, array of string, model colors.                                    *
    * @param: model_ids, array of int, unique id for each model.                              *
    * @param: scene, THREE.Scene(), instance of the scene.                                    *
    * ---                                                                                     *
    * Methods:                                                                                *
    * ---                                                                                     *
    * @method: loadModel, to load the glTF model and clone the instances.                     *
    * @method: duplicateModel, to duplicate the instances with the given params:              *
    *   (position, rotation, color, id)                                                       *
    ******************************************************************************************/
    constructor(model_path, model_containers,
        model_positions, model_rotations, model_colors = null, model_ids, scene) {
        this.model_path = model_path;
        this.model_containers = model_containers;
        this.model_positions = model_positions;
        this.model_rotations = model_rotations;
        this.model_colors = model_colors;
        this.model_ids = model_ids;
        this.scene = scene;
        this.loader = new GLTFLoader();
    }
    create() { 
        this.loadModel();
        this.duplicateModel();
    }
    
    loadModel() {
        const onLoad = (result, model_containers) => {
            const model = result.scene.children[0];
            model.position.set(0.0, 0.0, 0.0);
            model.scale.set(0.05, 0.05, 0.05);

            for (let i = 0; i < model_containers.length; i++) {
                model_containers[i].add(model.clone());
            }
        };
        this.loader.load(
            this.model_path,
            gltf => onLoad(gltf, this.model_containers),
        ), undefined, function (error) {
            console.log('An error happened');
        };
    }

    duplicateModel() {
        for (let i = 0; i < this.model_containers.length; i++) {

            this.model_containers[i].translateX(this.model_positions[i].x);
            this.model_containers[i].translateY(this.model_positions[i].y);
            this.model_containers[i].translateZ(this.model_positions[i].z);

            if (this.model_rotations[i]) {
                this.model_containers[i].rotateY(Math.PI/2);
            }
            
            /* Supplementary Information */
            this.model_containers[i].userData.color = this.model_colors[i];
            this.model_containers[i].userData.id = this.model_ids[i];
            
            this.scene.add(this.model_containers[i]);
        }
    }
}

export function createBase(scene) {
    /* 16x16 ==> 48x24 */
    let bases = [];
    let bases_pos = [];
    let bases_rot = [];
    let bases_colors = [];
    let bases_ids = [];

    for (let i = 0; i < 6; i++) { 
        bases.push(new Object3D());
        bases_rot.push(false);
        /* Green Color */
        bases_colors.push(0x00FF00);
        bases_ids.push(100+i);
    }

    const base_pos_0 = new Vector3( 0.0, 0.0, 0.0);
    const base_pos_1 = new Vector3(-6.4, 0.0, 0.0);
    const base_pos_2 = new Vector3( 6.4, 0.0, 0.0);
    const base_pos_3 = new Vector3(-6.4, 0.0, 3.2);
    const base_pos_4 = new Vector3( 0.0, 0.0, 3.2);
    const base_pos_5 = new Vector3(6.4, 0.0, 3.2);

    bases_pos.push(base_pos_0);
    bases_pos.push(base_pos_1);
    bases_pos.push(base_pos_2);
    bases_pos.push(base_pos_3);
    bases_pos.push(base_pos_4);
    bases_pos.push(base_pos_5);

    const baseCreator_ = new ModelCreator(base_plate_path, bases, bases_pos,
        bases_rot, bases_colors, bases_ids, scene);
    
    baseCreator_.create()
}

export function createLego(position, color, id, scene, size=2, rot=false) {
    let lego = [new Object3D()];
    const model_color = {
        2: {
            red: lego_2x2_red_path,
            green: lego_2x2_green_path,
            blue: lego_2x2_blue_path,
            yellow: lego_2x2_yellow_path,
            white: lego_2x2_white_path,
            olive: lego_2x2_olive_path,
            light: lego_2x2_light_path
        },
        4: {
            red: lego_2x4_red_path,
            blue: lego_2x4_blue_path,
            yellow: lego_2x4_yellow_path
        }
};
    let lego_rot = [rot];
    let lego_color = [color];
    let lego_id = [id];

    let model_path;

    let pos_in_mm = new Vector3(
        position.y * 0.8 - 9.2,
        position.z * 0.48,
        position.x * 0.8 - 2.8
    );

    if (size == 2) {
        model_path = model_color[size][color];
    }
    else if (size == 4) {
        model_path = model_color[size][color];
        if (rot) {
            pos_in_mm.z += 0.4;
        }
        else { 
            pos_in_mm.x += 0.4;
        }
    }
    else { 
        console.log("Wrong Lego Size!!, size must be 2, or 4")
    }
    
    
    let lego_pos = [pos_in_mm];

    const legoCreator_ = new ModelCreator(model_path, lego, lego_pos,
        lego_rot, lego_color, lego_id, scene);
    
        legoCreator_.create()
}
 
export function removeLego(scene, name) {
    scene.remove(scene.getObjectByName(name, true));
    scene.remove(scene.getObjectById(18));
}