
// Create the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "grass.jpg";

// player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
	playerReady = true;
};
playerImage.src = "paul.gif";

// Banana image
var garbageReady = false;
var garbageImage = new Image();
garbageImage.onload = function () {
	garbageReady = true;
};
garbageImage.src = "banana.gif";

//can image
var canReady = false;
var canImage = new Image();
canImage.onload = function () {
	canReady = true;
};
canImage.src = "can.gif";

//recycle image
var recycleReady = false;
var recycleImage = new Image();
recycleImage.onload = function () {
	recycleReady = true;
};
recycleImage.src = "recycle.gif";

//bottle image
var bottleReady = false;
var bottleImage = new Image();
bottleImage.onload = function () {
	bottleReady = true;
};
bottleImage.src = "bottle.gif";

//babe image
var babeReady = false;
var babeImage = new Image();
babeImage.onload = function () {
	babeReady = true;
};
babeImage.src = "babe.gif";
// Game objects
////////////////////////////////////////////////////////////////////////////////////////////////////
var player = {
	speed: 512, // movement in pixels per second
	x: canvas.width/2,
	y: canvas.height/2
};

var garbage = {
	x: 0,
	y: 0
};

var can = {
	x: 0,
	y: 0
};

var recycle = {
	x:canvas.width-60,
	y:0
};

var bottle = {
	x:0,
	y:0
};

var babe = {
	x:-100,
	y:-100,
	speed:128
};

var score=0;
var wrongRecepticle=0;
///////////////////////////////////////////////////////////////////////////////////////////////////////
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var reset = function () {
	playerHasGarbage=false;
	playerHasBottle=false;
	if(Math.random()>.5)
	{
		garbage.x=-100;
		garbage.y=-100;
		resetBottle();
	}
	else
	{
		bottle.x=-100;
		bottle.y=-100;
		resetGarbage();
	}
}

var resetGarbage = function () {
	playerHasGarbage = false;
	// Throw the garbage somewhere on the screen randomly
	garbage.x = 32 + (Math.random() * (canvas.width - 64));
	garbage.y = 32 + (Math.random() * (canvas.height - 64));
};

var resetBottle = function () {
	playerHasBottle = false;
	// Throw the bottle somewhere on the screen randomly
	bottle.x = 32 + (Math.random() * (canvas.width - 64));
	bottle.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		player.y -= player.speed * modifier;
		if (player.y<=0){player.y=1;}
	}
	if (40 in keysDown) { // Player holding down
		player.y += player.speed * modifier;
		if (player.y>=canvas.height-48){player.y=canvas.height-49;}
	}
	if (37 in keysDown) { // Player holding left
		player.x -= player.speed * modifier;
		if (player.x<=0){player.x=1;}
	}
	if (39 in keysDown) { // Player holding right
		player.x += player.speed * modifier;
		if (player.x>=canvas.width-40){player.x=canvas.width-41;}
	}
	
	/*if (score%20==0 && score>0)
	{
		player.speed+=128;
	}*/
	//move Babe
	if(babe.x>canvas.width+50)
	{
		babe.x=-10;
		babe.y=Math.round(Math.random() * (canvas.height-50))
		if (babe.y<50)
		{
			babe.y+=50;
		}
	}
	babe.x+=babe.speed * modifier;
	if (playerHasGarbage)
	{
		garbage.x = player.x;
		garbage.y = player.y;
	}
	else if (playerHasBottle)
	{
		bottle.x = player.x;
		bottle.y = player.y;
	}
	else
	{
		// are you touching garbage?
		if (
			player.x <= (garbage.x + 32)
			&& garbage.x <= (player.x + 32)
			&& player.y <= (garbage.y + 32)
			&& garbage.y <= (player.y + 32)
			&& playerHasBottle==false
		) {
			//player has picked up a piece of garbage
			playerHasGarbage = true;
		}
		// are you touching bottle?
		if (
			player.x <= (bottle.x + 32)
			&& bottle.x <= (player.x + 32)
			&& player.y <= (bottle.y + 32)
			&& bottle.y <= (player.y + 32)
			&& playerHasGarbage == false
		) {
			//player has picked up bottle
			playerHasBottle = true;
		}
	}
		
	//can player throw something away?
	if (
		player.x <= (can.x + 32)
		&& can.x <= (player.x + 32)
		&& player.y <= (can.y + 32)
		&& can.y <= (player.y + 32)
		&& (playerHasGarbage || playerHasBottle)
	) {
		if (playerHasGarbage)
		{
			//point given
			score+=1;
			//check if we should increment babes speed
			if(score%10==0 && score>0)
			{
				babe.speed+=128;
			}
		}
		else
		{
			//point subtraction
			wrongRecepticle+=1;
		}
		reset();
	}
	//can you recycle something?
	if (
		player.x <= (recycle.x + 32)
		&& recycle.x <= (player.x + 32)
		&& player.y <= (recycle.y + 32)
		&& recycle.y <= (player.y + 32)
		&& (playerHasBottle || playerHasGarbage)
	) {
		if (playerHasBottle)
		{
			//point given
			score+=1;
			//check if we should increment babes speed
			if(score%10==0 && score>0)
			{
				babe.speed+=128;
			}
		}
		else
		{
			//point subtraction
			wrongRecepticle+=1;
		}
		reset();
	}
	
	//is paul touching babe?
	if (
		player.x <= (babe.x + 32)
		&& babe.x <= (player.x + 32)
		&& player.y <= (babe.y + 32)
		&& babe.y <= (player.y + 32)
	) {
		reset();
		player.x=canvas.width/2;
		player.y=canvas.height/2;
		keysDown={};
		alert("BABE GOT YOU!!! You need to start over now");
		wrongRecepticle=0;
		babe.speed=128;
		score=0;
	}
	
	if (wrongRecepticle>=2)
	{
		reset();
		player.x=canvas.width/2;
		player.y=canvas.height/2;
		keysDown={};
		alert("Quit putting stuff in the wrong recepticles!!!  You need to start over now");
		wrongRecepticle=0;
		babe.speed=128;
		score=0;
	}
	if (score>=75)
	{
		Winner();
	}
};


// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}

	if (garbageReady) {
		ctx.drawImage(garbageImage, garbage.x, garbage.y);
	}
	
	if (canReady) {
		ctx.drawImage(canImage,can.x,can.y);
	}
	
	if (recycleReady) {
		ctx.drawImage(recycleImage,recycle.x,recycle.y);
	}
	
	if (bottleReady) {
		ctx.drawImage(bottleImage,bottle.x,bottle.y);
	}
	
	if (babeReady) {
		ctx.drawImage(babeImage,babe.x,babe.y);
	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("score: " + score, 32, canvas.height-64);
};
// The main game loop
var main = function () {
	var start = Date.now();
	var delta = start - end;

	update(delta / 1000);
	render();

	end = start;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var end = Date.now();
reset();
main();

var Winner = function () 
{
	alert("Hooray! you did it!");
	reset();
	score=0
	babe.speed=128
	main();
}
