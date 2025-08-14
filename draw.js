const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
document.addEventListener('keypress', (event) => {
    if (event.key === ' ') {
        jump();
    }
    else if (event.key >=0 && event.key < combos.length) {
        launchToPalya(event.key);
    }
});
document.addEventListener('touchstart', (event) => {
    jump();
});
const parabola = [1,4,9,16,25,36,49,64,81,100,121,144,169,196,225,256,289,324,361,400];
const parLength = 17;
const w = 1400;
const h = 600;
const speed = 10; // speed of the game
let step = 0;
let spawn = 0;
let vonal = { x: w/5 };
let elemek = {
    "cs1": {tipus: "csapda", h: 1 },
    "cs2": {tipus: "csapda", h: 0.6 },
    "o1": {tipus: "oszlop", h: 1 },
    "o2": {tipus: "oszlop", h: 2 },
    "o3": {tipus: "oszlop", h: 3 },
};
const d3 = 90; // diameter for triangle
const d4 = 60; // diameter for player square
const d4r = Math.sqrt(2)/2 * d4; // radius for player square
let combos = [
    ["cs1", 0],
    ["cs1", 0, "cs2", d3],
    ["o1", 0],
    ["cs1", 0, "o1", d3],
    ["o1", 0, "cs1", 2*d4, "o2", 4*d4, "cs1", 6*d4, "o3", 8*d4],
    ["o1", 0, "o1", d4, "o1", 2*d4, "o1", 3*d4],
    ["o1", 0, "o1", d4, "o1", 2*d4, "o1", 3*d4, "o1", 4*d4, "o1", 5*d4, "o1", 6*d4],
];
let palya = [];
palya.push({ x: w + 50, elem: elemek["cs1"] });
let jatekos = { y: 3*h/4 - d4/2, angle: Math.PI / 4, state: "normal", r: d4r, phase: 0 };

function jump() {
    if (jatekos.state === "normal") {
        jatekos.state = "jumps-up";
        jatekos.phase = 0;
    }
}

function draw() {
    step += speed;
    drawHatter();

    // Új pálya elemek
    drawPalya();
    if (step - spawn > 500) {
        if(Math.random() < 0.01) {
            let comboRandom = Math.floor(combos.length * Math.random());
            launchToPalya(comboRandom);
        }
    }

    // játékos
    drawJatekos();

    for (let index = 0; index < palya.length; index++) {
        let item = palya[index];
        if (item.x > w / 4 && item.x < w / 4 + d4 && jatekos.y > 3*h/4 - item.elem.h * d4 && jatekos.y < 3*h/4) {
            // hit detection
            jatekos.state = "death";
        }
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
    if (jatekos.state == "death") {
        jatekos.angle += Math.PI / 2 / (parLength); // Rotate the player
        jatekos.r--; // shrink the player
        if (jatekos.r <= 0) {
            jatekos.state = "normal";
            jatekos.y = 3*h/4 - d4/2; // reset player position
            jatekos.r = d4r; // reset player size
            jatekos.angle = Math.PI / 4; // reset player angle
            palya = []; // reset the game
        }        
    }

    requestAnimationFrame(draw);
}

draw();

function launchToPalya(comboIndex) {
    let combo = combos[comboIndex];
    for (let i=0; i<combo.length; i+=2) {
        let elemName = combo[i];
        let offset = combo[i+1];
        palya.push( { x: w + 50 + offset, elem: elemek[elemName] } );
    }
    spawn = step;
}

function drawHatter() {
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
    for (let x = vonal.x; x < w + 50; x += Math.floor(w/5)) {
        ctx.moveTo(x, 3*h/4);
        ctx.lineTo(x, h);
    }
    ctx.stroke();
    if (vonal.x < speed) {
        vonal.x = Math.floor(w/5);
    }
    vonal.x -= speed;
}

function drawPalya() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    for (let index=0; index<palya.length; index++) {
        let item = palya[index];
        let elem = item.elem;
        if (elem.tipus == "csapda") {
            let dh = elem.h * d3;
            ctx.moveTo(item.x, 3*h/4 - dh * Math.sqrt(3)/2);
            ctx.lineTo(item.x + d3*3/4 / 2, 3*h/4);
            ctx.lineTo(item.x - d3*3/4 / 2, 3*h/4);
            ctx.lineTo(item.x, 3*h/4 - dh * Math.sqrt(3)/2);
        }
        else if (elem.tipus == "oszlop") {
            ctx.rect(item.x - d4/2, 3*h/4 - elem.h * d4, d4, elem.h * d4);
        }
        item.x -= speed;
        ctx.font = "20px Arial";
//        ctx.fillText(item.elem.tipus, item.x, 3*h/4 - elem.h * d4 - 10);
        if (item.x < -150) {
            palya.splice(index, 1);
        }
    }
    ctx.fill();
    ctx.stroke();
}

function drawJatekos() {
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    ctx.fillStyle = "green";
    let x = w / 4;
    let y = jatekos.y;
    let r = jatekos.r;
    let a = jatekos.angle
    ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    for (let i = 0; i < 4; i++) {
        a += Math.PI / 2;
        ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.fill();
    ctx.stroke();
}
