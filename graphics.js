
function addCellLight(cell, propname, image, container){
    cell[propname] = PIXI.Sprite.fromImage(image);
    cell[propname].anchor.set(0.5);
    setXY(cell[propname].scale, 0.5)
    container.addChildAt(cell[propname], 0);

    setXY(cell[propname], cell.body.position.x, cell.body.position.y)

    let startValue = cell.maxValue * 2.6
    let endValue = cell.maxValue * 2.9
    setWidthHeight(cell[propname], startValue);

    let animationBlock  = { width : cell[propname].width , height : cell[propname].height};
    cell.tween1 = new TWEEN.Tween(animationBlock)
        .to({ width: endValue, height: endValue }, 600)
        .onUpdate(function() {
            cell[propname].width = this.width;
            cell[propname].height = this.height;
        })
        .yoyo(true)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .repeat(Infinity)
        .start();

}

function selectCells(cells){

    for (let cell of cells) {
        let bloomFilter = new filter.BloomFilter();
        let dropShadowFilter = new filter.DropShadowFilter();
        dropShadowFilter.blurX = 1;
        dropShadowFilter.blurY = 1;
        cell.shock = new filter.ShockwaveFilter();

        // cell.shock.center = {x: cell.body.position.x/ width , y: cell.body.position.y/height};
        cell.shock.center = {x: 0.1 , y: 0.1};
        cell.shock.params = {x: 0.03, y: 0.03, z: 0.01}
        // Filter
        cell.container.filters = [cell.shock, bloomFilter];
        // addCellLight(cell, "light1", 'LightRotate1.png', cell.container);
        addCellLight(cell, "light2", 'LightRotate2.png', cell.container);
    }

}

function deselectCells(cells){
    for (let cell of cells) {
        removeCellLight(cell, "light2", cell.container);
        cell.container.filters = null;
    }
}

function removeCellLight(cell, propname, container){
    container.removeChild(cell[propname]);
}


function drawPerson(graphics, color, position){
    graphics.beginFill(color);
    graphics.drawRect(0,0, 7, 30);
    graphics.endFill();
}
