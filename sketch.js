let userX;
let userY;
let user;
let userW = 60;
let xSpeed = 0;
let ySpeed = 0;
let rockObj;
let rock;
let rocks = [];
let health = 100;
let colDmg = 10;
let score = 0;
let back1;
let back2;
let backW = 512;
let backL = 512;
let back1y = 0;
let back2y = -512;
let kills = 0;
let highscore;
let miss = 0;
let state = 0; //0 = menu 1 = game 2 = game over
let shot;
let shotTrig = false;
let shotObj;
let ufo;
let ufoObj;
let level;
let missMax;
let fail;
let ufoHit;
let fire;
let rockHit;
let rockDest;
let setGame = false;
let pauseGame = 1;
let acc = 0.2;

const changeAcc = (el) => {
  acc = float( el.value );
}

const hide = () =>{
    var rangeBar = document.getElementById("rangeBar");
    rangeBar.style.display = "inline";
    //parent of rangeBar should be center
    document.getElementById("center").appendChild(rangeBar);
    //rangeBar.parentNode.id = "center";
    document.getElementById("canvas1").style.display = "flex";
    document.getElementById("play").style.display = "none";
    document.getElementById("pause").style.display = "inline";
}

const pause = () =>{
  pauseGame *= -1;
  if (pauseGame < 0) {
    noLoop();
    document.getElementById("pause").style.display = "none";
    document.getElementById("resume").style.display = "inline";
  } else {
    document.getElementById("pause").style.display = "inline";
    document.getElementById("resume").style.display = "none";
    loop();
  }
}

function preload() {
    soundFormats('wav', 'mp3');
    back1 = loadImage("assets/space.png");
    back2 = loadImage("assets/space.png");
    shot = loadImage("assets/shot.png");
    user = loadImage("assets/ship.png");
    rock = loadImage("assets/rock.png");
    ufo = loadImage("assets/ufo.png");
    fail= loadSound("assets/game_over");
    ufoHit = loadSound("assets/ship_caught");
    fire = loadSound("assets/laser");
    rockDest = loadSound("assets/rockhit");
    rockHit = loadSound("assets/rock-destroy");
}

function setup() {
    var canvas = createCanvas(512, 512);
    canvas.id("canvas1");
    canvas.parent("#center");
  }
  
  function draw() {

    if (state == 0) {
        menu();
    } else if (state == 1) {
        game();
    } else if (state == 2) {
        gameOver();
    }
  }

  function menu() {
    setGame = false;
    //background
    image(back1, 0, back1y, backW, backL);
    image(back2, 0, back2y, backW, backL);
    
    back1y += 2;
    back2y += 2;
    
    if (back1y > 512) {
      back1y = back2y - 512;
    }
    if (back2y > 512) {
      back2y = back1y - 512;
    }

    fill(255);
    textSize(32);
    // select level
    textAlign(CENTER);
    text("Select Difficulty Level", width/2, height/2 - 50);

    fill(0, 0);
    rectMode(CENTER);
    rect(width/2, height/2, 125, 50);
    rect(width/2, height/2 + 50, 125, 50);
    rect(width/2, height/2 + 100, 125, 50);

    fill(255);
    text("Easy", width/2, height/2 + 10);
    text("Medium", width/2, height/2 + 60);
    text("Hard", width/2, height/2 + 110);
    textAlign(LEFT);

    if (mouseX > width/2 - 65 && mouseX < width/2 + 65 && mouseY > height/2 - 25 && mouseY < height/2 + 25) {
      level = 0;
      stroke(255);
      fill(0, 0);
      rect(width/2, height/2, 125, 50);
      noStroke();
      if (mouseIsPressed) {
        state = 1;
      }
    }
    if (mouseX > width/2 - 65 && mouseX < width/2 + 65 && mouseY > height/2 + 25 && mouseY < height/2 + 75) {
      level = 1;
      stroke(255);
      fill(0, 0);
      rect(width/2, height/2 + 50, 125, 50);
      noStroke();
      if (mouseIsPressed) {
        state = 1;
      }
    }

    if (mouseX > width/2 - 65 && mouseX < width/2 + 65 && mouseY > height/2 + 75 && mouseY < height/2 + 125) {
      level = 2;
      stroke(255);
      fill(0, 0);
      rect(width/2, height/2 + 100, 125, 50);
      noStroke();
      if (mouseIsPressed) {
        state = 1;
      }
    }
  }

  function setVals() {

    userX = width / 2;
    userY = height *2/3 + height*1/6;
    xSpeed = 0;
    ySpeed = 0;
    health = 100;

    highscore = getItem("highscore");
    if (highscore == null) {
      highscore = 0;
    }

    // 1 rock easy, 2 rocks medium, 3 rocks hard

    //removing rocks
    for (let i = 0; i < rocks.length; i++) {
      rocks.splice(i);
    }

    for (let i = 0; i <= level; i++) {
      rockObj = { 
        x: random(width/6, width* 5/6),
        y: 0, 
        w: 40, 
        speed: 3 
      };
      //rockObj.x = random(width/6, width* 5/6);
      rocks.push(rockObj);
    }
    //rocks.push(rockObj);
    
    shotObj = {
      x: userX - 5,
      y: userY - userW/2,
      w: 10,
      h: 15,
      speed: 5
    };

    ufoObj = {
      x: 0,
      y: random(50, height/2),
      w: 40,
      h: 40,
      speed: level + 1
    };

    let rand = random(-1, 1);
    if (rand > 0) {
      ufoObj.x = width - ufoObj.w/2;
      ufoObj.speed = -1;
    }
    else {
      ufoObj.x = ufoObj.w/2;
      ufoObj.speed = 1;
    }

    missMax = 3 - level;
    // noCursor();
    setGame = true;
  }

  function game() {

    if (setGame == false) {
      setVals();
    }

    //background
    image(back1, 0, back1y, backW, backL);
    image(back2, 0, back2y, backW, backL);
    
    back1y += 2;
    back2y += 2;
    
    if (back1y > 512) {
      back1y = back2y - 512;
    }
    if (back2y > 512) {
      back2y = back1y - 512;
    }

    //scores
    fill(255);
    //textSize normal
    textSize(14);
    textAlign(LEFT);
    text("Score: " + kills + " Highscore: " + highscore + " Miss: " + miss, 20, 30);

    //user
    fill(100);
    imageMode(CENTER);
    image(user, userX, userY, userW, userW);
    imageMode(CORNER);

    //user movement
    if (keyIsDown(65)) {
      xSpeed -= acc;
    }
    
    if (keyIsDown(68)) {
      xSpeed += acc;
    }

    if (keyIsDown(87)) {
      ySpeed -= acc;
    }

    if (keyIsDown(83)) {
      ySpeed += acc;
    }

    //borders - ASSIGN HEALTH BAR X TO BORDERS
    if (userX < userW/2 + 10) {
      userX = userW/2 + 10;
      xSpeed = 0;
    } 
    if  (userX > width - userW/2 - 10)
    {
      userX = width - userW/2 - 10;
      xSpeed = 0;
    }

    if (userY < height*2/3 + userW/2 + 3)
    {
      userY = height*2/3 + userW/2 + 3;
      ySpeed = 0;
    }
    
    if (userY > height - (userW/2 + 3))
    {
      userY = height - (userW/2 + 3);
      ySpeed = 0;
    }

    //user speed update
    userX += xSpeed;
    userY += ySpeed;

    //inertia
    xSpeed *= 0.96;
    ySpeed *= 0.96;

    //rock - number of rocks based on difficulty level chosen

    for (let i = 0; i < rocks.length; i++) {
      fill(255);
      imageMode(CENTER);
      image(rock, rocks[i].x, rocks[i].y, rocks[i].w, rocks[i].w);
      imageMode(CORNER);
      //circle(rocks[i].x, rocks[i].y, rocks[i].w);
      rocks[i].y += rocks[i].speed;

      //boundaries
      if (rocks[i].y > height) {
        rocks[i].x = random(width/6, width* 5/6);
        rocks[i].y = 0;
      }

      //collision
      if (dist(userX, userY, rocks[i].x, rocks[i].y) < userW/2 + rocks[i].w/2) {
        rockHit.play();
        health -= colDmg;
        rocks[i].x = random(width/6, width* 5/6);
        rocks[i].y = 0;
      }

      //laser hits rock
      if (shotTrig == true) {
        if (dist(shotObj.x, shotObj.y, rocks[i].x, rocks[i].y) < shotObj.w/2 + rocks[i].w/2) {
          rockDest.play();
          rocks[i].x = random(width/6, width* 5/6);
          rocks[i].y = 0;
          // kills += 1;
          shotTrig = false;
        }
      }

    }

    //health bar
    rectMode(CORNER);
    stroke(255);
    fill(0);
    rect(userX - 20, userY + 15, 40, 5);
    fill(255, 0, 0);
    rect(userX - 20, userY + 15, health*2/5, 5);
    stroke(0);

    if (health <= 0) {
      health = 0;
      state = 2;
      fail.play();
      // noLoop();
    }

    //shooting

    if (shotTrig == false) {
      shotObj.x = userX - 5;
      shotObj.y = userY - userW/2;
    }

    if (keyIsDown(32) && shotTrig == false) {
      shotTrig = true;
      fire.play();
    }

    if (shotTrig == true) {
      image(shot, shotObj.x, shotObj.y, shotObj.w, shotObj.h);
        if (shotObj.y < 0) {
          shotTrig = false;
        }
        else {
          shotObj.y -= shotObj.speed;
        }
    }


    //ufo

    //noise values for y movement
    let noiseValue = noise(frameCount * 0.01);
    let scaledNoise = noiseValue * 100;
    // ufoObj.y += scaledNoise;

    imageMode(CENTER);
    image(ufo, ufoObj.x, ufoObj.y + scaledNoise, ufoObj.w, ufoObj.h);
    imageMode(CORNER);
    ufoObj.x += ufoObj.speed;

    if (ufoObj.x < ufoObj.w/2 || ufoObj.x > width - ufoObj.w/2 || ufoObj.y < ufoObj.h/2) {
      let rand = random(-1, 1);
      if (rand > 0) {
        ufoObj.x = width - ufoObj.w/2;
        ufoObj.speed = -1;
      }
      else {
        ufoObj.x = ufoObj.w/2;
        ufoObj.speed = 1;
      }
      ufoObj.y = random(50, height/2);
      miss += 1;
    }

    if (miss >= missMax) {
      miss = 0;
      state = 2;
      fail.play();
    }

    //ufo collision with shot
    if (shotTrig == true) {
      if (dist(shotObj.x, shotObj.y - 20, ufoObj.x, ufoObj.y) < shotObj.w/2 + ufoObj.w/2) {
        ufoHit.play();
        let rand = random(-1, 1);
        if (rand > 0) {
          ufoObj.x = width - ufoObj.w/2;
          ufoObj.speed = -1;
        }
        else {
          ufoObj.x = ufoObj.w/2;
          ufoObj.speed = 1;
        }
        ufoObj.y = random(50, height/2);
        kills += 1;
        shotTrig = false;
      }
    }

  }

  function gameOver() {

    //background
    image(back1, 0, back1y, backW, backL);
    image(back2, 0, back2y, backW, backL);
    
    back1y += 2;
    back2y += 2;
    
    if (back1y > 512) {
      back1y = back2y - 512;
    }
    if (back2y > 512) {
      back2y = back1y - 512;
    }

    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Game Over", width/2, height/2 - 50);
    text("Score: " + kills, width/2, height/2);
    text("Highscore: " + highscore, width/2, height/2 + 50);
    textAlign(LEFT);
    
    if (kills > highscore) {
      highscore = kills;
      storeItem("highscore", highscore);
    }

    //restart button
    fill(0, 0);
    rectMode(CENTER);
    rect(width/2, height/2 + 100, 100, 50);
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Restart", width/2, height/2 + 105);

    if (mouseX > width/2 - 50 && mouseX < width/2 + 50 && mouseY > height/2 + 100 - 25 && mouseY < height/2 + 100 + 25) {
      fill(0, 0);
      stroke(255);
      rect(width/2, height/2 + 100, 100, 50);
      noStroke();
      fill(255);
      text("Restart", width/2, height/2 + 105);
      if (mouseIsPressed) {
        state = 1;
        kills = 0;
        health = 100;
        miss = 0;
        setGame = false;
        userX = width / 2;
        userY = height *2/3 + height*1/6;
        xSpeed = 0;
        ySpeed = 0;
      }
    }

    //menu button
    fill(0, 0);
    rectMode(CENTER);
    rect(width/2, height/2 + 150, 100, 50);
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Menu", width/2, height/2 + 155);

    if (mouseX > width/2 - 50 && mouseX < width/2 + 50 && mouseY > height/2 + 150 - 25 && mouseY < height/2 + 150 + 25) {
      fill(0, 0);
      stroke(255);
      rect(width/2, height/2 + 150, 100, 50);
      noStroke();
      fill(255);
      text("Menu", width/2, height/2 + 155);
      if (mouseIsPressed) {
        state = 0;
        setGame = false;
      }
    }
  }
  