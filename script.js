/* simplified final stable mobile snake */
const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");
let box,cols,rows;
const headImg=new Image(); headImg.src="face.png";
let snake,dir,nextDir,headX,headY,food,eating=false;

function resize(){
 canvas.width=innerWidth-10;
 canvas.height=innerHeight-120;
 box=Math.max(30,Math.floor(Math.min(canvas.width,canvas.height)/20));
 cols=Math.floor(canvas.width/box);
 rows=Math.floor(canvas.height/box);
}
resize();

function init(){
 snake=[{x:Math.floor(cols/2),y:Math.floor(rows/2)}];
 dir=nextDir="RIGHT";
 headX=snake[0].x*box; headY=snake[0].y*box;
 food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)};
}
init();

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.strokeStyle="white"; ctx.lineWidth=3;
 ctx.strokeRect(0,0,cols*box,rows*box);

 ctx.fillStyle="red";
 ctx.fillRect(food.x*box,food.y*box,box,box);

 ctx.strokeStyle="lime"; ctx.lineWidth=box;
 ctx.beginPath();
 ctx.moveTo(headX+box/2,headY+box/2);
 for(let i=1;i<snake.length;i++){
  ctx.lineTo(snake[i].x*box+box/2,snake[i].y*box+box/2);
 }
 ctx.stroke();

 const hs=box*2;
 ctx.save();
 ctx.beginPath();
 ctx.arc(headX+box/2,headY+box/2,hs/2,0,Math.PI*2);
 ctx.clip();
 ctx.drawImage(headImg,headX+box/2-hs/2,headY+box/2-hs/2,hs,hs);
 ctx.restore();
}

function update(){
 const tX=snake[0].x*box, tY=snake[0].y*box;
 if(headX<tX) headX+=4;
 if(headX>tX) headX-=4;
 if(headY<tY) headY+=4;
 if(headY>tY) headY-=4;

 if(headX===tX&&headY===tY){
  let h={...snake[0]};
  if(dir==="RIGHT")h.x++;
  if(dir==="LEFT")h.x--;
  if(dir==="UP")h.y--;
  if(dir==="DOWN")h.y++;
  if(h.x<0||h.y<0||h.x>=cols||h.y>=rows)return;
  snake.unshift(h);
  if(h.x===food.x&&h.y===food.y){
   food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)};
  } else snake.pop();
 }
 draw(); requestAnimationFrame(update);
}
update();

let sx,sy;
canvas.ontouchstart=e=>{sx=e.touches[0].clientX; sy=e.touches[0].clientY;}
canvas.ontouchend=e=>{
 const dx=e.changedTouches[0].clientX-sx;
 const dy=e.changedTouches[0].clientY-sy;
 if(Math.abs(dx)>Math.abs(dy)){
  if(dx>0&&dir!=="LEFT")dir="RIGHT";
  if(dx<0&&dir!=="RIGHT")dir="LEFT";
 } else {
  if(dy>0&&dir!=="UP")dir="DOWN";
  if(dy<0&&dir!=="DOWN")dir="UP";
 }
}

restartBtn.onclick=()=>{resize();init();}
window.onresize=()=>{resize();}
