
import {
    CylinderGeometry,
    BoxGeometry,
    Mesh,
    MeshPhongMaterial,
    Vector3,
    Group,
    Color
} from "three";

export default class CreateLego { 
    constructor(scene, size, color, name, position, rotation = false) {
        this.scene = scene;
        this.size = size;
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
        this.color = this.color_dict[color];
        this.name = name;
        /* position in mm */
        this.position = new Vector3(
            position.y * 0.8 - 9.2,
            position.z * 0.48 + 0.01,
            position.x * 0.8 - 2.8
        );
        this.rotation = rotation;
        this.lego_face = this.create_face();
        this.lego_cube = this.create_cube();
        // this.material = new MeshBasicMaterial({ color: this.color, flatShading: true });
        //
        this.create_lego();
    };

    create_face = ()=> { 
        const face = new Group()
        const material = new MeshPhongMaterial({
            color: this.color,
            flatShading: true,
            emissive: 0,
            specular: 0x070707,
            shininess: 100
        });
        const stud_geometry = new CylinderGeometry(0.1, 0.1, 0.12, 16);
        const stud_1 = new Mesh(stud_geometry, material);
        const stud_shift = 0.2;
        stud_1.position.set(stud_shift, 0.0, stud_shift);
        const stud_2 = new Mesh(stud_geometry, material);
        stud_2.position.set(-stud_shift, 0.0, stud_shift);
        const stud_3 = new Mesh(stud_geometry, material);
        stud_3.position.set(stud_shift, 0.0, -stud_shift);
        const stud_4 = new Mesh(stud_geometry, material);
        stud_4.position.set(-stud_shift, 0.0, -stud_shift);
        face.add(stud_1);
        face.add(stud_2);
        face.add(stud_3);
        face.add(stud_4);
        return face;
    };

    create_cube = () => { 
        const material = new MeshPhongMaterial({
            color: this.color,
            flatShading: true,
            emissive: 0,
            specular: 0x070707,
            shininess: 100
        });
        const cube = new BoxGeometry(0.8, 0.48, 0.8);
        const lego_cube = new Mesh(cube, material);
        lego_cube.position.set(0.0, 0.24, 0.0);
        return lego_cube;
    };

    create_2x2 = () => { 
        const lego_2x2 = new Group();
        const lego_cube = this.lego_cube.clone();
        const lego_face = this.lego_face.clone();
        lego_face.position.set(0.0, 0.52, 0.0);
        lego_2x2.add(lego_cube);
        lego_2x2.add(lego_face);
        return lego_2x2
    };

    create_2x4 = () => { 
        const lego_2x4 = new Group();
        const lego_2x2_1 = this.create_2x2();
        const lego_2x2_2 = this.create_2x2();
        lego_2x2_2.position.set(0.8, 0.0, 0.0)
        lego_2x4.add(lego_2x2_1);
        lego_2x4.add(lego_2x2_2);
        return lego_2x4;
    };

    create_2x6 = () => { 
        const lego_2x6 = new Group();
        const lego_2x2 = this.create_2x2();
        const lego_2x4 = this.create_2x4();
        lego_2x2.position.x += 1.6;
        lego_2x6.add(lego_2x4);
        lego_2x6.add(lego_2x2);
        return lego_2x6;
    };

    position_lego = (lego) => {
        lego.translateX(this.position.x);
        lego.translateY(this.position.y);
        lego.translateZ(this.position.z);
    };

    create_lego = () => {
        let lego = new Group();
        if (this.size === 2) {
            // create Lego 2x2 Brick
            lego = this.create_2x2();
        }
        else if (this.size === 4) {
            // create Lego 2x4 Brick
            lego = this.create_2x4();
            if (this.rotation) { 
                lego.position.z += 0.8;
            }
        }
        else if (this.size === 6) { 
            // create Lego 2x6 Brick
            lego = this.create_2x6();
            if (this.rotation) { 
                lego.position.z += 1.6;
            }
        }
        else { 
            // Throw an Error
            console.log(this.size);
            throw "Lego Block size has to be 2, 4, or 6!!";
        }
        // Translate the Brick to Position
        this.position_lego(lego);
        if (this.rotation) { 
            lego.rotateY(Math.PI/2);
        };
        lego.name = this.name;
        // Add the Brick to the scene
        this.scene.add(lego);
    };    
}