let container, camera, scene, renderer, controls, model;
function load3D(element) {
    if (!element) return false;
    container = element;
    const url = container.dataset.model;
    if (url) {
        init(url);
        animate();
    }
}

function init(file) {
    const fov = 45;
    const aspect = container.offsetWidth / container.offsetHeight;
    const near = 0.01;
    const far = 2000;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0, 0, 4);

    scene = new THREE.Scene();
    new THREE.GLTFLoader().load(
        file,
        function (gltf) {
            model = gltf.scene;
            model.traverse( function ( child ) {
                if (child.isMesh) {
                    if(child.name == "PCB") child.receiveShadow = true;
                    else child.castShadow = true;
                    child.geometry.computeVertexNormals(); // FIX
                }
            });
            scene.add(model);
            document.getElementById("threejs_loading").style.display = "none";
        },
        undefined,
        console.error
    );

    renderer = WebGL.isWebGLAvailable() ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const environment = new THREE.RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbbbbbb );
    scene.environment = pmremGenerator.fromScene( environment ).texture;
    environment.dispose();

    hlight = new THREE.AmbientLight (0x404040, 0.4);
    scene.add(hlight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 3, 2);
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.left = -2;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 10;
    directionalLight.shadow.mapSize.set(1024, 1024);
    scene.add(directionalLight);

    controls = new THREE.OrbitControls (camera, renderer.domElement);
    controls.enableGizmos = false;
    controls.target.set(0,0,0);
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // required if damping enabled
    render();
}
function render() {
    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', function () {
    const viewer_div = document.getElementById("threejs");
    if (viewer_div) {
        viewer_div.innerHTML =
            '<div id="threejs_loading">\n' +
            '  <div class="cube-wrapper">\n' +
            '    <div class="cube">\n' +
            '      <div class="cube-faces">\n' +
            '        <div class="cube-face shadow"></div>\n' +
            '        <div class="cube-face bottom"></div>\n' +
            '        <div class="cube-face top"></div>\n' +
            '        <div class="cube-face left"></div>\n' +
            '        <div class="cube-face right"></div>\n' +
            '        <div class="cube-face back"></div>\n' +
            '        <div class="cube-face front"></div>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '  </div>\n' +
            '</div>';
        load3D(viewer_div);
    }
}, false);