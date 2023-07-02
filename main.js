let canvas, context;
let player;
let tracker;
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
function animate() {
    context.clearRect(map.x,map.y,canvas.width, canvas.height);

    
    player.update();
    context.fillStyle = "red";
    context.fillRect(tracker.x, tracker.y, tracker.s, tracker.s);

    context.fillStyle = "blue";
    context.fillRect(-100, canvas.height / 2 - 20, 40, 40);
    requestAnimationFrame(animate);
}


window.onclick = function () {
    
}

