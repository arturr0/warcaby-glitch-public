var socket = io.connect('https://luminous-second-provelone.glitch.me');

let Board = [];
let Letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
let Numbers = []
let freeBoard;
let Kills = [];



let killsOpt = [];

function Area(rectCenter, rectCenterY, row, column, isBlack, free, letter, number) {
  this.rectCenter = rectCenter;
  this.rectCenterY = rectCenterY;
  this.row = row;
  this.column = column;
  this.isBlack = isBlack;
  this.free = free;
  this.letter = letter;
  this.number = number;
}

let areaCenter = 64;
let row = 0;
let column = 0;

//let targetPos;
let movingPawn = null;
let pawnCompletedMove = false;
let isPawnMoving = false;

let RedMove = false;
let GreenMove = false;

var Player;

let check = false;
let bothCompleted = false;

let killer = "";

let Pawns = [];

let current;

let Greenturn = false;
let turn;

let killersOpt = [];
let killersOptMode = false;
let killedOpt = [];
let killedOptMode = false;

let message;
// let pawnLetter;
// let pawnNumber;

function Pawn(rectCenter, rectCenterY, row, column, isRed, queen, live, killer, killed, letter, number) {
  this.rectCenter = rectCenter;
  this.rectCenterY = rectCenterY;
  this.row = row;
  this.column = column;
  this.isRed = isRed;
  this.queen = queen;
  this.live = true;
  this.killer = false;
  this.killed = false;
  this.letter = letter;
  this.number = number;
  this.pos = createVector(rectCenter, rectCenterY);
  this.targetPos = null;
  this.update = function() {
    if (this.targetPos) {
      let vel = p5.Vector.sub(this.targetPos, this.pos);
      if (vel.mag() > 1 && this.live) {
        vel.setMag(1);
        this.pos.add(vel);
        pawnCompletedMove = false;
      } else {
        this.pos = this.targetPos.copy();
        this.targetPos = null;
        this.rectCenter = this.pos.x;
        this.rectCenterY = this.pos.y;
        pawnCompletedMove = true; // Mark the move as completed
      }
    }
  };

  this.show = function() {
    fill(this.isRed ? 'red' : 'green');
    if (this.queen) {
      strokeWeight(10); // grubość obrysu dla królowej
      stroke(255, 255, 255); // kolor obrysu (czerwony)
    }
    else if (((Player == 1 && !Greenturn) || (Player == 2 && Greenturn)) && this.killer) {
    strokeWeight(10); // grubość obrysu dla królowej
    stroke(0, 0, 255); // kolor obrysu (czerwony)
    }
    else if (((Player == 1 && !Greenturn) || (Player == 2 && Greenturn)) && this.killed) {
        strokeWeight(10); // grubość obrysu dla królowej
        stroke(128, 128, 128); // kolor obrysu (czerwony)
    } else {
      noStroke(); // brak obrysu dla zwykłych pionków
    }
    circle(this.pos.x, this.pos.y, 50);
  };
}

let X;
let Y;
let pawnSelected = false;
let pawnPlayed;


socket.on('player', function(PLAYER) {
  Player = PLAYER;
  document.dispatchEvent(new Event('socketConnected'));

  ////////////////////////////////////////////////////////////////////////////////////////////////console.log(Player);
});

socket.on('update message kill', function(MES, PLAYED, LETTER, NUMBER, LETTER_LOOSER, NUMBER_LOOSER) {
  const newSpan = document.createElement('span');
  newSpan.className = 'message_kill';
  newSpan.textContent = `PAWN ${LETTER}${NUMBER} CAPTURES ON ${LETTER_LOOSER}${NUMBER_LOOSER}`;

  if (PLAYED) {
    newSpan.style.color = 'red';
  } else {
    newSpan.style.color = 'green';
  }

  document.getElementById('history').appendChild(newSpan);
  jQuery("#history").scrollTop(jQuery("#history")[0].scrollHeight);
});

socket.on('update message move', function(MES, PLAYED, LETTER, NUMBER, LETTER_BOARD, NUMBER_BOARD) {
  const newSpan = document.createElement('span');
  newSpan.className = 'message_move';
  newSpan.textContent = `PAWN ${LETTER}${NUMBER} TO ${LETTER_BOARD}${NUMBER_BOARD}`;

  if (PLAYED) {
    newSpan.style.color = 'red';
  } else {
    newSpan.style.color = 'green';
  }

  document.getElementById('history').appendChild(newSpan);
  jQuery("#history").scrollTop(jQuery("#history")[0].scrollHeight);
});


socket.on('both completed', function() {
  bothCompleted = true;
  ////////////////console.log('completed');
});

socket.on('update killer mode', function(KILLER_MODE, PAWNS) {
for (let i = 0; i < PAWNS.length; i++) {
    
    Pawns[i].killer = PAWNS[i].killer;
    
    }
  
  killersOptMode = KILLER_MODE;
  //killConditions = [];
  for (let i = 0; i < killConditions.length; i++)
    for (let j = 0; j < killersOpt.length; j++)
      if (killConditions[i][0] == killersOpt[j][0] && killConditions[i][1] == killersOpt[j][1]) {
        ////////////////////////console.log("delete");
        killConditions.splice(i, 1);
      }
  killersOpt = [];
  ////////////////////////////////////////////////////////////////////////////////////////////////console.log(Player);
});

socket.on('animate', function(data, TURN) {
  let newPos = createVector(data.x, data.y);
  let targetPawn = Pawns.find(pawn => pawn.rectCenter === data.oldX && pawn.rectCenterY === data.oldY && pawn.live);
  if (targetPawn) {
    //////////////////////////////////////////////////////////////////////////////////console.log("animate");
    targetPawn.targetPos = newPos;
    movingPawn = targetPawn;
  }
});

socket.on('new state', function(BOARD, PAWNS, TURN, PLAY, CHECK, KILL) {
  for (let i = 0; i < BOARD.length; i++) {
    Board[i].free = BOARD[i].free;
    Board[i].row = BOARD[i].row;
    Board[i].column = BOARD[i].column;
  }
  for (let i = 0; i < PAWNS.length; i++) {
    Pawns[i].row = PAWNS[i].row;
    Pawns[i].column = PAWNS[i].column;
    Pawns[i].letter = PAWNS[i].letter;
    Pawns[i].number = PAWNS[i].number;
    Pawns[i].live = PAWNS[i].live;
    Pawns[i].isRed = PAWNS[i].isRed;
    Pawns[i].killer = PAWNS[i].killer;
    
  }
  //kill();
  Greenturn = TURN;
  
  movingPawn = Pawns[PLAY];
  killConditions = KILL;
  //if (Pawns[PLAY].isBlack == Greenturn) killConditions = [];
  //////////////////////////////////////////////////////////////////////////////////////console.log(PLAY);
  //////////////////////////////////////////////////////////////////////////////////////console.log(movingPawn);
  
  
  
});

socket.on('new kill state', function(BOARD, PAWNS) {
  for (let i = 0; i < BOARD.length; i++) {
    Board[i].free = BOARD[i].free;
    Board[i].row = BOARD[i].row;
    Board[i].column = BOARD[i].column;
  }
  for (let i = 0; i < PAWNS.length; i++) {
    Pawns[i].row = PAWNS[i].row;
    Pawns[i].column = Pawns[i].column;
    Pawns[i].live = PAWNS[i].live;
    Pawns[i].isRed = PAWNS[i].isRed;
  }
  //Greenturn =! Greenturn;

  ////////////////////////////////////////////////////////////////////////////////////////////////console.log("kill");
  
  //kill();
});

function setup() {
  const myCanvas = createCanvas(576, 576);
  myCanvas.parent('game');
  turn = select('#turn');
  let PlayerInfo = select('#player');
  
  if (Player == 2) {document.getElementById("player").style.color = "green"; PlayerInfo.value("GREEN");}
  else if (Player == 1) {document.getElementById("player").style.color = "red"; PlayerInfo.value("RED");}
  killer = select('#kill');
  rectMode(CENTER);
  background(220);

  let isBlack = true;
  for (let i = 0; i < 8; i++)
    Numbers.push(i + 1);

  for (let i = 0; i < 8; i++) {
    row++;
    column = 0;
    isBlack = !isBlack;

    for (let j = 0; j < 8; j++) {
      let rectCenter = (column * 64 + 32) + 32;
      column++;
      let area = new Area(rectCenter, (row * 64 - 32) + 32, row, column, isBlack, true, Letters[j], Numbers[i]);
      Board.push(area);
      
      isBlack = !isBlack;
    }
  }
  //f(rectCenter, rectCenterY, row, column, isRed, queen, live, killer, killed, letter, number)
  for (let j = 0; j < Board.length; j++) {
    if (Board[j].isBlack && Board[j].row < 4) {
      Board[j].free = false;
      let pawn = new Pawn(Board[j].rectCenter, (Board[j].row * 64 - 32) + 32, Board[j].row, Board[j].column, true, false, true, false, false, Board[j].letter, Board[j].number);
      Pawns.push(pawn);
    } else if (Board[j].isBlack && Board[j].row > 5) {
      Board[j].free = false;
      let pawn = new Pawn(Board[j].rectCenter, (Board[j].row * 64 - 32) + 32, Board[j].row, Board[j].column, false, false, true, false, false, Board[j].letter, Board[j].number);
      Pawns.push(pawn);
    }
  }
}

function draw() {
  turn.value(Greenturn);
  let PlayerInfo = select('#player');
  
  
  if (Player == 2) {document.getElementById("player").style.color = "green"; PlayerInfo.value("PLAYER GREEN");}
  else if (Player == 1) {document.getElementById("player").style.color = "red"; PlayerInfo.value("PLAYER RED");}
  if (Greenturn) document.getElementById("turn").style.color = "green";
  else document.getElementById("turn").style.color = "red";
  background(220);

  for (let i = 0; i < Board.length; i++) {
    let color = Board[i].isBlack ? 0 : 255;
    noStroke();
    fill(color);
    rect(Board[i].rectCenter, Board[i].rectCenterY, 64, 64);
  }

  for (let i = 0; i < Pawns.length; i++) {
    if (Pawns[i].live) {
      //Pawns[i].update();
      Pawns[i].show();
      fill(0); // Set the fill color for the text
      noStroke();
      textSize(32); // Set the size of the text
      textAlign(CENTER, CENTER); // Align the text to the center both horizontally and vertically
      text(i, Pawns[i].rectCenter, Pawns[i].rectCenterY);
    }
  }

  for (let i = 0; i < Letters.length; i++) {
    
      
      fill(0); // Set the fill color for the text
      noStroke();
      textSize(20); // Set the size of the text
      textAlign(CENTER, CENTER); // Align the text to the center both horizontally and vertically
      text(Letters[i], 64 + i*64, 16);
      text(Letters[i], 64 + i*64, 560);
    
  }
  for (let i = 0; i < Numbers.length; i++) {
    
      
    fill(0); // Set the fill color for the text
    noStroke();
    textSize(20); // Set the size of the text
    textAlign(CENTER, CENTER); // Align the text to the center both horizontally and vertically
    text(Numbers[i], 16, 64 + i*64);
    text(Numbers[i], 560, 64 + i*64);
  
}

  if (movingPawn) {
    
    movingPawn.update();
    movingPawn.show();
    
  }
  //kill();
   ////////////////////////////////////////////////////////////////////////////////////////console.log("OUT " + pawnCompletedMove);
   console.log(killersOptMode);
  //  if (pawnCompletedMove && !killersOptMode) {
  //   kill();
  //   killOpt();
  //   stepKill();
    
  //   }
   if (bothCompleted) {
    kill();
    killOpt();
    stepKill();
    bothCompleted = false; 
   }
   if (pawnCompletedMove) {
    //////////////////console.log('check');
    // kill();
    // killOpt();
    // stepKill();
   
    movingPawn = null; // Reset movingPawn after completing the move
    pawnCompletedMove = false;
    
    //Greenturn = !Greenturn;
    //////////////////////////////console.log(killConditions);
    
    
    
    isPawnMoving = false;
    // socket.emit('state', Board, Pawns, Greenturn, check, current); // Send the move to the server
    // socket.emit('move', { x: targetPos.x, y: targetPos.y, oldX: movingPawnOldPos.x, oldY: movingPawnOldPos.y });
    socket.emit('complete', Player);
    return;
  }
  

  ////////////////////////////////////////////////////////////////////////////////////////////////console.log(kill());
  
  for (let i = 0; i < Board.length; i++)
    if (Board[i].free && Board[i].isBlack) {
      strokeWeight(1);
      stroke(255);
      noFill();
      rect(Board[i].rectCenter, Board[i].rectCenterY, 55, 55);
    }
}

function mouseClicked() {
  X = mouseX;
  Y = mouseY;

  // Check if a pawn is clicked
  for (let i = 0; i < Pawns.length; i++) {
    let p = Pawns[i];
    if (!killersOptMode && ((p.isRed && !Greenturn && Player == 1) || (!p.isRed && Greenturn  && Player == 2)) && p.live &&
        X > p.rectCenter - 32 && X < p.rectCenter + 32 && Y > p.rectCenterY - 32 && Y < p.rectCenterY + 32) {
      pawnSelected = true;
      pawnPlayed = i;
      return;
    }
  }

  for (let k = 0; k < Board.length; k++) {
    if (Pawns[pawnPlayed].row == Board[k].row && Pawns[pawnPlayed].column == Board[k].column && Pawns[pawnPlayed].live) {
      freeBoard = k;
    }
  }

  // Check if a valid move is made
  if (pawnSelected) {
    
    check = true;
    
    for (let j = 0; j < Board.length; j++) {
      if (Board[j].isBlack && X > Board[j].rectCenter - 32 && X < Board[j].rectCenter + 32 &&
          Y > Board[j].rectCenterY - 32 && Y < Board[j].rectCenterY + 32 &&
          Board[j].isBlack && Board[j].free &&
          ((Pawns[pawnPlayed].isRed && Pawns[pawnPlayed].row - Board[j].row == -1 &&
            (Pawns[pawnPlayed].column - Board[j].column == 1 || Pawns[pawnPlayed].column - Board[j].column == -1)) ||
           (!Pawns[pawnPlayed].isRed && Pawns[pawnPlayed].row - Board[j].row == 1 &&
            (Pawns[pawnPlayed].column - Board[j].column == 1 || Pawns[pawnPlayed].column - Board[j].column == -1)))) {
              Greenturn = !Greenturn;
        let pawnLetter = Pawns[pawnPlayed].letter;
        let pawnNumber = Pawns[pawnPlayed].number;
        let boardLetter = Board[j].letter;
        let boardNumber = Board[j].number;
        let played = Pawns[pawnPlayed].isRed;
        message = "move";
        socket.emit('message move', message, played, pawnLetter, pawnNumber, boardLetter, boardNumber);
        Board[freeBoard].free = true;
        let targetPos = createVector(Board[j].rectCenter, Board[j].rectCenterY);
        let movingPawnOldPos = { x: Pawns[pawnPlayed].rectCenter, y: Pawns[pawnPlayed].rectCenterY };
        Pawns[pawnPlayed].targetPos = targetPos;
        movingPawn = Pawns[pawnPlayed];
        Pawns[pawnPlayed].row = Board[j].row;
        Pawns[pawnPlayed].column = Board[j].column;
        Pawns[pawnPlayed].letter = Board[j].letter;
        Pawns[pawnPlayed].number = Board[j].number;
        Board[j].free = false;
        
        // check = true;
        current = pawnPlayed;
        socket.emit('state', Board, Pawns, Greenturn, check, current, killConditions); // Send the move to the server
        socket.emit('move', { x: targetPos.x, y: targetPos.y, oldX: movingPawnOldPos.x, oldY: movingPawnOldPos.y }); // Send the move to the server
        pawnSelected = false;
        isPawnMoving = true;
        //Greenturn = !Greenturn;
      }
    }
  }
  // killersOpt.push(killConditions[i]);
  // killersOpt.push(killConditions[i + 1]);
  if (killersOptMode) {
    for (let i = 0; i < killersOpt.length; i++) {
      ////////////////////////////////////////////////////////////console.log(killersOpt);
      
      //let pawnSelected;
      
      // Pawns[killersOpt[0][0]].killer = false;
      // Pawns[killersOpt[1][0]].killer = false;
      //////////////////////////////////////////////////////////console.log(Pawns[killersOpt[0][0]]);
      //////////////////////////////////////////////////////////console.log(Pawns[killersOpt[1][0]]);
      //socket.emit('state', Board, Pawns, Greenturn, check, current);
      if (((killersOpt[i][3] && !Greenturn && Player == 1) || (!killersOpt[i][3] && Greenturn  && Player == 2)) &&
          X > killersOpt[i][5] - 32 && X < killersOpt[i][5] + 32 && Y > killersOpt[i][6] - 32 && Y < killersOpt[i][6] + 32) {
            //////////console.log("click");
            for (let j = 0; j < killersOpt.length; j++)
              Pawns[killersOpt[j][0]].killer = false;
            ////////////////////////////////////////////////////////////////console.log(killersOpt[i]);
            pawnSelected = killersOpt[i][0];
            //////////////////////////////console.log(pawnSelected);
            for (let j = 0; j < killConditions.length; j++)
              if (killConditions[j][0] != pawnSelected) {
                //////////////////////////////console.log(killConditions[j][0]);
                killConditions.splice(j,1); 
                
                ////////////////////////////////////////////////////////////////console.log(killersOpt[i][0]);
              }
            ////////////////////////////////console.log(killConditions);
            killersOptMode = false;
            killersOpt = [];
            //kill();
            killOpt();
            stepKill();
            socket.emit('killer mode', killersOptMode, Pawns);
        }
        
        }
        
  
        //return;
      
    }
  
  }
let playerHasKill = false;
let multipleKillCond = false;
//let multipleKillCondGreen = false;
let previousPlayer = null;
let killCntr = 0;
let killConditions = [];
function kill() {
    //killConditions = [];
    
    
    //if (isPawnMoving) return; // Prevent further actions while a pawn is moving
    //////////////////////////////////////////////////////////////////////////////////////////console.log("outside kill"); // Moved outside the loop
    //let i, j, k
    
    for (let j = 0; j < Pawns.length; j++) {
      for (let k = 0; k < Pawns.length; k++) {
        if (Pawns[j].isRed != Pawns[k].isRed && Pawns[j].live && Pawns[k].live &&
            ( (((Greenturn == false && Pawns[j].isRed == false) || (Greenturn == true && Pawns[j].isRed == true)))) &&
            ((Pawns[k].row - Pawns[j].row == 1 && Pawns[k].column - Pawns[j].column == 1))) {
          for (let i = 0; i < Board.length; i++) {
            if (Pawns[j].row - Board[i].row == 1 && Pawns[j].column - Board[i].column == 1 && Board[i].free) {
              killConditions.push([k, j, i, Pawns[k].isRed, Greenturn, Pawns[k].rectCenter, Pawns[k].rectCenterY]);
              ////////console.log(`kill 1, killer ${k}, killed ${j}`);
              //killSwitch(k, j, i, Pawns[k].isRed);
              playerHasKill = true;
              //break;
              
               
            }
          }
        }
        
        //break;
      }
      
      
  }
  for (let j = 0; j < Pawns.length; j++) {
    for (let k = 0; k < Pawns.length; k++) {
      if (Pawns[j].isRed != Pawns[k].isRed && Pawns[j].live && Pawns[k].live &&
          ( (((Greenturn == false && Pawns[j].isRed == false) || (Greenturn == true && Pawns[j].isRed == true)))) &&
          ((Pawns[k].row - Pawns[j].row == 1 && Pawns[k].column - Pawns[j].column == -1))) {
        for (let i = 0; i < Board.length; i++) {
          if (Pawns[j].row - Board[i].row == 1 && Pawns[j].column - Board[i].column == -1 && Board[i].free) {
            killConditions.push([k, j, i, Pawns[k].isRed, Greenturn, Pawns[k].rectCenter, Pawns[k].rectCenterY]);
            ////////console.log(`kill 2, killer ${k}, killed ${j}`);
            //killSwitch(k, j, i, Pawns[k].isRed);
            playerHasKill = true;
            //break;
            
             
          }
        }
      }
      
      //break;
    }
    
    
}
for (let j = 0; j < Pawns.length; j++) {
  for (let k = 0; k < Pawns.length; k++) {
    if (Pawns[j].isRed != Pawns[k].isRed && Pawns[j].live && Pawns[k].live &&
        ( (((Greenturn == false && Pawns[j].isRed == false) || (Greenturn == true && Pawns[j].isRed == true)))) &&
        ((Pawns[k].row - Pawns[j].row == -1 && Pawns[k].column - Pawns[j].column == 1))) {
      for (let i = 0; i < Board.length; i++) {
        if (Pawns[j].row - Board[i].row == -1 && Pawns[j].column - Board[i].column == 1 && Board[i].free) {
          killConditions.push([k, j, i, Pawns[k].isRed, Greenturn, Pawns[k].rectCenter, Pawns[k].rectCenterY]);
          ////////console.log(`kill 3, killer ${k}, killed ${j}`);
          //killSwitch(k, j, i, Pawns[k].isRed);
          playerHasKill = true;
          //break;
          
           
        }
      }
    }
    
    //break;
  }
}
  for (let j = 0; j < Pawns.length; j++) {
    for (let k = 0; k < Pawns.length; k++) {
      if (Pawns[j].isRed != Pawns[k].isRed && Pawns[j].live && Pawns[k].live &&
          ( (((Greenturn == false && Pawns[j].isRed == false) || (Greenturn == true && Pawns[j].isRed == true)))) &&
          ((Pawns[k].row - Pawns[j].row == -1 && Pawns[k].column - Pawns[j].column == -1))) {
        for (let i = 0; i < Board.length; i++) {
          if (Pawns[j].row - Board[i].row == -1 && Pawns[j].column - Board[i].column == -1 && Board[i].free) {
            killConditions.push([k, j, i, Pawns[k].isRed, Greenturn, Pawns[k].rectCenter, Pawns[k].rectCenterY]);
            ////////console.log(`kill 4, killer ${k}, killed ${j}`);
            //killSwitch(k, j, i, Pawns[k].isRed);
            playerHasKill = true;
            //break;
            
             
          }
        }
      }
      
      //break;
    }
    
}
//k j i isred
  
  

  //////////////////////////////////////////////////////////////////////////console.log(killConditions)
  // for (let i = 0; i < killConditions.length; i++)
  //   killSwitch(killConditions[i][0], killConditions[i][1], killConditions[i][2], killConditions[i][3]);
  // Assuming killConditions is an array with length > 0
  if (killConditions.length > 1 && !killersOptMode) {
    // Start from 1 to avoid comparing the element with itself
     let i = 0; // Always refer to the first element
     if (killConditions[i][0] != killConditions[1][0] && 
         killConditions[i][3] == killConditions[1][3] &&
         killConditions[i][1] == killConditions[1][1] &&
         Pawns[killConditions[i][1]].live && Pawns[killConditions[1][1]].live
     ) {
       //console.log(`killer1: ${killConditions[i][0]} killer2: ${killConditions[1][0]} killed1: ${killConditions[i][1]} killed2: ${killConditions[1][1]}`);
       killersOptMode = true;
       Pawns[killConditions[i][0]].killer = true;
       Pawns[killConditions[1][0]].killer = true;
       killersOpt.push(killConditions[i]);
       killersOpt.push(killConditions[1]);
       
       // If you want to break the loop after the first match, uncomment the following line
       // break;
     }
   
 }
 
  for (let i = 0; i < killConditions.length - 1; i++) 
    if (killConditions[i][0] == killConditions[i + 1][0] && killConditions[i][1] == killConditions[i + 1][1]) {
      //////////////////////////////////////////////////////////////console.log("killedOpt");
    }
}
// k j i
let lastMove = false;
let multiKill = false;
function killOpt() {
    for (let i = 0; i < killConditions.length; i++)
        if (!killersOptMode && Pawns[killConditions[i][1]].live) {
          killSwitch(killConditions[i][0],killConditions[i][1],killConditions[i][2],killConditions[i][3]);
          
        }
        
}

function killSwitch(winner, looser, newBoard, player) {
  //isPawnMoving = true;
  //pawnCompletedMove = false;
  //////////console.log("killSwitch");
  if (!killersOptMode && Pawns[looser].live) {
  for (let m = 0; m < Board.length; m++)
    if (Board[m].row == Pawns[winner].row && Board[m].column == Pawns[winner].column) Board[m].free = true;
  for (let m = 0; m < Board.length; m++)
    if (Board[m].row == Pawns[looser].row && Board[m].column == Pawns[looser].column) Board[m].free = true;
  // let targetPos = createVector(Board[newBoard].rectCenter, Board[newBoard].rectCenterY);
  // let movingPawnOldPos = { x: Pawns[winner].rectCenter, y: Pawns[winner].rectCenterY };
  //////console.log("killSwitch");
  let pawnLetter = Pawns[winner].letter;
  let pawnNumber = Pawns[winner].number;
  let pawnLetterLooser = Pawns[looser].letter;
  let pawnNumberLooser = Pawns[looser].number;
  let played = Pawns[winner].isRed;
  message = "kill";
  if ((Player == 1 && !Greenturn) || (Player == 2 && Greenturn) && Pawns[looser].live)
    socket.emit('message kill', message, played, pawnLetter, pawnNumber, pawnLetterLooser, pawnNumberLooser);
  Pawns[looser].live = false;
  //Pawns[winner].targetPos = targetPos;
  //if (Pawns[winner].live) movingPawn = Pawns[winner];
  Pawns[winner].row = Board[newBoard].row;
  Pawns[winner].column = Board[newBoard].column;
  Pawns[winner].letter = Board[newBoard].letter;
  Pawns[winner].number = Board[newBoard].number;
  
  Board[newBoard].free = false;
  //pawnSelected = false;
  //isPawnMoving = true;
  //Pawns.splice(looser, 1)
  if (Pawns[winner].isRed) {killer.value("RED"); document.getElementById("kill").style.color = "red";}
  else if (!Pawns[winner].isRed) {killer.value("GREEN"); document.getElementById("kill").style.color = "green";}
  //Greenturn = !Greenturn;
  //socket.emit('kill state', Board, Pawns, Greenturn);
  //if (cntr > 1) Greenturn = !Greenturn;
  //if (cntr > 1) 
  //socket.emit('killstate', Board, Pawns); 
  //else if (cntr == 1) 
  
  //kill();
  //////////////////////////////////////////////////////////////////////////////////////////console.log("ks player " + player + " " + "Greenturn " + Greenturn);
  //////////////////////////////////////////////////////////////////////////////////////////console.log("return " + kill());

//   let killResult = kill();
//   //////////////////////////////////////////////////////////////////////////////////////////console.log("killResult " + killResult);

//   if (killResult == 1) {
//   check = true;
  
//   //////////////////////////////////////////////////////////////////////////////////////////console.log("check true");
//   socket.emit('state', Board, Pawns, Greenturn, check);
//   }
//  else {
//   check = false;
//   //////////////////////////////////////////////////////////////////////////////////////////console.log("check false " + check);
//   socket.emit('state', Board, Pawns, Greenturn, check);
// }
  ////////////////////////////////////////////////////////////////////////////////////////console.log("winner");
  ////////////////////////////////////////////////////////////////////////////////////////console.log(Pawns[winner]);
  ////////////////////////////////////////////////////////////////////////////////////////console.log("looser");
  ////////////////////////////////////////////////////////////////////////////////////////console.log(Pawns[looser]);
  current = winner;
  
  // socket.emit('state', Board, Pawns, Greenturn, check, current);
  // socket.emit('move', { x: targetPos.x, y: targetPos.y, oldX: movingPawnOldPos.x, oldY: movingPawnOldPos.y }); // Send the move to the server
  kill();
  
  //stepKill(killConditions)
  //return;
  }
}

function stepKill() {
    ////////////////////console.log(killConditions);
    //////////console.log(killConditions);
  //for (let i = 0; i < killConditions.length; i++)
  ////console.log(`killer: ${killConditions[i][0]}, killed: ${killConditions[i][1]}, turn: ${killConditions[i][4]}, check: ${check}`);
  //////////////////////////////////////////////////////console.log(killersOptMode);
  if (!killersOptMode) { 
  for (let i = 0; i < killConditions.length; i++)
    
    //if (Pawns[killConditions[i][0]].live && !Pawns[killConditions[i][1]].live ) 
      {
    //////////////console.log("step in");
    let targetPos = createVector(Board[killConditions[i][2]].rectCenter, Board[killConditions[i][2]].rectCenterY);
    let movingPawnOldPos = { x: Pawns[killConditions[i][0]].rectCenter, y: Pawns[killConditions[i][0]].rectCenterY };
    
    Pawns[killConditions[i][0]].targetPos = targetPos;
    if (Pawns[killConditions[i][0]].live) movingPawn = Pawns[killConditions[i][0]];
    isPawnMoving = true;
    ////////////////////////////////////////////////////////console.log(killConditions.length);
    if (killConditions.length > 1) check = true;
    else check = false;
    killConditions.splice(i, 1);
    
    socket.emit('state', Board, Pawns, Greenturn, check, current, killConditions);
    socket.emit('move', { x: targetPos.x, y: targetPos.y, oldX: movingPawnOldPos.x, oldY: movingPawnOldPos.y });
    break;
  }
  //killConditions = [];

}

}

function mousePressed() {
    if (mouseButton === RIGHT) {
      
      let X = mouseX;
      let Y = mouseY;
      for (let i = 0; i < Board.length; i++)
        if (X > Board[i].rectCenter - 32 && X < Board[i].rectCenter + 32 &&
            Y > Board[i].rectCenterY - 32 && Y < Board[i].rectCenterY + 32) {
          //////////////console.log("b i " + i);
          //////////////console.log(Board[i]);
      }
      for (let i = 0; i < Pawns.length; i++) {
        let p = Pawns[i];
        if (X > p.rectCenter - 32 && X < p.rectCenter + 32 && Y > p.rectCenterY - 32 && Y < p.rectCenterY + 32) {
         //console.log("p i " + i)
         //console.log(Pawns[i]);
        }
      }
    }
  }
