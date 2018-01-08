  'use strict';
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
        player.lives-= 1;
        console.log(player.lives);
        if (player.lives < 0){
          console.log("gameover");
          game_over();
        }
        else{
          draw_info();
          player.reset();
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
  this.sprite = 'images/char-boy.png';
  this.lives = 5;
  this.extra = 0;
  this.level = 1;
  this.score = 0;
  this.highest = -1;
}

Player.prototype.update = function(dt){
  if(this.y < 50){
      win();
      draw_info();
      this.reset();
  }
  draw_info();

};

Player.prototype.newGame = function(){
  this.x = 200;
  this.y = 400;
  this.lives = 5;
  this.extra = 0;
  this.level = 1;
  this.score = 0;
  this.highest = -1;
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

Player.prototype.reset = function() {
  this.x = 200;
  this.y = 400;
  draw_info();
};


var Coin = function(x , y) {
    this.sprite = 'images/Gem-Blue.png';
    this.x = x;
    this.y = y;
}

Coin.prototype.update = function(dt) {
  if(player.x >= this.x - 60 && player.x <= this.x + 60){
      if(player.y >= this.y - 60 && player.y <= this.y + 60){
        player.score += 10;
          this.x = getRandomInt(0, 400);
          this.y = getRandomInt(30, 200);
      }
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
var coin = new Coin(getRandomInt(0, 400), getRandomInt(30, 200) );

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var board = document.getElementById('game');
var context = board.getContext('2d');

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
  context.fillText(player.lives, 130, 30);

};

var draw_level = function() {
    context.font = 'bold 15pt Questrial';
    context.fillStyle = '#000000';
    context.fillText(player.level, 325, 30);
};

var draw_score = function() {
    context.font = 'bold 10pt Questrial';
    context.fillStyle = '#000000';
    context.fillText(player.score, 150, 70);
    if (window.localStorage['highscore']) {
        var highscore = localStorage['highscore'];
    } else highscore = 0;
    context.fillText(highscore, 350, 70);
};

var win = function() {
    player.score += 50;
    player.win = 15;
    player.level++;

    if(player.score >= 1000 && player.extra == 0){
      player.lives++;
      player.extra++;
    }
};

var game_over = function() {
    context.clearRect(0, 0, 399, 70);
    player.reset();

    if (player.score >= highscore) {
        localStorage['highscore'] = player.score;
        highMessage = "You got the High Score of: " +player.score;
        $('.modal-high').text(highMessage);
        modal.style.display = "block";
    }
    else{
      topMessage = "Your score was: " + player.score;
      bottomMessage = "The high score was: " + highscore;
      $('.modal-score').text(topMessage);
      $('.modal-high').text(bottomMessage);
      modal.style.display = "block";
    }

}

var modal = document.getElementById('myModal');

document.getElementById("restart").onclick = function() {
    player.newGame();
    modal.style.display = "none";
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
