
import {
    Scene,
    Color,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    sRGBEncoding
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class SceneCreator { 
    constructor(container) { 
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.initScene();
    }

    initScene=()=> { 
        this.scene = new Scene();
        this.scene.background = new Color(0x21252d);
        this.createCamera();
        this.createLights();
        this.createControls();
        this.createRenderer();

        this.renderer.setAnimationLoop(() => {
            this.renderer.render(this.scene, this.camera);
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
    }

    createLights= ()=> {
        const mainLight = new DirectionalLight(0xffffff, 5);
        mainLight.position.set(10, 10, 10);
        
        const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
        this.scene.add(mainLight, hemisphereLight);
    }

    createRenderer = ()=> {
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor( 0xffffff, 0 );
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