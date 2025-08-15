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
let keepJumping = false;
document.addEventListener('touchstart', (event) => {
    keepJumping = true;
});
document.addEventListener('touchend', (event) => {
    keepJumping = false;
});
const parabola = [1,4,9,16,25,36,49,64,81,100,121,144,169,196,225,256,289,324,361,400];
const parLength = 17;
const w = 1400;
const h = 600;
const hBase = 3 * h / 4; // height of the base line
const xJatekos = Math.floor(w / 4); // x position of the player
const dVonal = Math.floor(w / 4); // distance between vertical lines
const speed = 10; // speed of the game
let step = 0;
let spawn = 0;
let vonal = { x: dVonal };
const d3 = 90; // diameter for triangle
const d4 = 60; // diameter for player square
const d4r = Math.sqrt(2)/2 * d4; // radius for player square
let elemek = {
    "cs1": {tipus: "csapda", h: 1.2*d4 },
    "cs2": {tipus: "csapda", h: 0.7*d4 },
    "o1": {tipus: "oszlop", h: 1*d4 },
    "o2": {tipus: "oszlop", h: 2*d4 },
    "o3": {tipus: "oszlop", h: 3*d4 },
};
const dd = 2.5 * d4;
let combos = [
    ["cs1", 0],
    ["cs1", 0, "cs2", d3],
    ["o1", 0],
    ["cs1", 0, "o1", d3],
    ["o1", 0, "cs1", dd, "o2", 2*dd, "cs1", 3*dd, "o3", 4*dd],
    ["o1", 0, "o1", d4, "o1", 2*d4, "o1", 3*d4],
    ["o1", 0, "o1", d4, "o1", 2*d4, "o1", 3*d4, "o1", 4*d4, "o1", 5*d4, "o1", 6*d4],
];
let palya = []; // items: x and elem
let itemAtJatekos = null;
palya.push({ x: w + 150, elem: elemek["cs1"] });
let jatekos = { y: hBase - d4/2, angle: Math.PI / 4, state: "idle", r: d4r, phase: 0 }; // "normal", "jump", "fall", "dead"

function jump() {
    if (jatekos.state === "idle") {
        jatekos.state = "jump";
        jatekos.phase = 0;
    }
}

function draw() {
    step += speed;
    drawHatter();

    // Új pálya elemek
    drawPalya();
    if (step - spawn > 500) {
        if(Math.random() < 0.03) {
            let comboRandom = Math.floor(combos.length * Math.random());
            launchToPalya(comboRandom);
        }
    }

    // játékos
    drawJatekos();

    // death detection
    if (itemAtJatekos && 
        //itemAtJatekos.elem.tipus == "csapda" && 
        kozte(itemAtJatekos.x, xJatekos, xJatekos+d4) && 
        kozte(jatekos.y, hBase-itemAtJatekos.elem.h-d4/3, hBase-d4/2)) 
    {
        jatekos.state = "dead";
    }

    if (jatekos.state == "jump") {
        jatekos.angle += Math.PI / 2 / (parLength-1); // Rotate the player
        jatekos.y -= Math.floor(parabola[parLength-1-jatekos.phase] * 0.1);
        jatekos.phase ++;
        if (jatekos.phase >= parLength - 1) {
            jatekos.state = "fall";
        }
    }
    if (jatekos.state == "fall") {
        jatekos.angle += Math.PI / 2 / (parLength); // Rotate the player
        jatekos.y += Math.floor(parabola[parLength-1-jatekos.phase] * 0.1);
        jatekos.phase --;
        if (jatekos.phase < 0) {
            jatekos.state = "idle";
        }
        else {
            // check if player falls on platform
            if (itemAtJatekos && 
                itemAtJatekos.elem.tipus == "oszlop" && 
                kozte(itemAtJatekos.x, xJatekos - d4, xJatekos + 2 * d4) &&
                kozte(jatekos.y + d4/2, hBase - itemAtJatekos.elem.h - d4/4, hBase - itemAtJatekos.elem.h))
            {
                jatekos.y = hBase - itemAtJatekos.elem.h - d4/2; // reset player position
                jatekos.state = "idle"; // reset player state
                jatekos.angle = Math.PI / 4; // reset player angle
            }
        }
    }
    // fall detection
    if (jatekos.state == "idle") {
        let whereToFall = hBase - d4 / 2;
        if (itemAtJatekos) whereToFall = itemAtJatekos.h - d4 / 2;
        if (jatekos.y < whereToFall) jatekos.y = whereToFall;
    }

    if (jatekos.state == "dead") {
        jatekos.angle += Math.PI / 2 / (parLength); // Rotate the player
        jatekos.r--; // shrink the player
        if (jatekos.r <= 0) {
            jatekos.state = "idle";
            jatekos.y = hBase - d4/2; // reset player position
            jatekos.r = d4r; // reset player size
            jatekos.angle = Math.PI / 4; // reset player angle
            palya = []; // reset the game
        }        
    }

    if (jatekos.state == "idle" && keepJumping) {
        jump();
    }

    requestAnimationFrame(draw);
}

draw();

function kozte(a, b, c) {
    return a >= b && a <= c;
}

 function launchToPalya(comboIndex) {
    let combo = combos[comboIndex];
    for (let i=0; i<combo.length; i+=2) {
        let elemName = combo[i];
        let offset = combo[i+1];
        palya.push( { x: w + 150 + offset, elem: elemek[elemName] } );
    }
    spawn = step;
}

function drawHatter() {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, w, hBase);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "darkblue";
    ctx.fillRect(0, hBase, w, h);
    ctx.fill();

    // base line
    ctx.beginPath();
    ctx.strokeStyle = "lightblue";
    ctx.lineWidth = 10;
    ctx.moveTo(0, hBase);
    ctx.lineTo(w, hBase);
    // vertical lines
    for (let x = vonal.x; x < w + 150; x += dVonal) {
        ctx.moveTo(x, hBase);
        ctx.lineTo(x, h);
    }
    ctx.stroke();
    if (vonal.x < speed) {
        vonal.x = dVonal;
    }
    vonal.x -= speed;
}

function drawPalya() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    itemAtJatekos = null;
    for (let index=0; index<palya.length; index++) {
        let item = palya[index];
        let elem = item.elem;
        if (elem.tipus == "csapda") {
            let dh = elem.h;
            ctx.moveTo(item.x, hBase - dh);
            ctx.lineTo(item.x + d3*3/4 / 2, hBase);
            ctx.lineTo(item.x - d3*3/4 / 2, hBase);
            ctx.lineTo(item.x, hBase - dh);
        }
        else if (elem.tipus == "oszlop") {
            ctx.rect(item.x - d4/2, hBase - elem.h, d4, elem.h);
        }
        item.x -= speed;
        if (kozte(item.x, xJatekos- d4, xJatekos + 2 * d4)) {
            itemAtJatekos = item;
        }
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
    let x = xJatekos;
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
