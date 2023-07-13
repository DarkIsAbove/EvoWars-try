class Player extends Warrior {
    constructor(x, y, canvas_x, canvas_y, width, height, color, mini_color) {
        super(x, y, canvas_x, canvas_y, width, height, color, mini_color);
        this.allowMove = true;
        this.addAngle = 0;
    }

    toggleAllowMove() {
        this.allowMove = this.allowMove ? false : true;
    }

    draw() {
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
        context.font = "10px Arial";
        context.fillText(this.exp, 0, 100);

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

    update() {
        this.expCollission();

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
                ;
            });
            break;
    }
}