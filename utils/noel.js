function createElm(tag,classs,ids,src){
    var ilm = document.createElement(tag);
    if(ids!="")
        ilm.id = ids;
    if(classs!="")
        ilm.className = classs;
    if(src != "") 
        ilm.src = src;
    return ilm;
}
function bodyAdd(){
    document.getElementById("bodyForm").appendChild(createElm("canvas","","bongbong",""));
    document.getElementById("bodyForm").appendChild(createElm("div","cursor","",""));
    document.getElementById("bodyForm").appendChild(createElm("div","cursor2","",""));
    document.getElementById("bodyForm").appendChild(createElm("div","","onggianoel",""));
}
function get(elm){
    if(elm[0] == "#")
        return document.getElementById(elm.slice(1,elm.length));
    else if(elm[0] == ".")
        return document.getElementsByClassName(elm.slice(1,elm.length)); 
}
function mouseEvent(){
    
var cursor = document.querySelector('.cursor');
var cursorinner = document.querySelector('.cursor2');

document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});

document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursorinner.style.left = x + 'px';
  cursorinner.style.top = y + 'px';
});

document.addEventListener('mousedown', function(){
  cursor.classList.add('click');
  cursorinner.classList.add('cursorinnerhover')
  cursorinner.classList.add('click');
  cursor.classList.add('cursorinnerhover')
});

document.addEventListener('mouseup', function(){
  cursor.classList.remove('click')
  cursorinner.classList.remove('cursorinnerhover')
  cursorinner.classList.remove('click')
  cursor.classList.remove('cursorinnerhover')
});
get("#onggianoel").addEventListener('mousemove',()=>{
    get("#onggianoel").style.top = (Math.floor(Math.random() * (70 - 20) ) + 10).toString()+"%";
    get("#onggianoel").style.left =(Math.floor(Math.random() * (70 - 20) ) + 10).toString()+"%";
});
get("#onggianoel").addEventListener('click',()=>{
    alert("Không làm mà đòi có ăn :))");
});
}
bodyAdd();

var w = window.innerWidth,
h = window.innerHeight,
canvas = get("#bongbong"),
ctx = canvas.getContext("2d"),
rate = 100,
arc = 300,
time,
count,
size = 4;
speed = 8;
l = new Array(),
color = ["#F8F8FF"];
canvas.setAttribute("width",w);
canvas.setAttribute("height",h);
function createBongBong(){
    time = 0;
    count =0;
    for(var i=0;i<arc;i++){
        l[i] = {
            x:Math.ceil(Math.random()*w),
            y:Math.ceil(Math.random()*h),
            toX:Math.random()*5 + 1,
            toY:Math.random()*5 + 1,
            c: color[Math.floor(Math.random() * color.length)],
            size: Math.random() * size
        }
    }
}


function bongbong(){
    ctx.clearRect(0,0,w,h);
    for(var i =0 ; i<arc;i++){
        var k = l[i];
        ctx.beginPath();
        ctx.arc(k.x,k.y,k.size,0,Math.PI*2,false);
        ctx.fillStyle = k.c;
        ctx.fill();
        k.x = k.x + k.toX * (time*0.05);
        k.y = k.y + k.toY * (time*0.05);
        if(k.x > w) k.x = 0;
        if(k.y > h) k.y = 0;
        if(k.x < 0) k.x = w;
        if(k.y < 0) k.y = h;
       
    }
    if (time<speed) time++;
    timeout =  setTimeout(bongbong, 1000/rate);
}

createBongBong();
bongbong();
// mouseEvent();



