window.addEventListener("load", () =>
{
	new Game();
	
	function run()
	{
		timeout(100, () => Game.one.doMoveToStart());
		
		timeout(1500, () => Game.one.doPlay());
		
		timeout(2000, () => KMulCounter.one.doAnimateValue(3, 10));
		
		timeout(10000, () => Game.one.doExplode());
		//timeout(3000, () => Game.one.doExplode());
		
		timeout(14000, () => run());
	}
	
	Game.one.onInit = () => {

		timeout(300, () => run());
		
	}
});


