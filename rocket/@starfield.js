class KStarfield extends PIXI.Container
{
	constructor()
	{
		super();
		KStarfield.one = this;
		
		var graphic1 = new PIXI.Graphics();
		graphic1.beginFill(0xffffff);
		graphic1.lineStyle(0);
		graphic1.drawCircle(0, 0, 10);
		graphic1.endFill();		
		var texture1 = pixi.renderer.generateTexture(graphic1);
		
		var starfield = makeParticles({
			textures: [texture1],
			scale: [0.1, 0.28],
			direction: [90, 90],
			lifetime: [500, 500],
			interval: [10, 14],
			velocity: [2, 4],
			tint: [0xFFFFFF, 0xFFFFe1, 0xFFe1FF, 0xe1e1FF, 0xe1ffe1],
			onSpawn: (sprite) => {
				sprite.x = rnd(0, app.w);
				sprite.y = rnd(0, 10);
			}
		});
		
		pixi.stage.addChild(starfield);
		this.m_starfield = starfield;
	}
	
	doMoveToStart()
	{
		this.m_starfield.doPause();
		this.m_starfield.doClear();
	}
	
	doPlay()
	{
		this.m_starfield.doPlay();
	}
}


