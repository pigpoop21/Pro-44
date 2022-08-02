var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Starly, Starly_running, Starly_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  Starly_running =   loadAnimation("starly 1.png");
  Starly_flying = loadAnimation("starly 2.png")
  Starly_collided = loadAnimation("Fainted.png");
  
  groundImage = loadImage("Poke-Feild.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Tree_1.png");
  obstacle2 = loadImage("Tree_1.png");
  obstacle3 = loadImage("Trainer.jpg");
  obstacle4 = loadImage("Trainer.jpg");
  obstacle5 = loadImage("Magnemite.png");
  obstacle6 = loadImage("Magnemite.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 400);
  
  Starly = createSprite(50,180,20,50);
  
  Starly.addAnimation("running", Starly_running);
  Starly.addAnimation("collided", Starly_collided);
  
  
  ground = createSprite(200,0,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,300,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //Starly.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
  console.log(Starly.y)
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    //change the Starly animation
    if (Starly.y<200){
      Starly.addAnimation("flying",Starly_flying)
      Starly.changeAnimation("flying")
      Starly.scale = 0.5
    }

    else if(Starly.y>200){
      Starly.changeAnimation("running", Starly_running);
      Starly.scale = 0.1
    }
    if(keyDown("space") && Starly.y >= 159) {
      Starly.velocityY = -12;
    }
  
    Starly.velocityY = Starly.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    Starly.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(Starly)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    Starly.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the Starly animation
    Starly.changeAnimation("collided",Starly_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = Starly.depth;
    Starly.depth = Starly.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,260,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    var scale = 1
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
      scale = 0.3
              break;
      case 2: obstacle.addImage(obstacle2);
      scale = 0.3
              break;
      case 3: obstacle.addImage(obstacle3);
      scale = 0.3
              break;
      case 4: obstacle.addImage(obstacle4);
      scale = 0.3
              break;
      case 5: obstacle.addImage(obstacle5);
      scale = 0.1
              break;
      case 6: obstacle.addImage(obstacle6);
      scale = 0.1
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = scale;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

