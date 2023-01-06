class KFlyingObjects extends PIXI.Container
{
	constructor()
	{
		super();
		pixi.stage.addChild(this);
		var atlas = PIXI.Loader.shared.resources["img/atlas.json"];
		
		var moon = pixi.stage.addChild(new PIXI.Sprite(atlasTexture(atlas, "moon")));
		moon.anchor.set(0.5);
		moon.x = app.w + 15;
		moon.y = -15;
		moon.fitw(140);
		
		
		// meteors
		var meteors = makeParticles({
			textures: [
				atlasTexture(atlas, "cm_red"),
				atlasTexture(atlas, "cm_blue"),
				atlasTexture(atlas, "cm_yellow"),
				atlasTexture(atlas, "cm_simple"),
			],
			particles: 30,
			scale: [0.2, 0.35],
			direction: [90, 90],
			lifetime: [500, 500],
			interval: [800, 1500],
			velocity: [11, 11],
			onInterval: () => {
				var cfg = (sprite, texture, top) => {
					if (!top) {
						sprite.y = rnd(-100, -150);
						sprite.x = rnd(app.w + 150, app.w + 200);
					} else {
						sprite.y = rnd(-150, -200);
						sprite.x = app.w + rnd(100, 150);
					}
					sprite.m_angle = rnd(-180 - 35, -180 - 35) / 180 * Math.PI;
					sprite.rotation = sprite.m_angle;
					sprite.m_vx = Math.cos(sprite.m_angle) * sprite.m_vel * sprite.m_scale;
					sprite.m_vy = Math.sin(sprite.m_angle) * sprite.m_vel * sprite.m_scale;
					if (texture) sprite.texture = texture;
				};
				var s1 = meteors.doSpawnRaw();
				var s2 = meteors.doSpawnRaw();
				var s3 = meteors.doSpawnRaw();
				var top = rnd(0, 10) > 5;
				cfg(s1, 0, top);
				cfg(s2, s1.texture, top);
				cfg(s3, s1.texture, top);
			}
		});
		pixi.stage.addChild(meteors);
		
		// shine
		var shine = makeParticles({
			textures: [
				atlasTexture(atlas, "shine"),
			],
			particles: 10,
			scale: [0.5, 0.5],
			direction: [90, 90],
			lifetime: [500, 500],
			interval: [800, 1500],
			velocity: [1.8, 2.2],
			onSpawn: (sprite) => {
				sprite.y = -100;
				sprite.x = rnd(100, 200);
				sprite.angle = 0;
				sprite.alpha = 1;
				
				gsap.killTweensOf(sprite);
				var animation = new TimelineLite();
				gsap.to(sprite, {alpha: 0.1, duration: 2, repeat:3, yoyo:true});
			}
		});
		pixi.stage.addChild(shine);
		
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
			interval: [100, 550], // 100, 550
			rotation: [-0.02, 0.02],
			velocity: [2, 3],
			emitfn: (sprite) =>
			{
				sprite.y = rnd(app.h * 0.2, app.h * 0.8);
				if (rnd(0, 10) < 5) {
					sprite.x = -50;
					sprite.m_angle = rnd(-25, 25) / 180 * Math.PI;
				} else {
					sprite.x = app.w + 50;
					sprite.m_angle = rnd(-180 - 25, -180 + 25) / 180 * Math.PI;
				}
				
				var texturei = sprite.m_texturei;
				if (texturei == 0) // shuttle
				{
					sprite.x = -50;
					sprite.m_rot = 0;
					sprite.m_angle = rnd(-55, 0) / 180 * Math.PI;
					sprite.rotation = sprite.m_angle;
				}
				
				if (texturei >= 8) // meteor
				{
					sprite.y = rnd(app.h * 0, app.h * 0.4);
					sprite.x = app.w + 50;
					sprite.m_angle = rnd(-180 - 35, -180 - 35) / 180 * Math.PI;
					sprite.m_rot = 0;
					sprite.rotation = sprite.m_angle;
				}
				
				sprite.m_vx = Math.cos(sprite.m_angle) * sprite.m_vel * sprite.m_scale * 3;
				sprite.m_vy = Math.sin(sprite.m_angle) * sprite.m_vel * sprite.m_scale * 3;
			}
		});
		pixi.stage.addChild(sputnics);
		
		this.m_sput = sputnics;
		this.m_shine = shine;
		this.m_met = meteors;
		
		KFlyingObjects.one = this;
	}
	
	doPlay()
	{
		this.m_sput.doPlay();	
		this.m_shine.doPlay();	
		this.m_met.doPlay();	
	}
	
	doPause()
	{
		this.m_sput.doPause();	
		this.m_shine.doPause();	
		this.m_met.doPause();	
	}
}
