var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Collision = Matter.Collision,
    SAT = Matter.SAT,
    Common = Matter.Common,
    Composite = Matter.Composite;

var engine = Engine.create({
    render: {
        options: {
          width: window.innerWidth,
          height: window.innerHeight
        }
    }
});

var followBody = undefined;

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        background: "transparent",
        wireframes: false,
        width: window.innerWidth,
        height: window.innerHeight
    }
});

Render.setPixelRatio(render, "auto")

var maxRight = 400;
var maxLeft = 400;

var character = Bodies.rectangle(400, 900, 80, 80);
Body.setAngularVelocity(character, 0.05)
character.special = "Hey, why are you looking at this?"
followBody = character
var lava = Bodies.rectangle(3800, 3000, 10000000000, 1000, { isStatic: true, render: {fillStyle: "#ff3c00"}});
var platform1 = Bodies.rectangle(400, 1200, 810, 60, { isStatic: true});

Composite.add(engine.world, [character, lava, platform1]);

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
                    x: power*(degree/45),
                    y: -power/(degree/45)
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
                    x: power*(degree/45),
                    y: power/(degree/45)
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
        Body.setAngularVelocity(character, 0.1)
    }
}

document.addEventListener("mouseup", (event) => {
    mouseUP(event);
})

document.addEventListener("touchend", (event) => {
    mouseUP(event);
})

function follow() {
    if (SAT.collides(character, lava)) {
        setTimeout(() => {
            location.href = "death.html"
        }, 500)
    }
    if (followBody != undefined) {
        Render.lookAt(render, followBody, {
            x: window.innerWidth,
            y: 600
        });
    }
    requestAnimationFrame(follow)
}

function spawnTerrain() {
    Composite.add(engine.world, Bodies.rectangle(maxRight+1400, Common.random(800, 1800), 810, 60, { isStatic: true}));
    Composite.add(engine.world, Bodies.rectangle(maxLeft-1400, Common.random(800, 1800), 810, 60, { isStatic: true}));
    maxLeft -= 1400
    maxRight += 1400
    setTimeout(spawnTerrain, 2000);
}

spawnTerrain()
follow()
