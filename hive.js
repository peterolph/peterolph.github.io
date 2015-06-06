
var gCanvas;
var gContext;
var gCounter;
var gTiles;
var gMouse;

function hexCorner(x,y,size,i){
  var angle = 60 * i
  var rad = Math.PI / 180 * angle
  return [x + size * Math.cos(rad), y + size * Math.sin(rad)];
}

function hex(context,hCoord,size,fillColour,textColour,label){
  
  pCoord = hexToPix(hCoord);
  x = pCoord[0]
  y = pCoord[1]
  
  context.save()
  context.beginPath();
  for(i=0; i<7; i++){
    var point = hexCorner(x,y,size,i)
    context.lineTo(point[0],point[1]);
  }
  context.closePath();
  
  if(fillColour){
    context.fillStyle = fillColour
    context.fill();
  }
  
  context.strokeStyle = '#202020'
  context.lineJoin = 'round'
  context.lineWidth = 1
  context.stroke();
  
  context.fillStyle = textColour
  context.font = "20px Arial"
  context.fillText(label,x,y)
  context.restore()
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
  gTiles.push([hCoord,gCounter]);
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
    hex(gContext,gTiles[tile][0],48,'#ffffee','#dd4444',gTiles[tile][1]);
  }
  hex(gContext,gMouse,45,'','','');
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