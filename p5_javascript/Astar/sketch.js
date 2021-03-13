
/* Márton Gábor GO9LPP*/ 
var cols = 50;
var rows = 50;
var grid = new Array(cols);
var w, h, start, end;
var path = [];
var openSet = [];
var closedSet = []; 

function setup() {
  createCanvas(600, 600);
  w = width/cols;
  h = height/rows;
  //2D tömb
  for(var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }
  //tömb feltöltése node-okkal
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
    grid[i][j] = new Node(i, j);
    }
  }
  //nodeok megkapják a szomszédaik adatait
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
    grid[i][j].addNeighbor(grid);
    }
  }
  //start és cél node-ok
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  //annak biztosítása hogy ne legyen fal a kezdés, cél, 
  //és legalább 1 lépés legyen
  start.wall = false;
  end.wall = false;
  grid[0][1].wall = false;
  //az openset megkapja a kezdőpontot
  openSet.push(start);
}

function draw() {
  background(255);
  if(openSet.length > 0){
    var winner = 0;
    for(var i = 0; i < openSet.length; i++){
      if (openSet[i].f < openSet[winner].f){
          winner = i; // megkeressük a legjobb F-el rendelkező lépést
      }
    }
    var current = openSet[winner];
    if(current === end){ // ha a jelenlegi node az end node, vége
      noLoop();
      console.log("DONE");
    }

    removeFromArray(openSet, current); //kivesszük a jelenlegi nodeot az opensetből
    closedSet.push(current);// berakjuk a closedsetbe
    
    var neighbors = current.neighbors; // a curr. szomszédjainak ideiglenes tárolása
    for(var i = 0; i < neighbors.length; i++){
      var neighbor = neighbors[i];
      if(!closedSet.includes(neighbor) && !neighbor.wall){ // ha a szomszéd nem szerepel a closedsetben vagy nem fal
        var tempG = current.g + 1; // ideiglenes G
        
        var newPath = false; // hogy csak 1 út legyen kiválasztva (pl a diagonális lépések bugosak e nélkül)
        if(openSet.includes(neighbor)){// ha az openset tagja az adott szomszéd
          if(tempG < neighbor.g){ // akkor megnézzük a G értékét
            neighbor.g = tempG;
            newPath = true; // megvan az új út
          }
        }else{ // ha nem volt benne eddig az opensetbe akkor hozzá adjuk
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if(newPath){ // miután megvan az új út
          neighbor.h = heuristic(neighbor,end); // heurisztika számítás
          neighbor.f = neighbor.g + neighbor.h; // F számítás
          neighbor.previous = current; // megkapja a szomszéd az előző nodeot
        }
      }
    }
  } else{
    console.log("NO SOLUTION!");
    noLoop();
    return; // ha nincs megoldás kilépés és white screen
  }

  for(var i = 0; i < cols; i++){
    for(var j = 0;j < rows; j++){ 
      grid[i][j].show(color(255));//nodeok felrajzolása
    }
  }

  for(var i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255,0,0)); // megvizsgált nodeok pirosak
  }
  for(var i = 0; i < openSet.length; i++){
    openSet[i].show(color(0,255,0)); // lehetséges nodeok zöldek
  }
  //út keresés
  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous){ // amíg van megelőző
    path.push(temp.previous); // bekerül az útvonalba
    temp = temp.previous; // 1-et vissza lépünk az előzőre
  }
  for(var i = 0; i < path.length; i++){
    path[i].show(color(0,0,255)); // az útvonal kék
  }
}

function Node(i, j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;
  
  if(random(1)< 0.3){ // random falak generálása
    this.wall = true;
  }

  this.addNeighbor = function(grid){ // szomszédok
    if(this.i < cols - 1){
      this.neighbors.push(grid[this.i+1][this.j]); // le
    }
    if(this.i > 0){
    this.neighbors.push(grid[this.i-1][this.j]); // fel
    }
    if(this.j < rows - 1){
    this.neighbors.push(grid[this.i][this.j+1]); // jobbra
    }
    if(this.j > 0){
    this.neighbors.push(grid[this.i][this.j-1]); // balra
    }
    //diagonális lépések
    /*
    if(this.i > 0 && this.j > 0){
      this.neighbors.push(grid[this.i-1][this.j-1]);
    }
    if(this.i < cols-1 && this.j > 0){
      this.neighbors.push(grid[this.i+1][this.j-1]);
    }
    if(this.i > 0 && this.j < rows-1){
      this.neighbors.push(grid[this.i-1][this.j+1]);
    }
    if(this.i < cols-1 && this.j < rows-1){
      this.neighbors.push(grid[this.i+1][this.j+1]);
    }
    */
  }

  this.show = function(color){
    fill(color);
    if(this.wall){
      fill(0); // falak feketék
    }
    noStroke();
    rect(this.i*w, this.j*h, w, h);
    //rect(this.i*w, this.j*h, w-1, h-1); kockás hatással
  }
}

function removeFromArray(arr,element){
  for(var i = arr.length-1; i >= 0; i--){ 
    // visszafelé, mert amúgy kihagy 1 elemet splice után
    if(arr[i] === element){
      arr.splice(i, 1);
    }
  }
}

function heuristic(a,b){
  var distance = dist(a.i, a.j, b.i, b.j); // euklédeszi
  //var d = abs(a.i-b.i) + abs(a.j-b.j); //manhattan
  return distance;
}