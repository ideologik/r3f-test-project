console.log('hola cubo', THREE)

// Scene
const scene = new THREE.Scene()

//Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'purple' })
const mesh = new THREE.Mesh(geometry, material)
//mesh.position.set(1, 1, 1)
//mesh.scale.set(1, 1, 1)
//mesh.rotation.set(Math.PI * 0.25, 0, 0)


// Second Mesh
const geometry2 = new THREE.BoxGeometry(1, 1, 1)
const material2 = new THREE.MeshBasicMaterial({ color: 'green' })
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.position.set(-1, 1, 1)


// Group
const group = new THREE.Group()
group.add(mesh)
group.add(mesh2)
//group.rotation.y = Math.PI * 0.25
scene.add(group)

// Camera
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 2000);
camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 1;

scene.add(camera);

const helper = new THREE.CameraHelper(camera);
scene.add(helper);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

//Renderer
const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)


// Clock
const clock = new THREE.Clock()



const animate = () => {

    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime * .1



    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()