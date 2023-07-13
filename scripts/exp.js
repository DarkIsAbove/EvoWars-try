class Exp {
    constructor(amount) {
        this.amount = amount;
        this.width = this.height = this.amount * 0.2;
        this.x = Math.random() * (World.size - this.width);
        this.y = Math.random() * (World.size - this.height);
        this.color;
        this.ref = [this, "white"];
        camera.minimap.include(this.ref);
    }

    update_position_in_camera() {
        this.canvas_x = this.x - camera.x;
        this.canvas_y = this.y - camera.y;
    }


    draw() {
        if (!camera.inside(this)) return;
        context.fillStyle = this.color;
        context.fillRect(this.canvas_x, this.canvas_y, this.width, this.height);
    }

    collect(object) {
        object.exp += this.amount;
        this.collected = true;
    }


    update() {
        this.update_position_in_camera();
        this.draw();
    }
}

class ExpGenerator {
    constructor() {
        this.exps = [];
        this.collected = [];
    }

    generate() {
        let amount = Math.round(Math.random() * 900) + 100;
        let exp = new Exp(amount);
        this.exps.push(exp);
    }

    update() {
        for (let i = 0; i < this.exps.length; i++) {
            let exp = this.exps[i];
            if (exp.collected && this.collected.indexOf(exp) < 0) this.collected.push(exp);
            exp.update();

        }  

        for (let i = 0, collected = this.collected; i < collected.length; i++) {
            let exp = collected[i];
            let index = this.exps.indexOf(exp);
            this.exps.splice(index, 1);
            camera.minimap.remove(exp.ref);
        }
        this.collected = [];
    }
}

function generateExp() {
    expGenerator.generate();
    Timer.add("timeout", 500, generateExp);
}