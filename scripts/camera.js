class Camera {
    constructor() {
        this.x = this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;


        this.minimap = {
            width: this.width * 0.25,
            height: this.height * 0.25,
            y: 0,
            objects: []
        };
        this.minimap.x = this.width - this.minimap.width;

        this.minimap.update = function () {
            context.fillStyle = "brown";
            context.fillRect(this.x, this.y, this.width, this.height);

            for (let [object, color] of this.objects) {
                let mini_object = {
                    x: this.x + ((object.x - object.width / 2) / World.size) * this.width,
                    y: ((object.y - (object.height / 2)) / World.size) * this.height,
                    width: (object.width / World.size) * this.width,
                    height: (object.height / World.size) * this.height
                };

                context.fillStyle = object.mini_color || color;
                context.fillRect(mini_object.x, mini_object.y, mini_object.width, mini_object.height);
            }
        }

        this.minimap.include = function (object) {
            this.objects.push(object);
        }

        this.minimap.remove = function (object) {
            let index = this.objects.indexOf(object);
            this.objects.splice(index, 1);
        }

    }
   
    focusPlayer() {
        this.x = player.x + (player.width / 2) - this.width / 2;
        this.y = player.y + (player.height / 2) - this.height / 2;
    }

    inside(object) {
        return !((object.x > this.x + this.width) ||
            (object.x + object.width < this.x) ||
            (object.y > this.y + this.height) ||
            (object.y + object.height < this.y));
    }

    update () {
        this.focusPlayer();
        this.minimap.update();

        context.font = "20px monospace";
        context.fillText(`x : ${this.x} y : ${this.y} totalWidth : ${this.x + this.width} totalHeight : ${this.y + this.height}`, 0, 100);
    }
};
