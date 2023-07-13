let canvas, context;
let player;
let tracker;
let camera;


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

window.onload = function () {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");

    canvas.width = screen.width;
    canvas.height = screen.height;

    document.body.appendChild(canvas);

    camera = new Camera();

    player_size = 50;
    player = new Player(2500, 2500, canvas.width / 2 - player_size / 2, canvas.height / 2 - player_size / 2, player_size, player_size, "blue" , "yellow");

    someguy = new Warrior(4000, 3000, 0, 0, player_size, player_size, "blue","violet");
    someguy2 = new Warrior(5000, 5000, 0, 0, player_size, player_size, "red", "blue");

    expGenerator = new ExpGenerator();
    generateExp();

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

function animate(current_time) {
    context.clearRect(0,0,canvas.width, canvas.height);
    Timer.update(current_time);
    camera.update();
    someguy.update();
    someguy2.update();
    player.update();
    expGenerator.update();
    context.fillStyle = "red";
    context.fillRect(tracker.x, tracker.y, tracker.s, tracker.s);
    requestAnimationFrame(animate);
}
