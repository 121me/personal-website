import * as THREE from '../libs/three/build/three.module.js';
import { TWEEN } from '../libs/three/jsm/libs/tween.module.min.js';

let camera, scene, renderer;

let INTERSECTED = undefined;

const meshes = [];

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

const clock = new THREE.Clock();

/*
 * Initialize the scene
 */
function init() {
    const canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;

    {
        const fov = 40;
        const aspect = 2;  // the canvas default
        const zNear = 0.1;
        const zFar = 1000;
        camera = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
        camera.position.set(-10, 0, 0).multiplyScalar(3);
        camera.lookAt(0, 0, 0);
    }

    scene = new THREE.Scene();

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 20, 0);
        scene.add(light);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        const d = 50;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 50;
        light.shadow.bias = 0.001;
    }

    {
        const light = new THREE.AmbientLight(0xffffff, 0.2);
        light.position.set(0, 0, 0);
        scene.add(light);
    }

    {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshPhongMaterial({color: 0xff0000})
        );

        mesh.position.set(0, 0, -15);

        scene.add(mesh);
        meshes.push(mesh);
    }

    {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshPhongMaterial({color: 0x00ff00})
        );

        mesh.position.set(0, 6, -15);

        scene.add(mesh);
        meshes.push(mesh);
    }

    {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshPhongMaterial({color: 0x0000ff})
        );

        mesh.position.set(0, -6, -15);

        scene.add(mesh);
        meshes.push(mesh);
    }

    /*
    const ground = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 0.1),
        new THREE.MeshPhongMaterial({color: 0xaaaaaa})
    );

    ground.position.set(400, -5, 0);
    ground.rotation.x = -Math.PI / 2;

    scene.add(ground);
     */

    document.addEventListener( 'pointermove', onPointerMove );
}

function animate() {
    const time = clock.getElapsedTime();
    const r = time * 0.1

    TWEEN.update();

    meshes.forEach(mesh => {
        mesh.rotation.set(r * 2, r * 3, r * 4)
    });

    requestAnimationFrame(animate);
    render();
}

function render() {

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
}

function zoomObject(object, ratio) {
    new TWEEN.Tween(object.scale)
        .to({x: ratio, y: ratio, z: ratio}, 1000)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();
}

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( meshes, false );

    if ( intersects.length > 0 ) {

        const object = intersects[ 0 ].object;

        if ( INTERSECTED !== object ) {

            if ( INTERSECTED ) {
                zoomObject(INTERSECTED, 1);
            }

            INTERSECTED = object;
            zoomObject(INTERSECTED, 1.5);

        }

    } else {

        if (INTERSECTED) {
            zoomObject(INTERSECTED, 1);
            INTERSECTED = undefined;
        }

    }
}

init();
animate();
