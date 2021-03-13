function setup() {
  createCanvas(400,400);
  angleMode(DEGREES);
}

function draw() {
  background(0);

  translate(200,200);
  rotate(-90);
  let hr = hour();
  let mn = minute();
  let sc = second();

  strokeWeight(8);
  noFill();
  //seconds
  stroke(100,255,150);
  let end1 = map(sc,0,60,0,360);
  arc(0,0,260,260,0,end1);
  push();
  rotate(end1);
  line(0,0,100,0);
  pop();
  //minutes
  stroke(150,100,255);
  let end2 = map(mn,0,60,0,360);
  arc(0,0,280,280,0,end2);
  push();
  rotate(end2);
  line(0,0,80,0);
  pop();
  //hours
  stroke(255,100,150);
  let end3 = map(hr%12,0,12,0,360);
  arc(0,0,300,300,0,end3);
  push();
  rotate(end3);
  line(0,0,60,0);
  pop();
  strokeWeight(9);
  stroke(0);
  point(0,0);
}