class KGlow extends PIXI.Container
{
	constructor()
	{
		super();
		KGlow.one = this;
		pixi.stage.addChild(this);
		
		var sprite = this.addChild(PIXI.Sprite.from("img/glow.png"));
		sprite.anchor.set(0.5, 0.5);
		sprite.alpha = 0.3;
		sprite.fitw(200);
		this.m_sprite = sprite;
		this.doSetOnline(true);
		
		PIXI.Ticker.shared.add(() => {
			if (KRocket.one)
				this.position = KRocket.one.m_sprite.getGlobalPosition();
		});
	}

	doPlay()
	{
		gsap.to(this, {alpha: 1, duration: 5});
	}
	
	doSetOnline(online)
	{
		this.m_sprite.tint = online ? 0x3ECC7F : 0xED1D49;
	}
}
