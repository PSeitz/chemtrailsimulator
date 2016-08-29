function setXY(target, value, y) {
    target.x = value
    if (y) {
        target.y = y
    }else {
        target.y = value
    }
}
function setXYFrom(target, from) {
    target.x = from.x
    target.y = from.y
}

function setWidthHeight(target, value, height) {
    target.width = value
    if (height) {
        target.height = height
    }else {
        target.height = value
    }
}

function getXYRatio(startPos, endPos){
    let deltaX = (endPos.x - startPos.x)
    let deltaY = (endPos.y - startPos.y)

    let xRatio = Math.abs(deltaX) / (Math.abs(deltaX) + Math.abs(deltaY)) * Math.sign(deltaX)
    let yRatio = Math.abs(deltaY) / (Math.abs(deltaX) + Math.abs(deltaY)) * Math.sign(deltaY)
    return {
        xRatio:xRatio,
        yRatio:yRatio
    }
}

function moveTowards(startPos, endPos, movementAmount){
    // let deltaX = (endPos.x - startPos.x)
    // let deltaY = (endPos.y - startPos.y)
    //
    // let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    // let distanceRatio = movementAmount / distance;
    // startPos.x += deltaX * distanceRatio;
    // startPos.y += deltaY * distanceRatio;

    let radians = getDegree(startPos, endPos);
    // startPos.x = startPos.x - movementAmount * Math.cos(radians);
    // startPos.y = startPos.y - movementAmount * Math.sin(radians);
    return {
        x : startPos.x - movementAmount * Math.cos(radians),
        y : startPos.y - movementAmount * Math.sin(radians)
    }

}

function moveTowardsAngle(startPos, radians, movementAmount){
    return {
        x : startPos.x - movementAmount * Math.cos(radians),
        y : startPos.y - movementAmount * Math.sin(radians)
    }
}


function turnUntilNoCollision(startPos, cellBodies, shouldTurnRight, adjustedDegree, lookahead){

    let projectedCollisionPoint = moveTowardsAngle(startPos, degreesToRadians(adjustedDegree), lookahead);
    let stepSize = 3, steps = 0;
    let maxSteps = 360 / stepSize;
    let turnFun = shouldTurnRight ? turnRight : turnLeft;

    while (Matter.Query.ray(cellBodies, startPos, projectedCollisionPoint, 3).length > 0 ) {
        steps ++;
        adjustedDegree = turnFun(adjustedDegree, stepSize);

        projectedCollisionPoint = moveTowardsAngle(startPos, degreesToRadians(adjustedDegree), lookahead);
        if (steps > maxSteps)
            return false;
    }

    adjustedDegree = turnFun(adjustedDegree, stepSize);
    return {
        degree: adjustedDegree,
        steps: steps
    };
}


function getDegree(startPos, endPos){
    let x = startPos.x - endPos.x;
    let y = startPos.y - endPos.y;
    let radians = Math.atan2(y,x);
    return radians
}

// 0 180   -180 -0
function turnRight(degree, amount){
    degree += amount;
    if (degree > 180) {
        degree = -180 + degree % 180;
    }
    return degree;
}

// 0 180   -180 -0
function turnLeft(degree, amount){
    degree -= amount;
    if (degree < -180) {
        degree = 180 + degree % 180;
    }
    return degree;
}

function radiansToDegrees(radians){
    return radians * (180/Math.PI)
}

function degreesToRadians(degrees){
    return degrees / 180 * Math.PI
    // return degrees * Math.PI/180
}
