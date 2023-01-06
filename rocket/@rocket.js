class KRocket extends PIXI.Container
{
	constructor()
	{
		super();
		KRocket.one = this;
		this.y = KCurve.top;
		
		this.m_move = new PIXI.Container();
		this.addChild(this.m_move);
		
		this.m_radius = new PIXI.Container();
		this.m_radius.x = 0;
		this.m_radius.y = KCurve.radius;
		this.m_move.addChild(this.m_radius);
		
		this.m_sprite = this.m_radius.addChild(PIXI.Sprite.from("img/racoon.png"));
		this.m_sprite.anchor.set(0.5, 0.5);
		this.m_sprite.fitw(95);
		this.m_sprite.y = -8;
		
		this.m_tail = this.m_radius.addChild(new PIXI.Container());
		this.m_tail.x = -40;
		this.m_tail.y = -2;
		
		new KFireTail();
		pixi.stage.addChild(this);
	}
	
	doMoveToStart()
	{
		this.x = -50;
		this.visible = 1;
		this.angle = 0;
		gsap.killTweensOf(this);
		gsap.to(this, {x: 100, duration: 2, ease: Power1.InOut});
	}
	
	doPlay()
	{
		//var animation = new TimelineLite();
		gsap.killTweensOf(this);
		gsap.killTweensOf(this.m_move);
		
		CustomEase.create("rocket", "0,0,0.58,1")
		
		CustomEase.create("rocket1", "0,0,0.15,1")
		
		gsap.to(this, {x: KCurve.right - KCurve.radius, duration: 2.5,  ease: "rocket1"});
		
		gsap.to(this, {angle: -93, duration: 2.5, ease: "rocket"});
	}
}

class KFireTail extends PIXI.Container
{
	constructor()
	{
		super();
		var atlas = PIXI.Loader.shared.resources["img/atlas.json"];
		
		var firetail2 = makeParticles({
			textures: [atlasTexture(atlas, "part")],
			anchor: KRocket.one.m_tail,
			scale: [1, 1],
			velocity: [3, 3],
			scaleto: [0.0, 0.1],
			direction: [170, 190],
			lifetime: [20, 70],
			interval: [2, 5],
			rotation: [-0.08, 0.08],
		});
		
		KFireTail.one = firetail2;
		pixi.stage.addChild(firetail2);
	}
}

