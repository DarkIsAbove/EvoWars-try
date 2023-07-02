let canvas, context;
let player;
let tracker;
let map;
window.onload = function () {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");

    canvas.width = screen.width;
    canvas.height = screen.height;

    alert(screen.width + " " + screen.height)

    document.body.appendChild(canvas);

    player_size = 50;
    player = new Warrior(canvas.width / 2 - player_size / 2, canvas.height / 2 - player_size / 2, player_size, "black");
    
    requestAnimationFrame(animate);

    tracker = {
        x: 0,
        y: 0,  
        s : 10
    }

    window.onmousemove = function (event) {
        tracker.x = event.clientX - tracker.s / 2;
        tracker.y = event.clientY - tracker.s / 2;
    }


    map = {
        x: 0,
        y:0
    }
}

class Warrior {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    update() {
        let opposite = this.x - tracker.x;
        let adjacent = this.y - tracker.y;
        let hypotenuse = Math.sqrt(opposite ** 2 + adjacent ** 2);

        this.angle = Math.acos(adjacent / hypotenuse);
        
        context.save();
        context.translate(this.x, this.y);
       
        if (opposite > 0) {
            context.rotate(-this.angle);
        }
        else context.rotate(this.angle);

        context.font = "30px Monospace";
        context.fillText(this.angle, 100, 100);
        
        context.strokeStyle = "blue";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(0,this.size / 2);
        context.lineTo(0,- 100);
        context.stroke();
        context.fillStyle = this.color;
        context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        context.restore();

        context.beginPath();
        context.moveTo(tracker.x,tracker.y);
        context.lineTo(tracker.x, this.y);
        context.moveTo(tracker.x, tracker.y);
        context.lineTo(this.x, this.y);
        context.moveTo(tracker.x, this.y);
        context.lineTo(this.x, this.y);
        context.stroke();

        if (player.x - tracker.x > 0) {
            
        }
        
    }
}

let bullets = new function () {
    this.bullets = [];
    this.add = function () {
        let bullet = {
            x: player.x,
            y: player.y,
            s: player.size * 0.1,
            vvx: 0,
            vvy : 0
        };

        let x = player.x - tracker.x;
        let y = player.y - tracker.y;

        let ax = Math.abs(x);
        let ay = Math.abs(y);

        if (ay > ax) {
            bullet.vy = (y > 0) ? -1 : 1;
            let vx = -(x / y);
            bullet.vx = (y < 0) ? -(vx) : vx;
        } else {
            bullet.vx = (x > 0) ? -1 : 1;
            let vy = -(y / x);
            bullet.vy = (x < 0) ? -(vy) : vy;
        }

       

        this.bullets.push(bullet);
    }
    this.restartRemove = function () { this.removed = [] };

    this.remove = function (obj) {
        this.removed.push(obj);
    }

    this.finalizedRemove = function () {
        for (let i = 0, len = this.removed.length; i < len; i++) {
            let obj = this.removed[i];
            let idx = this.bullets.indexOf(obj);
            this.bullets.splice(idx, 1);
        }
    }

    this.update = function () {
        this.restartRemove();
        for (let i = 0, len = this.bullets.length; i < len; i++) {
            let bullet = this.bullets[i];
            bullet.vvx += bullet.vx;
            bullet.vvy += bullet.vy;
            bullet.x += bullet.vvx;
            bullet.y += bullet.vvy;
            bullet.vvx *= 0.8;
            bullet.vvy *= 0.8;
            if (bullet.x + bullet.s < 0 || bullet.x > canvas.width || bullet.y > canvas.height || bullet.y + bullet.s < 0 || bullet.toRemove) this.remove(bullet);
            context.fillStyle = "red";
            context.fillRect(bullet.x, bullet.y, bullet.s, bullet.s);
        }
        this.finalizedRemove();
    }
}

let zombieSpawner = new function () {
    this.zombies = [];

    this.lastTime = new Date().getTime();
    let timer = 500;

    this.spawn = function () {
        let zombie = {};
        let zero = ["x", "y"][Math.floor(Math.random() * 2)];
        let s = 50;
        let x, y;
        let vx, vy;
        if (zero == "x") {
            x = [0, canvas.width][Math.floor(Math.random() * 2)];
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = [0, canvas.height][Math.floor(Math.random() * 2)];
        }
        let dx = player.x - (x + s / 2);
        let dy = player.y - (y + s /2);

        if (Math.abs(dx) > Math.abs(dy)) {
            vx = (dx > 0) ? 1 : -1;
            vy = (dy / dx);
            vy = (dx < 0) ? -vy : vy;
        } else {
            vy = (dy > 0) ? 1 : -1;
            vx = (dx / dy);
            vx = (dy < 0) ? -vx : vx;
        }
        let color = "blue";
        zombie = { x, y, vx, vy, s ,color};
        this.zombies.push(zombie)
    }
    this.restartRemove = function () { this.removed = [] }
    this.remove = function (obj) {this.removed.push(obj) }
    this.finalizedRemove = function () {
        for (let i = 0; i < this.removed.length; i++) {
            let obj = this.removed[i];
            let idx = this.zombies.indexOf(obj);
            this.zombies.splice(idx, 1);
        }
    }
    this.update = function () {
        this.restartRemove();
        let currentTime = new Date().getTime();
        let timeElapsed = currentTime - this.lastTime;
      
        if (timeElapsed > timer) {
            this.lastTime = new Date().getTime();
            this.spawn();      
            
        }

        for (let i = 0, len = this.zombies.length; i < len; i++) {
            let zombie = this.zombies[i];
            zombie.x += zombie.vx;
            zombie.y += zombie.vy;
            if (!zombie.removed) {
                if (collideTo.apply(zombie, [player])) alert("GameOver");
                for (let j = 0, len2 = bullets.bullets.length; j < len2; j++) {
                    let bullet = bullets.bullets[j];
                    if (collideTo.apply(zombie, [bullet])) {
                        zombie.color = "red";
                        zombie.vx = 0;
                        zombie.vy = 0;
                        setTimeout(function () {
                            zombieSpawner.remove(zombie);
                            zombieSpawner.finalizedRemove();
                        }, 500);
                        bullet.toRemove = true;
                    }
                }
            }
            context.fillStyle = zombie.color;
            context.fillRect(zombie.x, zombie.y, zombie.s, zombie.s);
        }
        this.finalizedRemove();
    }
}

function collideTo(object) { 
    object.s = object.s || object.size;
    return this.x + this.s > object.x && this.x < object.x + object.s && this.y + this.s > object.y && this.y < object.y + object.s;
}

function animate() {
    context.clearRect(map.x,map.y,canvas.width, canvas.height);

    bullets.update();
    zombieSpawner.update();
    player.update();
    context.fillStyle = "red";
    context.fillRect(tracker.x, tracker.y, tracker.s, tracker.s);

    context.fillStyle = "blue";
    context.fillRect(-100, canvas.height / 2 - 20, 40, 40);
    requestAnimationFrame(animate);
}


window.onclick = function () {
    bullets.add();
}

