let canvas = document.querySelector('canvas');
canvas.width=1000;
canvas.height=600;

let xGrid=10;
let yGrid=10;

let ctx=canvas.getContext('2d');


function drawGrids()
{
  ctx.beginPath();

  while(xGrid<canvas.height)
  {
    ctx.moveTo(0,xGrid);
    ctx.lineTo(canvas.width,xGrid);
    xGrid+=10;
  }
  while(yGrid<canvas.width)
  {
    ctx.moveTo(yGrid,0);
    ctx.lineTo(yGrid,canvas.height);
    yGrid+=10;
  }
  ctx.strokeStyle="grey"
  ctx.stroke();
}

function drawAxis()
{
  let yPlot=500;
  let xPlot=800;
  let temperature=-15;
  let date=1;
  ctx.beginPath();
  ctx.strokeStyle="black";
  ctx.moveTo(50,50);
  ctx.lineTo(50,500);
  ctx.lineTo(800,500);

  ctx.moveTo(50,500);
  for(let i=1;i<=10;i++)
  {
    ctx.strokeText(temperature,20,yPlot);
    yPlot-=50;
    temperature+=5;
  }

  // ctx.moveTo(50,500);
  // for(let j=1;j<=240;j++)
  // {
  //   ctx.strokeText((date % 12),20,xPlot);
  //   xPlot-=20;
  //   date+=1;
  // }

  ctx.stroke()
}
// function drawLineChart()
// {
//   ctx.beginPath();
//   ctx.strokeStyle="red";
//   ctx.moveTo(50,500);
//
//   var xPlot=10;
//
//
//
// }

function createTransform(domain, range)
{
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x)
    {
      return alpha * x + beta;
    }
}

// drawAxis()
// drawGrids()
