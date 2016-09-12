function addPersonUI(person, stage) {

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

function addPlaneUI(thePlane){
    let planerDrawer = new PIXI.Graphics();
    planerDrawer.beginFill(thePlane.color);
    planerDrawer.drawRect(0,0, 35, 15);
    planerDrawer.endFill();

    let texture = planerDrawer.generateTexture();
    thePlane.sprite = new PIXI.Sprite(texture)
    setXY(thePlane.sprite.anchor, 0.5);
    thePlane.sprite.anchor.x=0.3
    setXYFrom(thePlane.sprite, thePlane.position)
}

function drawPerson(graphics, color, position){
    graphics.beginFill(color);
    graphics.drawRect(0,0, 7, 30);
    graphics.endFill();
}
