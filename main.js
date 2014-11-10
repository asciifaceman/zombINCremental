var player = { // These would go to save file
	name: "Oglaf The Weak",
	level: 1,
	xp: 0,
	levelxp: 1,
	basedamage: 5,
	money: 0,
	income: 0,
	killedZ: 0,
	damageBonus: 1,
	damCost: 5000,
	xpBonus: 1,
	xpCost: 5000,
	BankAct: false
};

var inventory = {
	knife: [0, 0.01],
	hatchet: [0, 0.03],
	shortsword: [0, 0.05],
	longsword: [0, 0.08],
	pistol: [0, 0.1],
	rifle: [0, 0.2],
	shotgun: [0, 0.5]
};

var game = { // Statefull Settings
	attacking: false,
	enemy: null
};

// System Functions 


function prettify(input){
    var output = Math.round(input * 100)/100;
	return output;
};

function saveGame(){
	localStorage.setItem("playerSave",JSON.stringify(player));
	flashMessage("Game Saved!");
};
function loadGame(){
	var playerGame = JSON.parse(localStorage.getItem("playerSave"));
	for (var prop in playerGame){
		if (typeof playerGame[prop] !== "undefined") player[prop] = playerGame[prop];
		console.log("Loaded: " + prop);
	};
	flashMessage("Save Loaded!");
};
function deleteSave(){
	localStorage.removeItem("playerSave");
	flashMessage("Save DELETED!");
};

// Zombie Object Setup
function Zombie (zname, maxhp, moneyValue, xpValue, armor) {
	this.zname = zname;
	this.maxhp = maxhp;
	this.hp = maxhp;
	this.moneyValue = moneyValue;
	this.xpValue = xpValue;
	this.armor = armor;
};

function createEnemy(zname){
	if (zname == "Shambler"){
		game["enemy"] = new Zombie("Shambler", 20, .1, 1, 0);
	} else if (zname == "Walker"){
		game["enemy"] = new Zombie("Walker", 50, .2, 3, 5);
	} else if (zname == "Walker"){
		game["enemy"] = new Zombie("Walker", 80, .3, 5, 8);
	}
};

Zombie.prototype.kill = function(){
	this.hp = this.maxhp;
	player["killedZ"] += 1;
	addXP(this.xpValue);
	player["money"] += this.moneyValue;
}
Zombie.prototype.attack = function(damage) {
	if ((this.hp - damage) > 0){
		this.hp -= damage;
		//console.log("Attacked " + this.zname + "!");
	} else if ((this.hp - damage) <= 0) {
		console.log("Killed zombie!");
		this.kill();
	} else {
		console.log("Killed zombie!");
		this.kill();
	};
	
};

Zombie.prototype.combat = function(){
	// Determine Inventory Bonus
	invBonus = 1;
	invBonus = getInvModifier();
	if (((player["basedamage"] * player["damageBonus"]) * invBonus) < this.armor){
		options = [];
		flashMessage("Attack failed! It's too strong!");
		return 1;
	}
	damage = ((player["basedamage"] * player["damageBonus"]) * invBonus) - this.armor;
	//console.log("Damage : " + damage);
	this.attack(damage);

};

// Game Stuff

function getRandomArbitrary(min, max){
	return (Math.random() * (max - min + 1)) + min;
};

function levelUP(){
	player["xp"] = 0; //ditched xp rollover
	player["level"] += 1;
	console.log(Math.log(getRandomArbitrary(1, player["level"])) / 2);
	player["basedamage"] += Math.log(getRandomArbitrary(1, player["level"])) / 2;
	player["levelxp"] = (Math.pow(player["level"], 2) - Math.log(Math.pow(player["level"],2)));
	//console.log(player["levelxp"]);
	flashMessage("Leveled Up! " + player["levelxp"] + " needed for next level...");
};

function addXP(xp){
	if ((player["xp"] + xp) < player["levelxp"]){
		player["xp"] += xp * player["xpBonus"];
	} else {
		levelUP();
	}
}

function getInvModifier(){
	invBonus = 1;
	for (var index in inventory){
		temp = 0;
		if(!inventory.hasOwnProperty(index)){
			continue;
		};
		if (inventory[index][0] >= 1){
			temp = (inventory[index][0] * inventory[index][1])
		};
		invBonus += temp;
		
	};
	return invBonus;
};

function attackButton(){
	if (game["enemy"]){
		if (game["attacking"]){
			game["attacking"] = false;
		} else {
			game["attacking"] = true;
		};
	};
};

function buyItem(item){
	for (var index in inventory){
		if (index == item){
			inventory[item][0] += 1;
			flashMessage("Bought " + item + "!");
		}
	}
};


// Window Functions

function updateStats(){
	hpPercent = (game["enemy"].hp / game["enemy"].maxhp) * 100;
	document.getElementById("HP").style.width = hpPercent + '%';
	document.getElementById("hppercent").innerHTML = prettify(hpPercent) + "%";
	xpPercent = (player["xp"] / player["levelxp"]) * 100;
	document.getElementById("XP").style.width = xpPercent + '%';
	document.getElementById("levelPercent").innerHTML = prettify(xpPercent) + "%";
	document.getElementById("level").innerHTML="Level : " + player["level"];
	document.getElementById("zombieKills").innerHTML = player["killedZ"];
	document.getElementById("money").innerHTML = prettify(player["money"]);
};

window.setInterval(function(){ // 1000 (1s) delay for attacks
	if (game["attacking"]){
		game["enemy"].combat();
	};
}, 1000);

window.setInterval(function() { // 10 delay for status updates
	if (game["enemy"] == null){
		document.getElementById("fightEnemy").disabled = true;
	} else {
		document.getElementById("fightEnemy").disabled = false;
		document.getElementById("zName").innerHTML = game["enemy"].zname;
		dps = (player["basedamage"] * player["damageBonus"]) * getInvModifier();
		document.getElementById("playerDPS").innerHTML = dps;
	};
	if (game["enemy"]){
		updateStats();
	};

}, 10);


// Window Effect Functions

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


// Overlays

function toggleZOverlay(){
	var overlay = document.getElementById('zombieoverlay');
	var specialBox = document.getElementById('zombiebox');
	overlay.style.opacity = .8;
	if(overlay.style.display == "block"){
		overlay.style.display = "none";
		specialBox.style.display = "none";
	} else {
		overlay.style.display = "block";
		specialBox.style.display = "block";
	}
}
function toggleOptions(){
	var overlay = document.getElementById('optionsoverlay');
	var specialBox = document.getElementById('optionsbox');
	overlay.style.opacity = .8;
	if(overlay.style.display == "block"){
		overlay.style.display = "none";
		specialBox.style.display = "none";
	} else {
		overlay.style.display = "block";
		specialBox.style.display = "block";
	}
}





