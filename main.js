// window.onload = init;

let colors = [0xec407a,0xab47bc,0x26c6da,0xffca28,0x29b6f6,0xe84e40,0x5c6bc0,0xff7043,0x9ccc65];

let cells = [];
let attackCells = [];
let owners = [];

function getNextColor(){
    return getNext(colors, 'colors')
}

let cursors = {};
function getNext(collection, name){
    if (!cursors[name]) cursors[name] = 0;

    if (cursors[name] == collection.length) {
        cursors[name]=0;
    }
    let col = collection[cursors[name]];
    cursors[name]++;
    return col;
}


let filter = PIXI.filters || PIXI.Filter;

class Game {
    constructor(money) {
        this.money = money;
    }
}

let game = new Game(0)
let width = 800;
let height = 600;

function init() {

}

function showhide(id) {
    var e = document.getElementById(id);
    e.style.display = (e.style.display == 'inline-block') ? 'none' : 'inline-block';
 }

function switchToCanvas(){
    showhide('startit')
    showhide('moneyyeshrich')
    showhide('stage')
    addCanvasStuff()
}

function addCanvasStuff(){
    let canvas = document.getElementById("stage");


    // var ongoingTouches = new Array();
    // el.addEventListener("touchstart", handleStart, false);
    // el.addEventListener("touchend", handleEnd, false);
    // el.addEventListener("touchcancel", handleCancel, false);
    // el.addEventListener("touchmove", handleMove, false);
    //
    // function handleStart(evt) {
    //     evt.preventDefault();
    //     log("touchstart.");
    //     var ctx = canvas.getContext("2d");
    //     var touches = evt.changedTouches;
    //
    //     for (var i = 0; i < touches.length; i++) {
    //         log("touchstart:" + i + "...");
    //         ongoingTouches.push(copyTouch(touches[i]));
    //         var color = colorForTouch(touches[i]);
    //         ctx.beginPath();
    //         ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    //         ctx.fillStyle = color;
    //         ctx.fill();
    //         log("touchstart:" + i + ".");
    //     }
    // }
    let mouseDown = false
    let mousePos = {}
    canvas.addEventListener("mousedown", function(evt){
        mouseDown = true
        setXYFrom(mousePos, evt)
    }, false);
    canvas.addEventListener("mousemove", function(evt){
        setXYFrom(mousePos, evt)
    }, false);
    canvas.addEventListener("mouseup", function(evt){
        setXYFrom(mousePos, evt)
        mouseDown = false
    }, false);

    canvas.width=width;
    canvas.height=height;

    let loader = PIXI.loader
    loader
		.add("cloud1", "img/cloud1_nice.png")
        .add("cloud3", "img/cloud4_nice.png")
        .load(abgehts);

    function abgehts(){

        let stage = new PIXI.Container(0x66FF99, true);
        let renderer = new PIXI.autoDetectRenderer(width, height, {
            view: canvas, backgroundColor : 0x1099bb, antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoResize:true});

            PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

            //full size
            // canvas.width = window.innerWidth;
            // canvas.height = window.innerHeight;
            //
            // window.addEventListener("resize", function(){
            //     canvas.width = window.innerWidth;
            //     canvas.height = window.innerHeight;
            // });

            let thePlane = new Plane(getNextColor())

            let NUM_PERSONS = 10;
            //Create Cells
            let persons = []

            for (let i = 0; i < NUM_PERSONS; i++) {
                let person = new Person(faker.name.findName(),  getNextColor());
                let allXs = pluck(persons, 'position.x')
                person.position = {
                    x: randomXPointWithMinDistance(5, allXs, 0, width), y:height
                }
                persons.push(person);
            }

            thePlane.position = { x: 100, y:height / 3 }
            addPlaneUI(thePlane)
            stage.addChild(thePlane.sprite);

            PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

            addPersons(persons);
            function addPersons(persons) {
                for (let person of persons) {
                    addPersonUI(person, stage)
                }
            }
            function getAffectedPersons(bounds){
                return _.filter(persons, function(person) {
                    return _.inRange(person.position.x, bounds.x, bounds.x + bounds.width);
                });
            }

            function poisonPersons(line){
                let posison_persons = getAffectedPersons(line.getBoundaries())
                for (person of posison_persons) {
                    person.intoxicationLevel = line.getChemDensityOnGround();
                    person.text.style = {font:"14px Arial",fill:"#FF0000"};
                }
                game.money+= height - line.startHeight
            }

            function addUIText(text){
                let uitext = new PIXI.cocoontext.CocoonText( text,{font : '16px Arial', align : 'center', fill:"white"});
                uitext.canvas.style.webkitFontSmoothing = "antialiased";
                stage.addChild(uitext);
                uitext.y = 20;
                return uitext
            }
            let tankText = addUIText(thePlane.chemtrailTank)
            tankText.x = 20
            let moneyText = addUIText(game.money)
            moneyText.x = width - 20
            moneyText.anchor.x = 1

            //Capture the keyboard arrow keys
            let left = keyboard(37);
            let up = keyboard(38);
            let right = keyboard(39);
            let down = keyboard(40);
            let space = keyboard(32);

            let elapsed = Date.now();

            space.release = () => {
                thePlane.chemtrails.completeLine()
            }

            let start = performance.now();
            // *** ANIMATE
            animate();
            function animate() {
                let timestamp = performance.now()
                requestAnimationFrame(animate);
                let delta = (timestamp - start) / 10;
                start = timestamp;

                tankText.text = "Chemtrailtank: "+Math.round(thePlane.chemtrailTank)
                moneyText.text = "Moneten: "+Math.round(game.money)
                thePlane.sprite.rotation = degreesToRadians(thePlane.angle)
                if (left.isDown) thePlane.angle -= thePlane.rotationSpeed * delta;
                if (right.isDown) thePlane.angle += thePlane.rotationSpeed * delta;
                if (space.isDown) thePlane.spray(delta)

                if (mouseDown) {
                    //  thePlane.angle = getDegree(thePlane.sprite, mousePos)
                    // var x = thePlane.sprite.x - mousePos.x;
                    // var y = thePlane.sprite.y - mousePos.y;
                    // let radians = Math.atan2(y,x);
                    // thePlane.angle = radiansToDegrees(radians)
                }
                thePlane.move(delta);
                thePlane.chemtrails.descend(delta);
                thePlane.chemtrails.draw(stage);

                let lines = thePlane.chemtrails.hitsGround()
                if (lines.length > 0) {
                    poisonPersons(lines[0]);
                }
                renderer.render(stage)
            }

            renderer.render(stage)

        }

}

    class Key {
        constructor(keycode) {
            let keyCallBack = keyboard(keycode);
            this.pressed = false
            keyCallBack.press = () => {this.pressed = true;}
            keyCallBack.release = () => {this.pressed = false;}
        }
    }
    class ChemtrailLine {
        constructor(startPos, descendSpeed, chemTrailAmount){
            this.startHeight = startPos.y // height ratio
            this.descendation = 0;
            this.descendSpeed = descendSpeed
            this.positions = []
            this.positions.push(startPos)
            this.completed = false
            this.chemTrailAmount = chemTrailAmount
        }
        getChemDensityOnGround(){
            let dense = this.chemTrailAmount / this.line.getBounds().width
            let heightAplied = dense * ( (height - his.descendation) / height ) //balance -- linear height
            return heightAplied
        }
        addTrail(pos, chemTrailAmount){
            if (lineDistance( _.last(this.positions), pos ) > 1) {
                this.positions.push(pos)
            }
            this.chemTrailAmount+=chemTrailAmount
        }
        completeLine(){
            this.completed = true;
            this.positions = []
        }
        descend(delta){
            if (this.completed == false) {
                for (let i = 0; i < this.positions.length; i++) {
                    this.positions[i].y += this.descendSpeed * delta
                }
            }else{
                this.line.position.y += this.descendSpeed * delta
            }
            this.descendation += this.descendSpeed * delta
        }
        getBoundaries(){
            return this.line.getBounds()
        }
        hitsGround(){
            if (!this.line) return false; // TODO
            return this.startHeight + this.descendation + 40 > height
        }
        draw(stage){
            if(this.completed == true) return
            if(this.positions.length < 2) return

            if (this.line) stage.removeChild(this.line)

            this.line = new PIXI.Graphics();

            this.line.lineStyle(5, 0x88BB88, 1);
            this.line.moveTo(this.positions[0].x,this.positions[0].y);
            for (let i = 1; i < this.positions.length; i++) {
                this.line.lineTo(this.positions[i].x,this.positions[i].y);
            }
            this.line.endFill();
            stage.addChild(this.line);
        }
    }
    class Chemtrails {
        constructor(color) {
            this.color = color;
            this.positions = []
            this.descendSpeed = .1
            this.lastPos;
            this.completeLines = []
            this.chemtrailLines = []
            this.currentLine = null;

        }
        descend(delta){
            for (let line of this.chemtrailLines) {
                line.descend(delta)
            }
        }
        hitsGround(){
            return _.remove(this.chemtrailLines, function(line) {
              return line.hitsGround()
            });
        }
        completeLine(){
            this.currentLine.completeLine();
            this.currentLine = null;
        }
        addTrail(pos, chemTrailAmount){
            if (!this.currentLine) {
                this.currentLine = new ChemtrailLine(pos, this.descendSpeed, chemTrailAmount)
                this.chemtrailLines.push(this.currentLine)
            }else{
                this.currentLine.addTrail(pos, chemTrailAmount);
            }
        }
        draw(stage){
            for (let line of this.chemtrailLines) {
                line.draw(stage)
            }
        }
    }


    function lineDistance( point1, point2 )
    {
        return Math.hypot(point2.x-point1.x, point2.y-point1.y)
    }

    class Plane {
        constructor(color, initialPosition) {
            this.chemtrails = new Chemtrails()
            this.color = color;
            this.chemtrailTank = 300;
            this.speed = 1;
            this.angle = 180;
            this.position = initialPosition;
            this.rotationSpeed = 0.5;
        }
        move(delta){
            this.position = moveTowardsAngle(this.position, degreesToRadians(this.angle), this.speed * delta);
            setXYFrom(this.sprite.position, this.position)
        }
        spray(delta){
            if (this.chemtrailTank <= 0) {
                return;
            }
            let chemTrailAmount =  (1 * delta)
            this.chemtrailTank -= chemTrailAmount;
            this.chemtrailTank = Math.max(0, this.chemtrailTank)
            this.chemtrails.addTrail(this.position, chemTrailAmount)
        }
    }

    class Person {
        constructor(name, color) {
            this.name = name;
            this.color = color;
            this.intoxicationLevel = 0
        }
    }
