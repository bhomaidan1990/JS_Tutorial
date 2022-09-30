import {
    BoxGeometry,
    Mesh,
    MeshStandardMaterial,
    Vector3,
    Object3D,
    Group,
    Color,
} from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

/* BasePlate Dimensions 6.4 x ?? x 6.4 */
import base_plate_path from "../assets/dae/BasePlate_16x16.dae";
/* Lego Dimensions: (0.8 x 0.48 x 0.8) */
import lego_2x2_path from "../assets/dae/Lego_2x2.dae";
import lego_2x4_path from "../assets/dae/Lego_2x4.dae";
import lego_2x6_path from "../assets/dae/Lego_2x6.dae";

export default class ModelCreator {
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
    constructor(scene) {

        this.scene = scene;
        this.loader = new ColladaLoader();
        this.base_model = new Mesh();
        this.lego_2x2_model = new Mesh();
        this.lego_2x4_model = new Mesh();
        this.lego_2x6_model = new Mesh();
        this.loadModels();
    }
    loadModels = () => { 
        this.loadModel(base_plate_path, this.base_model);
        this.loadModel(lego_2x2_path, this.lego_2x2_model);
        this.loadModel(lego_2x4_path, this.lego_2x4_model);
        this.loadModel(lego_2x6_path, this.lego_2x6_model);
    }

    loadModel = (model_path, model_container_) => {
        const onLoad = (result, model_container) => {
            const model = result.scene.children[0];
            model_container.geometry = model.geometry.clone();
            model_container.material = model.material.clone(true);
            model_container.scale.set(0.05, 0.05, 0.05)
            model_container.material.color.set(0xFFFF00);
            this.scene.add(model_container);
        };
        this.loader.load(
            model_path,
            collada => onLoad(collada, model_container_),
        ), (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); },
            (error) => { console.log('An error happened'); };
    }

    createModel = (typ, pos, name, color, rot=false) => {
        const model_ = new Mesh();

        const color_dict = {
            red:    new Color(0x52010C),
            green:  new Color(0x004904),
            blue:   new Color(0x010C52),
            yellow: new Color(0x5A4B00),
            white:  new Color(0x4D4D4D),
            olive:  new Color(0x243E02),
            light:  new Color(0x74A545)
        }

        let pos_in_mm = new Vector3(
            pos.y * 0.8 - 9.2,
            pos.z * 0.48,
            pos.x * 0.8 - 2.8
        );

        if (typ == "base") {
            model_.add(this.base_model.clone());
            model_.material.color.set(0xffff00);
        }
        else if (typ == "lego_2x2") {
            model_.add(this.lego_2x2_model.clone());
        }
        else if (typ == "lego_2x4") {
            model_.add(this.lego_2x4_model.clone());
            if (rot) {
                pos_in_mm.z += 0.4;
            }
            else {
                pos_in_mm.x += 0.4;
            }
        }
        else if (typ == "lego_2x6") {
            if (! rot) {
                pos_in_mm.x += 0.8;
                pos_in_mm.z -= 0.8;
            }
            model_.add(this.lego_2x6_model.clone());
        }
        else {
            console.log("Wrong Type Selected, Available types are: base, lego_2x2, lego_2x4, lego_2x6")
            throw 'Wrong Model Type Selected!';
        }

        model_.translateX(pos.x);
        model_.translateY(pos.y);
        model_.translateZ(pos.z);

        if (rot) {
            model_.rotateY(Math.PI / 2);
        }
        // model_.children[0].material.color.set(color_dict[color]);
        /* Supplementary Information */
        model_.userData.color = this.color;
        model_.name = name;

        this.scene.add(model_);
    }

    createBase = ()=> {
        /* 16x16 ==> 48x24 */
        let bases_pos = [];
    
        const base_pos_0 = new Vector3(11.5, 0.0, 3.5);
        const base_pos_1 = new Vector3( 3.5, 0.0, 3.5);
        const base_pos_2 = new Vector3(19.5, 0.0, 3.5);
        const base_pos_3 = new Vector3( 3.5, 0.0, 7.5);
        const base_pos_4 = new Vector3(11.5, 0.0, 7.5);
        const base_pos_5 = new Vector3(19.5, 0.0, 7.5);
    
        bases_pos.push(base_pos_0);
        bases_pos.push(base_pos_1);
        bases_pos.push(base_pos_2);
        bases_pos.push(base_pos_3);
        bases_pos.push(base_pos_4);
        bases_pos.push(base_pos_5);
    
        for (let i = 0; i < bases_pos.length; i++) {
            this.createModel("base", bases_pos[i], "base_"+i, "green");
        }
    }
    
    removeLego = (name) => {
        console.log("Removing Object from the Scene...");
        console.log(this.scene.getObjectByName(name, true));
        this.scene.remove(this.scene.getObjectByName(name, true));
    }
    /* This function does not work */
    changeColorLego = (name, color) => {
        // if (this.scene.getObjectByName(name).length > 0){
        //     this.scene.getObjectByName(name).material.color.set(color);
    }
      
    createGripper=(pos, gripper_color = 0xaaaaaa)=> {
    
        let pos_in_mm = new Vector3(
            pos.y * 0.8 - 9.2,
            pos.z * 0.48,
            pos.x * 0.8 - 2.8
        );
        const gripper = new Group();
        gripper.name = "gripper";
    
        const gripper_material = new MeshStandardMaterial({ color: gripper_color });
        // gripper_material.transparent = true;
        gripper_material.opacity = 0.7;
    
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
        base.position.x = pos_in_mm.x;
        base.position.z = pos_in_mm.z;
        base.name = "base";
    
        // fingers
        const finger_geometry = new BoxGeometry(0.8, 0.6, 0.8);
    
        const finger_right = new Mesh(finger_geometry, gripper_material);
        finger_right.position.y = pos_in_mm.y + 0.3;
        finger_right.position.x = pos_in_mm.x + 0.8;
        finger_right.position.z = pos_in_mm.z;
        finger_right.name = "finger_right";
    
        const finger_left = new Mesh(finger_geometry, gripper_material);
        finger_left.position.y = pos_in_mm.y + 0.3;
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
        console.log("Gripper Created");
}
}