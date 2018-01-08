var Enemy = function(y, speed) {
  this.x = 0;
  this.y = y;
  this.speed = speed;
  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
  if (this.x > 600){
    this.x = -100;
  }
  else{
    this.x += this.speed * dt;
  }
  if(player.x >= this.x - 60 && player.x <= this.x + 60){
      if(player.y >= this.y - 60 && player.y <= this.y + 60){
        game.lives-= 1;
        if (game.lives < 0){
          console.log("gameover");
          game_over();
        }
        else{
          draw_info();
          reset();
        }
      }
    }
};
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function(x, y, speed) {
  this.x = 200;
  this.y = 400;
  this.speed = speed;
  this.sprite = this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(dt){
  if(this.y < 50){
      win();
      draw_info();
      reset();
  }
  draw_info();

};

Player.prototype.handleInput = function(key){
  switch(key) {
    case 'up':
      if (this.y > 0){
        this.y -= 50;
      }
      break;
    case 'down':
      if (this.y < 600 && this.y != 400) {
        this.y += 50;
      }
      break;
    case 'left':
      if (this.x > 0 && this.x > 0) {
        this.x -= 50;
      }
      break;
    case 'right':
      if (this.x < 600 && this.x !=400){
        this.x += 50;
      }
  }
};

Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var reset = function() {
  player.x = 200;
  player.y = 400;
};


var Coin = function(x , y) {
    this.sprite = 'images/Gem-Blue.png';
    this.x = x;
    this.y = y;
}

Coin.prototype.update = function(dt) {
  if(player.x >= this.x - 60 && player.x <= this.x + 60){
      if(player.y >= this.y - 60 && player.y <= this.y + 60){
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

Coin.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var enemy1 = new Enemy(70, (Math.random() * 200));
var enemy2 = new Enemy(125, (Math.random() * 200));
var enemy3 = new Enemy(185, (Math.random() * 200));
var enemy4 = new Enemy(225, (Math.random() * 200));
var allEnemies = [enemy1, enemy2, enemy3, enemy4];
var player = new Player();
var coin = new Coin();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

board = document.getElementById('game');
var context = board.getContext('2d');

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
  reset();
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


var game_over = function() {
    context.clearRect(0, 0, 399, 70);
    reset();

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

var modal = document.getElementById('myModal');

document.getElementById("restart").onclick = function() {
    resetGame();
    modal.style.display = "none";
}
