let canvas, context;
let player;
let tracker;


let Timer = {
    queues: [],
    track_fps: {
        fps: undefined,
        last_time: undefined,
        delta_time: undefined,
        get_fps: function (current_time) {
            if (this.last_time == undefined) this.last_time = current_time;
            this.delta_time = current_time - this.last_time;
            this.last_time = current_time;
            this.fps = 1000 / (1 && this.delta_time);
        }
    }
};
Timer.update = function (current_time) {
    this.track_fps.get_fps(current_time);

    for (let timer of this.queues) {
        timer.track();
    }
}

Timer.get_delta_time = function () { return this.track_fps.delta_time / 10; };

Timer.add = function (type, end, callback, condition_met) {
    let timer = { end, callback, condition_met };
    let func_type;

    function interval() {
        if (!this.old_end) this.old_end = this.end;
        if (this.end < 1) {
            if (this.callback()) {
                this.condition_met();
                Timer.queues.splice(Timer.queues.indexOf(this), 1);
            }
            this.end = this.old_end;
        } else this.end -= Timer.get_delta_time();
    }

    function timeout() {
        this.end -= Timer.get_delta_time();
        if (this.end < 1) {
            this.callback();
            Timer.queues.splice(Timer.queues.indexOf(this), 1);
        }
    }

    if (type == "timeout") func_type = timeout;
    else func_type = interval;
    timer.track = func_type;

    this.queues.push(timer);
}

let World = new function () {
    this.size = 10000;
    this.center = {
        x: 5000,
        y: 5000
    };
}

let Camera;
window.onload = function () {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");

    canvas.width = screen.width;
    canvas.height = screen.height;

    document.body.appendChild(canvas);

    Camera = new function () {
        this.x = this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;

        this.minimap = {
            width: this.width * 0.25,
            height: this.height * 0.25,
            y : 0,
            objects : []
        };
        this.minimap.x = this.width - this.minimap.width;
        this.minimap.update = function () {
            context.fillStyle = "brown";
            context.fillRect(this.x, this.y, this.width, this.height);

            for (let [object,color] of this.objects) {
                let mini_object = {
                    x: this.x + ((object.x - object.width / 2) / World.size) * this.width,
                    y: ((object.y - (object.height / 2)) / World.size) * this.height,
                    width: (object.width / World.size) * this.width,
                    height: (object.height / World.size) * this.height
                };

                context.fillStyle = color;
                context.fillRect(mini_object.x, mini_object.y, mini_object.width, mini_object.height);
            }       
        }

        this.minimap.include = function ([object,color]) {
            this.objects.push([object,color]);
        }

        this.focusPlayer = function () {
            this.x = player.x + (player.width / 2) - this.width / 2;
            this.y = player.y + (player.height / 2) - this.height / 2;
        }

        this.inside = function (object) {
            return !((object.x > this.x + this.width) ||
                (object.x + object.width < this.x) ||
                (object.y > this.y + this.height) ||
                (object.y + object.height < this.y));
        }

        this.update = function () {
            this.focusPlayer();
            this.minimap.update();

            context.font = "20px monospace";
            context.fillText(`x : ${this.x} y : ${this.y} totalWidth : ${this.x + this.width} totalHeight : ${this.y + this.height}`, 0, 100);
        }
    };


    player_size = 50;
    player = new Player(2500, 2500, canvas.width / 2 - player_size / 2, canvas.height / 2 - player_size / 2, player_size, player_size, "blue" , "yellow");

    someguy = new Warrior(4000, 3000, 0, 0, player_size, player_size, "blue","violet");
    someguy2 = new Warrior(5000, 5000, 0, 0, player_size, player_size, "red","blue");

    tracker = {
        x: 0,
        y: 0,  
        s : 10
    }

    window.onmousemove = function (event) {
        if (!player.allowMove) return;
        tracker.x = event.clientX - tracker.s / 2;
        tracker.y = event.clientY - tracker.s / 2;
    }

    requestAnimationFrame(animate);
}


class Warrior {
    constructor(x, y, canvas_x, canvas_y, width,height, color, mini_color) { 
        this.x = x;
        this.y = y;
        this.canvas_x = canvas_x;
        this.canvas_y = canvas_y;
        this.width = width;
        this.height = height;
        this.color = color;

        Camera.minimap.include([this,mini_color]);
    }

    draw() {
        if (!Camera.inside(this)) return;
        console.log("Inside")
        context.fillStyle = this.color;
        context.fillRect(this.canvas_x, this.canvas_y, this.width, this.height);
    }

    update_position_in_camera() {
        this.canvas_x = this.x - Camera.x;
        this.canvas_y = this.y - Camera.y;
    }

    update() {
        this.update_position_in_camera();
        this.draw();
        
        /*let opposite = this.canvas_x - tracker.x;
        let adjacent = this.canvas_y - tracker.y;
        let hypotenuse = Math.sqrt(opposite ** 2 + adjacent ** 2);

        this.angle = Math.acos(adjacent / hypotenuse);
        
        context.save();
        context.translate(this.canvas_x, this.canvas_y);
       
        if (opposite > 0) {
            context.rotate(-this.angle);
        }
        else context.rotate(this.angle);

        context.fillStyle = "black"
        context.font = "30px Monospace";
        context.fillText(this.angle, 100, 100);
        
        context.strokeStyle = "blue";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(0,this.height / 2);
        context.lineTo(0,- 100);
        context.stroke();
        this.draw();
        context.restore();

        context.beginPath();
        context.moveTo(tracker.x,tracker.y);
        context.lineTo(tracker.x, this.canvas_y);
        context.moveTo(tracker.x, tracker.y);
        context.lineTo(this.canvas_x, this.canvas_y);
        context.moveTo(tracker.x, this.canvas_y);
        context.lineTo(this.canvas_x, this.canvas_y);
        context.stroke();


        let dx = this.canvas_x - tracker.x;
        let dy = this.canvas_y - tracker.y;
        let dif = this.width / 2;

        if (dx > dif) {
            this.x--;
        } else if (dx < -dif) this.x++;

        if (dy > dif) {
            this.y--;
        } else if (dy < -dif) this.y++;

        context.font = "10px monospace";
        context.fillText(`x : ${this.x} y : ${this.y}`, this.canvas_x, this.canvas_y + 20);*/
    }
}


class Player extends Warrior {
    constructor(x, y, canvas_x, canvas_y, width, height, color, mini_color) {
        super(x, y, canvas_x, canvas_y, width, height, color, mini_color);
        this.allowMove = true;
        this.addAngle = 0;
    }

    toggleAllowMove = function () {
        this.allowMove = this.allowMove ? false : true;
    }
    draw = function () {
        //get the angle of rotation
        let opposite = this.canvas_x - tracker.x;
        let adjacent = this.canvas_y - tracker.y;
        let hypotenuse = Math.sqrt(opposite ** 2 + adjacent ** 2);
        this.angle = Math.acos(adjacent / hypotenuse);

        //save the current drawing state
        context.save();
        //translate the origin of canvas to the position of player
        context.translate(this.canvas_x, this.canvas_y);
        //rotate
        if (opposite > 0) {
            context.rotate(-this.angle);
        }
        else context.rotate(this.angle);

        //the value of angle
        context.fillStyle = "black"
        context.font = "30px Monospace";
        context.fillText(this.angle, 100, 100);

        //draw the line that tells what direction the player is facing at
        context.strokeStyle = "blue";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(0, this.height / 2);
        context.lineTo(0, - 100);
        context.stroke();

        //draw the player
        context.fillStyle = this.color;
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        //the players tiny sword
        context.save();
        context.translate(-this.width / 2, -this.height / 2);
        context.rotate((25 + this.addAngle) * Math.PI / 180);
        context.beginPath();
        context.strokeStyle = "black";
        context.moveTo(0, 0);
        context.lineTo(0, this.height * 1.5);
        context.stroke();
        context.restore();

        context.restore();
        //restore to the last drawing state
    }

    update_position() {
        // the changes in x and y
        let dx = this.canvas_x - tracker.x;
        let dy = this.canvas_y - tracker.y;
        //how much changes it needs to make a move
        let diff = this.width / 2;
        //the amount of changes it will move
        let amount = Timer.get_delta_time();

        if (this.allowMove) {
            if (dx > diff) {
                this.x -= amount;
            } else if (dx < -diff) this.x += amount;

            if (dy > diff) {
                this.y -= amount;
            } else if (dy < -diff) this.y += amount;
        }
    }

    update = function () {
        //obviously to draw the player
        this.draw();

        //the triangle
        context.beginPath();
        context.moveTo(tracker.x, tracker.y);
        context.lineTo(tracker.x, this.canvas_y);
        context.moveTo(tracker.x, tracker.y);
        context.lineTo(this.canvas_x, this.canvas_y);
        context.moveTo(tracker.x, this.canvas_y);
        context.lineTo(this.canvas_x, this.canvas_y);
        context.stroke();

        //update player position
        this.update_position();

        context.font = "10px monospace";
        context.fillText(`x : ${this.x} y : ${this.y}`, this.canvas_x, this.canvas_y + 20);
    }
}
function animate(current_time) {
    context.clearRect(0,0,canvas.width, canvas.height);
    Timer.update(current_time);
    Camera.update();
    someguy.update();
    someguy2.update();
    player.update();
    context.fillStyle = "red";
    context.fillRect(tracker.x, tracker.y, tracker.s, tracker.s);
    requestAnimationFrame(animate);
}

window.onclick = function () {
    if (!player.allowMove) return;
    let limit = 240;
    player.toggleAllowMove();
    Timer.add("interval", 0, function () {
        player.addAngle += 10;
        return player.addAngle >= limit;
    }, function () {
        player.addAngle = 0;
        player.toggleAllowMove();
    });
}
window.onkeydown = function (event) {
    if (!player.allowMove) return;
    switch (event.keyCode) {
        case 32:
            player.toggleAllowMove();
            let dx = player.canvas_x - tracker.x;
            let dy = player.canvas_y - tracker.y;
            let dif = player.width / 2;
            let limitX, limitY;
            let addX, addY;
            let old_pos_x = player.x;
            let old_pos_y = player.y;

            if (dx > dif) {
                limitX = -200;
                addX = -50;
            } else if (dx < -dif) {
                limitX = 200;
                addX = 50;
            } else {
                limitX = 0;
                addX = 0;
            }

            if (dy > dif) {
                limitY = -200;
                addY = -50;
            } else if (dy < -dif) {
                limitY = 200;
                addY = 50;
            } else {
                limitY = 0;
                addY = 0;
            }
            Timer.add("interval", 10, function () {
                player.x += addX;
                player.y += addY;

                let dx = player.x - old_pos_x;
                let dy = player.y - old_pos_y;

                return Math.round(dx) == limitX && Math.round(dy) == limitY;
            }, function () {
                player.toggleAllowMove();
;            });
            break;
    }
}