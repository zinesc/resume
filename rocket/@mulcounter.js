class KMulCounter extends PIXI.Container
{
	constructor()
	{
		super();
		KMulCounter.one = this;
		pixi.stage.addChild(this);
		
		this.m_label = new PIXI.Text("1.00x", {fontFamily: "Segoe UI, Consolas", fontWeight:700, fontSize: 64, fill: 0xffffff, align: "center"});
		this.m_label.anchor.set(0.5, 0.5);
		this.addChild(this.m_label);
		
		this.x = app.w / 2;
		this.y = app.h / 2;
		this.m_val = 0;
	}
	
	doAnimateValue(value, duration = 5)
	{
		gsap.to(this, {m_val: value, duration: duration, ease: "power1.In", onUpdate: () => {
			this.doSetValue(this.m_val);
		}});
	}
	
	doSetValue(value)
	{
		this.m_val = value;
		this.m_label.text = parseFloat(this.m_val).toFixed(2) + "x";
	}
	
	doClear()
	{
		this.m_label.tint = 0xFFFFFF;
	}
	
	doSetRed()
	{
		this.m_label.tint = 0xED1D49;
	}
}

