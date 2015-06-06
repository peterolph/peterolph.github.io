
var gCanvas;
var gContext;
var gTiles = [];
var gMouse = [-1,-1];
var gPlayer = 'WHITE';
var gPiece = 'BEE';
var gWaitingForMove = null;

var kWidth;
var kHeight;
var kButtonWidth = 70;
var kButtonHeight = 20;
var kButtonMargin = 10;
var kTileSize = 48;
var kCursorSize = 45;
var kPlayerColours = {'WHITE': 'rgb(250,250,230)',
                      'BLACK': 'rgb(30,30,30)'}
var kPieceColours =  {'BEETLE': 'rgb(144,129,246)',
                      'SPIDER': 'rgb(79,42,23)',
                      'BEE': 'rgb(246,158,34)',
                      'HOPPER': 'rgb(47,158,64)',
                      'ANT': 'rgb(67,134,205)'};
var kBorderColour = '#202020';

function hexCorner(x,y,size,i){
  var angle = 60 * i;
  var rad = Math.PI / 180 * angle;
  return [x + size * Math.cos(rad), y + size * Math.sin(rad)];
}

function hexPath(context,hCoord,size,fillColour,textColour,label){
  pCoord = hexToPix(hCoord);
  x = pCoord[0];
  y = pCoord[1];
  
  context.beginPath();
  for(i=0; i<7; i++){
    var point = hexCorner(x,y,size,i);
    context.lineTo(point[0],point[1]);
  }
  context.closePath();
}

function drawTile(hCoord,data){
  gContext.save();
  hexPath(gContext,hCoord,kTileSize);
  
  player = data[0];
  piece = data[1];
  
  var fillColour = kPlayerColours[player];
  gContext.fillStyle = fillColour;
  gContext.fill();
  
  gContext.strokeStyle = kBorderColour;
  gContext.lineJoin = 'round';
  gContext.lineWidth = 1;
  gContext.stroke();
  
  var textColour = kPieceColours[piece];
  gContext.textAlign="center";
  gContext.textBaseline="middle";
  gContext.fillStyle = textColour;
  gContext.font = "20px Arial";
  gContext.fillText(piece,x,y);
  gContext.restore();
}

function drawCursor(){
  gContext.save();
  hexPath(gContext,gMouse,kCursorSize);
  gContext.strokeStyle = 'rgba(200,0,0,0.5)';
  gContext.stroke();
  gContext.restore();
}

function drawButton(index,colour){
  var x = kWidth - kButtonWidth - kButtonMargin
  var y = kButtonMargin + (kButtonMargin + kButtonHeight) * index
  gContext.fillStyle = colour;
  gContext.fillRect(x, y, kButtonWidth, kButtonHeight);
}

function drawButtons(){
  gContext.save();
  gContext.fillStyle = '#dddddd'
  gContext.fillRect(kWidth-kButtonWidth-kButtonMargin*2,0,kButtonWidth+kButtonMargin*2,kButtonMargin*9+kButtonHeight*8);
  gContext.strokeRect(kWidth-kButtonWidth-kButtonMargin*2,0,kButtonWidth+kButtonMargin*2,kButtonMargin*9+kButtonHeight*8);
  var count = 0;
  for(var key in kPlayerColours){
    drawButton(count,kPlayerColours[key]);
    count++;
  }
  count ++
  for(var key in kPieceColours){
    drawButton(count,kPieceColours[key]);
    count++;
  }
  gContext.restore();
}

function highlightButton(index){
  var x = kWidth - kButtonWidth - kButtonMargin
  var y = kButtonMargin + (kButtonMargin + kButtonHeight) * index
  gContext.strokeRect(x, y, kButtonWidth, kButtonHeight);
}

function highlightButtons(){
  gContext.save();
  gContext.strokeStyle = '#ff0000';
  gContext.lineWidth = 2;
  if(gPlayer === 'WHITE'){
    highlightButton(0);
  } else {
    highlightButton(1);
  }
  if(gPiece === 'BEETLE'){
    highlightButton(3);
  } else if(gPiece === 'SPIDER'){
    highlightButton(4);
  } else if(gPiece === 'BEE'){
    highlightButton(5);
  } else if(gPiece === 'HOPPER'){
    highlightButton(6);
  } else if(gPiece === 'ANT'){
    highlightButton(7);
  }
  gContext.restore();
}

function pixToHex(pCoord){
  x = pCoord[0] * 2/3 / 50;
  y = (-pCoord[0] / 3 + Math.sqrt(3)/3 * pCoord[1]) / 50;
  return [x,y];
}

function hexToPix(hCoord){
  x = 50 * 3/2 * hCoord[0];
  y = 50 * Math.sqrt(3) * (hCoord[0]/2 + hCoord[1]);
  return [x,y];
}

function roundHex(hCoord){
  x = hCoord[0];
  y = hCoord[1];
  z = 0 - x -y;
  var rx = Math.round(x);
  var ry = Math.round(y);
  var rz = Math.round(z);
  var xDiff = Math.abs(rx - x);
  var yDiff = Math.abs(ry - y);
  var zDiff = Math.abs(rz - z);
  if(xDiff > yDiff && xDiff > zDiff){
    rx = 0 - ry - rz;
  } else if(yDiff > zDiff){
    ry = 0 - rx - rz;
  } else {
    rz = 0 - rx - ry;
  }
  return [rx,ry];
}

function pixToRoundHex(pCoord){
  return roundHex(pixToHex(pCoord));
}

function getCoord(e){
  x = e.clientX - gCanvas.offsetLeft;
  y = e.clientY - gCanvas.offsetTop;
  return [x,y];
}

function checkIfButtonIsBeingPressed(pCoord){
  var x = pCoord[0];
  var y = pCoord[1];
  var w = kButtonWidth;
  var h = kButtonHeight;
  var m = kButtonMargin;
  if(x > kWidth - w - m && x < kWidth - m){
    if(y > m && y < m+h){
      gPlayer = 'WHITE';
    } else if(y > m*2+h && y < m*2+h*2){
      gPlayer = 'BLACK';
    } else if(y > m*4+h*3 && y < m*4+h*4){
      gPiece = 'BEETLE';
    } else if(y > m*5+h*4 && y < m*5+h*5){
      gPiece = 'SPIDER';
    } else if(y > m*6+h*5 && y < m*6+h*6){
      gPiece = 'BEE';
    } else if(y > m*7+h*6 && y < m*7+h*7){
      gPiece = 'HOPPER';
    } else if(y > m*8+h*7 && y < m*8+h*8){
      gPiece = 'ANT';
    }
  }
  if( x > kWidth - w - m*2 && y < m*9 + h*8 ){
    return true;
  } else {
    return false;
  }
}

function turnover(){
  if(gPlayer === 'WHITE'){
    gPlayer = 'BLACK';
  } else {
    gPlayer = 'WHITE';
  }
}

function hiveOnClick(e){
  var pCoord = getCoord(e);
  var hCoord = pixToRoundHex(pCoord);
  if(gWaitingForMove){
    moveTile(gWaitingForMove,hCoord);
    gWaitingForMove = null;
    turnover();
  } else {
    var buttonWasPressed = checkIfButtonIsBeingPressed(pCoord);
    if(!buttonWasPressed){
      if(findTile(hCoord)){
        gWaitingForMove = hCoord
      } else {
        setTile(hCoord,[gPlayer,gPiece,-1]);
        turnover();
      }
    }
  }
  hiveRedraw();
}

function hiveOnMove(e){
  pCoord = getCoord(e);
  gMouse = pixToRoundHex(pCoord);
  hiveRedraw();
}

function hiveRedraw(){
  gContext.clearRect(0,0,800,600);
  for (var tile in gTiles){
    drawTile(gTiles[tile][0],gTiles[tile][1]);
  }
  drawCursor();
  drawButtons();
  highlightButtons();
}

function findTile(hCoord){
  for(var i in gTiles){
    if(gTiles[i][0][0] === hCoord[0] && gTiles[i][0][1] === hCoord[1]){
      return i;
    }
  }
}

function setTile(hCoord,data){
  i = findTile(hCoord);
  if(i){
    gTiles[i] = [hCoord,data];
  } else {
    gTiles.push([hCoord,data]);
  }
}

function moveTile(hCoord,newHCoord){
  i = findTile(hCoord);
  if(gTiles[i][1][2] != -1){
    gTiles[gTiles[i][1][2]][0] = hCoord;
  }
  o = findTile(newHCoord);
  if(o){
    gTiles[i][1][2] = o;
    gTiles[o][0] = [-100,-100];
  } else {
    gTiles[i][1][2] = -1;
  }
  gTiles[i][0] = newHCoord;
}

$(document).ready(function() {
  gCanvas = $("#hive")[0];
  gCanvas.addEventListener("click",hiveOnClick,false);
  gCanvas.addEventListener("mousemove",hiveOnMove,false);
  
  gContext = gCanvas.getContext("2d");
  
  kWidth = gCanvas.width;
  kHeight = gCanvas.height;
  
  hiveRedraw();
 });