let container, camera, scene, renderer, controls;

function load3D(element, file, rotation) {
    container = element;
    init(file);
    animate();
}

function init(file) {
    const fov = 45;
    const aspect = container.offsetWidth / container.offsetHeight;
    const near = 0.01;
    const far = 2000;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(0, 0, 4);

    scene = new THREE.Scene();
    const model = new THREE.GLTFLoader().load(
        file,
        function (gltf) {
            scene.add(gltf.scene);
        },
        undefined,
        console.error
    );

    renderer = WebGL.isWebGLAvailable() ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = .4;

    container.appendChild(renderer.domElement);

    const environment = new THREE.RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbbbbbb );
    scene.environment = pmremGenerator.fromScene( environment ).texture;
    environment.dispose();

    controls = new THREE.OrbitControls (camera, renderer.domElement);
    controls.enableGizmos = false;
    controls.target.set(0, 0, 0);
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