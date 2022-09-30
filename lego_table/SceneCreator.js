
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
} from "three";

export default class SceneCreator { 
    constructor(container) { 
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.initScene();
    }

    initScene() { 
        this.scene = new Scene();
        this.createCamera();
        this.createLights();
        this.createControls();
        this.createRenderer();

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });

        window.addEventListener("resize", this.onWindowResize, false);
    }

    createCamera() { 
        fov = 60; near = 1; far = 1000;
        aspect_ratio = this.container.clientWidth/this.container.clientHeight
        this.camera = PerspectiveCamera(fov, aspect_ratio, near, far);
        this.camera.position.z += 85;
        this.camera.position.y += 110;
        this.camera.position.x += 35;
        this.camera.rotation.x = (-55* Math.PI / 180);
    }

    createControls() {
        /* Create Controls to allow for scene control */
        controls = new OrbitControls(this.camera, this.container);
    }

    createLights() {
        const mainLight = new DirectionalLight(0xffffff, 5);
        mainLight.position.set(10, 10, 10);
        
        const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
        this.scene.add(mainLight, hemisphereLight);
    }

    createRenderer() {
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor( 0xffffff, 0 );
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
    
        this.container.appendChild(this.renderer.domElement);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    
        // Update camera frustum
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    getScene() { 
        return this.scene;
    }

    getCamera() { 
        return this.Camera;
    }

    getRenderer() { 
        return this.renderer;
    }
}