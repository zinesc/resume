class Game
{
	constructor()
	{
		Game.one = this;
		
		this.w = 658;
		this.h = 485;
		
		var pixi = new PIXI.Application({width: this.w, height: this.h, backgroundColor: 0x182332,
			antialias: true, autoDensity: true, resolution: 2});
			
		document.body.appendChild(pixi.view);

		PIXI.Loader.shared
			.add("img/atlas.json")
			.add("img/dx.json").load(() => this.doInit());
		
		window.app = this;
		window.pixi = pixi;
	}
	
	doInit()
	{
		new KStarfield();
		new KGround();
		new KFlyingObjects();
		new KCurve();
		new KNetworkStatus();
		new KGlow();
		new KRocket();
		new KMulCounter();
		new KParachute();
		new KExplosion();
		new KCountDown();
		this.doClear();
		
		if (this.onInit)
			this.onInit();
			
		window.dispatchEvent(new Event("rocketready", {bubbles: true}));	
	}
	
	doClear()
	{
		KFireTail.one.doPause();
		KRocket.one.visible = 0;
		KGlow.one.alpha = 0;
	}
	
	doMoveToStart(countdown)
	{
		KFireTail.one.doPlay();
		KRocket.one.doMoveToStart();
		KGround.one.doMoveToStart();
		KCurve.one.doMoveToStart();
		KStarfield.one.doMoveToStart();
		KFlyingObjects.one.doPause();
		KMulCounter.one.doClear();
		KGlow.one.alpha = 0;
		KCountDown.one.doPlay(countdown);
	}
	
	doPlay()
	{
		KRocket.one.doPlay();
		KCurve.one.doPlay();
		KGround.one.doPlay();
		KStarfield.one.doPlay();
		KFlyingObjects.one.doPlay();
		KGlow.one.doPlay();
	}
	
	doExplode()
	{
		KFireTail.one.doPause();
		KFlyingObjects.one.doPause();
		KRocket.one.visible = 0;
		KGlow.one.alpha = 0;
		KCurve.one.visible = 0;
		KExplosion.one.doPlay();
		KMulCounter.one.doSetRed();
		timeout(400, () => KParachute.one.doPlay());
	}
	
}


// utils
clog = console.log;

function rnd(min, max) { return min + Math.random() * (max - min) }

function timeout(delay, resolve) { return setTimeout(resolve, delay) }

// pixi
PIXI.Sprite.prototype.fitw = function(width)
{
	var sprite = this;
	var doScale = function() {
		if (sprite.texture.width <= 1) return;
		var scale = width / sprite.texture.width;
		sprite.scale.set(scale, scale);
	};
	doScale();
	sprite.texture.baseTexture.once("loaded", doScale);
}

function atlasTexture(atlas, name)
{
	var rect = atlas.spritesheet.data.frames[name];
	return new PIXI.Texture(atlas.spritesheet.baseTexture, new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h));
}

function atlasAnimation(atlas, name)
{
	var textures = [];
	for (var v of atlas.spritesheet.data.animations[name]) {
		var rect = atlas.spritesheet.data.frames[v];
		textures.push(new PIXI.Texture(atlas.spritesheet.baseTexture, new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h)));
	}
	return textures;
}

