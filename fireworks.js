const canvas = document.getElementById('fireworksCanvas'); //获取画布
const ctx = canvas.getContext('2d'); //2d模式
//设置画布的大小为屏幕大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//获取元素的矩形大小
const randomNumberRect = randomNumber.getBoundingClientRect();
const randomNumber1Rect = randomNumber1.getBoundingClientRect();
const randomNumber2Rect = randomNumber.getBoundingClientRect();
//绘制线段
function getCenterPosition(element) {  
    // 获取元素的中心点坐标
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2, //获取元素中心点x轴坐标
        y: rect.top + rect.height / 2 //获取元素中心点y轴坐标
    };
}

const pos1 = getCenterPosition(randomNumber);
const pos2 = getCenterPosition(randomNumber1);
const pos3 = getCenterPosition(randomNumber2);





class Firework {
    // 烟花类，表示烟花的发射和爆炸
    // 该类负责烟花的运动和绘制
    constructor(x, y, targetX, targetY) { 
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.distanceToTarget = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);
        this.distanceTraveled = 0; 
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 50 + 50;
        this.targetRadius = 1;
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.sqrt((this.x + vx - this.x) ** 2 + (this.y + vy - this.y) ** 2);
        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.targetX, this.targetY);
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

class Particle {
    // 粒子类，表示烟花爆炸后的粒子
    // 该类负责粒子的运动和绘制
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 10 + 1;
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = Math.random() * 360;
        this.brightness = Math.random() * 50 + 50;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01; 
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
    }
}

const fireworks = [];
const particles = [];
let isFireworksActive = false; // 控制烟花生成的标志变量

function createParticles(x, y) {
    // 创建粒子效果，创建多个粒子
    // 该函数负责粒子的生成和运动
    let particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function loop2() {
    //判断是否生成烟花
    // 主循环函数，负责绘制烟花和粒子效果
    // 该函数负责动画的更新和绘制
    requestAnimationFrame(loop2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    let i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }
    let j = particles.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }
    if (isFireworksActive && Math.random() < 0.05) {
        fireworks.push(new Firework(canvas.width / 2, canvas.height, Math.random() * canvas.width, Math.random() * canvas.height / 2));
    }else if(!isFireworksActive){
        // 绘制直线
        ctx.strokeStyle = '#fff'; // 设置线条颜色
        ctx.lineWidth = 2; // 设置线条宽度
        ctx.beginPath();
        ctx.moveTo(pos1.x - randomNumberRect.width / 3, pos1.y + randomNumberRect.height / 2); // 起点
        ctx.lineTo(pos2.x, pos2.y - randomNumber1Rect.height / 2); // 终点
        ctx.moveTo(pos1.x + randomNumberRect.width * 0.33, pos1.y + randomNumberRect.height / 2); // 起点
        ctx.lineTo(pos3.x, pos3.y - randomNumber2Rect.height / 2); // 终点
        ctx.stroke(); // 绘制线条
    }
    
}

//window.onload = loop;// 会在页面加载完成后开始动画     
loop2();// 会立即启动动画,不会等待页面加载完成 