let scene, camera, renderer, dice;
let rollInterval;

document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-button');
    const diceType = document.getElementById('dice-type');
    const result = document.getElementById('result');
    const darkModeToggle = document.getElementById('dark-mode');

    initThreeJS();
    createDice(6); // Start with a D6

    diceType.addEventListener('change', () => createDice(parseInt(diceType.value)));
    rollButton.addEventListener('click', rollDice);
    darkModeToggle.addEventListener('change', toggleDarkMode);

    function initThreeJS() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(300, 300);
        document.getElementById('dice-container').appendChild(renderer.domElement);
    
        camera.position.z = 5;
    
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
    
        const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
    
        const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);
    
        animate();
    }
    
    function animate() {
        requestAnimationFrame(animate);
        if (dice) dice.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    function createDiceTexture(text, color, size = 64) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');

        context.fillStyle = color;
        context.fillRect(0, 0, 128, 128);

        context.font = `bold ${size}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'black';
        context.fillText(text, 64, 64);

        return new THREE.CanvasTexture(canvas);
    }

    function createDice(sides) {
        if (dice) scene.remove(dice);
    
        let geometry, materials;
        switch (sides) {
            case 4:
                geometry = new THREE.TetrahedronGeometry(1.5);
                materials = [
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('1', '#ff6b6b', 48) }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('2', '#feca57', 48) }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('3', '#48dbfb', 48) }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('4', '#ff9ff3', 48) })
                ];
                break;
            case 6:
                geometry = new THREE.BoxGeometry(2, 2, 2);
                materials = [
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('1', '#ff6b6b') }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('6', '#feca57') }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('2', '#48dbfb') }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('5', '#ff9ff3') }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('3', '#54a0ff') }),
                    new THREE.MeshPhongMaterial({ map: createDiceTexture('4', '#5f27cd') })
                ];
                break;
            case 8:
                geometry = new THREE.OctahedronGeometry(1.5);
                materials = Array(8).fill().map((_, i) => 
                    new THREE.MeshPhongMaterial({ map: createDiceTexture(`${i + 1}`, `hsl(${i * 45}, 100%, 75%)`, 48) })
                );
                break;
            case 10:
                geometry = new THREE.ConeGeometry(1, 2, 10);
                materials = Array(10).fill().map((_, i) => 
                    new THREE.MeshPhongMaterial({ map: createDiceTexture(`${(i + 1) % 10}`, `hsl(${i * 36}, 100%, 75%)`, 40) })
                );
                break;
            case 12:
                geometry = new THREE.DodecahedronGeometry(1.5);
                materials = Array(12).fill().map((_, i) => 
                    new THREE.MeshPhongMaterial({ map: createDiceTexture(`${i + 1}`, `hsl(${i * 30}, 100%, 75%)`, 40) })
                );
                break;
            case 20:
                geometry = new THREE.IcosahedronGeometry(1.5);
                materials = Array(20).fill().map((_, i) => 
                    new THREE.MeshPhongMaterial({ map: createDiceTexture(`${i + 1}`, `hsl(${i * 18}, 100%, 75%)`, 36) })
                );
                break;
        }
    
        dice = new THREE.Mesh(geometry, materials);
    
        // Adjust position and rotation for specific dice types
        switch (sides) {
            case 4:
                dice.rotation.x = Math.PI * 0.25;
                dice.rotation.z = Math.PI * 0.25;
                break;
            case 8:
                dice.rotation.x = Math.PI * 0.25;
                dice.rotation.z = Math.PI * 0.25;
                break;
            case 10:
                dice.rotation.x = Math.PI;
                break;
            case 12:
                dice.rotation.y = Math.PI * 0.25;
                break;
            case 20:
                dice.rotation.y = Math.PI * 0.25;
                break;
        }
    
        scene.add(dice);
    
        // Adjust camera position
        camera.position.z = sides === 10 ? 6 : 5;
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        scene.background = document.body.classList.contains('dark-mode') ? new THREE.Color(0x333333) : new THREE.Color(0xf0f0f0);
    }
});
