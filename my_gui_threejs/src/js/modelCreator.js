import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    Vector3,
    Object3D,
    Group,
    Color
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
/* BasePlate Dimensions 6.4 x ?? x 6.4 */
import base_plate_path from "../assets/glb/BasePlate_16x16.glb";
/* Lego Dimensions: (0.8 x 0.48 x 0.8) */
import lego_2x2_path from "../assets/glb/Lego_2x2.glb";
import lego_2x4_path from "../assets/glb/Lego_2x4.glb";
import lego_2x6_path from "../assets/glb/Lego_2x6.glb";

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
    * @param: model_names, array of string, unique name for each model.                       *
    * @param: scene, THREE.Scene(), instance of the scene.                                    *
    * ---                                                                                     *
    * Methods:                                                                                *
    * ---                                                                                     *
    * @method: create, to call other methods and create a gltf model.                         *                                                                                 *
    * @method: loadModel, to load the glTF model and clone the instances.                     *
    * @method: duplicateModel, to duplicate the instances with the given params:              *
    *   (position, rotation, color, name)                                                     *
    ******************************************************************************************/
    constructor(model_path, model_containers,
        model_positions, model_rotation, model_color, model_names, scene) {
        this.model_path = model_path;
        this.model_containers = model_containers;
        this.model_positions = model_positions;
        this.model_rotation = model_rotation;
        this.model_color = model_color;
        this.model_names = model_names;
        this.scene = scene;
        this.loader = new GLTFLoader();
    }
    create = () => { 
        this.loadModel();
        this.duplicateModel();
    }
    
    loadModel =()=> {
        const onLoad = (result, model_containers) => {
            const model = result.scene.children[0];
            model.position.set(0.0, 0.0, 0.0);
            model.scale.set(0.05, 0.05, 0.05);
            model.material.color.set(this.model_color)
            for (let i = 0; i < model_containers.length; i++) {
                model_containers[i].add(model.clone(true));
            }
        };
        this.loader.load(
            this.model_path,
            gltf => onLoad(gltf, this.model_containers),
        ), undefined, function (error) {
            console.log('An error happened');
        };
    }

    duplicateModel = () => {
        for (let i = 0; i < this.model_containers.length; i++) {

            this.model_containers[i].translateX(this.model_positions[i].x);
            this.model_containers[i].translateY(this.model_positions[i].y);
            this.model_containers[i].translateZ(this.model_positions[i].z);

            if (this.model_rotation) {
                this.model_containers[i].rotateY(Math.PI/2);
            }
            
            /* Supplementary Information */
            this.model_containers[i].userData.color = this.model_color;
            this.model_containers[i].name = this.model_names[i];
            
            this.scene.add(this.model_containers[i]);
        }
    }
}

export function createBase(scene) {
    /* 16x16 ==> 48x24 */
    let bases = [];
    let bases_pos = [];
    let bases_names = [];

    for (let i = 0; i < 6; i++) { 
        bases.push(new Object3D());
        bases_names.push("base_"+i);
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
        false, 0x004904, bases_names, scene);
    
    baseCreator_.create()
}


export function createLego(position, color, name, scene, size=2, rot=false) {
    let lego = [new Object3D()];
    const color_dict = {
        red:    new Color(0x52010C),
        green:  new Color(0x004904),
        blue:   new Color(0x010C52),
        yellow: new Color(0x5A4B00),
        white:  new Color(0x4D4D4D),
        olive:  new Color(0x243E02),
        light:  new Color(0x74A545)
    }
    let model_path;

    let pos_in_mm = new Vector3(
        position.y * 0.8 - 9.2,
        position.z * 0.48,
        position.x * 0.8 - 2.8
    );

    if (size == 2) {
        model_path = lego_2x2_path;
    }
    else if (size == 4) {
        model_path = lego_2x4_path;
        if (rot) {
            pos_in_mm.z += 0.4;
        }
        else { 
            pos_in_mm.x += 0.4;
        }
    }
    else if (size == 6) {
        model_path = lego_2x6_path;
        if (! rot) {
            pos_in_mm.x += 0.8;
            pos_in_mm.z -= 0.8;
        }
    }
    else { 
        console.log("Wrong Lego Size!!, size must be 2, 4, or 6!");
    }
    
    const legoCreator_ = new ModelCreator(model_path, lego, [pos_in_mm],
        rot, color_dict[color], [name], scene);
    
    legoCreator_.create();
}
 
export function removeLego(scene, name) {;
    scene.remove(scene.getObjectByName(name, true));
}

export function createGripper(pos, scene, gripper_color = 0xaaaaaa){
    
    let pos_in_mm = new Vector3(
        pos.y * 0.8 - 9.2,
        pos.z * 0.48,
        pos.x * 0.8 - 2.8
    );
    const gripper = new Group();
    gripper.name = "gripper";

    const gripper_material = new MeshBasicMaterial({ color: gripper_color });
    // gripper_material.transparent = true;
    gripper_material.opacity= 0.7;

    //Pole
    const pole_geometry = new BoxGeometry(0.8, 5, 0.8);
    
    const pole = new Mesh(pole_geometry, gripper_material);
    pole.position.y = pos_in_mm.y + 3.7;
    pole.position.x = pos_in_mm.x;
    pole.position.z = pos_in_mm.z;
    pole.name = "pole";

    // Base
    const base_geometry = new BoxGeometry(3.0, 0.6, 0.8);
    const base = new Mesh(base_geometry, gripper_material);
    base.position.y = pos_in_mm.y + 0.9;
    base.position.x = pos_in_mm.x ;
    base.position.z = pos_in_mm.z ;
    base.name = "base";

    // fingers
    const finger_geometry = new BoxGeometry(0.8, 0.6, 0.8);

    const finger_right = new Mesh(finger_geometry, gripper_material);
    finger_right.position.y = pos_in_mm.y+0.3;
    finger_right.position.x = pos_in_mm.x + 0.8;
    finger_right.position.z = pos_in_mm.z;
    finger_right.name = "finger_right";

    const finger_left = new Mesh(finger_geometry, gripper_material);
    finger_left.position.y = pos_in_mm.y+0.3;
    finger_left.position.x = pos_in_mm.x - 0.8;
    finger_left.position.z = pos_in_mm.z;
    finger_left.name = "finger_left";

    // adding to pole
    gripper.add(pole);
    gripper.add(base);
    gripper.add(finger_right);
    gripper.add(finger_left);

    // adding to scene
    scene.add(gripper);
}

/* This function does not work */
export function changeColorLego(scene, name, color) {

    // colors
    const red_color    = new Color(0xCC0100);
    const green_color  = new Color(0x004904);
    const blue_color   = new Color(0x010C52);
    const yellow_color = new Color(0x5A4B00);
    const white_color  = new Color(0x4D4D4D);
    const olive_color  = new Color(0x243E02);
    const light_color  = new Color(0x4DDD30);
    
    this.color_dict = {
        red:    red_color,
        green:  green_color,
        blue:   blue_color,
        yellow: yellow_color,
        white:  white_color,
        olive:  olive_color,
        light:  light_color
    }
    
    if (scene.getObjectByName(name).children.length > 0)
    {
        scene.getObjectByName(name, true).children[0].material.color.set(color_dict[color]);
    }
    else {
        // This part is executed
        console.log(scene.getObjectByName(name, true).children);
     }
}