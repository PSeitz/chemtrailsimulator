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


function init() {

    let width = 800;
    let height = 600;
    let canvas = document.getElementById("stage");

    canvas.width=width;
    canvas.height=height;

    let loader = PIXI.loader
    loader
		.add("cloud1", "img/cloud1_nice.png")
		.add("cloud2", "img/cloud3_nice.png")
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
                person.position = {
                    x: _.random(0, width), y:height
                }
                persons.push(person);
            }


            thePlane.position = { x: 0, y:height/3 }
            let planerDrawer = new PIXI.Graphics();
            planerDrawer.beginFill(thePlane.color);
            planerDrawer.drawRect(0,0, 35, 10);
            planerDrawer.endFill();

            let texture = planerDrawer.generateTexture();
            thePlane.sprite = new PIXI.Sprite(texture)
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

            addSprites(persons);
            function addSprites(persons) {

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
                    person.text.y = - 20 -  _.random(0, 80);

                }

            }

            //Get shader code as a string
            var shaderCode = document.getElementById("shader").innerHTML
            var uniforms = {}
            uniforms.time = {
              type:"1f",
              value:0.1
            }

            //Create our Pixi filter using our custom shader code
            // var simpleShader = new PIXI.AbstractFilter('',shaderCode);
            //Apply it to our object
            // thePlane.sprite.filters = [simpleShader]

            // var shad = getCloudShader(200,200)
            // var cloudshader = new PIXI.Filter(shad.fragmentSrc2);
            //
            // var bg = PIXI.Sprite.fromImage("test_BG.jpg");
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

            let leftPressed = false, rightPressed = false;

            right.press = () => {rightPressed = true;}
            left.press = () => {leftPressed = true;}

            right.release = () => {rightPressed = false;}
            left.release = () => {leftPressed = false;}

            let clouds = []

            space.press = () => {
                let cloudSprite = new PIXI.Sprite(loader.resources.cloud3 .texture)
                cloudSprite.scale = new PIXI.Point(0.1, 0.1)
                cloudSprite.anchor.x = 0.5
                stage.addChild(cloudSprite);
                setXYFrom(cloudSprite, thePlane.sprite)
                clouds.push(cloudSprite)
            }


            // start animating
            animate();
            function animate(time) {
                requestAnimationFrame(animate);

                thePlane.sprite.rotation =  degreesToRadians(thePlane.angle)
                if (leftPressed) {
                    thePlane.angle -= 0.5;
                }
                if (rightPressed) {
                    thePlane.angle += 0.5;
                }
                thePlane.move();
                for (cloud of clouds) {
                    cloud.y +=.1
                }

                renderer.render(stage)
            }

            renderer.render(stage)

        }

}

    class Plane {
        constructor(color, initialPosition) {
            this.color = color;
            this.chemtrailTank = 1000;
            this.speed = 1;
            this.angle = 180;
            this.position = initialPosition;
        }
        move(){
            this.position = moveTowardsAngle(this.position, degreesToRadians(this.angle), this.speed);
            setXYFrom(this.sprite.position, this.position)
        }
    }

    class Person {
        constructor(name, color) {
            this.name = name;
            this.color = color;
        }
    }
