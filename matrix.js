var chinese = "!@#%^&*()_+{}:;<>";
chinese = chinese.split("");

var figures = [];
var floor_h = 300;

for (var i = 0; i < 20; i++)
{
	var fig = document.body.appendChild(document.createElement("div"));
	fig.style.cssText = "font:18px/0 arial; position:absolute; top:0; left:50%; z-index:-1; color:#abc;";
	fig.style.left = (Math.random() * 98) + '%';
	fig._y = Math.random() * floor_h;
	fig._vy = 1 + Math.random();
	fig.innerHTML = chinese[i % chinese.length];
	figures.push(fig);
}


function animate()
{
	for (var i = 0; i < figures.length; i++)
	{
		var f = figures[i];
		f._y += f._vy;
		if (f._y > floor_h) f._y = -10;
		f.style.opacity = 1 - f._y / floor_h;
		f.style.transform = "translate(0, " + f._y + "px)";
	}	
	
	requestAnimationFrame(animate);
}

animate();