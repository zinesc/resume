function lava2__run(path = "")
{
	if (!document.body.__lava2) {
		document.body.__lava2 = 1;
			lava2__loadJs("~/js/lazy/three.js", () => {
				lava2__runReal(path);
			});
	}
}

function lava2__loadJs(path, callback)
{
	if (!window.__THREE__) {
		var id = path.replace(new RegExp("\\W+", "g"), "_");
		var script = document.querySelector("#" + id);
		if (script) return callback();
		script = document.createElement("script");
		document.head.appendChild(script);
		script.id = id;
		script.src = path;
		script.onload = callback;
	} else
		return callback();
}

function lava2__runReal(path)
{
	var w = 640;
	var h = 640;
	var paused = false;
	var paused2 = false;
	//--

	var scene = new THREE.Scene();
	scene.background = null; //new THREE.Color(0xffffff);
	
	var camera = new THREE.PerspectiveCamera(35, w / h, 1, 30000);
	camera.position.z = 3.3;
	
	const renderer = new THREE.WebGLRenderer({antialias_: true});
	renderer.setClearColor(0x000000, 0);
	renderer.setSize(w, h);
	
	//--
	var main = document.body;
	main.appendChild(renderer.domElement);
	renderer.domElement.style.cssText = "position:absolute; top:50%; left:50%; z-index:0; transform:translate(-50%, -50%)";
	//--
	var uniforms = {
		time: {value: 0.0},
	};
	const material = new THREE.ShaderMaterial({
		vertexShader: lava2__vertShader(),
		fragmentShader: lava2__fragShader(),
		uniforms: uniforms,
	});
	const glowMaterial = new THREE.ShaderMaterial({
		vertexShader: lava2__vertShader(),
		fragmentShader: lava2__glowFragShader(),
		uniforms: uniforms,
	});
	
	//--
	var glowMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 30, 30), glowMaterial);
	scene.add(glowMesh);
	
	//--
	var mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.4, 30, 30), material);
	mesh.position.z = 1;
	scene.add(mesh);

	
	//--
	var animate = function() 
	{
		if (paused) return;
		//--
		requestAnimationFrame(animate);
		if (!paused2) {
			renderer.render(scene, camera);
			//--
			mesh.rotation.y += 0.001;
			uniforms.time.value += 0.00025;
		}
	}
	animate();
	
	var start = function() {
		paused2 = 0;
		paused = 0;
		animate();
	}
	var pause = function() {
		paused = true; 
	}
	
	//--
	window.addEventListener("popstate", () => {
		var url = location.pathname.split("/").pop();
		if (url != path) { 
			pause(); renderer.domElement.style.display = "none"; 
		} 
		else { 
			start(); renderer.domElement.style.display = ""; 
		}
	});
	
	//--
	window.addEventListener("scroll", (ev) => {	
		var pos = 200;
		if (window.scrollY > pos && !paused2) paused2 = 1; else
		if (window.scrollY < pos && paused2) paused2 = 0;
	});
}

function lava2__noise()
{
	return `
		vec4 mod289(vec4 x) {
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		float mod289(float x) {
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}

		vec4 permute(vec4 x) {
			return mod289(((x*34.0)+1.0)*x);
		}

		float permute(float x) {
			return mod289(((x*34.0)+1.0)*x);
		}

		vec4 taylorInvSqrt(vec4 r)
		{
			return 1.79284291400159 - 0.85373472095314 * r;
		}

		float taylorInvSqrt(float r)
		{
			return 1.79284291400159 - 0.85373472095314 * r;
		}

		vec4 grad4(float j, vec4 ip)
		{
			const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
			vec4 p,s;

			p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
			p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
			s = vec4(lessThan(p, vec4(0.0)));
			p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

			return p;
		}

		#define F4 0.309016994374947451

		float snoise(vec4 v)
		{
			const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
			0.276393202250021,  // 2 * G4
			0.414589803375032,  // 3 * G4
			-0.447213595499958); // -1 + 4 * G4

			vec4 i  = floor(v + dot(v, vec4(F4)) );
			vec4 x0 = v -   i + dot(i, C.xxxx);

			vec4 i0;
			vec3 isX = step( x0.yzw, x0.xxx );
			vec3 isYZ = step( x0.zww, x0.yyz );

			i0.x = isX.x + isX.y + isX.z;
			i0.yzw = 1.0 - isX;

			i0.y += isYZ.x + isYZ.y;
			i0.zw += 1.0 - isYZ.xy;
			i0.z += isYZ.z;
			i0.w += 1.0 - isYZ.z;

			vec4 i3 = clamp( i0, 0.0, 1.0 );
			vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
			vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

			vec4 x1 = x0 - i1 + C.xxxx;
			vec4 x2 = x0 - i2 + C.yyyy;
			vec4 x3 = x0 - i3 + C.zzzz;
			vec4 x4 = x0 + C.wwww;

			i = mod289(i);
			float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
			vec4 j1 = permute( permute( permute( permute (
			i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
			+ i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
			+ i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
			+ i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

			vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

			vec4 p0 = grad4(j0,   ip);
			vec4 p1 = grad4(j1.x, ip);
			vec4 p2 = grad4(j1.y, ip);
			vec4 p3 = grad4(j1.z, ip);
			vec4 p4 = grad4(j1.w, ip);

			vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
			p0 *= norm.x;
			p1 *= norm.y;
			p2 *= norm.z;
			p3 *= norm.w;
			p4 *= taylorInvSqrt(dot(p4,p4));

			vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
			vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
			m0 = m0 * m0;
			m1 = m1 * m1;
			
			float result = 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
				+ dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
				
			return (1.0 + result) * 0.5;
			return result;
		}
	`;
}

function lava2__vertShader()
{
	return `
		varying vec2 vuv;
		varying vec3 vpos;
		void main()
		{
			vuv = uv;
			vpos = position;
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * mvPosition;

		}
	`;
}

function lava2__fragShader()
{
	return `
		${lava2__noise()}
		uniform float time;
		varying vec2 vuv;
		varying vec3 vpos;
		
		vec3 fire3(float a) {
			a /= 1.2;
			return vec3(a, a*a, a*a*a*a*a) * 3.0; // yellow
		}
		
		float fireNoise(vec4 pos)
		{
			float sum = 0.0;
			float amp = 1.0;
			float scale = 3.5;
			for (int i = 0; i < 6; i++) {
				sum += (snoise(pos * scale) - 0.3) * amp;
				pos.w += 100.0;
				amp *= 0.9;
				scale *= 2.0;
			}
			return sum * 0.6;
		}

		float finalHeat(vec4 pos)
		{
			float fire = fireNoise(pos);
			return fire;
		}
		
		vec3 finalColor(vec3 vpos, float time)
		{
			float noise = finalHeat(vec4(vpos, time));
			return fire3(noise);
		}
		
		void main() 
		{
			vec3 color = finalColor(vpos, time);
			gl_FragColor = vec4(color, 1.0);
		}
	`;
}

function lava2__glowFragShader()
{
	return `
		${lava2__noise()}
		uniform float time;
		varying vec2 vuv;
		varying vec3 vpos;
		
		vec3 fire3(float a) {
			a /= 1.3;
			return vec3(a, a*a*a*a*a, a*a*a*a*a*a*a*a) * 0.9; // yellow
		}
		
		void main() 
		{
			float d = sqrt(vpos.x * vpos.x + vpos.y * vpos.y);
			
			d = 1.0 - d;
			
			float r = d * d;
			
			r = (10.1 + r) * r * r;
			
			float glow = r;
			
			r += 2.1 * r * (snoise(vec4(vpos * 2.5, time * 15.0)) - 0.6);
			
			r = max(glow, r);
			
			gl_FragColor = vec4(fire3(r), r);
		}
	`;
}
