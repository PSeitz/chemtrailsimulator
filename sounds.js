var sounds = {};

function load(name, path){
    sounds[name] = new Howl({
      src: [path]
    });
}

function play(name){
    sounds[name].play();
}

load("attack", 'sounds/attack.wav')
load("select", 'sounds/select7.wav')
load("hit", 'sounds/select4.wav')
load("drop", 'sounds/drop3.wav')
load("drop1", 'sounds/drop2.wav')
