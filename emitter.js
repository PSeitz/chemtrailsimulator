function getEmitter(container){

    // Create a new emitter
    var emitter = new PIXI.particles.Emitter(

        // The PIXI.Container to put the emitter in
        // if using blend modes, it's important to put this
        // on top of a bitmap, and not use the root stage Container
        container,
        // The collection of particle images to use
        [PIXI.Texture.fromImage('img/smokeparticle.png')],

        // Emitter configuration, edit this to change the look
        // of the emitter
        {
         "alpha": {
          "start": 0.1,
          "end": 0.1
         },
         "scale": {
          "start": 0.3,
          "end": .3,
          "minimumScaleMultiplier": 1
         },
         "color": {
          "start": "#a1ada5",
          "end": "#49802f"
         },
         "speed": {
          "start": 0.05,
          "end": 1.05
         },
         "acceleration": {
          "x": 0,
          "y": 30
         },
         "maxVelocityY" : 10,
         "startRotation": {
          "min": 190,
          "max": 350
         },
         "noRotation": false,
         "rotationSpeed": {
          "min": 20 ,
          "max": 100
         },
         "lifetime": {
          "min": 0.7,
          "max": 1.5
         },
         "blendMode": "overlay",
         "frequency": 0.01,
         "emitterLifetime": -1,
         "maxParticles": 5000,
         "pos": {
          "x": 0,
          "y": 0
         },
         "addAtBack": true,
         "spawnType": "circle",
         "spawnCircle": {
          "x": 0,
          "y": 0,
          "r": 0
         }
        }
    );
    return emitter;
}
