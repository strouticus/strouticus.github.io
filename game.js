var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

	// game.load.image('atari', 'assets/sprites/cokecan.png');
	// game.load.image('ball', 'assets/sprites/red_ball.png');
	// game.load.image('sky', 'assets/skies/cavern2.png');

}

var sprite1;
var sprite2;
var cursors;

var sprite1Locked = true;
var sprite2Locked = false;

var p1Key;
var p2Key;
var p1Heavy;
var p2Heavy;
var resetKey;

var p1FirstPressed = false;
var p2FirstPressed = false;

var p1VoiceMinFreq = 800;
var p1VoiceMaxFreq = 1600;

var voiceFreqMaxVel = 1000;

var voiceMaxGain = 0.02;
var voiceMaxVel = 800;

var voice1StartFreq

// Web Audio API Setup

// create web audio api context
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

// create Oscillator and gain node
var p1Oscillator = audioCtx.createOscillator();
var p1GainNode = audioCtx.createGain();

p1Oscillator.type = "square";

// connect oscillator to gain node to speakers

p1Oscillator.connect(p1GainNode);
p1GainNode.connect(audioCtx.destination);

function create() {

	// game.add.image(0, 0, 'sky');

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

	game.physics.p2.applyDamping = false;

	//  Add 2 sprites which we'll join with a spring
	sprite1 = game.add.sprite(250, 100);
	sprite2 = game.add.sprite(400, 100);

	game.physics.p2.enable([sprite1, sprite2]);
	game.physics.p2.gravity.y = 1000;

	sprite1.body.clearShapes();
	sprite2.body.clearShapes();

	sprite1.body.addCircle(20);
	sprite2.body.addCircle(20);

	sprite1.body.kinematic = true;
	sprite2.body.kinematic = true;

	sprite1.body.debug = true;
	sprite2.body.debug = true;

	sprite1.body.fixedRotation = true;
	sprite2.body.fixedRotation = true;

	var constraint = game.physics.p2.createDistanceConstraint(sprite1, sprite2, 150);

	// text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

	p1Key = game.input.keyboard.addKey(Phaser.Keyboard.A);
	p2Key = game.input.keyboard.addKey(Phaser.Keyboard.L);
	p1Heavy = game.input.keyboard.addKey(Phaser.Keyboard.S);
	p2Heavy = game.input.keyboard.addKey(Phaser.Keyboard.COLON);
	resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

	p1Key.onDown.add(function(){
		p1FirstPressed = true;
	});
	p2Key.onDown.add(function(){
		p2FirstPressed = true;
	});
	resetKey.onDown.add(function(){
		reset();
	});

	p1Oscillator.detune.value = 100; // value in cents
	p1Oscillator.start(0);

	p1GainNode.gain.value = 0.0001;

	game.onPause.add(onGamePause, this);
	game.onResume.add(onGameResume, this);
}

function update() {

	if (sprite1.body.kinematic) {
		sprite1.body.setZeroVelocity();
	}
	if (sprite2.body.kinematic) {
		sprite2.body.setZeroVelocity();
	}

	if (p1Key.isDown) {
		sprite1.body.kinematic = true;
	} else if (p1FirstPressed) {
		sprite1.body.dynamic = true;
	}
	if (p2Key.isDown) {
		sprite2.body.kinematic = true;
	} else if (p2FirstPressed) {
		sprite2.body.dynamic = true;
	}
	if (p1Heavy.isDown) {
		sprite1.body.mass = 5000;
	} else {
		sprite1.body.mass = 1;
	}
	if (p2Heavy.isDown) {
		sprite2.body.mass = 5000;
	} else {
		sprite2.body.mass = 1;
	}

	updateVoice(sprite1, p1GainNode, p1Oscillator);

	game.debug.text( sprite1.body.velocity.x, 20, 20 );

	

}

function onGamePause () {
	p1GainNode.disconnect(audioCtx.destination);
}

function onGameResume () {
	p1GainNode.connect(audioCtx.destination);
}

function updateVoice (sprite, gainNode, oscillatorNode) {
	var combinedVel = Math.sqrt(Math.pow(sprite.body.velocity.x, 2) + Math.pow(sprite.body.velocity.y, 2));
	var gainPct = Math.min((combinedVel / voiceMaxVel), 1);
	var freqPct = Math.min((combinedVel / voiceFreqMaxVel), 1);
	var newVol = voiceMaxGain * gainPct;
	var newFreq = p1VoiceMinFreq + ((p1VoiceMaxFreq - p1VoiceMinFreq) * freqPct);

	oscillatorNode.frequency.value = newFreq;
	gainNode.gain.value = newVol;

	game.debug.text( combinedVel, 20, 40 );
}

function reset () {
	console.log("resetting");
	sprite1.body.kinematic = true;
	sprite2.body.kinematic = true;
	sprite1.body.x = 250;
	sprite1.body.y = 100;
	sprite2.body.x = 400;
	sprite2.body.y = 100;
	p1FirstPressed = false;
	p2FirstPressed = false;
}