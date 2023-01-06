function makeParticles(config)
{
		var rnd = function(min, max) { return min + Math.random() * (max - min) }
		
		config.textures;
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
		container.m_play = 1;
		
		for (let i = 0; i < config.particles; i++)
		{
			var sprite = new PIXI.Sprite();
			sprite.anchor.set(0.5, 0.5);
			sprite.visible = false;
			sprite.alpha = 0;
			container.addChild(sprite);
		}				
		
		container.doPause = function()
		{
			this.m_play = 0;
		}
		
		container.doPlay = function()
		{
			this.m_play = 1;
		}
		
		container.doClear = function()
		{
			for (var v of this.children) {
				v.visible = 0;
				v.alpha = 0;
			}
		}
		
		container.doPrepareSpawn = function()
		{
			this.m_interval = rnd(this.m_config.interval[0], this.m_config.interval[1]);
		}
		
		container.doSpawnRaw = function()
		{
			var sprite = 0;
			for (var v of this.children)
				if (!v.visible) { sprite = v; break; }
			
			if (sprite) {
				var cfg = this.m_config;
				var shape = this.m_config.shape;
				var angle = rnd(cfg.direction[0], cfg.direction[1]) / 180 * Math.PI;
				var scale = rnd(cfg.scale[0], cfg.scale[1]);
				var vel = rnd(cfg.velocity[0], cfg.velocity[1]);
				var rot = rnd(cfg.rotation[0], cfg.rotation[1]);
				var pos = cfg.pos || {x: 0, y: 0};
				
				var tint = -1;
				var scaleto = scale;
				
				if (cfg.tint)
					tint = cfg.tint[Math.floor(rnd(0, cfg.tint.length))];
				
				
				if (cfg.scaleto)
					scaleto = rnd(cfg.scaleto[0], cfg.scaleto[1]);

				sprite.m_texturei = (container.m_nexttexture++) % this.m_config.textures.length;
				sprite.texture = this.m_config.textures[sprite.m_texturei];
				
				var relx = 0;
				var rely = 0;
				var rela = 0;
				
				if (cfg.anchor) {
					var matrix = cfg.anchor.worldTransform;
					var pos0 = matrix.apply(pos);
					var pos1 = matrix.apply(new PIXI.Point(pos.x + 1, pos.y));
					var dx = pos1.x - pos0.x;
					var dy = pos1.y - pos0.y;
					var dl = Math.sqrt(dx*dx + dy*dy);
					var rela = - Math.acos(dx / dl);
					if (dy > 0) rela = Math.PI * 2 - rela;
					relx = pos0.x;
					rely = pos0.y;
				}
				
				sprite.scale.set(scale, scale);
				sprite.x = relx;
				sprite.y = rely;
				sprite.alpha = rnd(cfg.alpha[0], cfg.alpha[1]);
				sprite.rotation = angle;
				
				sprite.m_angle = angle;
				sprite.m_scale = scale;
				sprite.m_scaleto = scaleto;
				sprite.m_rot = rot;
				sprite.m_vel = vel;
				sprite.m_vx = Math.cos(rela + angle) * vel;
				sprite.m_vy = Math.sin(rela + angle) * vel;
				sprite.m_lifetimeinit = rnd(cfg.lifetime[0], cfg.lifetime[1]);
				sprite.m_lifetime = sprite.m_lifetimeinit;
				
				if (tint >= 0) sprite.tint = tint;
				
				sprite.visible = true;
			}
			
			return sprite;
		}
		
		container.doSpawn = function()
		{
			this.doPrepareSpawn();
			
			if (this.m_config.onInterval) {
				return this.m_config.onInterval();
			}
				
			var sprite = this.doSpawnRaw();
			var cfg = this.m_config;
			
			if (sprite) {
			
				if (cfg.onSpawn) {
					cfg.onSpawn(sprite);
				}
				if (cfg.emitfn) {
					cfg.emitfn(sprite);
				}
			}
		}
		
		container.doCheckSpawn = function(time)
		{
			if (this.m_play)
			{
				this.m_timer += time;
				
				while (this.m_timer > this.m_interval) {
					this.m_timer -= this.m_interval;
					this.doSpawn();
				}
				
				if (this.m_timer < 0) this.m_timer = 0;
			}
		}
		
		container.doUpdate = function(time)
		{
			this.doCheckSpawn(time);
			for (var v of this.children)
			{
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
		container.doPlay();
		
		PIXI.Ticker.shared.add((time) => { container.doUpdate(time) });
		
		return container;
}
