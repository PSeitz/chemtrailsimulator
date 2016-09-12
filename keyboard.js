function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
    if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;

    }
    event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
    if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
    }
    event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}


// function mouse(canvas) {
//     var mouse = {};
//     mouse.code = keyCode;
//     mouse.isDown = false;
//     mouse.isUp = true;
//     mouse.press = undefined;
//     mouse.release = undefined;
//     //The `downHandler`
//     mouse.downHandler = function(event) {
//     if (event.keyCode === mouse.code) {
//         if (mouse.isUp && mouse.press) mouse.press();
//         mouse.isDown = true;
//         mouse.isUp = false;
//
//     }
//     event.preventDefault();
//     };
//
//     //The `upHandler`
//     mouse.upHandler = function(event) {
//     if (event.keyCode === mouse.code) {
//         if (mouse.isDown && mouse.release) mouse.release();
//         mouse.isDown = false;
//         mouse.isUp = true;
//     }
//     event.preventDefault();
//     };
//
//     //Attach event listeners
//     canvas.addEventListener("mousedown", function(evt){
//         flag = 0;
//     }, false);
//
//     window.addEventListener(
//         "keydown", mouse.downHandler.bind(mouse), false
//     );
//     window.addEventListener(
//         "keyup", mouse.upHandler.bind(mouse), false
//     );
//     return mouse;
// }
