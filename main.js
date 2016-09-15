window.onload = addCanvasStuff;

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

    let mouseDown = false

    // let mousePoses = []
    let touchPos1 = undefined
    let touchPos2 = undefined

    var ongoingTouches = new Array();
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);

    function setXYFromTouch(touch, target){
        target.x = touch.clientX
        target.y = touch.clientY
    }

    function saveXYFromTouches(touches){
        if(touches[0]) {
            touchPos1 = touchPos1 || {}
            setXYFromTouch(touches[0], touchPos1)
        }
        if(touches[1]){
            touchPos2 = touchPos2 || {}
            setXYFromTouch(touches[1], touchPos2)
        }
    }
    function clearTouchPos(){
        touchPos1 = undefined
        touchPos2 = undefined
    }
    function handleStart(evt) {


        evt.preventDefault();
        mouseDown = true
        saveXYFromTouches(evt.touches)
    }
    function handleEnd(evt) {
        evt.preventDefault();
        mouseDown = false
        clearTouchPos()
    }
    function handleCancel(evt) {
        evt.preventDefault();
        mouseDown = false
        clearTouchPos()
    }
    function handleMove(evt) {
        evt.preventDefault();
        saveXYFromTouches(evt.touches)
    }

    // canvas.addEventListener("mousedown", function(evt){
    //     mouseDown = true
    //     // setXYFrom(mousePos, evt)
    //     mousePoses.length = 0
    //     mousePoses.push({
    //         x:evt.x,
    //         y:evt.y
    //     })
    // }, false);
    // canvas.addEventListener("mousemove", function(evt){
    //     // setXYFrom(mousePos, evt)
    //     mousePoses.length = 0
    //     mousePoses.push({
    //         x:evt.x,
    //         y:evt.y
    //     })
    // }, false);
    // canvas.addEventListener("mouseup", function(evt){
    //     // setXYFrom(mousePos, evt)
    //     mousePoses.length = 0
    //     mousePoses.push({
    //         x:evt.x,
    //         y:evt.y
    //     })
    //     mouseDown = false
    // }, false);

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

            let emitters = []
            function handleChemtrailHitsGround(line){
                let posison_persons = getAffectedPersons(line.getBoundaries())
                for (person of posison_persons) {
                    let dense = line.getChemDensityOnGround()
                    let increase = person.increaseIntoxicationLevel(dense)
                    game.money+= (increase)
                    person.text.style = {font:"14px Arial",fill:"#FF0000"};
                    // let emitter = getEmitter(person.container)
                    // emitters.push(emitter)
                }
                let emitter = getEmitter(line.container)
                emitters.push(emitter)
                // game.money+= height - line.startHeight
                line.container.removeChild(line.line)

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

            let spottedText = addUIText(thePlane.spotted)
            spottedText.x = width / 2
            spottedText.anchor.x = .5

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
                spottedText.text = "Spotted: "+Math.round(thePlane.spotted)

                thePlane.sprite.rotation = degreesToRadians(thePlane.angle)
                if (left.isDown) thePlane.angle -= thePlane.rotationSpeed * delta;
                if (right.isDown) thePlane.angle += thePlane.rotationSpeed * delta;

                for (emitter of emitters) {
                    emitter.update(delta * 0.01);
                }

                let isSpraying = space.isDown;

                if (mouseDown) {
                    function handleTouch(touchPos){
                        if (getDistance( thePlane.sprite, touchPos ) < 70) {
                            isSpraying = true
                        }else{
                            var x = thePlane.sprite.x - touchPos.x;
                            var y = thePlane.sprite.y - touchPos.y;
                            let radians = Math.atan2(y,x);
                            // thePlane.angle = radiansToDegrees(radians)
                            thePlane.angle = turnTowards(thePlane.angle, radiansToDegrees(radians),  thePlane.rotationSpeed * delta)
                        }
                    }
                    if(touchPos1) handleTouch(touchPos1)
                    if(touchPos2) handleTouch(touchPos2)

                }

                for (person of persons) {
                    thePlane.spotted += person.spotPlane(thePlane, delta)
                }

                thePlane.move(delta);
                thePlane.chemtrails.descend(delta);

                if (isSpraying) thePlane.spray(delta, stage)

                let lines = thePlane.chemtrails.hitsGround()
                if (lines.length > 0) lines.forEach((line) => {handleChemtrailHitsGround(line)})
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
        constructor(startPos, descendSpeed, chemTrailAmount, stage){
            this.startHeight = startPos.y // height ratio
            this.descendation = 0;
            this.descendSpeed = descendSpeed
            this.positions = []
            this.positions.push(startPos)
            this.completed = false
            this.chemTrailAmount = chemTrailAmount
            this.container = new PIXI.Container();
            stage.addChild(this.container);
            this.startPos = startPos
            this.container.x = this.startPos.x
            this.container.y = this.startPos.y
        }
        getChemDensityOnGround(){
            let dense = this.chemTrailAmount / this.line.getBounds().width
            let heightAplied = dense * ( (height - this.descendation) / height ) //balance -- linear height
            return heightAplied
        }
        addTrail(pos, chemTrailAmount){
            if (getDistance( _.last(this.positions), pos ) > 1) {
                this.positions.push(pos)
            }
            this.chemTrailAmount+=chemTrailAmount
            this.draw()
        }
        shouldCompleteLine(){
            return this.positions.length > 5
        }
        completeLine(){
            this.completed = true;
            this.positions = []
        }
        descend(delta){
            this.container.position.y += this.descendSpeed * delta
            this.descendation += this.descendSpeed * delta
        }
        getBoundaries(){
            return this.line.getBounds()
        }
        hitsGround(){
            if (!this.line) return false; // TODO
            return this.startHeight + this.descendation + 10 > height
        }
        draw(){
            if(this.completed == true) return
            // if(this.positions.length < 2) return

            if (this.line) this.container.removeChild(this.line)

            this.line = new PIXI.Graphics();

            this.line.lineStyle(5, 0x88BB88, 1);

            this.line.moveTo(0, 0)
            for (let i = 1; i < this.positions.length; i++) {
                this.line.lineTo(this.positions[i].x - this.startPos.x ,this.positions[i].y-this.startPos.y);
            }
            this.line.endFill();

            this.container.addChild(this.line);
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
        newChemtrailLine(pos, chemTrailAmount, stage){
            this.currentLine = new ChemtrailLine(pos, this.descendSpeed, chemTrailAmount, stage)
            this.chemtrailLines.push(this.currentLine)
        }
        addTrail(pos, chemTrailAmount, stage){
            if (!this.currentLine) {
                this.newChemtrailLine(pos, chemTrailAmount, stage)
            }else{
                if (this.currentLine.shouldCompleteLine()) {
                    this.completeLine()
                    this.newChemtrailLine(pos, chemTrailAmount, stage)
                }else{
                    this.currentLine.addTrail(pos, chemTrailAmount);
                }
            }
        }
    }


    function getDistance( point1, point2 )
    {
        return Math.hypot(point2.x-point1.x, point2.y-point1.y)
    }

    class Plane {
        constructor(color, initialPosition) {
            this.chemtrails = new Chemtrails()
            this.color = color;
            this.chemtrailTank = 300;
            this.speed = 1;
            this.maxSpeed = 2;
            this.angle = 180;
            this.position = initialPosition;
            this.rotationSpeed = 0.5;
            this.spotted = 0;
        }
        move(delta){
            this.position = moveTowardsAngle(this.position, degreesToRadians(this.angle), this.speed * delta);
            setXYFrom(this.sprite.position, this.position)
            if ( degreesToRadians(this.angle) < 0) {
                this.speed += 0.1
                this.speed = Math.min(this.speed, this.maxSpeed)
            }
        }
        spray(delta, stage){
            if (this.chemtrailTank <= 0) {
                return;
            }
            let chemTrailAmount =  (1 * delta)
            this.chemtrailTank -= chemTrailAmount;
            this.chemtrailTank = Math.max(0, this.chemtrailTank)
            this.chemtrails.addTrail(this.position, chemTrailAmount, stage)
        }
    }

    function Enum(a){
      let i = Object
        .keys(a)
        .reduce((o,k)=>(o[a[k]]=k,o),{});

      return Object.freeze(
        Object.keys(a).reduce(
          (o,k)=>(o[k]=a[k],o), v=>i[v]
        )
      );
    } // y u so terse?

    const PERSON_TYPE = Enum({
        a: 0,
        b: 1,
        c: "banana"
    });

    class Person {
        constructor(name, color, personType) {
            this.name = name;
            this.color = color;
            this.personType = personType;
            this.intoxicationLevel = 0
        }
        increaseIntoxicationLevel(poison){
            let prev = this.intoxicationLevel
            this.intoxicationLevel = Math.max(10, this.intoxicationLevel+poison)
            return this.intoxicationLevel - prev
        }
        spotPlane(thePlane, delta){
            let planeDistance = getDistance( this.position, thePlane.position );
            if (planeDistance < 100) {
                return planeDistance / 100 * delta
            }
            return 0
        }
    }
