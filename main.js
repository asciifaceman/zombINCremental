var player = {
	name:"Nobody",
	level:1,
	xp:0,
	levelxp:1000,
	money:0, 
	income:0, 
	killedZombies:0
};

var zombies = {
	level:0,
	moneyValue:1,
	xpValue:10
}

function saveGame(){
	localStorage.setItem("playerSave",JSON.stringify(player));
	localStorage.setItem("zombiesSave",JSON.stringify(zombies));
};
function loadGame(){
	var playerGame = JSON.parse(localStorage.getItem("playerSave"));
	for (var prop in playerGame){
		if (typeof playerGame[prop] !== "undefined") player[prop] = playerGame[prop];
		console.log("Loaded: " + prop);
	};
	var zombieGame = JSON.parse(localStorage.getItem("zombiesSave"));
	for (var prop in zombieGame){
		if (typeof zombieGame[prop] !== "undefined") zombies[prop] = zombieGame[prop];
		console.log("Loaded: " + prop);
	};

};
function deleteSave(){
	localStorage.removeItem("playerSave");
	localStorage.removeItem("zombiesSave");
};

function moneyClick(increment){
	player["money"] = player["money"] + increment;
	document.getElementById("money").innerHTML = player["money"];
};

function incrementIncome(){
	var incomeCost = Math.floor(10 * Math.pow(1.1,player["income"]));
	if (player["money"] >= incomeCost){
		player["income"] = player["income"] + 1;
		player["money"] = player["money"] - incomeCost;
		document.getElementById('income').innerHTML = player["income"];
		document.getElementById('money').innerHTML = player["money"];
	};
	var nextIncome = Math.floor(10 * Math.pow(1.1,player["income"]));
	document.getElementById('incomeCost').innerHTML = nextIncome;
};

function XPBar(enemy) {
	if (player["xp"] < player["levelxp"]){
		player["xp"] += enemy["xpValue"];
		xpPercent = (player["xp"] / player["levelxp"]) * 100;
		document.getElementById("XP").style.width = xpPercent + '%';
	} else {
		player["xp"] -= player["levelxp"];
		player["xp"] += enemy["xpValue"];
		player["level"]++;
		xpPercent = (player["xp"] / player["levelxp"]) * 100;
		document.getElementById("level").innerHTML="Level : " + player["level"];
		document.getElementById("levelPercent").innerHTML=xpPercent + "%";
	}
	//setTimeout(function() {
	//	XPBar();
	//}, 500);
};

function killZombie(){
	XPBar(zombies);

};

window.setInterval(function(){ // 1000 delay for income and shorter stuff
	moneyClick(player["income"]);
}, 1000);

window.setInterval(function() { // 100 delay for faster stuff like XP updates
	xpPercent = (player["xp"] / player["levelxp"]) * 100;
	//console.log(xpPercent);
	document.getElementById("XP").style.width = xpPercent + "%";
	document.getElementById("level").innerHTML="Level : " + player["level"];
	document.getElementById("levelPercent").innerHTML=xpPercent + "%";
	document.getElementById("income").innerHTML = player["income"];
}, 100);