let camera, scene, renderer, controls;
const container_height = 600, container_width = 1200;

function load3D(container, file) {
    init(container, file);
    animate();
}

function init(container, file) {
    const fov = 45;
    const aspect = container_width / container_height;
    const near = 0.01;
    const far = 2000;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set(-0.75, 0.7, 1.25);

    scene = new THREE.Scene();
    const model = new THREE.GLTFLoader().load(
        file,
        function (gltf) {
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        console.error
    );

    renderer = WebGL.isWebGLAvailable() ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container_width, container_height);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    const environment = new THREE.RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbbbbbb );
    scene.environment = pmremGenerator.fromScene( environment ).texture;
    environment.dispose();

    const grid = new THREE.GridHelper( 500, 10, 0xffffff, 0xffffff );
    grid.material.opacity = 0.5;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add( grid );

    controls = new THREE.ArcballControls (camera, renderer.domElement);
    controls.minDistance = 400;
    controls.maxDistance = 1000;
    controls.gizmoVisible = true
    controls.target.set( 10, 90, - 16 );
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = container_width / container_height;
    camera.updateProjectionMatrix();
    renderer.setSize(container_width, container_height);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // required if damping enabled
    render();
}
function render() {
    renderer.render(scene, camera);
    console.log(camera,controls);
}