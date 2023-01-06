class KNickname extends PIXI.Container
{
	constructor(name)
	{
		super();
		pixi.stage.addChild(this);
		
		var label = new PIXI.Text(name, {fontFamily: "Segoe UI, Consolas", fontWeight:400, fontSize: 14, fill: 0xffffff, align: "center"});
		label.anchor.set(0.5, 0.5);
		label.alpha = 0.8;
		
		var back = new PIXI.Container();
		var graphics = back.addChild(new PIXI.Graphics());
		graphics.beginFill(0xFFFFFF);
		graphics.drawRoundedRect(0, 0, label.width * 1.2, label.height * 1.3, 6);
		graphics.endFill();
		graphics.x = - label.width * 1.2 / 2;
		graphics.y = - label.height * 1.3 / 2;
		graphics.alpha = 1;
		graphics.tint = 0x587998;
		
		this.addChild(back);
		this.addChild(label);
		
		var pos = KRocket.one.m_tail.getGlobalPosition();
		this.x = pos.x;
		this.y = pos.y;
		
		gsap.to(back, {alpha: 0, duration:3, ease: "power0.InOut"});
		
		this.doUpdate = this.doUpdate.bind(this);
		PIXI.Ticker.shared.add(this.doUpdate);
		
		setTimeout(() => {
			pixi.stage.removeChild(this);
			PIXI.Ticker.shared.remove(this.doUpdate);
		}, 4000);
	}
	
	doUpdate(time)
	{
		this.y += time * 2;
	}
		
	static doDrop(name)
	{
		if (!KRocket.one) return;
		new KNickname(name);
	}
}


function nicknameDropExample()
{
	KNickname.doDrop("User" + Math.round(rnd(0, 100)));
	setTimeout(nicknameDropExample, rnd(1, 3000));
}

//window.addEventListener("load", () => { nicknameDropExample() });
