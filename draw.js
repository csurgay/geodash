const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
document.addEventListener('keypress', (event) => {
    if (event.key === ' ') {
        jump();
    }
});
document.addEventListener('touchstart', (event) => {
    jump();
});
const parabola = [1,4,9,16,25,36,49,64,81,100,121,144,169,196,225,256,289,324,361,400,441,484,529,576,625,676,729,784,841,900,961,1024,1089,1156,1225,1296,1369,1444,1521,1600];
const parLength = 17;
const w = 1400;
const h = 600;
const speed = 10;
let step = 0;
let spawn = 0;
let vonal = { x: w/5 };
let elemek = [
    { tipus: "csapda" },
    { tipus: "oszlop", h: 1 },    
    { tipus: "oszlop", h: 2 },    
    { tipus: "oszlop", h: 3 },    
];
let palya = [];
palya.push({ x: w + 50, tipus: "csapda" });
const d3 = 90; // diameter for triangle
const d4 = 100; // diameter for player square
let jatekos = { y: 3*h/4 - d4/Math.sqrt(2)/2, angle: Math.PI / 4, state: "normal" }; // state: jumps-up / jumps-down

function jump() {
    if (jatekos.state === "normal") {
        jatekos.state = "jumps-up";
        jatekos.phase = 0;
    }
}

function draw() {
    step += speed;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, w, 3*h/4);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "darkblue";
    ctx.fillRect(0, 3*h/4, w, h);
    ctx.fill();

    // base line
    ctx.beginPath();
    ctx.strokeStyle = "lightblue";
    ctx.lineWidth = 10;
    ctx.moveTo(0, 3*h/4);
    ctx.lineTo(w, 3*h/4);
    // vertical lines
    for (let x = vonal.x; x < w; x += w/5) {
        ctx.moveTo(x, 3*h/4);
        ctx.lineTo(x, h);
    }
    ctx.stroke();
    vonal.x -= speed;
    if (vonal.x < 0) {
        vonal.x = w/5 - speed;
    }


    // Pálya elemek
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    for (let [index, elem] of palya.entries()) {
        if (elem.tipus == "csapda") {
            ctx.moveTo(elem.x, 3*h/4 - d3 * Math.sqrt(3)/2);
            ctx.lineTo(elem.x + d3*3/4 / 2, 3*h/4);
            ctx.lineTo(elem.x - d3*3/4 / 2, 3*h/4);
            ctx.lineTo(elem.x, 3*h/4 - d3 * Math.sqrt(3)/2);
        }
        else if (elem.tipus == "oszlop") {
            ctx.rect(elem.x - d4/2, 3*h/4 - elem.h * d3, d3, elem.h * d3);
        }
        elem.x -= speed;
        if (elem.x < -50) {
            palya.splice(index, 1);
        }
    }
    ctx.fill();

    if (step - spawn > 300) {
        if(Math.random() < 0.01) {
            palya.push({ x: w + 50, tipus: "csapda" });
            spawn = step;
        }
        else if (Math.random() < 0.02) {
            let oszlopHeight = Math.floor(Math.random() * 3) + 1; // Random height between 1 and 3
            palya.push({ x: w + 50, tipus: "oszlop", h: oszlopHeight });
            spawn = step;
        }
    }

    // játékos
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    ctx.fillStyle = "green";
    let x = w / 4;
    let y = jatekos.y;
    let r = d4 / 2;
    let a = jatekos.angle
    ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    for (let i = 0; i < 4; i++) {
        a += Math.PI / 2;
        ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
    if (jatekos.state == "jumps-up") {
        jatekos.angle += Math.PI / 2 / (parLength-1); // Rotate the player
        jatekos.y -= Math.floor(parabola[parLength-1-jatekos.phase] * 0.1);
        jatekos.phase ++;
        if (jatekos.phase >= parLength - 1) {
            jatekos.state = "jumps-down";
        }
    }
    if (jatekos.state == "jumps-down") {
        jatekos.angle += Math.PI / 2 / (parLength); // Rotate the player
        jatekos.y += Math.floor(parabola[parLength-1-jatekos.phase] * 0.1);
        jatekos.phase --;
        if (jatekos.phase < 0) {
            jatekos.state = "normal";
        }
    }

    ctx.stroke();

    requestAnimationFrame(draw);
}

draw();