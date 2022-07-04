var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Collision = Matter.Collision,
    Composite = Matter.Composite;

var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        background: "transparent",
        wireframes: false
    }
});

var character = Bodies.rectangle(400, 900, 80, 80);
character.special = "Hey, why are you looking at this?"
var platform1 = Bodies.rectangle(400, 1200, 810, 60, { isStatic: true});
var platform2 = Bodies.rectangle(1600, 1000, 810, 60, { isStatic: true});
var platform3 = Bodies.rectangle(2800, 1400, 810, 60, { isStatic: true});
var platform4 = Bodies.rectangle(3800, 800, 810, 60, { isStatic: true});

Composite.add(engine.world, [character, platform1, platform2, platform3, platform4]);

function isColliding(object) {
    for (var i = 0; i < Composite.allBodies(engine.world).length; i++) {
        var collide = Collision.collides(object, Composite.allBodies(engine.world)[i])
        if (collide != null) {
            if (!(collide.bodyA.special != undefined && collide.bodyB.special != undefined)) {
                return true;
            }
        }
    }
    return false
}

Render.run(render);

var runner = Runner.create();

Runner.run(runner, engine);

function getDegree(x1, y1) {
    return 90-Math.acos(x1/Math.sqrt(Math.pow(x1, 2)+Math.pow(y1, 2))) * (180 / Math.PI);
}

var cachedPosition = {
    x: 0,
    y: 0
};

function mouseDOWN(e) {
    cachedPosition.x = e.clientX
    cachedPosition.y = e.clientY
}

document.addEventListener("mousedown", (e) => {
    mouseDOWN(e)
})

document.addEventListener("touchstart", (e) => {
    mouseDOWN(e)
})

function mouseUP(e) {
    if (isColliding(character)) {
        var degree = "INVALID";
        var difX = cachedPosition.x - e.clientX
        var difY = cachedPosition.y - e.clientY
        if (difX > 0 && difY < 0) {
            var degree = getDegree(difX, difY)
        } if (difX < 0 && difY < 0) {
            var degree = -getDegree(Math.abs(difX), difY);
        }

        var power = Math.sqrt(Math.pow(difX, 2)+Math.pow(difY, 2))/1000
        console.log(degree)
        if (degree > 0) {
            if (degree < 25) {
                Body.applyForce(character, character.position, {
                    x: power*(degree/45),
                    y: -0.4,
                })
            }
            else if (degree > 45) {
                Body.applyForce(character, character.position, {
                    x: power/(degree/45),
                    y: -power*(degree/45)
                })
            } else if (degree < 45) {
                Body.applyForce(character, character.position, {
                    x: power*(degree/45),
                    y: -power/(degree/45)
                })
            } else if (degree == 45) {
                Body.applyForce(character, character.position, {
                    x: power,
                    y: -power
                })
            }
        } else {
            if (-degree < 25) {
                Body.applyForce(character, character.position, {
                    x: power*(degree/45),
                    y: -0.4
                })
            } else if (-degree > 45) {
                Body.applyForce(character, character.position, {
                    x: power/(degree/45),
                    y: power*(degree/45)
                })
            } else if (-degree < 45) {
                Body.applyForce(character, character.position, {
                    x: power*(degree/45),
                    y: power/(degree/45)
                })
            } else if (-degree == 45) {
                Body.applyForce(character, character.position, {
                    x: power,
                    y: -power
                })
            }
        }
    }
}

document.addEventListener("mouseup", (event) => {
    mouseUP(event);
})

document.addEventListener("touchend", (event) => {
    mouseUP(event);
})

function follow() {
    Render.lookAt(render, character, {
        x: window.innerWidth,
        y: 600
    });
    requestAnimationFrame(follow)
}

follow()