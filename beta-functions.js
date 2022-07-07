// 1. Loading and saving worlds
// Dependencies: resurrect-js

var necromancer = new Resurrect();

function loadData(text) {
    var world = necromancer.resurrect(text);
    engine.world = world;
    return true;
}

function saveData() {
    return necromancer.stringify(engine.world);
}
