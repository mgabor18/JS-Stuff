var cols, rows;
var w = 20;
var grid = [];
var current;
var stack = [];

function setup() {
  createCanvas(600, 400);
  //frameRate(5);
  cols = floor(width/w);
  rows = floor(height/w);
  //canvas felosztása cellákra + a tömb feltöltése
  for(var j = 0; j < rows; j++){
    for(var i = 0; i < cols; i++){
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0]; // első elem, kiindulás
}

function draw() {
  background(50);
  for(var i = 0; i < grid.length; i++){
    grid[i].show();
  }
  current.visited = true;
    //step1
  var next= current.checkNeighbors();
  if(next){
    next.visited = true;
    current.highlight();
    //step2
    stack.push(current);
    //step3
    removeWalls(current, next);
    //step4
    current = next;
  } else if(stack.length > 0){
    var stackCell = stack.pop();
    current = stackCell;
  }
}

function index(i,j){
  //edge case-k
  if(i < 0 || j < 0 || j > rows-1 || i > cols-1){
    return -1;
  }

  return i + j * cols;
}

//cellák
function Cell(i, j){
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true]; // TOP RIGHT BOTTOM LEFT
  this.visited = false;

  this.checkNeighbors = function(){
    var neighbors = [];
    //szomszédok helye
    var top = grid[index(i, j-1)];
    var right = grid[index(i+1, j)];
    var bottom = grid[index(i, j+1)];
    var left = grid[index(i-1, j)];
    // ha nem undefined és nem volt még, berakjuk a szomszédokba
    if(top && !top.visited){
      neighbors.push(top);
    }
    if(right && !right.visited){
      neighbors.push(right);
    }
    if(bottom && !bottom.visited){
      neighbors.push(bottom);
    }
    if(left && !left.visited){
      neighbors.push(left);
    }
    //szomszéd check, random kiválasztás
    if(neighbors.length > 0){
      var rNum = floor(random(0,neighbors.length));
      return neighbors[rNum];
    } else{
      return undefined;
    }
  }
  //aktuális cella kiemelése
  this.highlight = function() {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill(0, 0, 255, 100);
    rect(x, y, w, w);
  };

  //megjelenítő
  this.show = function(){
    var x = this.i * w;
    var y = this.j * w;
    stroke(255);
    //gridelés
    if(this.walls[0]){
      line(x  , y  , x+w, y); //top
    }
    if(this.walls[1]){
      line(x+w, y  , x+w, y+w); //right
    }
    if(this.walls[2]){
      line(x+w, y+w, x  , y+w); //bottom
    }
    if(this.walls[3]){
      line(x  , y+w, x  , y); //left
    }
    if(this.visited){
      fill(0,255,255,100);
      noStroke();
      rect(x,y,w,w);
    }
  }
}

function removeWalls(a,b){
  var x = a.i - b.i;
  var y = a.j - b.j;

  if(x === 1){
    a.walls[3] = false; // left
    b.walls[1] = false; // right
  } else if(x === -1){
    a.walls[1] = false; //right
    b.walls[3] = false; //left
  }

  if(y === 1){
    a.walls[0] = false; // bottom
    b.walls[2] = false; // top
  }else if(y === -1){
    a.walls[2] = false; // top
    b.walls[0] = false; // bottom
  }
}