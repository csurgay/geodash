const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
document.addEventListener('keypress', (event) => {
    if (event.key === ' ') {
        if (jatekos.state === "normal") {
            jatekos.state = "jumps-up";
            jatekos.phase = 0;
        }
    }
});
const parabola = [4,9,16,25,36,49,64,81,100,121,144,169,196,225,256,289,324,361,400];
const parLength = 18;
const w = 1000;
const speed = 8;
let step = 0;
let spawn = 0;
let vonal = { x: 160 };
let palya = [];
palya.push({ x: w + 50, tipus: "csapda1" });
const d3 = 100; // diameter for triangle
const d4 = 110; // diameter for player square
let jatekos = { y: 500 - d4/Math.sqrt(2)/2, angle: Math.PI / 4, state: "normal" }; // state: jumps-up / jumps-down

function draw() {
    step += speed;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(0, 500);
    ctx.lineTo(w, 500);
    for (let x = vonal.x; x < w; x += 160) {
        ctx.moveTo(x, 500);
        ctx.lineTo(x, 600);
        ctx.stroke();
    }

    palya.forEach(elem => {
        if (elem.tipus === "csapda1") {
            ctx.moveTo(elem.x, 500 - d3 * Math.sqrt(3)/2);
            ctx.lineTo(elem.x + d3*3/4 / 2, 500);
            ctx.lineTo(elem.x - d3*3/4 / 2, 500);
            ctx.lineTo(elem.x, 500 - d3 * Math.sqrt(3)/2);
        }
        elem.x -= speed;
        if (elem.x < -50) {
            elem.tipus = "kiment";
        }
    });

    vonal.x -= speed;
    if (vonal.x < 0) {
        vonal.x = 155;
    }

    if(Math.random() < 0.01 && step - spawn > 300) {
        palya.push({ x: w + 50, tipus: "csapda1" });
        spawn = step;
    }

    // játékos
    let x = w / 4;
    let y = jatekos.y;
    let r = d4 / 2;
    let a = jatekos.angle
    ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    for (let i = 0; i < 4; i++) {
        a += Math.PI / 2;
        ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
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