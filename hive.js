
var gCanvas;
var gContext;
var gCounter;
var gTiles;
var gMouse;

var kWhiteColour = 'rgb(250,250,230)'
var kBlackColour = 'rgb(30,30,30)'
var kBeetleColour = 'rgb(144,129,246)'
var kSpiderColour = 'rgb(79,42,23)'
var kBeeColour = 'rgb(246,158,34)'
var kHopperColour = 'rgb(47,158,64)'
var kAntColour = 'rgb(67,134,205)'

function hexCorner(x,y,size,i){
  var angle = 60 * i
  var rad = Math.PI / 180 * angle
  return [x + size * Math.cos(rad), y + size * Math.sin(rad)];
}

function hexPath(context,hCoord,size,fillColour,textColour,label){
  pCoord = hexToPix(hCoord);
  x = pCoord[0]
  y = pCoord[1]
  
  context.beginPath();
  for(i=0; i<7; i++){
    var point = hexCorner(x,y,size,i)
    context.lineTo(point[0],point[1]);
  }
  context.closePath();
}

function drawTile(context,hCoord,data){
  context.save()
  hexPath(context,hCoord,48);
  
  player = data[0]
  piece = data[1]
  
  var fillColour = '#ffffff'
  if(player === 'one'){
    fillColour = kWhiteColour;
  } else if(player === 'two'){
    fillColour = kBlackColour;
  }
  context.fillStyle = fillColour
  context.fill();
  
  context.strokeStyle = '#202020'
  context.lineJoin = 'round'
  context.lineWidth = 1
  context.stroke();
  
  var textColour = '#000000'
  if(piece === 'BEE'){
    textColour = kBeeColour;
  } else if(piece === 'ANT'){
    textColour = kAntColour;
  } else if(piece === 'HOPPER'){
    textColour = kHopperColour;
  } else if(piece === 'SPIDER'){
    textColour = kSpiderColour;
  } else if(piece === 'BEETLE'){
    textColour = kBeetleColour;
  }
  context.fillStyle = textColour
  context.font = "20px Arial"
  context.fillText(piece,x,y)
  context.restore()
}

function drawCursor(context,hCoord){
  context.save()
  hexPath(context,hCoord,45);
  context.strokeStyle = 'rgba(200,0,0,0.5)';
  context.stroke();
  context.restore();
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
  x = hCoord[0]
  y = hCoord[1]
  z = 0 - x -y
  var rx = Math.round(x);
  var ry = Math.round(y);
  var rz = Math.round(z);
  var xDiff = Math.abs(rx - x);
  var yDiff = Math.abs(ry - y);
  var zDiff = Math.abs(rz - z);
  if(xDiff > yDiff && xDiff > zDiff){
    rx = 0 - ry - rz
  } else if(yDiff > zDiff){
    ry = 0 - rx - rz
  } else {
    rz = 0 - rx - ry
  }
  return [rx,ry]
}

function pixToRoundHex(pCoord){
  return roundHex(pixToHex(pCoord));
}

function getCoord(e){
  x = e.clientX - gCanvas.offsetLeft;
  y = e.clientY - gCanvas.offsetTop;
  return [x,y];
}

function hiveOnClick(e){
  pCoord = getCoord(e);
  var hCoord = pixToRoundHex(pCoord);
  setTile(hCoord,['one','BEE']);
  gCounter++;
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
    drawTile(gContext,gTiles[tile][0],gTiles[tile][1]);
  }
  drawCursor(gContext,gMouse);
}

function setTile(hCoord,data){
  for(var i in gTiles){
    if(gTiles[i][0][0] === hCoord[0] && gTiles[i][0][1] === hCoord[1]){
      gTiles[i] = [hCoord,data];
      return
    }
  }
  gTiles.push([hCoord,data]);
}

function getTile(hCoord){
  for(var i in gTiles){
    if(gTiles[i][0][0] === hCoord[0] && gTiles[i][0][1] === hCoord[1]){
      return gTiles[i][1];
    }
  }
}

$(document).ready(function() {
  gCanvas = $("#hive")[0];
  gCanvas.addEventListener("click",hiveOnClick,false);
  gCanvas.addEventListener("mousemove",hiveOnMove,false);
  
  gContext = gCanvas.getContext("2d");
  gContext.textAlign="center";
  gContext.textBaseline="middle";
  
  gCounter = 0;
  gTiles = [];
 });