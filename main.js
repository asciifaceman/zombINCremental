var player = {
	name:"Nobody",
	level:1,
	xp:0,
	levelxp:20,
	money:0, 
	income:0, 
	killedZombies:0,
	damagebonus:1,
	damcost:5000,
	xpbonus:1,
	xpcost:5000,
	bankAccount: false
};

var zombies = {
	level:0,
	hp:10,
	maxhp:10,
	moneyValue:1,
	xpValue:10,
	difficulty: 1
}

var killing = false;

function prettify(input){
    var output = Math.round(input * 100)/100;
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

function buyItem(item){
	console.log("buying: " + item);
	if (item == "bank"){
		if (player["money"] < 100000){
			flashMessage("Not enough money for that purchase!");
		}
	} else if (item == "xpbonus"){
		if (player["money"] < player["xpcost"]){
			flashMessage("Not enough money for that purchase!");
		} else {
			if (player["xpbonus"] <= 500){
				player["money"] -= player["xpcost"];
				player["xpbonus"] += (Math.log(player["xpbonus"]) + 1);
				player["xpcost"] += (Math.log(player["xpcost"]) * player["xpcost"]) / 2;	
			} else {
				flashMessage("You hit the bonus cap!");
			}
			
		}
	}
};

function moneyClick(increment){
	player["money"] = player["money"] + increment;
	document.getElementById("money").innerHTML = prettify(player["money"]);
};

function incrementIncome(){
	var incomeCost = (20 + Math.floor(5 * Math.log(player["income"] + 1))) * (player["level"] * 2);
	console.log(incomeCost);
	if (player["money"] >= incomeCost){
		player["income"] = (player["income"] * 1.1) + 1;
		player["money"] = player["money"] - incomeCost;
		document.getElementById('income').innerHTML = prettify(player["income"]);
		document.getElementById('money').innerHTML = prettify(player["money"]);
		var nextIncome = (20 + Math.floor(5 * Math.log(player["income"] + 1))) * (player["level"] * 2);
		document.getElementById('incomeCost').innerHTML = prettify(nextIncome);
	};
};

function levelUp(player, enemy){
	//newXP = enemy["xpValue"];
	//player["xp"] += newXP;
	//while (player["xp"] >= player["levelxp"]){
	//	player["xp"] - player["levelxp"];
	//	player["level"] += 1;
	//	player["levelxp"] = 100 * Math.sqrt(player["level"]);
	//	console.log(player["levelxp"]);
	//}
	player["xp"] = 0; // ditched XP rollover due to bugs
	player["level"] += 1;
	//player["levelxp"] = 100 * Math.sqrt(player["level"]);
	//player["levelxp"] = ((Math.pow(player["level"], 2) / 2) * 100) - (player["level"]*100);
	player["levelxp"] = (Math.pow(player["level"], 2) - Math.log(Math.pow(player["level"],2)));
	console.log(player["levelxp"]);

	flashMessage("Leveled up! " + player["levelxp"] + " needed for next level...");
};

function killBar(enemy) {
	//damage = (player["level"] + player["killedZombies"]) / 10;
	damage = (player["level"] + Math.log(player["killedZombies"] + 1));

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
			//console.log("new zombie HP : " + zombies["maxhp"]);
			zombies["xpValue"]++;
			zombies["hp"] = zombies["maxhp"];
		}
	}

};

function XPBar(enemy) {
	if ((player["xp"] + enemy["xpValue"]) < player["levelxp"]){
		player["xp"] += enemy["xpValue"] * player["xpbonus"];
		console.log(enemy["xpValue"] * player["xpbonus"]);
		xpPercent = (player["xp"] / player["levelxp"]) * 100;
		document.getElementById("XP").style.width = prettify(xpPercent + '%');
	} else {
		levelUp(player, enemy);
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
	//player["money"]++;
	player["money"] += zombies["moneyValue"];
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

function updatePage(){
	xpPercent = (player["xp"] / player["levelxp"]) * 100;
	hpPercent = (zombies["hp"] / zombies["maxhp"]) * 100;
	document.getElementById("XP").style.width = prettify(xpPercent) + "%";
	document.getElementById("level").innerHTML="Level : " + player["level"];
	document.getElementById("levelPercent").innerHTML=prettify(xpPercent) + "%";
	document.getElementById("hppercent").innerHTML=prettify(hpPercent) + "%";
	document.getElementById("income").innerHTML = prettify(player["income"]);
	document.getElementById("money").innerHTML = prettify(player["money"]);
	document.getElementById("zombieKills").innerHTML = player["killedZombies"];
	document.getElementById("xpcost").innerHTML = player["xpcost"];
	var nextIncome = (20 + Math.floor(5 * Math.log(player["income"] + 1))) * (player["level"] * 2);
	document.getElementById('incomeCost').innerHTML = prettify(nextIncome);
};

window.setInterval(function(){ // 1000 delay for income and shorter stuff
	moneyClick(player["income"]);
}, 1000);

window.setInterval(function() { // 100 delay for faster stuff like XP updates
	if (killing){
		killBar(zombies);
	}

	updatePage();

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








