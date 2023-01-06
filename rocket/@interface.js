function rocketgameClear(countdown = 3) { Game.one.doMoveToStart(countdown) };

function rocketgamePlay() { Game.one.doPlay() };

function rocketgameSetCounter(value) { KMulCounter.one.doSetValue(value) };

function rocketgameExplode() { Game.one.doExplode() };

function rocketgameDropNickname(name) { KNickname.doDrop(name); };
