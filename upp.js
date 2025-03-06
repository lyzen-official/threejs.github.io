// Set up the scene and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Load the GLB model
const loader = new THREE.GLTFLoader();
const modelPath = './concrete-frameb.glb'; // Relative path to the GLB file

let camera; // Declare a variable for the camera

loader.load(
  modelPath,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Optionally, adjust the model's position, rotation, or scale
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    model.rotation.set(0, 0, 0);

    // Log the model to the console for debugging
    console.log('Model loaded:', model);

    // Check if the GLB file contains a camera
    if (gltf.cameras && gltf.cameras.length > 0) {
      // Use the first camera from the GLB file
      camera = gltf.cameras[0];

      // Update the camera's aspect ratio and projection matrix
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Log the camera details
      console.log('Camera from GLB file:', camera);
    } else {
      // Fallback: Create a default camera if no camera is found in the GLB file
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(30, 0, 0); // Default position
      camera.lookAt(model.position); // Look at the model
      console.warn('No camera found in GLB file. Using default camera.');
    }

    // Add OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Add smooth damping (inertia)
    controls.dampingFactor = 0.05; // Adjust damping strength
    controls.screenSpacePanning = false; // Allow panning in screen space
    controls.minDistance = 1; // Minimum zoom distance
    controls.maxDistance = 50; // Maximum zoom distance
    controls.enablePan = true; // Enable panning
    controls.enableZoom = true; // Enable zooming
    controls.autoRotate = false; // Disable auto-rotation (optional)

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Required if controls.enableDamping is true
      controls.update();

      renderer.render(scene, camera);
    }
    animate();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened while loading the model:', error);
    console.error('Error details:', error.message, error.stack);
  }
);

// Handle window resizing
window.addEventListener('resize', () => {
  if (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
});