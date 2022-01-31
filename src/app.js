import * as THREE from '../libs/three/build/three.module.js';

let camera, scene, renderer, mesh;

const clock = new THREE.Clock();

function main() {
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
        camera.position.set(4, 3, 5).multiplyScalar(3);
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
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 2, 4);
        scene.add(light);
    }

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshPhongMaterial({color: 0xff0000})
    );

    scene.add(mesh);
}

function animate() {
    const time = clock.getElapsedTime();
    const r = time * 0.1

    mesh.rotation.set(r * 2, r * 3, r * 4)

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

main();
animate();
