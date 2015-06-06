
var gCanvas;
var gContext;
var gCounter;

function hexCorner(x,y,size,i){
  var angle = 60 * i
  var rad = Math.PI / 180 * angle
  return [x + size * Math.cos(rad), y + size * Math.sin(rad)];
}

function hex(context,x,y,label){
  context.beginPath();
  for(i=0; i<7; i++){
    var point = hexCorner(x,y,50,i)
    context.lineTo(point[0],point[1]);
  }
  context.stroke();
  context.fillText(label,x,y)
}

function hiveOnClick(e){
  console.log(e)
  x = e.clientX - gCanvas.offsetLeft;
  y = e.clientY - gCanvas.offsetTop;
  hex(gContext,x,y,gCounter);
  gCounter++;
}

$(document).ready(function() {
  gCanvas = $("canvas")[0];
  gCanvas.addEventListener("click",hiveOnClick,false);
  
  gContext = gCanvas.getContext("2d");
  gContext.textAlign="center";
  gContext.textBaseline="middle";
  
  gCounter = 0;
 });