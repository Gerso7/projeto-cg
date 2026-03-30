const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let shoulderAngle = 0;
let elbowAngle = 0;
let hipAngle = 0;
let kneeAngle = 0;

let globalScale = 1;
let autoAnimate = true;
let t = 0;

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === "a") shoulderAngle -= 0.1;
  if (key === "d") shoulderAngle += 0.1;

  if (key === "w") elbowAngle -= 0.1;
  if (key === "s") elbowAngle += 0.1;

  if (key === "j") hipAngle -= 0.1;
  if (key === "l") hipAngle += 0.1;

  if (key === "i") kneeAngle -= 0.1;
  if (key === "k") kneeAngle += 0.1;

  if (key === "q") globalScale = Math.max(0.5, globalScale - 0.1);
  if (key === "e") globalScale = Math.min(2.0, globalScale + 0.1);

  if (e.code === "Space") {
    autoAnimate = !autoAnimate;
    e.preventDefault();
  }
});

function drawBackground() {
  // chão
  ctx.fillStyle = "#c8c8c8";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

  // linha do chão
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 100);
  ctx.lineTo(canvas.width, canvas.height - 100);
  ctx.stroke();
}

function drawJoint(radius = 6, color = "#222") {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawHead() {
  ctx.save();

  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fillStyle = "#f2c28b";
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.stroke();

  // olhos
  ctx.beginPath();
  ctx.arc(-8, -4, 3, 0, Math.PI * 2);
  ctx.arc(8, -4, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();

  // boca
  ctx.beginPath();
  ctx.moveTo(-7, 8);
  ctx.lineTo(7, 8);
  ctx.strokeStyle = "#222";
  ctx.stroke();

  ctx.restore();
}

function drawTorso() {
  ctx.save();
  ctx.fillStyle = "#202020";
  ctx.fillRect(-30, -55, 60, 110);
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;
  ctx.strokeRect(-30, -55, 60, 110);
  ctx.restore();
}

function drawUpperArm() {
  ctx.save();
  ctx.fillStyle = "#2f6bff";
  ctx.fillRect(0, -8, 80, 16);
  ctx.restore();
}

function drawForearm() {
  ctx.save();
  ctx.fillStyle = "#18a84f";
  ctx.fillRect(0, -6, 65, 12);
  ctx.restore();
}

function drawUpperLeg() {
  ctx.save();
  ctx.fillStyle = "#c94a4a";
  ctx.fillRect(-7, 0, 14, 85);
  ctx.restore();
}

function drawLowerLeg() {
  ctx.save();
  ctx.fillStyle = "#f0a020";
  ctx.fillRect(-6, 0, 12, 75);
  ctx.restore();
}

function drawFoot() {
  ctx.save();
  ctx.fillStyle = "#444";
  ctx.fillRect(0, -5, 32, 10);
  ctx.restore();
}

function drawArm(side = 1) {
  // side = 1 braço direito, side = -1 braço esquerdo
  ctx.save();

  ctx.scale(side, 1);

  // ombro
  ctx.translate(30, -35);
  ctx.rotate(shoulderAngle);
  drawJoint();
  drawUpperArm();

  // cotovelo
  ctx.translate(80, 0);
  ctx.rotate(elbowAngle);
  drawJoint(5, "#333");
  drawForearm();

  ctx.restore();
}

function drawLeg(side = 1) {
  ctx.save();

  ctx.translate(side * 15, 55);
  ctx.rotate(hipAngle);
  drawJoint();
  drawUpperLeg();

  // joelho
  ctx.translate(0, 85);
  ctx.rotate(kneeAngle);
  drawJoint(5, "#333");
  drawLowerLeg();

  // pé
  ctx.translate(0, 75);
  drawFoot();

  ctx.restore();
}

function drawRobot() {
  ctx.save();

  // escala 
  ctx.scale(globalScale, globalScale);

  // tronco
  drawTorso();

  // cabeça
  ctx.save();
  ctx.translate(0, -82);
  drawHead();
  ctx.restore();

  // braços
  drawArm(1);
  drawArm(-1);

  // pernas
  drawLeg(1);
  drawLeg(-1);

  ctx.restore();
}

function updateAnimation() {
  if (!autoAnimate) return;

  t += 0.03;

  shoulderAngle = Math.sin(t) * 0.6;
  elbowAngle = Math.sin(t * 1.4) * 0.5;
  hipAngle = Math.sin(t) * 0.4;
  kneeAngle = Math.abs(Math.sin(t * 1.2)) * 0.5;
}

function draw() {
  // reset completo 
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  // centraliza 
  ctx.translate(canvas.width / 2, canvas.height / 2 + 40);

  updateAnimation();
  drawRobot();

  requestAnimationFrame(draw);
}

draw();
