class KCountDown extends PIXI.Container
{
	constructor()
	{
		super();
		KCountDown.one = this;
		pixi.stage.addChild(this);
		
		this.m_label = new PIXI.Text("1.00x", {fontFamily: "Segoe UI, Consolas", fontWeight:700, fontSize: 20, fill: 0xffffff, align: "center"});
		this.m_label.anchor.set(0.5, 0.5);
		this.addChild(this.m_label);
		
		
		var graphics1 = this.addChild(new PIXI.Graphics());
		graphics1.lineStyle({width: 4, color: 0xffffff, alpha: 0.15});
		graphics1.moveTo(-80, 0);
		graphics1.lineTo(80, 0);
		graphics1.y = -20;
		
		var graphics2 = this.addChild(new PIXI.Graphics());
		graphics2.lineStyle({width: 4, color: 0x2DDC4B, alpha: 1.0});
		graphics2.moveTo(-80, 0);
		graphics2.lineTo(80, 0);
		graphics2.y = -20;
		
		this.x = app.w / 2;
		this.y = app.h / 2 + 70;
		
		this.m_greenline = graphics2;
		this.doClear();
	}
	
	doClear()
	{
		this.visible = 0;
		gsap.killTweensOf(this);
		gsap.killTweensOf(this.m_greenline);
	}
	
	doPlay(value)
	{
		this.doClear();
		
		this.visible = 1;
		this.m_value = value;
		this.m_greenline.scale.x = 1;
		
		gsap.to(this, {m_value: 0, duration: value, ease: Linear.easeNone, onUpdate: () => {
			this.m_label.text = parseFloat(this.m_value).toFixed(2);
		}});
		
		gsap.to(this.m_greenline.scale, {x: 0, duration: value, ease: Linear.easeNone});
		
		timeout(value * 1000, () => {
			this.doClear();
		})
	}
}

