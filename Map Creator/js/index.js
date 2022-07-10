var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Collision = Matter.Collision,
    SAT = Matter.SAT,
    Common = Matter.Common,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Query = Matter.Query,
    Composite = Matter.Composite;

var lops = []
var selected = undefined;
var necromancer = new Resurrect();
var engine = Engine.create({
    render: {
        options: {
          width: window.innerWidth,
          height: window.innerHeight
        }
    }
});

engine.world.gravity.y = 0;

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        background: "transparent",
        wireframes: false,
        width: window.innerWidth,
        height: window.innerHeight,
        hasBounds: true
    }
});

var minBounds = { x: 0, y: 0 }
var maxBounds = { x: 1500, y: 1500 }

Render.lookAt(render, {
    min: minBounds,
    max: maxBounds
});

Render.setPixelRatio(render, "auto")

var character = Bodies.rectangle((maxBounds.x+minBounds.x)/2, (maxBounds.y+minBounds.y)/2-200, 80, 80);
character.frictionAir = 1
character.special = "Hey, why are you looking at this?"
var lava = Bodies.rectangle(3800, 3000, 10000000000, 1000, { isStatic: true, render: {fillStyle: "#ff3c00"}});
var platform1 = Bodies.rectangle((maxBounds.x+minBounds.x)/2, (maxBounds.y+minBounds.y)/2, 810, 60, {render: {fillStyle: "#000000"}});
platform1.frictionAir = 1

lops.push(platform1)

Composite.add(engine.world, [character, platform1, lava]);

Render.run(render);

var runner = Runner.create();

Runner.run(runner, engine);

var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Composite.add(engine.world, [mouseConstraint])
render.mouse = mouse;

document.body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
        minBounds.y += 100
        maxBounds.y += 100
        Render.lookAt(render, {
            min: { x: minBounds.x, y: minBounds.y },
            max: { x: maxBounds.x, y: maxBounds.y }
        });
    } if (e.key === "ArrowUp") {
        minBounds.y -= 100
        maxBounds.y -= 100
        Render.lookAt(render, {
            min: { x: minBounds.x, y: minBounds.y },
            max: { x: maxBounds.x, y: maxBounds.y }
        });
    } if (e.key === "ArrowLeft") {
        minBounds.x -= 100
        maxBounds.x -= 100
        Render.lookAt(render, {
            min: { x: minBounds.x, y: minBounds.y },
            max: { x: maxBounds.x, y: maxBounds.y }
        });
    } if (e.key === "ArrowRight") {
        minBounds.x += 100
        maxBounds.x += 100
        Render.lookAt(render, {
            min: { x: minBounds.x, y: minBounds.y },
            max: { x: maxBounds.x, y: maxBounds.y }
        });
    } if (e.key === "Escape") {
        location.href = "../"
    } 
})

function copyText(TextToCopy) {
    var TempText = document.createElement("input");
    TempText.value = TextToCopy;
    document.body.appendChild(TempText);
    TempText.select();
    
    document.execCommand("copy");
    document.body.removeChild(TempText);
}

function exportMap() {
    engine.world.gravity.y = 1;
    character.frictionAir = 0.01;
    character.render.lineWidth = 0;

    lops.forEach((body) => {
        body.render.lineWidth = 0;
        body.frictionAir = 0.01;
        body.isStatic = true;
    })

    copyText(necromancer.stringify(engine.world));

    engine.world.gravity.y = 0;
    character.frictionAir = 1;

    lops.forEach((body) => {
        body.frictionAir = 1;
        body.isStatic = false;
    })

    alert("Copied world text to clipboard!");
}

Events.on(runner, "tick", event => {
    if (mouseConstraint.body) {
        if (selected) {
            selected.render.lineWidth = "0"
            selected.render.strokeStyle = "#000000"
        }
        selected = mouseConstraint.body;
        selected.render.lineWidth = "3"
        selected.render.strokeStyle = "#FFFF00"
    }
});

document.getElementById("deletePlatform").onclick = function() {
    if (selected) {
        if (!selected.special) {
            Composite.remove(engine.world, selected)
        } else {
            alert("This element is compulsary!")
        }
    }
}

document.getElementById("exportMap").onclick = function() {
    exportMap()
}

document.getElementById("createPlatform").onclick = function() {
    var newPlatform = Bodies.rectangle((maxBounds.x+minBounds.x)/2, (maxBounds.y+minBounds.y)/2, 810, 60, {render: {fillStyle: "#000000"}});
    newPlatform.frictionAir = 1

    Composite.add(engine.world, [newPlatform]);
    lops.push(newPlatform)
}
