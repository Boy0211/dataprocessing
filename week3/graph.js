let canvas = document.querySelector('canvas');
canvas.width=1200;
canvas.height=800;

let ctx=canvas.getContext('2d');

var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        var Json = (JSON.parse(txtFile.responseText));

        console.log(Object.keys(Json))

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


        var x_axis = createTransform([0, 365], [50, 1150])
        var y_axis = createTransform([-200, 350], [600, 50])

        ctx.beginPath();
        var counter = 0
        Object.keys(Json).forEach(function(key)
        {
        counter++
        var month = key
        var max_temp = Json[key]['max_temp']
        var pixel_max_x = x_axis(counter)
        var pixel_max_y = y_axis(max_temp)

        ctx.lineTo(pixel_max_x, pixel_max_y)
        ctx.strokeStyle="red"
        ctx.stroke()
        })
        ctx.closePath()

        ctx.beginPath();
        var counter = 0
        Object.keys(Json).forEach(function(key)
        {
        counter++
        var month = key
        var min_temp = Json[key]['min_temp']
        var pixel_max_x = x_axis(counter)
        var pixel_max_y = y_axis(min_temp)

        ctx.lineTo(pixel_max_x, pixel_max_y)
        ctx.strokeStyle="blue"
        ctx.stroke()
        })
        ctx.closePath()

    }
}
txtFile.open("GET", fileName);
txtFile.send();


let xGridUp=50;
let xGridDown=600;
let yGridLeft=50;
let yGridRight=canvas.width-50;

function drawGrids()
{
  ctx.beginPath();
  while(xGridUp<xGridDown)
  {
    ctx.moveTo(yGridLeft,xGridUp);
    ctx.lineTo(yGridRight,xGridUp);
    xGridUp+=50;
  }
  ctx.strokeStyle="grey"
  ctx.stroke();
  ctx.closePath()
}

function drawAxis()
{
  ctx.beginPath()
  ctx.moveTo(yGridLeft, xGridDown)
  ctx.lineTo(yGridRight, xGridDown)
  ctx.moveTo(yGridLeft, xGridDown)
  ctx.lineTo(yGridLeft, xGridUp)
  ctx.strokeStyle="black"
  ctx.closePath()

  let yPlot=550;
  let temperature=-15;
  ctx.strokeStyle="black";
  ctx.font = '14px arial'

  for(let i=1;i<=10;i++)
  {
    ctx.fillText(temperature,20,yPlot);
    yPlot-=50;
    temperature+=5;
  }
  ctx.stroke()
}
function drawDates()
{
  let xPlot=0;
  let list_of_dates = ['jan', 'feb', 'mrt', 'apr', 'may', 'jun', 'jul', 'aug',
                       'sept', 'okt', 'nov', 'dec']

  for(let j=0;j<12;j++)
  {
    xPlot+=(1/12)*1100
    ctx.font = '16px arial';
    ctx.fillText(list_of_dates[j], xPlot, 620)
  }
}

function drawLegenda1()
{
  ctx.beginPath()
  ctx.moveTo(0,650)
  ctx.lineTo(30,650)
  ctx.strokeStyle="red"
  ctx.stroke()
  ctx.fillText("Maximum temperature", 40, 655)
  ctx.closePath()
}

function drawLegenda2()
{
  ctx.beginPath()
  ctx.moveTo(0,680)
  ctx.lineTo(30,680)
  ctx.strokeStyle="blue"
  ctx.stroke()
  ctx.fillText("Minimum temperature", 40, 685)
  ctx.closePath()
}

function drawAxisLegenda()
{
  ctx.beginPath()
  ctx.fillText("Temperature [*C]", 0, 40)
  ctx.fillText("Time [/month]", 1100, 650)
  ctx.closePath()
}



drawAxis()
drawGrids()
drawDates()
drawLegenda1()
drawLegenda2()
drawAxisLegenda()
