const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical', 
  gestureDirection: 'vertical', 
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

//get scroll value
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
  console.log({ scroll, limit, velocity, direction, progress })
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

let scene, camera, renderer, model;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let dampingFactor = 0.05;

let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 12;
    camera.position.y = 3;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    document.getElementById('model-container').appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-5, 5, -5);
    scene.add(directionalLight);
    
    loadModel();
    
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    animate();
}

function loadModel() {
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        './static/model.glb',
        function(gltf) {
            model = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;
            
            const scale = 1.8;
            model.scale.set(scale, scale, scale);
            
            scene.add(model);
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.error('An error happened while loading the model:', error);
        }
    );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
    targetRotationY = map(mouseX, -windowHalfX, windowHalfX, -Math.PI*0.5, Math.PI*0.5);
    targetRotationX = map(mouseY, -windowHalfY, windowHalfY, -Math.PI/4*0.3, Math.PI/4*0.3);
}

function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        currentRotationX += (targetRotationX - currentRotationX) * dampingFactor;
        currentRotationY += (targetRotationY - currentRotationY) * dampingFactor;
        model.rotation.x = currentRotationX;
        model.rotation.y = currentRotationY;
    }
    renderer.render(scene, camera);
}

init(); 