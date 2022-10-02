
import {
    CylinderGeometry,
    BoxGeometry,
    EdgesGeometry,
    LineSegments,
    Mesh,
    MeshPhongMaterial,
    LineBasicMaterial,
    Vector3,
    Group,
    Color
} from "three";

export default class CreateLego {

    constructor(scene, size, color, name, position, rotation = false) {
        this.scene = scene;
        this.size = size;
        // colors
        const red_color = new Color(0x660505);
        const green_color = new Color(0x004904);
        const blue_color = new Color(0x010C52);
        const yellow_color = new Color(0x5A4B00);
        const white_color = new Color(0x4D4D4D);
        const olive_color = new Color(0x243E02);
        const light_color = new Color(0x3A5820);

        this.color_dict = {
            red: red_color,
            green: green_color,
            blue: blue_color,
            yellow: yellow_color,
            white: white_color,
            olive: olive_color,
            light: light_color
        }
        this.color = this.color_dict[color];
        this.name = name;
        /* position in mm */
        this.position_mm = new Vector3(
            position.y * 0.8 - 8.8,
            position.z * 0.48 + 0.01,
            position.x * 0.8 - 2.4
        );
        this.position = position;
        this.rotation = rotation;
        this.create_lego();
    };

    create_face = () => {
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

    create_2x2_cube = () => {
        const material = new MeshPhongMaterial({
            color: this.color,
            flatShading: true,
            emissive: 0,
            specular: 0x070707,
            shininess: 100
        });
        const cube = new BoxGeometry(0.8, 0.48, 0.8);
        const lego_cube = new Mesh(cube, material);
        const mat = new LineBasicMaterial({ color: this.color, linewidth: 1 });
        /* Borders*/
        let geo = new EdgesGeometry(lego_cube.geometry);
        let borders = new LineSegments(geo, mat);
        borders.renderOrder = 1; // make sure borders are rendered 2nd
        lego_cube.add( borders );
        lego_cube.position.set(0.0, 0.24, 0.0);
        return lego_cube;
    };

    create_2x2 = () => {
        const lego_2x2 = new Group();
        const lego_cube = this.create_2x2_cube();
        const lego_face = this.create_face();
        lego_2x2.add(lego_cube);
        lego_2x2.add(lego_face);
        lego_face.position.set(0.0, 0.52, 0.0);
        return lego_2x2
    };

    create_2x4_brick = () => {
        const material = new MeshPhongMaterial({
            color: this.color,
            flatShading: true,
            emissive: 0,
            specular: 0x070707,
            shininess: 100
        });
        const brick = new BoxGeometry(1.6, 0.48, 0.8);
        const lego_brick = new Mesh(brick, material);
        const mat = new LineBasicMaterial({ color: this.color, linewidth: 1 });
        /* Borders*/
        let geo = new EdgesGeometry(lego_brick.geometry);
        let borders = new LineSegments(geo, mat);
        borders.renderOrder = 1; // make sure borders are rendered 2nd
        lego_brick.add(borders);
        lego_brick.position.set(0.0, 0.24, 0.0)
        return lego_brick;
    };
    
    create_2x4 = () => {
        const lego_2x4 = new Group();
        const lego_2x4_brick = this.create_2x4_brick();
        const face_1 = this.create_face();
        const face_2 = this.create_face();
        
        lego_2x4.add(lego_2x4_brick);
        lego_2x4.add(face_1);
        lego_2x4.add(face_2);
        
        face_1.position.set(+0.4, 0.52, 0.0);
        face_2.position.set(-0.4, 0.52, 0.0);

        return lego_2x4;
    };

    create_2x6_bar = () => {
        const material = new MeshPhongMaterial({
            color: this.color,
            flatShading: true,
            emissive: 0,
            specular: 0x070707,
            shininess: 100
        });
        const bar = new BoxGeometry(2.4, 0.48, 0.8);
        const lego_bar = new Mesh(bar, material);
        const mat = new LineBasicMaterial({ color: this.color, linewidth: 1 });
        /* Borders*/
        let geo = new EdgesGeometry(lego_bar.geometry);
        let borders = new LineSegments(geo, mat);
        borders.renderOrder = 1; // make sure borders are rendered 2nd
        lego_bar.add(borders);
        lego_bar.position.set(0.0, 0.24, 0.0);
        return lego_bar;
    };

    create_2x6 = () => {
        const lego_2x6 = new Group();
        const lego_2x6_bar = this.create_2x6_bar();
        const face_1 = this.create_face();
        const face_2 = this.create_face();
        const face_3 = this.create_face();
        
        lego_2x6.add(lego_2x6_bar);
        lego_2x6.add(face_1);
        lego_2x6.add(face_2);
        lego_2x6.add(face_3);

        face_1.position.set(+0.8, 0.52, 0.0);
        face_2.position.set(+0.0, 0.52, 0.0);
        face_3.position.set(-0.8, 0.52, 0.0);
        return lego_2x6;
    };

    position_lego = (lego) => {
        lego.translateX(this.position_mm.x);
        lego.translateY(this.position_mm.y);
        lego.translateZ(this.position_mm.z);
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
                lego.position.z += 0.4;
            }
            else { 
                lego.position.x += 0.4;
            }
        }
        else if (this.size === 6) {
            // create Lego 2x6 Brick
            lego = this.create_2x6();
            if (this.rotation) {
                lego.position.z += 0.8;
            }
            else { 
                lego.position.x += 0.8;
            }
        }
        else {
            // Throw an Error
            console.log(this.size);
            throw Object.assign(
                new Error("Lego Block size has to be 2, 4, or 6!!"),
                { code: 402 }
             );
        }
        // Translate the Brick to Position
        this.position_lego(lego);
        if (this.rotation) {
            lego.rotateY(Math.PI / 2);
        };
        lego.name = this.name;
        lego.userData.size = this.size;
        lego.userData.rotation = this.rotation;
        lego.userData.position = this.position;
        this.scene.add(lego);
    };
}