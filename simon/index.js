
////GLOBAL (sorta) VARIABLES
	var lose;
	var msg = document.getElementById("messages");
	var easy = document.getElementById("easy");
	var hard = document.getElementById("hard");
	var imp = document.getElementById("imp");
	var strict = document.getElementById("strict");
	var cv = document.getElementById("canvases");
	var title = document.getElementById("simone");
	var attrib = document.getElementById("attrib");
	
	var rn = 5;
	var turnCount = 0;
	var cpuMax = 19;
	var cpuArr = [];

	var resetBtn = document.getElementById("reset");
	resetBtn.addEventListener("click", function(){
		resetGame();
		});

	var hardMode = false;
	var impMode = false;
	var strictMode = false;

	var buttons = [
{	id: "r",
	color1: "#800",
	color2: "#F00",
	sound: "sound0"}, 
{	id: "g",
	color1: "#080",
	color2: "#0F0",
	sound: "sound1"}, 
{	id: "b",
	color1: "#008",
	color2: "#00F",
	sound: "sound2"}, 
{ id: "y",	
	color1: "#880",
	color2: "#FF0",
	sound: "sound3"},
{	id: "p",
	color1: "#808",
	color2: "#F0F",
	sound: "sound4"},
{	id: "o",
	color1: "#F80",
	color2: "#FC0",
	sound: "sound5"}
	];

var thanks = "Special thanks to Freesound.org user InspectorJ for the sound effects.";
////GLOBAL FUNCTIONS
	
	function btnPress(obj) {
		var canvas = document.getElementById(obj.id);
		canvas.style.backgroundColor = obj.color2;
		var beep = document.getElementById(obj.sound);
		beep.play();
		setTimeout(function(){
			canvas.style.backgroundColor = obj.color1;
			}, 500);
	}

	////Plays button sequence
		function playList(str, index){
			var obj = buttons.filter(function(x){
				return x.id == str;
				});	
			setTimeout(function(){
				btnPress(obj[0]);
			}, 700*(index+1));
		}


/*In theory, this is to draw the rest of the background. 
Not sure what I'm going to do with it in practice, because curved Canvas lines look awful.

	function drawNecklace(){
		var canvas = document.getElementById("main");
		var ctx = canvas.getContext("2d", {antialias: true});
		ctx.beginPath();
		ctx.translate(0.5,0.5);
		ctx.moveTo(40,0);
		ctx.bezierCurveTo(20,100,240,240,270,0);
		ctx.strokeStyle = "gold";
		ctx.lineWidth=2;
		ctx.stroke();
	}
*/

////"STATE" FUNCTIONS and sub-functions

	function gameStart(){
		easy.addEventListener("click", function(){
			hideBtns();
			return cpuTurn();
		});
		hard.addEventListener("click", function(){
			hideBtns();
			hardMode = true;
			return cpuTurn();
		});	
		imp.addEventListener("click", function(){
			hideBtns();
			hardMode = true;
			impMode = true;
			return cpuTurn();
		});
		strict.addEventListener("click", function(){
			strictMode = !strictMode;
			strict.classList.toggle("litUp");
		});

		cv.style.visibility = "hidden";
		msg.style.visibility = "hidden";

	}

	function hideBtns(){
		easy.style.display = "none";
		hard.style.display = "none";
		imp.style.display = "none";
		
		strict.style.display = "none";
		title.style.visibility = "hidden";
		attrib.style.visibility = "hidden";
	}

	function setDifficulty() {
		if(impMode === false){
			rn -= 1;
			var o = document.getElementById("o");
			o.style.backgroundColor = "#FA8";
			buttons.pop();

		}
		if(hardMode === false){
			rn -= 1;
			var p = document.getElementById("p");
			p.style.backgroundColor = "#A8A";
			buttons.pop(); 
		}
	}


	function cpuTurn(){

	////Adds the next button to the sequence
		function cpuNextMove(){
			var r = Math.round(Math.random() * rn);
			var obj = buttons[r];
			cpuArr.push(obj.id);
		}

	////begin turn
		
		msg.style.visibility = "initial";
		if(cpuArr.length > cpuMax){
			lose = false;
			return gameEnd();
		}

		if(cpuArr.length === 0){
			setTimeout(function(){
				setDifficulty();
				cv.style.visibility = "visible";
				cpuNextMove();
				playList(cpuArr[0],0);
				return yourTurn();
			}, 500);
		} else {
			cv.style.visibility = "visible";
			cpuNextMove();
			for (var i=0; i < cpuArr.length; i++){
				var x = cpuArr[i];
				playList(x, i);
			}
			msg.innerHTML = "Turn: " + cpuArr.length;
			return yourTurn();
		}
	}


	function yourTurn(){

	////Sets up the buttons to beep and check for pattern matches when clicked
		function setButtons(obj) {
		    var btn = document.getElementById(obj.id);
			btn.addEventListener("click", function() {
				btnPress(obj);
				arrCheck(obj.id);
			}, true);
		}

		//console.log("Move list: " + cpuArr);

	////Checks whether your click matches the pattern and changes state accordingly.

		/* If the ID passed in matches the ID at array index [turnCount], the counter
		increments, and it checks whether you've reached the end of the array. If so,
		the counter resets, the event listeners are cleared, and it becomes the 
		computer's turn. */

		function arrCheck(id){

			if(id === cpuArr[turnCount]) {
				turnCount++;
				if (turnCount === cpuArr.length) {
					turnCount = 0;
					setTimeout(function(){
						return cpuTurn();						
					}, 700);
				}

		/* If the ID doesn't match, it's try again or game over, depending on strictness. */

				} else {
					turnCount = 0;
					if(strictMode === true){
						lose = true;
						return gameEnd();
					} else {
						//msg.style.visibility = "initial";
						msg.innerHTML = "Try again!";
						setTimeout(function(){					
							for (var i=0; i < cpuArr.length; i++){
								var x = cpuArr[i];
								playList(x, i);
							}
						//msg.style.visibility = "hidden";	
						msg.innerHTML = "Turn: " + cpuArr.length;
						return yourTurn();			
					}, 1000);
				}	
			}
		}

	////This sets up the buttons for the player after the AI's first turn
		if(cpuArr.length === 1){
		for (var i=0; i < buttons.length; i++){
			setButtons(buttons[i]);
			}
		}
	}

	////And finally, the end state checks if you won or not and shows the reset button.
	function gameEnd(){

		function showEnd(str){
			msg.innerHTML = str;
			msg.style.visibility = "initial";
			easy.style.display = "none";
			hard.style.display = "none";
		}

		if (lose === false) {
			showEnd("YOU WIN!");
			cv.style.visibility = "hidden";
		} else {
			showEnd("YOU LOSE.");
			cv.style.visibility = "hidden";
		}
	}

	function resetGame(){
		location.reload();
	}

	gameStart();

