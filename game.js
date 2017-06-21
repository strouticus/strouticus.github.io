var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('atari', 'assets/sprites/cokecan.png');
	game.load.image('ball', 'assets/sprites/red_ball.png');
	game.load.image('sky', 'assets/skies/cavern2.png');

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

function create() {

	// game.add.image(0, 0, 'sky');

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

	game.physics.p2.applyDamping = false;

	//  Add 2 sprites which we'll join with a spring
	sprite1 = game.add.sprite(300, 100, 'ball');
	sprite2 = game.add.sprite(400, 100, 'atari');

	game.physics.p2.enable([sprite1, sprite2]);
	game.physics.p2.gravity.y = 1000;

	sprite1.body.kinematic = true;
	sprite2.body.kinematic = true;

	sprite1.body.fixedRotation = true;
	sprite2.body.fixedRotation = true;

	var constraint = game.physics.p2.createDistanceConstraint(sprite1, sprite2, 150);

	// text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

	p1Key = game.input.keyboard.addKey(Phaser.Keyboard.A);
	p2Key = game.input.keyboard.addKey(Phaser.Keyboard.L);
	p1Heavy = game.input.keyboard.addKey(Phaser.Keyboard.S);
	p2Heavy = game.input.keyboard.addKey(Phaser.Keyboard.COLON);

}

function update() {

	if (sprite1.body.kinematic) {
		sprite1.body.setZeroVelocity();
	}
	if (sprite2.body.kinematic) {
		sprite2.body.setZeroVelocity();
	}

	if (p1Key.isDown) {
		// sprite2.body.dynamic = true;
		sprite1.body.kinematic = true;
	} else {
		sprite1.body.dynamic = true;
	}
	if (p2Key.isDown) {
		sprite2.body.kinematic = true;
		// sprite1.body.dynamic = true;
	} else {
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

	

}