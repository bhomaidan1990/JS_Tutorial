
import {
    Scene,
    Color,
    Vector3,
    AxesHelper,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    AmbientLight,
    sRGBEncoding
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class SceneCreator {
    /**
     * 
     * @param {*} container 
     */
    constructor(container) { 
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.stats = new Stats();
        this.initScene();
    };

    initScene=()=> { 
        this.scene = new Scene();
        this.scene.background = new Color(0x21252d);

        this.createCamera();
        this.createLights();
        this.createControls();
        this.createRenderer();
        this.createAxe();
        this.container.appendChild(this.stats.dom);
        this.renderer.setAnimationLoop(() => {
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
        });

        window.addEventListener("resize", this.onWindowResize, false);
    }

    createCamera=()=> { 
        const fov = 60; 
        const near = 1;
        const far = 1000;
        const aspect_ratio = this.container.clientWidth/this.container.clientHeight
        this.camera = new PerspectiveCamera(fov, aspect_ratio, near, far);
        this.camera.position.set(0.1, 30, 15);
    }

    createControls=()=> {
        /* Create Controls to allow for scene control */
        const controls = new OrbitControls(this.camera, this.container);
        controls.update();
    }

    createLights= ()=> {
        const mainLight = new DirectionalLight(0xffffff, 5);
        mainLight.position.set(10, 10, 10);

        const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
        const ambientLight = new AmbientLight(0x404040, 5);

        this.scene.add(mainLight, hemisphereLight, ambientLight);
    }

    createAxe = (len=1.6, pos=null) => { 
        const axis = new AxesHelper(len);

        const red   = new Color(0xff0000);
        const green = new Color(0x00ff00);
        const blue  = new Color(0x0000ff);
        
        axis.setColors(green, blue, red);

        if (pos === null) { 
            pos = new Vector3(8.0, 5.0, -3.2);
        }
        axis.position.x = pos.x;
        axis.position.y = pos.y;
        axis.position.z = pos.z;
       
        this.scene.add(axis);
    }
    createRenderer = ()=> {
        this.renderer = new WebGLRenderer('webgl2',{ antialias: true, alpha: true });
        this.renderer.setClearColor( 0xA3A3A3, 0 );
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
    }

    onWindowResize = ()=> {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    
        // Update camera frustum
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    getScene = () => { 
        return this.scene;
    }

    getCamera = () => { 
        return this.camera;
    }

    getRenderer= () => { 
        return this.renderer;
    }
}