class Warrior {
    constructor(x, y, canvas_x, canvas_y, width, height, color, mini_color) {
        this.x = x;
        this.y = y;
        this.canvas_x = canvas_x;
        this.canvas_y = canvas_y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.exp = 500;

        camera.minimap.include([this, mini_color]);
    }
    
    collideTo(object) {
        return this.x + this.width > object.x &&
              this.x < object.x + object.width &&
              this.y + this.height > object.y &&
              this.y < object.y + object.height;
    }

    expCollission() {
        let exps = expGenerator.exps;
        for (let i = 0; i < exps.length; i++) {
            let exp = exps[i];
            if (this.collideTo(exp)) {
                exp.collect(this);
            }
        }
    }

    draw() {
        if (!camera.inside(this)) return;
        context.fillStyle = this.color;
        context.fillRect(this.canvas_x, this.canvas_y, this.width, this.height);
    }

    update_position_in_camera() {
        this.canvas_x = this.x - camera.x;
        this.canvas_y = this.y - camera.y;
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
