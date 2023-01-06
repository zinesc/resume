class KNetworkStatus extends PIXI.Container
{
	constructor()
	{
		super();
		KNetworkStatus.one = this;
		pixi.stage.addChild(this);
		
		this.m_label = new PIXI.Text("Network Status", {fontFamily: "Segoe UI, Consolas", fontWeight:300, fontSize: 14, fill: 0xffffff, align: "center", valign: "center"});
		this.m_label.anchor.set(1, 0.60);
		this.m_label.x = -35;
		this.m_label.y = -20;
		this.m_label.alpha = 0.4;
		this.addChild(this.m_label);
		
		this.m_indicator = new PIXI.Graphics();
		this.m_indicator.beginFill(0xFFFFFF);
		this.m_indicator.drawCircle(0, 0, 4);
		this.m_indicator.endFill();
		this.m_indicator.tint = 0x2DDC4B;
		this.m_indicator.x = -20;
		this.m_indicator.y = -20;
		
		this.addChild(this.m_indicator);
		
		this.x = app.w;
		this.y = app.h;
	}
	
	doSetOnline(online)
	{
		this.m_indicator.tint = online ? 0x2DDC4B : 0xED1D49;
	}
}

// setTimeout(() => { KNetworkStatus.one.doSetOnline(false) }, 1000);

// setTimeout(() => { KNetworkStatus.one.doSetOnline(true) }, 3000);
