class KCurve extends PIXI.Container
{
	constructor()
	{
		super();
		KCurve.one = this;
		pixi.stage.addChild(this);
		
		var graphics = this.addChild(new PIXI.Graphics());
		var alphaGradient = pixiGradient('rgba(255,255,255,0.0)', 'rgba(255,255,255,1)');
		
		/*
		graphics.lineStyle({width: 22, texture: alphaGradient, color: 0xffffff, alpha: 0.25});
		graphics.moveTo(left + 80, bottom + 30);
		graphics.bezierCurveTo(right + 50, bottom, right, top, right, top);
		
		graphics.lineTextureStyle({width: 8, texture: alphaGradient, color: 0x3ECC7F, alpha: 0.85});
		graphics.moveTo(left + 80, bottom + 30);
		graphics.bezierCurveTo(right + 50, bottom, right, top, right, top);
		*/
		
		var mask = new PIXI.Graphics();
		mask.beginTextureFill({texture: alphaGradient});
		mask.drawRect(0, 0, app.w, app.h);
		mask.endFill();
		
		//this.addChild(mask);
		this.m_graphics = graphics;
		
		PIXI.Ticker.shared.add((time) => {
		
			if (this.m_play) {
				
				var pos = KRocket.one.m_sprite.getGlobalPosition();
				pos.x += 3;
				
				var bot = app.h;
				var left = 0;
				var x1 = pos.x + 110;
				var y1 = bot;
				var x2 = pos.x;
				var y2 = pos.y;
				
				graphics.clear();
				graphics.lineStyle({width: 22, texture: alphaGradient, color: 0xffffff, alpha: 0.5});
				graphics.moveTo(left, bot);
				graphics.bezierCurveTo(x1, y1, x2, y2, pos.x, pos.y);
				
				graphics.lineStyle({width: 8, texture: alphaGradient, color: 0x3ECC7F, alpha: 1});
				graphics.moveTo(left, bot);
				graphics.bezierCurveTo(x1, y1, x2, y2, pos.x, pos.y);
			}
		});
	}
	
	doSetOnline(online)
	{
		this.m_line.tint = online ? 0x3ECC7F : 0xED1D49;
	}

	doMoveToStart()
	{
		this.visible = 1; //! 0
		this.m_play = 1; //! 0
		this.m_graphics.alpha = 0;
	}
	
	doPlay()
	{
		this.visible = 1;
		this.m_play = 1;
		gsap.to(this.m_graphics, {alpha: 1, duration: 0.25});
	}
}

KCurve.top = 125;
KCurve.bottom = 455;
KCurve.left = 50;
KCurve.right = 595;
KCurve.radius = KCurve.bottom - KCurve.top;

function pixiGradient(from, to)
{
	var w = 640;
	var h = app.h;
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const ctx = c.getContext("2d");
	const grd = ctx.createLinearGradient(0, h, 40, 0);
	grd.addColorStop(0, from);
	grd.addColorStop(0.03, from);
	grd.addColorStop(0.5, to);
	grd.addColorStop(1, to);
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, w, h);
	return new PIXI.Texture.from(c);
}