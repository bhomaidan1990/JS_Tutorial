import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import lego_2x2_path from "../assets/dae/Lego_2x2.dae";

let container, stats, controls;
let camera, scene, renderer;

export function init() {

	container = document.getElementById('container');

	camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
	camera.position.set(1, 10, - 1);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x21252d);

	// collada

	const loader = new ColladaLoader();
	loader.load(lego_2x2_path, function (collada) {

		const avatar = collada.scene;
		avatar.position.set(0.0, 0.0, 0.0);
        avatar.scale.set(0.05, 0.05, 0.05)
		avatar.children[0].material.color.set(0xffff00);
		scene.add(avatar);

	});

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	const pointLight = new THREE.PointLight(0xffffff, 0.8);
	scene.add(camera);
	camera.add(pointLight);

	//
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	//
	controls = new OrbitControls(camera, renderer.domElement);
	controls.screenSpacePanning = true;
	controls.minDistance = 5;
	controls.maxDistance = 40;
	controls.target.set(0, 2, 0);
	controls.update();

	//
	stats = new Stats();
	container.appendChild(stats.dom);

	//
	window.addEventListener('resize', onWindowResize);
	console.log(scene);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

export function animate() {

	requestAnimationFrame(animate);

	renderer.render(scene, camera);
	stats.update();

}