const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const heartRadius = 140;
let broken = false;

function getHeartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return {
    x: centerX + x * heartRadius * 0.05,
    y: centerY - y * heartRadius * 0.05,
  };
}

const fireYarns = [];
const heartShape = [];

for (let t = 0; t < Math.PI * 2; t += 0.01) {
  const p = getHeartPoint(t);
  heartShape.push(p);
}

for (let i = 0; i < 800; i++) {
  const target = heartShape[Math.floor(Math.random() * heartShape.length)];
  const startX = Math.random() * canvas.width;
  const startY = Math.random() * canvas.height;
  const angle = Math.atan2(target.y - startY, target.x - startX);
  fireYarns.push({
    x: startX,
    y: startY,
    vx: Math.cos(angle) * 2,
    vy: Math.sin(angle) * 2,
    tx: target.x,
    ty: target.y,
    color: `hsl(${Math.random() * 20}, 100%, 60%)`,
    size: Math.random() * 1.5 + 0.5,
    stitched: false
  });
}

function drawYarns() {
  fireYarns.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.stitched ? Math.random() * 0.3 + 0.7 : 1;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function updateYarns() {
  fireYarns.forEach(p => {
    if (broken && p.stitched) {
      p.x += p.vx;
      p.y += p.vy;
    } else if (!p.stitched) {
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3) {
        p.stitched = true;
        p.x = p.tx;
        p.y = p.ty;
      } else {
        p.x += dx * 0.01; 
        p.y += dy * 0.01;
      }
    } else {
      p.x += (p.tx - p.x) * 0.05; 
      p.y += (p.ty - p.y) * 0.05;
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateYarns();
  drawYarns();
  requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", () => broken = true);
canvas.addEventListener("mouseleave", () => broken = false);

animate();
