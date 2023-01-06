class KExplosion extends PIXI.Container
{
	constructor()
	{
		super();
		KExplosion.one = this;
		pixi.stage.addChild(this);

		//
		var atlas = PIXI.Loader.shared.resources["img/dx.json"];

    	//
		var sprite = this.addChild(new PIXI.AnimatedSprite(atlasAnimation(atlas, "explode")));
		sprite.anchor.set(0.5, 0.5);
		sprite.scale.set(0.5, 0.5);
		sprite.loop = 0;
		sprite.visible = 0;
		sprite.animationSpeed = 0.3;
		
		this.m_sprite = sprite;
	}
	
	doPlay()
	{
		this.position = KRocket.one.m_sprite.getGlobalPosition();
		this.m_sprite.visible = 1;
		this.m_sprite.gotoAndPlay(0);
		
		this.m_sprite.onComplete = () => {
			this.m_sprite.visible = 0;
		};
	}
}

class KParachute extends PIXI.Container
{
	constructor()
	{
		super();
		KParachute.one = this;
		pixi.stage.addChild(this);
		
		this.m_sprite = this.addChild(PIXI.Sprite.from("img/racoonp.png"));
		this.m_sprite.anchor.set(0.5, 0.5);
		this.m_sprite.fitw(95);
		
		this.visible = 0;
	}
	
	doPlay()
	{
		gsap.killTweensOf(this);
		
		this.alpha = 0;
		this.angle = -45;
		this.visible = 1;
		this.position = KRocket.one.m_sprite.getGlobalPosition();
		
		gsap.to(this, {alpha: 1, duration: 0.1, ease: Linear.easeNone});
		
		gsap.to(this, {y: 550, duration: 2, ease: Linear.easeNone, onComplete: () => {
			this.visible = 0;
		}});
		
		gsap.to(this, {angle: 45, duration: 1, ease: Sine.easeInOut, onComplete: () => {
			gsap.to(this, {angle: -45, duration: 1, ease: Sine.easeInOut, onComplete: () => {
			}});
		}});
	}
}

