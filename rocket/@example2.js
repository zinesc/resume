var users;
var end_multiplier;

window.addEventListener("load", () =>
{

	new Game();
	
});

window.addEventListener("rocketready", () =>
{
	wait_start_game(); // запускаем ожидание новой игры
	
});


function start_game()
{
	// тут должна быть функция старта взлета ракеты
	rocketgamePlay();
	
	
	var time = 0;
	var multiplier = 0;
	var countdown = setInterval(function()
	{
		time += 100; // время 
		multiplier = Math.pow(1.009, (time/1000)/0.15).toFixed(2); // высчитывается коэффициент multiplier
		
		//$('#multiplier').html(multiplier+'x'); // выводим на экран новый коэффициент multiplier
		rocketgameSetCounter(multiplier);
    
	  	users.forEach(function callback(user, index)
	  	{
	  		// перебираем всех игроков
			// если их коэффициент больше текущего и ранее мы их не показывали,
			// то помечаем, что мы их уже показали (show = true) и показываем их на экране
			
	  		if (multiplier >= user.multiplier && user.show === false) {
    		  	users[index].show = true; // помечаем что мы их показали
    		  	
		     	//$( "#users" ).append( "<p>"+user.name+"</p>" ); // показываем на экране 
		        // тут должна быть функция, которая показывает игрока под ракетой 
		        rocketgameDropNickname(user.name);
	    	}
		});
    
		// если текущий кафициент превышает случайный кофициент конца игры,
		// то запускается функция конца игры 
		if (multiplier >= end_multiplier) { 
			clearInterval(countdown); //останавливаем счетчик время
			game_end(); // функция конца игры
		}
		
		// тут в этом месте можно добавить элементы: самолёты, космодромы, метеориты, НЛО
		// например если коэфициент больше 3-х, то показать метеориты
		// if (multiplier >= 3) { 
		// 	// показываем метеориты
		// }
	}, 100);
}

function wait_start_game()
{
	// тут на этом этапе нужно вернуть ракету в исходное положение 
	rocketgameClear(3);
	
	//$('#multiplier').html('1.00x'); // показываем стартовый коэффициент на экране
	rocketgameSetCounter(1);
	
	//$('#multiplier').removeClass('end'); // удаляем красный цвет у коэффициента
	
	//$("#users").html(''); // стираем игроков с экрана
  
	var wait_time = 5; // время до начала игры
	
	setTimeout(function() { initialization(); }, 3000);
	
	//setTimeout(function() { initialization(); }, 1000);
	
	/*
	var wait = setInterval(function()
	{
		$('#wait').html(wait_time);
		
		if (wait_time <= 0) {
		   clearInterval(wait);
		   initialization(); // подготовка к начину игры
		}
		wait_time -= 1;
	}, 1000);
	*/
}


function game_end()
{
	//$('#multiplier').addClass('end'); // изменяем цвет коэффициента на красный
	setTimeout(function() { wait_start_game(); }, 3000); // запускаем ожидание новой игры через 3 секунды
	
	// тут должна быть функция взрыва ракеты и затем парашут с енотом.
	// на это у нас есть 3 секунды
	rocketgameExplode();
}

function initialization()
{
	//$("#wait").html(''); // стираем время ожидания
	
	end_multiplier = getRandomArbitrary(3, 4); // устанавливаем случайный коэффициент от 3 до 4
	
	users = [
		{
			name: 'Vasya',
    	multiplier: '1.2',
    	show: false
		},
  	{
			name: 'Maksim',
    	multiplier: '2.0',
    	show: false
		},
    {
			name: 'Denis',
    	multiplier: '3.1',
    	show: false
		},
 	];
 	
	start_game(); // начинаем игру
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
