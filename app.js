//const app = new PIXI.Application();
const gameContainer = document.querySelector('.game_container');

const ufoList = [];
const app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000000
        });
        gameContainer.appendChild(app.view);
// document.body.appendChild(app.view);
let lifeSprites = [];

let myLife = 3;
let myScore = 0;

window.addEventListener("load", loadLifeSprites);
const scoreDisplayDiv = document.createElement('div');
        scoreDisplayDiv.classList.add('score');
        gameContainer.appendChild(scoreDisplayDiv);



const shotSound = new Howl({
  src: "assets/sounds/small-laser.mp3",
});
const ufoDown = new Howl({
  src: "assets/sounds/ploop.wav",
});
const gameOver = new Howl({
  src: "assets/sounds/power-down.mp3",
});
const lifeOver = new Howl({
  src: "assets/sounds/dead.ogg",
});

const stars = PIXI.Sprite.from("assets/milky-way.jpg");
stars.x = 0;
stars.y = 0;
stars.scale.x = 1.3;
stars.scale.y = 1.3;
app.stage.addChild(stars);

const rocket = PIXI.Sprite.from("assets/rocket.png");
rocket.x = 350;
rocket.y = 520;
rocket.scale.x = 0.05;
rocket.scale.y = 0.05;
app.stage.addChild(rocket);

function loadLifeSprites() {
  const imageUrls = [
    "assets/rocket-life.png",
    "assets/rocket-life.png",
    "assets/rocket-life.png",
  ];
  imageUrls.forEach((url, index) => {
    const oneLife = PIXI.Sprite.from(url);
    oneLife.scale.x = 0.1;
    oneLife.scale.y = 0.1;
    oneLife.y = 20;
    oneLife.x = 20 + index * 50;
    app.stage.addChild(oneLife);
    lifeSprites.push(oneLife);
  });
}

function removeOneLifeSprite() {
    if (lifeSprites.length > 0) {
        const spriteToRemove = lifeSprites.pop();
        app.stage.removeChild(spriteToRemove);
    }
};

// function loadScoreDisplay() {
//     const loadScoreDisplay = document.createElement('div');
//     loadScoreDisplay.classList.add('score');
//     document.body.appendChild(loadScoreDisplay);
//     loadScoreDisplay.innerHTML = myScore.toString();
// }

function updateScoreDisplay() {
    scoreDisplayDiv.innerHTML = `${myScore}`;
}

gameInterval(function () {
  const ufo = PIXI.Sprite.from("assets/ufo" + random(1, 2) + ".png");
  ufo.x = random(0, 700);
  ufo.y = -25;
  ufo.scale.x = 0.1;
  ufo.scale.y = 0.1;
  app.stage.addChild(ufo);
  ufoList.push(ufo);
  flyDown(ufo, random(1, 3));

  waitForCollision(ufo, rocket).then(function () {
    myLife -= 1;
    lifeOver.play();
    rocketHitAnimation();
    removeOneLifeSprite();
    if (myLife <= 0) {
      app.stage.removeChild(rocket);
      stopGame();
      gameOver.play();
    }
  });
}, 1000);

function leftKeyPressed() {
  rocket.x = rocket.x - 5;
}

function rightKeyPressed() {
  rocket.x = rocket.x + 5;
}

function spaceKeyPressed() {
  const bullet = PIXI.Sprite.from("assets/bullet.png");
  bullet.x = rocket.x + 13;
  bullet.y = 500;
  bullet.scale.x = 0.02;
  bullet.scale.y = 0.02;
  flyUp(bullet);
  app.stage.addChild(bullet);
  shotSound.play();

  waitForCollision(bullet, ufoList).then(function ([bullet, ufo]) {
    ufoDown.play();
    app.stage.removeChild(bullet);
    app.stage.removeChild(ufo);
    app.stage.removeChild(stars);
    app.renderer.background.color = "#fb5f58";
    setTimeout(() => {
      app.stage.addChildAt(stars, 0);
    }, 250);
    if (ufo.y >= 2) {
      myScore += 10;
    } else {
      myScore += 1;
    }
    updateScoreDisplay();
  });
}

function rocketHitAnimation() {
  app.stage.removeChild(rocket);
  setTimeout(() => {
    app.stage.addChild(rocket);
  }, 100);
  setTimeout(() => {
    app.stage.removeChild(rocket);
  }, 200);
  setTimeout(() => {
    app.stage.addChild(rocket);
  }, 300);
  setTimeout(() => {
    app.stage.removeChild(rocket);
  }, 400);
  setTimeout(() => {
    app.stage.addChild(rocket);
  }, 500);
  setTimeout(() => {
    app.stage.removeChild(rocket);
  }, 600);
  setTimeout(() => {
    app.stage.addChild(rocket);
  }, 700);
}
