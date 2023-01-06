class KGround extends PIXI.Container
{
	constructor()
	{
		super();
		KGround.one = this;
		pixi.stage.addChild(this);
				
		var ground = this.addChild(PIXI.Sprite.from("img/ground.png"));
		ground.anchor.set(0.5, 1);
		ground.x = pixi.screen.width / 2;
		ground.y = pixi.screen.height;
		ground.fitw(pixi.screen.width);
	}
	
	doMoveToStart()
	{
		gsap.killTweensOf(this);
		gsap.to(this, {y: 0, duration: 1});
	}
	
	doPlay()
	{
		gsap.to(this, {y: app.h, duration: 20, ease: "power0.InOut"});
	}
}
