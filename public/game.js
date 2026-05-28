// ===================================================
// THREE.JS HYPER-REALISTIC 3D OCEAN ENGINE
// ===================================================

const scoreEl = document.getElementById("score-val");
const healthFill = document.getElementById("health-fill");
const timeEl = document.getElementById("time-val");
const gameOverScreen = document.getElementById("game-over-screen");
const overTitle = document.getElementById("over-title");
const overMsg = document.getElementById("over-msg");

let score = 0;
let health = 100;
let timeLeft = 45;
let gameOver = false;
let gameTimer;
let clock = new THREE.Clock();

// 1. Setup 3D Scene, Camera & WebGL Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010b14);
scene.fog = new THREE.FogExp2(0x010b14, 0.035); // Smooth underwater fog

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 22); // Perfect cinematic depth position

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 2. Volumetric Ambient Lighting
const ambientLight = new THREE.AmbientLight(0x0a2540, 2.0); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x38bdf8, 4.0); 
directionalLight.position.set(5, 30, 10);
scene.add(directionalLight);

// 3. Generate Procedural 3D Player Shark
const sharkGroup = new THREE.Group();

// Main Torso Mesh
const bodyGeo = new THREE.SphereGeometry(2.5, 32, 16);
bodyGeo.scale(1, 0.48, 0.48); 
const sharkMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.35,
    metalness: 0.15
});
const sharkBody = new THREE.Mesh(bodyGeo, sharkMat);
sharkGroup.add(sharkBody);

// 3D Dorsal Fin Mesh
const finShape = new THREE.ConeGeometry(0.6, 1.8, 4);
finShape.scale(1, 1, 0.3);
const dorsalFin = new THREE.Mesh(finShape, sharkMat);
dorsalFin.position.set(-0.5, 1.1, 0);
dorsalFin.rotation.z = -0.4;
sharkGroup.add(dorsalFin);

// 3D Tail Fin Mesh
const tailGeo = new THREE.ConeGeometry(1.2, 2.0, 4);
tailGeo.scale(0.2, 1, 1);
const tailFin = new THREE.Mesh(tailGeo, sharkMat);
tailFin.position.set(-2.8, 0, 0);
sharkGroup.add(tailFin);

// Bioluminescent Electro-Glow Sensory Aura (3D Volumetric Bubble)
const glowGeo = new THREE.SphereGeometry(6.5, 16, 16);
const glowMat = new THREE.MeshBasicMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending
});
const sensoryGlow = new THREE.Mesh(glowGeo, glowMat);
sharkGroup.add(sensoryGlow);

scene.add(sharkGroup);

// 4. Smooth 3D Mouse Tracking Variables
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// 5. Environmental Marine Snow (3D Space Dust)
const particleGeo = new THREE.BufferGeometry();
const particleCount = 300;
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 60;     
    posArray[i+1] = (Math.random() - 0.5) * 40;   
    posArray[i+2] = (Math.random() - 0.5) * 30;   
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMat = new THREE.PointsMaterial({
    size: 0.07,
    color: 0xffffff,
    transparent: true,
    opacity: 0.35
});
const marineSnow = new THREE.Points(particleGeo, particleMat);
scene.add(marineSnow);

// 6. Entities Buffers
let creatures3D = [];
let hazards3D = [];

function spawn3DCreature() {
    if (gameOver) return;
    const isLeft = Math.random() > 0.5;
    
    const fishGeo = new THREE.ConeGeometry(0.4, 1.2, 4);
    fishGeo.rotation.z = Math.PI / 2;
    const isNeon = Math.random() > 0.5;
    const fishMat = new THREE.MeshStandardMaterial({
        color: isNeon ? 0x0284c7 : 0xea580c,
        emissive: isNeon ? 0x014d7a : 0x000000,
        roughness: 0.4
    });
    
    const fishMesh = new THREE.Mesh(fishGeo, fishMat);
    fishMesh.position.set(isLeft ? -35 : 35, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 3);
    
    fishMesh.userData = {
        speed: (Math.random() * 3 + 3) * (isLeft ? 1 : -1),
        scanned: false
    };
    
    scene.add(fishMesh);
    creatures3D.push(fishMesh);
    
    setTimeout(spawn3DCreature, Math.random() * 700 + 500);
}

function spawn3DHazard() {
    if (gameOver) return;
    
    const mineGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(0.7, 12, 12);
    const mineMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const core = new THREE.Mesh(coreGeo, mineMat);
    mineGroup.add(core);
    
    const spikeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 4);
    for(let i=0; i<6; i++) {
        const spike = new THREE.Mesh(spikeGeo, mineMat);
        spike.position.y = 0.7;
        const pivot = new THREE.Group();
        pivot.rotation.x = (i * Math.PI) / 3;
        pivot.rotation.z = (i * Math.PI) / 4;
        pivot.add(spike);
        mineGroup.add(pivot);
    }
    
    mineGroup.position.set(35, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 3);
    mineGroup.userData = { speed: Math.random() * 2 + 2.5 };
    
    scene.add(mineGroup);
    hazards3D.push(mineGroup);
    
    setTimeout(spawn3DHazard, Math.random() * 1500 + 1000);
}

// 7. Render Loop
function animate() {
    if (gameOver) return;
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();

    // Smooth Interpolated Matrix positions
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;
    
    sharkGroup.position.x = mouse.x * 20;
    sharkGroup.position.y = mouse.y * 11;
    
    // Dynamic Angular Flipping / Rotation mechanics
    sharkGroup.rotation.z = (mouse.targetY - sharkGroup.position.y/11) * 0.35;
    sharkGroup.rotation.y = (mouse.targetX < mouse.x) ? Math.PI : 0;

    // Organic Realtime Tail Wag Mechanics
    tailFin.rotation.y = Math.sin(elapsedTime * 14) * 0.25;
    
    // Ambient Electro-Sensor Pulsing Animation
    let scalePulse = 1 + Math.sin(elapsedTime * 4.5) * 0.04;
    sensoryGlow.scale.set(scalePulse, scalePulse, scalePulse);

    // Drifting Marine Snow Loop Logic
    const positions = marineSnow.geometry.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.025;
        if (positions[i] < -20) positions[i] = 20;
    }
    marineSnow.geometry.attributes.position.needsUpdate = true;

    // Process Fish Entities
    for (let i = creatures3D.length - 1; i >= 0; i--) {
        let f = creatures3D[i];
        f.position.x += f.userData.speed * 0.016;
        f.rotation.y = f.userData.speed > 0 ? 0 : Math.PI;

        // Proximity Sensing Trigger Box
        let dist = sharkGroup.position.distanceTo(f.position);
        if (dist < 6.3 && !f.userData.scanned) {
            f.userData.scanned = true;
            score += 10;
            scoreEl.innerText = score + " TB";
            f.material.emissive.setHex(0x00ffcc); // Flash bright glowing teal upon capture
        }

        if (f.userData.scanned) {
            f.scale.subScalar(0.025);
            if (f.scale.x <= 0) {
                scene.remove(f);
                creatures3D.splice(i, 1);
                continue;
            }
        }

        if (Math.abs(f.position.x) > 38) {
            scene.remove(f);
            creatures3D.splice(i, 1);
        }
    }

    // Process Mines / Hazards Matrix
    for (let j = hazards3D.length - 1; j >= 0; j--) {
        let h = hazards3D[j];
        h.position.x -= h.userData.speed * 0.016;
        h.rotation.x += 0.012;
        h.rotation.y += 0.012;

        let dist = sharkGroup.position.distanceTo(h.position);
        if (dist < 2.4) {
            health -= 25;
            if (health < 0) health = 0;
            healthFill.style.width = health + "%";
            
            scene.remove(h);
            hazards3D.splice(j, 1);
            
            if (health <= 0) endGame(false);
            continue;
        }

        if (h.position.x < -38) {
            scene.remove(h);
            hazards3D.splice(j, 1);
        }
    }

    renderer.render(scene, camera);
}

function runTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        timeEl.innerText = timeLeft;
        if (timeLeft <= 0) endGame(true);
    }, 1000);
}

// 🚀 [UPDATED INTEGRATED ENDGAME] - पुरानी और नई का परफेक्ट कॉम्बो
function endGame(survived) {
    gameOver = true;
    clearInterval(gameTimer);
    
    // UI अपडेट करने का लॉजिक
    if (gameOverScreen) gameOverScreen.style.display = "flex";
    if (overTitle) {
        overTitle.innerText = survived ? "🦈 ECO-SURVEY MISSION SUCCESS" : "🚨 HEALTH DEPLETED!";
        overTitle.style.color = survived ? "#38bdf8" : "#f43f5e";
    }
    if (overMsg) overMsg.innerText = `Total Forensic Bio-Data Transferred: ${score} Terabytes.`;

    // बैकएंड सर्वर पर डेटा सेंड करना
    sendDataToBackend(survived);
}

// 🚀 BACKEND SYNC FUNCTION
async function sendDataToBackend(survived) {
    try {
        const response = await fetch('/api/save-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                score: score, 
                survived: survived, 
                timeLeft: timeLeft 
            })
        });
        const data = await response.json();
        if(data.status === "success") {
            console.log("✅ Score synced to backend successfully!");
        }
    } catch (err) {
        console.error("❌ Sync Error:", err);
    }
}

// Window Screen Autofit Scaler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Auto Start Core Engines
initGame = () => {
    spawn3DCreature();
    spawn3DHazard();
    runTimer();
    animate();
}
initGame();