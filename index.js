let camera, scene, renderer, controls;

function load3D(container, path, file){
    init(container, path, file);
    animate();
}

function init(container, path, file) {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20);
    camera.position.set(-0.75, 0.7, 1.25);

    scene = new THREE.Scene();

    // model
    new GLTFLoader()
        .setPath(path)
        .load(file, function (gltf) {
            scene.add(gltf.scene);
        });

    renderer = WebGL.isWebGLAvailable() ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene.background = new THREE.Color(0xbbbbbb);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set(0, 0.35, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // required if damping enabled
    render();
}

function render() {
    renderer.render(scene, camera);
}