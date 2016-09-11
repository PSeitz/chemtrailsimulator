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

let game = {};

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


function init() {

    let width = 800;
    let height = 600;
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


            thePlane.position = { x: 100, y:height/3 }
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

            // let graphics2 = new PIXI.Graphics();
            // graphics2.beginFill(0xe84e40);
            // graphics2.drawRect(0, 0, 10, 20);
            // graphics2.endFill();
            // let texture = graphics2.generateTexture();
            // let sprite = new PIXI.Sprite(texture);
            // sprite.x = 100;
            // sprite.y = 100;
            // stage.addChild(sprite);

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

            let tankText = addTankDisplay()
            function addTankDisplay(){
                let tankText = new PIXI.cocoontext.CocoonText(thePlane.chemtrailTank ,{font : '16px Arial', align : 'center', fill:"white"});
                // setXY(tankText.anchor, 0.5);
                tankText.canvas.style.webkitFontSmoothing = "antialiased";
                stage.addChild(tankText);
                tankText.y = 20;
                tankText.x = 20
                return tankText
            }


            //Get shader code as a string
            let shaderCode = document.getElementById("shader").innerHTML
            let uniforms = {}
            uniforms.time = {
              type:"1f",
              value:0.1
            }

            //Create our Pixi filter using our custom shader code
            // let simpleShader = new PIXI.AbstractFilter('',shaderCode);
            //Apply it to our object
            // thePlane.sprite.filters = [simpleShader]

            // let shad = getCloudShader(200,200)
            // let cloudshader = new PIXI.Filter(shad.fragmentSrc2);
            //
            // let bg = PIXI.Sprite.fromImage("test_BG.jpg");
            // bg.width = 200;
            // bg.height = 200;
            // bg.shader = cloudshader;
            // stage.addChild(bg);



            //Capture the keyboard arrow keys
            let left = keyboard(37);
            let up = keyboard(38);
            let right = keyboard(39);
            let down = keyboard(40);
            let space = keyboard(32);

            let clouds = []

            // space.press = () => {
            //     let cloudSprite = new PIXI.Sprite(loader.resources.cloud3 .texture)
            //     cloudSprite.scale = new PIXI.Point(0.1, 0.1)
            //     cloudSprite.anchor.x = 0.5
            //     stage.addChild(cloudSprite);
            //     setXYFrom(cloudSprite, thePlane.sprite)
            //     clouds.push(cloudSprite)
            // }



            let elapsed = Date.now();

            // space.press = () => {
            //     emitter.emit = true;
            // }
            //
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

                tankText.text = Math.round(thePlane.chemtrailTank)

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
    class Chemtrails {
        constructor(color) {
            this.color = color;
            this.positions = []
            this.descendSpeed = .1
            this.lastPos;
            this.completeLines = []
        }
        descend(delta){
            for (let i = 0; i < this.positions.length; i++) {
                this.positions[i].y += this.descendSpeed * delta
            }
            for (let line of this.completeLines) {
                line.position.y += this.descendSpeed * delta
            }
        }

        completeLine(){
            if (this.positions.length == 0)
                return;
            this.completeLines.push(this.line)
            this.line = null;
            this.positions = []
        }
        addPos(pos){
            if (!this.lastPos || lineDistance( this.lastPos, pos ) > 5) {
                this.positions.push(pos)
                this.lastPos = pos
            }
        }
        draw(stage){
            if(this.positions.length < 2) return

            if (this.line) stage.removeChild(this.line)

            this.line = new PIXI.Graphics();
            let line =this.line

            line.lineStyle(5, 0x888888, 1);
            // draw a triangle using lines
            line.moveTo(this.positions[0].x,this.positions[0].y);
            for (let i = 1; i < this.positions.length; i++) {
                line.lineTo(this.positions[i].x,this.positions[i].y);
            }
            // end the fill
            line.endFill();

            // add it the stage so we see it on our screens..
            stage.addChild(line);
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
            this.chemtrailTank -= (1 * delta);
            // this.chemtrailTank = 
            if (this.chemtrailTank < 0) {
                return;
            }
            this.chemtrails.addPos(this.position)
        }
    }

    class Person {
        constructor(name, color) {
            this.name = name;
            this.color = color;
        }
    }
