function getEmitter(container){

    // Create a new emitter
    var emitter = new PIXI.particles.Emitter(

        // The PIXI.Container to put the emitter in
        // if using blend modes, it's important to put this
        // on top of a bitmap, and not use the root stage Container
        container,
        // The collection of particle images to use
        [PIXI.Texture.fromImage('img/particle.png')],

        // Emitter configuration, edit this to change the look
        // of the emitter
        {
        	"alpha": {
        		"start": 0.74,
        		"end": 0
        	},
        	"scale": {
        		"start": 0.5,
        		"end": 0.12,
        		"minimumScaleMultiplier": 0.1
        	},
        	"color": {
        		"start": "#22bd17",
        		"end": "#100f0c"
        	},
        	"speed": {
        		"start": 70,
        		"end": 0
        	},
        	"acceleration": {
        		"x": 0,
        		"y": 0
        	},
        	"startRotation": {
        		"min": 0,
        		"max": 360
        	},
        	"noRotation": false,
        	"rotationSpeed": {
        		"min": 0,
        		"max": 200
        	},
        	"lifetime": {
        		"min": 0.5,
        		"max": 1
        	},
        	"blendMode": "normal",
        	"ease": [
        		{
        			"s": 0,
        			"cp": 0.329,
        			"e": 0.548
        		},
        		{
        			"s": 0.548,
        			"cp": 0.767,
        			"e": 0.876
        		},
        		{
        			"s": 0.876,
        			"cp": 0.985,
        			"e": 1
        		}
        	],
        	"frequency": 0.001,
        	"emitterLifetime": 0.1,
        	"maxParticles": 1000,
        	"pos": {
        		"x": 0,
        		"y": 0
        	},
        	"addAtBack": true,
        	"spawnType": "point"
        }
    );
    return emitter;
}
