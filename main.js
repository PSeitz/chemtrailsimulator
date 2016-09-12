window.onload = init;

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

function pluck(array, property){
    let newArr = []
    let props = property.split('.')
    for (el of array) {
        let pluckedObj = el;
        for (prop of props) {
            pluckedObj = pluckedObj[prop]
        }
        newArr.push(pluckedObj)
    }
    return newArr
}

class Game {
    constructor(money) {
        this.money = money;
    }
}

let game = new Game(0)
let width = 800;
let height = 600;

function init() {

    let canvas = document.getElementById("stage");

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

            function randomPointWithMinDistance(minDistance, otherXs){
                let x, nearestNeighbour;
                for (let i = 0; i < 1000; i++) {
                    x =  _.random(0, width)
                    if (otherXs.length === 0) {
                        return x;
                    }

                    for (otherX of otherXs) {
                        let distance = Math.abs(otherX - x)
                        if (nearestNeighbour == undefined || distance < nearestNeighbour) {
                            nearestNeighbour = distance
                        }
                    }
                    if (nearestNeighbour > minDistance) {
                        break;
                    }
                }

                return x
            }

            for (let i = 0; i < NUM_PERSONS; i++) {
                let person = new Person(faker.name.findName(),  getNextColor());
                let allXs = pluck(persons, 'position.x')

                person.position = {
                    x: randomPointWithMinDistance(5, allXs), y:height
                }
                persons.push(person);
            }


            thePlane.position = { x: 100, y:height / 3 }
            let planerDrawer = new PIXI.Graphics();
            planerDrawer.beginFill(thePlane.color);
            planerDrawer.drawRect(0,0, 35, 15);
            planerDrawer.endFill();

            let texture = planerDrawer.generateTexture();
            thePlane.sprite = new PIXI.Sprite(texture)
            setXY(thePlane.sprite.anchor, 0.5);
            thePlane.sprite.anchor.x=0.3
            setXYFrom(thePlane.sprite, thePlane.position)
            stage.addChild(thePlane.sprite);


            PIXI.cocoontext.CONST.TEXT_RESOLUTION =  window.devicePixelRatio;

            addPersons(persons);
            function addPersons(persons) {

                for (let person of persons) {
                    let container = new PIXI.DisplayObjectContainer();
                    person.container = container;
                    stage.addChild(container);

                    let graphics = new PIXI.Graphics();
                    drawPerson(graphics, person.color, person.position);

                    let texture = graphics.generateTexture();
                    person.sprite = new PIXI.Sprite(texture);
                    person.sprite.interactive = false;

                    setXY(person.sprite.anchor, 0.5);
                    container.addChild(person.sprite);

                    setXYFrom(person.container, person.position)

                    person.text = new PIXI.cocoontext.CocoonText(person.name ,{font : '10px Arial', align : 'center', fill:"white"});
                    setXY(person.text.anchor, 0.5);
                    person.text.canvas.style.webkitFontSmoothing = "antialiased";
                    container.addChild(person.text);
                    person.text.y = - 20 - _.random(0, 80);

                }

            }


            function addUIText(text){
                let uitext = new PIXI.cocoontext.CocoonText( text,{font : '16px Arial', align : 'center', fill:"white"});
                // setXY(uitext.anchor, 0.5);
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

            //Get shader code as a string
            let shaderCode = document.getElementById("shader").innerHTML
            let uniforms = {}
            uniforms.time = {
                type:"1f",
                value:0.1
            }



            //Capture the keyboard arrow keys
            let left = keyboard(37);
            let up = keyboard(38);
            let right = keyboard(39);
            let down = keyboard(40);
            let space = keyboard(32);

            let clouds = []


            let elapsed = Date.now();

            space.release = () => {
                thePlane.chemtrails.completeLine()
            }

            // start animating
            let start = performance.now();

            // *** ANIMATE
            animate();
            function animate(timestamp) {
                requestAnimationFrame(animate);
                let delta = (timestamp - start) / 10;
                start = timestamp;

                tankText.text = "Chemtrailtank: "+Math.round(thePlane.chemtrailTank)
                moneyText.text = "Moneten: "+Math.round(game.money)
                thePlane.sprite.rotation = degreesToRadians(thePlane.angle)
                if (left.isDown) {
                    thePlane.angle -= thePlane.rotationSpeed * delta;
                }
                if (right.isDown) {
                    thePlane.angle += thePlane.rotationSpeed * delta;
                  }
                if (space.isDown) {
                    thePlane.spray(delta)
                }
                thePlane.move();
                for (cloud of clouds) {
                    cloud.y += .1 * delta
                }
                thePlane.chemtrails.descend(delta);
                thePlane.chemtrails.draw(stage);

                let lines = thePlane.chemtrails.hitsGround()
                if (lines.length > 0) {
                    game.money+= height - lines[0].startHeight
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
        constructor(startPos, descendSpeed){
            this.startHeight = startPos.y // height ratio
            this.descendation = 0;
            this.descendSpeed = descendSpeed
            this.positions = []
            this.positions.push(startPos)
            this.completed = false
        }
        addPos(pos){
            if (lineDistance( _.last(this.positions), pos ) > 1) {
                this.positions.push(pos)
            }
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
        addPos(pos){
            if (!this.currentLine) {
                this.currentLine = new ChemtrailLine(pos, this.descendSpeed)
                this.chemtrailLines.push(this.currentLine)
            }else{
                this.currentLine.addPos(pos);
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
        move(){
            this.position = moveTowardsAngle(this.position, degreesToRadians(this.angle), this.speed);
            setXYFrom(this.sprite.position, this.position)
        }
        spray(delta){
            if (this.chemtrailTank <= 0) {
                return;
            }
            this.chemtrailTank -= (1 * delta);
            this.chemtrailTank = Math.max(0, this.chemtrailTank)
            this.chemtrails.addPos(this.position)
        }
    }

    class Person {
        constructor(name, color) {
            this.name = name;
            this.color = color;
        }
    }
