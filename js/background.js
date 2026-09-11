/* =========================================
   ECO PREMIUM BACKGROUND (FIXED)
========================================= */

const canvas = document.getElementById("eco-network");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const mouse = {
  x: null,
  y: null
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const icons = ["♻", "🗑", "🍃", "🥤", "📦"];

const lixo = [];

const TOTAL = 120;

class Lixo {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.size = Math.random() * 22 + 12;
    this.speedY = Math.random() * 0.6 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.3;

    this.icon = icons[Math.floor(Math.random() * icons.length)];
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;

    // loop infinito (tipo chuva)
    if (this.y > canvas.height + 20) {
      this.y = -20;
      this.x = Math.random() * canvas.width;
    }

    // leve interação com mouse
    if (mouse.x) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        this.x += dx * 0.04; 
        this.y += dy * 0.04; 
      }
    }
  }

  draw() {
    ctx.font = `${this.size}px Arial`;
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.fillText(this.icon, this.x, this.y);
  }
}

for (let i = 0; i < TOTAL; i++) {
  lixo.push(new Lixo());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lixo.forEach((l) => {
    l.update();
    l.draw();
  });

  requestAnimationFrame(animate);
}

animate();

/* =========================================
   MOUSE PARALLAX (FIXED)
========================================= */

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;

  document.querySelectorAll(".eco-aurora").forEach((a, i) => {
    const speed = (i + 1) * 0.5;

    a.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

