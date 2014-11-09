var money = 0;
var income = 0;

function moneyClick(number){
	money = money + number;
	document.getElementById("money").innerHTML = money;
};

function incrementIncome(){
	var incomeCost = Math.floor(10 * Math.pow(1.1,income));
	if (money >= incomeCost){
		income = income + 1;
		money = money - incomeCost;
		document.getElementById('income').innerHTML = income;
		document.getElementById('money').innerHTML = money;
	};
	var nextIncome = Math.floor(10 * Math.pow(1.1,income));
	document.getElementById('incomeCost').innerHTML = nextIncome;
};

window.setInterval(function(){
	moneyClick(income);
}, 1000);