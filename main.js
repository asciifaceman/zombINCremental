var player = {
	name:"Nobody",
	level:1,
	xp:0,
	levelxp:20,
	money:0, 
	income:0, 
	killedZombies:0
};

var zombies = {
	level:0,
	hp:10,
	maxhp:10,
	moneyValue:1,
	xpValue:10
}

var killing = false;

function prettify(input){
    var output = Math.round(input * 1000000)/1000000;
	return output;
}

//// System functions

function saveGame(){
	localStorage.setItem("playerSave",JSON.stringify(player));
	localStorage.setItem("zombiesSave",JSON.stringify(zombies));
	flashMessage("Game Saved!");
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
	flashMessage("Save Loaded!");
};
function deleteSave(){
	localStorage.removeItem("playerSave");
	localStorage.removeItem("zombiesSave");
	flashMessage("Save DELETED!");
};


///// Gameplay Functions

function moneyClick(increment){
	player["money"] = player["money"] + increment;
	document.getElementById("money").innerHTML = player["money"];
};

function incrementIncome(){
	var incomeCost = Math.floor(10 * Math.pow(1.1,player["income"]));
	if (player["money"] >= incomeCost){
		player["income"] = (player["income"] * 1.5) + 1;
		player["money"] = player["money"] - incomeCost;
		document.getElementById('income').innerHTML = player["income"];
		document.getElementById('money').innerHTML = player["money"];
	};
	var nextIncome = Math.floor(10 * Math.pow(1.1,player["income"]));
	document.getElementById('incomeCost').innerHTML = nextIncome;
};

function levelUp(player, enemy){
	newXP = enemy["xpValue"];
	player["xp"] += newXP;
	while (player["xp"] >= player["levelxp"]){
		player["xp"] - player["levelxp"];
		player["level"] += 1;
		player["levelxp"] *= 2.5;
	}

	//console.log(player["xp"]);
	//while (newXP > 0){
	//	console.log(newXP);
	//	if (player["xp"] < player["xpValue"]){
	//		player["xp"] += 1;
	//		newXP -= 1;
	//		console.log("[playerxp: " + player["xp"] + "][newXp: " + newXP)
	//	} else if (player["xp"] >= player["xpValue"]){
	//		player["level"] += 1;
	//		player["xp"] = 0;
	//		console.log("leveled up");
	//	}
	//}

	//player["xp"] -= player["levelxp"];
	//player["level"]++;

	flashMessage("Leveled up! " + player["levelxp"] + " needed for next level...");
};

function killBar(enemy) {
	//damage = (player["level"] + player["killedZombies"]) / 10;
	damage = (player["level"] + Math.log(player["killedZombies"] + 1));
	console.log("Damage : " + damage);
	console.log(zombies["hp"]);

	if (zombies["hp"] >= 0){
		zombies["hp"] -= damage;
		hpPercent = (zombies["hp"] / zombies["maxhp"]) * 100;
		document.getElementById("HP").style.width = hpPercent + '%';

	} else {
		killZombie(enemy);
		zombies["hp"] = zombies["maxhp"];
		if (zombies["level"] <= (player["level"] + 5)){
			zombies["level"] += 1;
			zombies["maxhp"] += (Math.log(zombies["maxhp"]) + zombies["level"]);
			console.log("new zombie HP : " + zombies["maxhp"]);
			zombies["xpValue"]++;
			zombies["hp"] = zombies["maxhp"];
		}
		//console.log(zombies["maxhp"]);
	}

	//killZombie();
};

function XPBar(enemy) {
	if ((player["xp"] + zombies["xpValue"]) < player["levelxp"]){
		player["xp"] += enemy["xpValue"];
		xpPercent = (player["xp"] / player["levelxp"]) * 100;
		document.getElementById("XP").style.width = prettify(xpPercent + '%');
	} else {
		levelUp(player, zombies);
		//player["xp"] -= player["levelxp"];
		//player["xp"] += enemy["xpValue"];
		xpPercent = (player["xp"] / player["levelxp"]) * 100;
		document.getElementById("level").innerHTML="Level : " + player["level"];
		document.getElementById("levelPercent").innerHTML=prettify(xpPercent) + "%";
	}
	player["killedZombies"]++;
};

function killZombie(){
	XPBar(zombies);
	player["money"]++;
	document.getElementById("zombieKills").innerHTML = player["killedZombies"];

};

function fightEnemy(zombies){
	if (killing){
		killing = false;
	} else {
		killing = true;	
	}
}

///// Automation Functions

window.setInterval(function(){ // 1000 delay for income and shorter stuff
	moneyClick(player["income"]);
}, 1000);

window.setInterval(function() { // 100 delay for faster stuff like XP updates
	if (killing){
		killBar(zombies);
	}

	xpPercent = (player["xp"] / player["levelxp"]) * 100;
	hpPercent = (zombies["hp"] / zombies["maxhp"]) * 100;
	//console.log("xp:" + player["xp"] + "/" + player["levelxp"]);
	document.getElementById("XP").style.width = prettify(xpPercent) + "%";
	document.getElementById("level").innerHTML="Level : " + player["level"];
	document.getElementById("levelPercent").innerHTML=prettify(xpPercent) + "%";
	document.getElementById("hppercent").innerHTML=prettify(hpPercent) + "%";
	document.getElementById("income").innerHTML = player["income"];
	document.getElementById("zombieKills").innerHTML = player["killedZombies"];
}, 100);

////// Window effect functions

function flashMessage(message){
	document.getElementById("flash").innerHTML = message;
	var options = {direction: "right"};
	$( "#flash-alert" ).show( "drop", options, 500, callback );

};

function callback() {
	setTimeout(function() {
		$( "#flash-alert:visible" ).removeAttr( "style" ).fadeOut();
	}, 1000 );
};

$("#flash-alert").hide();








