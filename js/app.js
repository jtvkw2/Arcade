// Draw the enemy and player objects on the screen
Object.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    draw_info();
}

//Reset player to beginning position
Object.prototype.reset = function() {
  player.x = 200;
  player.y = 400;
}

/*
    Enemy Objects
*/

// Enemies the player must avoid
var Enemy = function(x,y) {

    // The image/sprite for enemies
    this.sprite = 'images/enemy-bug.png';

    //x and y coordinates and movement speed
    this.x = x;
    this.y = y;
    var level = game.level;
    this.speed = Math.floor((Math.random() * 200) + 100);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    //if the enemy crosses off screen, reset its position. Otherwise, it keeps running.
    if(this.x <= 550){
        this.x += this.speed * dt;
    }else{
        this.x = -2;
    }

    //If the player comes within 30px of an enemy's x and y coordinates, reset the game
    if(player.x >= this.x - 30 && player.x <= this.x + 30){
        if(player.y >= this.y - 30 && player.y <= this.y + 30){
            game.lives-= 1;
            if (game.lives < 0){
              console.log("gameover");
              game_over();
            }
            else{
              draw_info();
              this.reset();
            }
        }
    }
}

/*
    Player Object
*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
// Player class and initial x and y coordinates
var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
}

//Update player position
Player.prototype.update = function(){
    //if left key is pressed and player is not on edge of map, pressed decrement x
    if(this.ctlKey === 'left' && this.x > 0){
        this.x = this.x - 50;
    //if right key is pressed and player is not on edge of map increment x
    }else if(this.ctlKey === 'right' && this.x != 400){
        this.x = this.x + 50;
    //if up key is pressed increment y
    }else if(this.ctlKey === 'up'){
        this.y = this.y - 50;
    //if down key is pressed and player is not on edge of map decrement y
    }else if (this.ctlKey === 'down' && this.y != 400){
        this.y = this.y + 50;
    }
    this.ctlKey = null;

    //If on water, reset
    if(this.y < 25){
      win();
      draw_info();
      this.reset();
      console.log(game.lives, game.score, game.level);

    }
}


//Input handler for player
Player.prototype.handleInput = function(e){
    this.ctlKey = e;
}

var Coin = function(x , y) {
    this.sprite = 'images/Gem-Blue.png';
    console.log("precoin");
    this.x = x;
    this.y = y;
}

Coin.prototype.update = function(dt) {
  if(player.x >= this.x - 40 && player.x <= this.x + 40){
      if(player.y >= this.y - 40 && player.y <= this.y + 40){
        var allcoin = [];
        game.score += 10;
          this.x = getRandomInt(0, 400);
          this.y = getRandomInt(30, 200);
      }
  }
  var coin = setInterval(getRandomInt(0, 5), 30);
  if(coin == 5){
    console.log("coin");
    this.x = getRandomInt(0, 400);
    this.y = getRandomInt(30, 200);
  }
}

// Instantiate enemies and player objects
var allEnemies = [];
(function setEnemies(){
    allEnemies.push(new Enemy(-2, 60));
    allEnemies.push(new Enemy(-2, 100));
    allEnemies.push(new Enemy(-2,150));
    allEnemies.push(new Enemy(-2,220));
}());

var player = new Player();
var coin = new Coin();
board = document.getElementById('game');
var context = board.getContext('2d');

// listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

game.lives = 5;
game.extra = 0;
game.level = 1;
game.score = 0;
game.highest = -1;

var resetGame = function(){
  game.lives = 5;
  game.extra = 0;
  game.level = 1;
  game.score = 0;
  game.highest = -1;
  draw_info();
  this.reset();
}
var draw_info = function() {
    context.clearRect(0, 0, 399, 70);
    context.font = 'bold 14pt Questrial';
    context.fillStyle = '#000000';
    context.fillText('Lives: ', 50, 30);
    draw_lives();
    context.font = 'bold 14pt Questrial';
    context.fillStyle = '#000000';
    context.fillText('Level: ', 250, 30);
    draw_level();
    context.font = 'bold 10pt Questrial';
    context.fillText('Score: ', 25, 70);
    context.fillText('Highscore: ', 200, 70);
    draw_score();
};

var draw_lives = function() {
  context.font = 'bold 15pt Questrial';
  context.fillStyle = '#000000';
  context.fillText(game.lives, 130, 30);

};

var draw_level = function() {
    context.font = 'bold 15pt Questrial';
    context.fillStyle = '#000000';
    context.fillText(game.level, 325, 30);
};

var draw_score = function() {
    context.font = 'bold 10pt Questrial';
    context.fillStyle = '#000000';
    context.fillText(game.score, 150, 70);
    if (window.localStorage['highscore']) {
        highscore = localStorage['highscore'];
    } else highscore = 0;
    context.fillText(highscore, 350, 70);
};

var win = function() {
    game.score += 50;
    game.win = 15;
    game.level++;

    if(game.score >= 1000 && game.extra == 0){
      game.lives++;
      game.extra++;
    }
};

var game_over = function() {
    context.clearRect(0, 0, 399, 70);
    this.reset();

    if (game.score >= highscore) {
        localStorage['highscore'] = game.score;
        highMessage = "You got the High Score of: " +game.score;
        $('.modal-high').text(highMessage);
        modal.style.display = "block";
    }
    else{
      topMessage = "Your score was: " + game.score;
      bottomMessage = "The high score was: " + highscore;
      $('.modal-score').text(topMessage);
      $('.modal-high').text(bottomMessage);
      modal.style.display = "block";
    }

}

// Get the modal
var modal = document.getElementById('myModal');

// When the user clicks anywhere outside of the modal, close it

document.getElementById("restart").onclick = function() {
    resetGame();
    modal.style.display = "none";

}
