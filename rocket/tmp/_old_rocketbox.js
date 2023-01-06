class utils
{
	static fit(sprite, width)
	{
		var doScale = function() {
			if (sprite.texture.width <= 1) return;
			var scale = width / sprite.texture.width;
			sprite.scale.set(scale, scale);
		};
		doScale();
		sprite.texture.baseTexture.once("loaded", doScale);
	}
}

pxapp = null;
rocketbox = null;

class RocketBox
{
	static init()
	{
		//
		this.initStarField();

		new RocketGround();

		// sputnics
		var sputnics = makeParticles({
			textures: [
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(0, 428, 350, 88)), // shuttle
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(0, 514, 171, 98)), // plate
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(347, 426, 180, 160)), // module
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(439, 629, 173, 219)), // ship
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(207, 627, 225, 216)), // station
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(0, 639, 209, 173)), // pilot
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(173, 526, 98, 95)), // sphere
				new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(696, 0, 366, 380)), // singularity
			],
			particles: 40,
			scale: [0.3, 0.4],
			direction: [0, 0],
			tint: [],
			lifetime: [1500, 1500],
			interval: [100, 550],
			rotation: [-0.02, 0.02],
			velocity: [2, 3],
			emitfn: (sprite) =>
			{
				sprite.y = randomBetween(this.h * 0.2, this.h * 0.8);
				if (randomBetween(0, 10) < 4) {
					sprite.x = -50;
					sprite.m_angle = randomBetween(-25, 25) / 180 * Math.PI;
				} else {
					sprite.x = this.w + 50;
					sprite.m_angle = randomBetween(-180 - 25, -180 + 25) / 180 * Math.PI;
				}
				
				var texturei = sprite.m_texturei;
				if (texturei == 0) // shuttle
				{
					sprite.x = -50;
					sprite.m_rot = 0;
					sprite.m_angle = randomBetween(-55, 0) / 180 * Math.PI;
					sprite.rotation = sprite.m_angle;
				}
				
				sprite.m_vx = Math.cos(sprite.m_angle) * sprite.m_vel * sprite.m_scale * 3;
				sprite.m_vy = Math.sin(sprite.m_angle) * sprite.m_vel * sprite.m_scale * 3;
			}
		});
		pixi.stage.addChild(sputnics);
		
		// racoon
		this.racoonRising = new PIXI.Container();
		this.racoonRising.angle = -90;
		this.racoonRising.x = 250;//70;
		this.racoonRising.y = 130;
		
		// racoon
		this.racoon = new PIXI.Container();
		window.gRocketRacoon = this.racoon;
		this.racoon.y = 300;
		
		this.racoon.m_tail = new PIXI.Container();
		this.racoon.m_tail.x = -40;
		this.racoon.m_tail.y = 7;
		this.racoon.addChild(this.racoon.m_tail);
		
		//
		/*
		var firetail = new PIXI.ParticleContainer(200, {alpha: true, scale: true, rotation: true, uvs: true});
		firetail.x = -40;
		firetail.y = 7;
		var emitter = new PIXI.particles.Emitter(firetail, [new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(278, 522, 25, 25))],
		{
			autoUpdate: true,
			"alpha": {"start": 1, "end": 0.9},
			"scale": {"start": 1, "end": 0.0, "minimumScaleMultiplier": 1},
			"color": {"start": "#ffffff", "end": "#ffffff" },
			"speed": {"start": 150,"end": 50, "minimumSpeedMultiplier": 1},
			"acceleration": {"x": 0, "y": 0 },
			"maxSpeed": 0,
			"startRotation": {"min": 175, "max": 185},
			"noRotation": false,
			"rotationSpeed": {"min": -80, "max": 80},
			"lifetime": {"min": 0.5, "max": 1.8},
			"blendMode": "normal",
			"frequency": 0.1,
			"emitterLifetime": -1,
			"maxParticles": 50,
			"pos": {"x": 0, "y": 0},
			"addAtBack": false,
			"spawnType": "circle",
			"spawnCircle": {"x": 0, "y": 0, "r": 0}

		});
		*/
		
		new RocketGlow();
		
		//
		this.racoon.m_sprite = PIXI.Sprite.from("img/racoon.png");
		this.racoon.m_sprite.anchor.set(0.5, 0.5);
		utils.fit(this.racoon.m_sprite, 95);
		
		//
		var textureFire = new PIXI.Texture(PIXI.Texture.from("img/atlas.png"), new PIXI.Rectangle(278, 522, 25, 25));
		var firetail2 = makeParticles({
			textures: [textureFire],
			anchor: this.racoon.m_tail,
			shape: {x: 0, y: 0, w: 0, h: 0},
			pos: {x: 0, y: 0},
			scale: [1, 1],
			velocity: [3, 3],
			scaleto: [0.0, 0.1],
			direction: [170, 190],
			lifetime: [20, 70],
			interval: [2, 5],
			rotation: [-0.08, 0.08],
		});
		pixi.stage.addChild(firetail2);

		//		
		//this.racoon.addChild(firetail);
		this.racoon.addChild(this.racoon.m_sprite);
		this.racoonRising.addChild(this.racoon);
		pixi.stage.addChild(this.racoonRising);

		pixi.stage.addChild(new RocketMultiplierCounter());
		pixi.stage.addChild(new RocketNetworkStatus());
	}
	
	static initStarField()
	{
		var graphic1 = new PIXI.Graphics();
		graphic1.beginFill(0xffffff);
		graphic1.lineStyle(0);
		graphic1.drawCircle(0, 0, 10);
		graphic1.endFill();		
		var texture1 = this.app.renderer.generateTexture(graphic1);
		
		this.starfield = makeParticles({
			textures: [texture1],
			shape: {x: 0, y: 0, w: this.w, h: 10},
			scale: [0.1, 0.28],
			direction: [90, 90],
			tint: [0xFFFFFF, 0xFFFFee, 0xFFeeFF, 0xeeeeFF, 0xeeffee],
			lifetime: [500, 500],
			interval: [5, 10],
		});
		pixi.stage.addChild(this.starfield);
	}
	
	static runRacoon()
	{
		gsap.to(this.racoonRising, {duration: 5, ease: "power0.Out", pixi: {rotation: -90}});
		gsap.to(this.racoonRising, {duration: 5, ease: "power0.Out", pixi: {x: 250}});
	}
}


//==============
class RocketGlow
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }
		
	init()
	{
		window.glob_RocketGlow = this;
		var sprite = this.addChild(PIXI.Sprite.from("img/glow.png"));
		sprite.anchor.set(0.5, 0.5);
		sprite.alpha = 0.3;
		utils.fit(sprite, 200);
		this.m_sprite = sprite;
		this.doSetOnline(true);
		pixi.stage.addChild(this);
		
		PIXI.Ticker.shared.add(() => {
			this.position = window.gRocketRacoon.getGlobalPosition();
		});
	}
	doSetOnline(online)
	{
		this.m_sprite.tint = online ? 0x3ECC7F : 0xED1D49;
	}
}

//===========================
class RocketMultiplierCounter
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }
		
	init()
	{
		window.glob_RocketMultiplierCounter = this;
		
		this.m_label = new PIXI.Text("1.00x", {fontFamily: "Segoe UI, Consolas", fontWeight:700, fontSize: 64, fill: 0xffffff, align: "center"});
		this.m_label.anchor.set(0.5, 0.5);
		this.addChild(this.m_label);
		
		this.x = pxapp.w / 2;
		this.y = pxapp.h / 2;
	}
	
	doAnimateValue(value, duration = 5)
	{
		gsap.to(this, {m_value:value, duration:duration, ease: "power1.In", onUpdate: () => {
			this.doSetValue(this.m_value);
		}});
	}
	
	doSetValue(value)
	{
		this.m_label.text = parseFloat(this.m_value).toFixed(2) + "x";
	}
}

setTimeout(() => { window.glob_RocketMultiplierCounter.doAnimateValue(2, 4) }, 1000);
setTimeout(() => { window.glob_RocketMultiplierCounter.doAnimateValue(3, 10) }, 6000);

//=======================
class RocketNetworkStatus
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }
		
	init()
	{
		window.glob_RocketNetworkStatus = this;
		
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
		
		this.x = pxapp.w;
		this.y = pxapp.h;
	}
	doSetOnline(online)
	{
		this.m_indicator.tint = online ? 0x2DDC4B : 0xED1D49;
	}
}

setTimeout(() => { window.glob_RocketNetworkStatus.doSetOnline(false) }, 1000);
setTimeout(() => { window.glob_RocketNetworkStatus.doSetOnline(true) }, 3000);

//==================
class RocketNickname
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }

	init(name)
	{
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
		pixi.stage.addChild(this);
		
		var pos = gRocketRacoon.m_tail.getGlobalPosition();
		this.x = pos.x;
		this.y = pos.y;
		
		gsap.to(back, {pixi: {alpha: 0}, duration:3, ease: "power0.InOut"});
		
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
		new RocketNickname(name);
	}
}


function nicknameDropExample()
{
	RocketNickname.doDrop("User" + Math.round(randomBetween(0, 100)));
	setTimeout(nicknameDropExample, randomBetween(1, 3000));
}

window.addEventListener("load", () => { nicknameDropExample() });

//===================
class RocketExplosion
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }
		
	init()
	{
	}
}

//===================
class RocketParachute
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }
}

//===================
class RocketTraceLine
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }
}

//=================
class RocketMeteors
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }
}

//=================
class RocketGround
{
	constructor() {
		return mount(this, new PIXI.Container(), arguments); }

	init()
	{
		window.glob_RocketGround = this;
		var ground = this.addChild(PIXI.Sprite.from("img/ground.png"));
		ground.anchor.set(0.5, 1);
		ground.x = pxapp.screen.width / 2;
		ground.y = pxapp.screen.height;
		utils.fit(ground, pxapp.screen.width);
		pixi.stage.addChild(this);
	}
	
	doRun()
	{
		gsap.to(this, {y: pxapp.screen.height, duration:20, ease: "power0.InOut"});
	}
	
	doClear()
	{
		gsap.to(this, {y: 0, duration:1, ease: "power0.InOut"});
	}
}

setTimeout(() => { window.glob_RocketGround.doRun(); }, 3000);

//============================
function makeParticles(config)
{
		config.textures;
		config.anchor || (config.anchor = 0);
		config.shape || (config.shape = {x: 0, y: 0, w: 400, h: 300});
		config.scale || (config.scale = [0.1, 0.5]);
		config.scaleto || (config.scaleto = 0);
		config.velocity || (config.velocity = [1, 1]);
		config.tint || (config.tint = [0xFFFFFF]);
		config.interval || (config.interval = [1, 2]);
		config.direction || (config.direction = [170, 190]);
		config.particles || (config.particles = 500);
		config.lifetime || (config.lifetime = [100, 200]);
		config.alpha || (config.alpha = [1, 1]);
		config.rotation || (config.rotation = [0, 0]);
		
		var container = new PIXI.ParticleContainer(config.particles, {scale: true, position: true, rotation: true, uvs: true, alpha: true});
		
		container.m_config = config;
		container.m_particles = [];
		container.m_timer = 0;
		container.m_nexttexture = 0;
		
		for (let i = 0; i < config.particles; i++)
		{
			var sprite = new PIXI.Sprite();
			sprite.anchor.set(0.5, 0.5);
			sprite.visible = false;
			sprite.alpha = 0;
			container.addChild(sprite);
		}				
		
		container.doPrepareSpawn = function()
		{
			this.m_interval = randomBetween(this.m_config.interval[0], this.m_config.interval[1]);
		}
		
		container.doSpawn = function()
		{
			var sprite = 0;
			for (var v of this.children)
				if (!v.visible) { sprite = v; break; }
			
			if (sprite) {
				var cfg = this.m_config;
				var shape = this.m_config.shape;
				var angle = randomBetween(cfg.direction[0], cfg.direction[1]) / 180 * Math.PI;
				var scale = randomBetween(cfg.scale[0], cfg.scale[1]);
				var tint = cfg.tint[Math.floor(randomBetween(0, cfg.tint.length))];
				var vel = randomBetween(cfg.velocity[0], cfg.velocity[1]);
				var rot = randomBetween(cfg.rotation[0], cfg.rotation[1]);
				
				var scaleto = cfg.scaleto ? randomBetween(cfg.scaleto[0], cfg.scaleto[1]) : scale;

				var texturei = (container.m_nexttexture++) % this.m_config.textures.length;
				sprite.m_texturei = texturei;
				sprite.texture = this.m_config.textures[sprite.m_texturei];
				
				var relx = 0;
				var rely = 0;
				var rela = 0;
				
				if (cfg.anchor) {
					var matrix = cfg.anchor.worldTransform;
					var pos0 = matrix.apply(cfg.pos);
					var pos1 = matrix.apply(new PIXI.Point(cfg.pos.x + 1, cfg.pos.y));
					var dx = pos1.x - pos0.x;
					var dy = pos1.y - pos0.y;
					var dl = Math.sqrt(dx*dx + dy*dy);
					var rela = - Math.acos(dx / dl);
					if (dy > 0) rela = Math.PI * 2 - rela;
					relx = pos0.x;
					rely = pos0.y;
				}
				
				
				sprite.scale.set(scale, scale);
				sprite.x = relx + randomBetween(shape.x, shape.x + shape.w);
				sprite.y = rely + randomBetween(shape.y, shape.y + shape.h);
				sprite.alpha = randomBetween(cfg.alpha[0], cfg.alpha[1]);
				sprite.rotation = angle;
				
				sprite.m_angle = angle;
				sprite.m_scale = scale;
				sprite.m_scaleto = scaleto;
				sprite.m_rot = rot;
				sprite.m_vel = vel;
				sprite.m_vx = Math.cos(rela + angle) * vel;
				sprite.m_vy = Math.sin(rela + angle) * vel;
				sprite.m_lifetimeinit = randomBetween(cfg.lifetime[0], cfg.lifetime[1]);
				sprite.m_lifetime = sprite.m_lifetimeinit;
				
				if (tint) sprite.tint = tint;
				if (cfg.emitfn) cfg.emitfn(sprite);
				
				sprite.visible = true;
				this.doPrepareSpawn();
			}
		}
		
		container.doCheckSpawn = function(time)
		{
			this.m_timer += time;
			
			while (this.m_timer > this.m_interval) {
				this.m_timer -= this.m_interval;
				this.doSpawn();
			}
			
			if (this.m_timer < 0) this.m_timer = 0;
		}
		
		container.doUpdate = function(time)
		{
			this.doCheckSpawn(time);
			for (var v of this.children) {
				if (!v.visible) continue;
				
				v.m_lifetime -= time;
				
				if (v.m_lifetime <= 0) {
					v.visible = false;
					v.alpha = 0;
					continue;
				}
				
				var progress = 1 - v.m_lifetime / v.m_lifetimeinit;
				
				var scale = v.m_scaleto * progress + v.m_scale * (1 - progress);
				
				v.x += v.m_vx * time;
				v.y += v.m_vy * time;
				v.rotation += v.m_rot * time;
				v.scale.set(scale, scale);
			}
		}
		
		container.doPrepareSpawn();
		PIXI.Ticker.shared.add((time) => { container.doUpdate(time) });
		return container;
}

// mount methods
function mount(classObject, node, args)
{
	var proto = classObject.prototype || Object.getPrototypeOf(classObject);
	var methods = Object.getOwnPropertyNames(proto);
	var ctr = "init";
	for (var m of methods)
		if (!node[m]) node[m] = proto[m];

	if (node[ctr]) node[ctr].apply(node, args);
	return node;
}

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

