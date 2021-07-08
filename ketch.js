var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,190,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /3;
  trex.collide(ground);
  ground.scale = 2;
  //ground.velocityX = -(6 + score/100);
  
  gameOver = createSprite(displayWidth/2,80,20,20);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,140, 20, 20);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(trex.x,190,400,10);
  invisibleGround.visible = false;
  invisibleGround.collide(ground);

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(180);
  text("Score: "+ score,  camera.position.x-200,50);

  camera.position.x = trex.x + 900;
  //camera.position.y = trex.y;
  trex.collide(invisibleGround);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.x = trex.x + 2;
    gameOver.x = gameOver.x + 2;
    restart.x = restart.x +2;
    trex.velocityY = trex.velocityY + 0.8
    
  
    /*if (ground.x < 0){
      ground.x = ground.width/2;
    }*/

    ground.velocityX = 2;
    invisibleGround.velocityX = 2;
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }

    invisibleGround.velocityX = 2;

  }
  else if (gameState === END) {
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    ground.velocityX = 0;
    trex.changeAnimation("collided", trex_collided);
    trex.velocityY = 0;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    restart.visible = true;
    gameOver.visible = true;
    invisibleGround.velocityX = 0;
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (camera.position.x % 150 === 0) {
    var cloud = createSprite(camera.position.x + 950, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 400;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
    if (camera.position.x % 150 === 0) {
        var obstacle = createSprite(camera.position.x + 950, 165, 10, 40);
        obstacle.velocityX = -4;    

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
   

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}