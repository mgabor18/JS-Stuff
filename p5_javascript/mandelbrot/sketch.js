var minVal = -0.5;
var maxVal = 0.5;

var minSlider;
var maxSlider;

function setup() {
  createCanvas(400,400);
  pixelDensity(1);

  minSlider = createSlider(-2.5, 0, -2.5, 0.01);
  maxSlider = createSlider(0, 2.5, 2.5, 0.01);
}

function draw() {
  var maxIterations = 50;
  loadPixels();
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){

      var aElement = map(x, 0, width, minSlider.value(), maxSlider.value());
      var bElement = map(y, 0, height, minSlider.value(), maxSlider.value());

      var cValueA = aElement;
      var cValueB = bElement;

      var n = 0;
      while (n < maxIterations){
        var aa = aElement * aElement - bElement * bElement;
        var bb = 2 * aElement * bElement;

        aElement = aa + cValueA;
        bElement = bb + cValueB;

        if(abs(aElement + bElement) > 16){
          break;
        }

        n++;
      }
      var brightness = map(n, 0, maxIterations, 0, 1);
      brightness = map(sqrt(brightness), 0, 1, 0, 255);
      if(n === maxIterations){
        brightness = 0;
      }

      var pix = (x + y * width) * 4;
      pixels[pix + 0] = brightness;
      pixels[pix + 1] = brightness;
      pixels[pix + 2] = brightness;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();

}