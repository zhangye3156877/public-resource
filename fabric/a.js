// var bol = (r2.x > r1.x + r1.width ||
//   r2.x + r2.width < r1.x ||
//   r2.y > r1.y + r1.height ||
//   r2.y + r2.height < r1.y);

  var rects = [
    {
      x:10,
      y:15,
      width:100,
      height:100,
    },
    {
      x:20,
      y:5,
      width:120,
      height:80,
    },
    {
      x:15,
      y:10,
      width:50,
      height:150
    }
  ]

  rects.sort(function(a,b){
    return a.x - b.x;
  })

  var maxx = 600
  var minx = 50;
  var shape = {
    width:100,
    height:100
  };
  var choosed = {};

  for(var i = 0;i < rects.length; i++) {
    if (i === 0) {
      choosed.width = rects[i].x - minx;
      choosed.index = i;
      continue;
    }

    if (i === rects.length - 1) {
      var newx = maxx - rects[i].x - rects[i].width;
      if (choosed.width - newx < 0) {
        choosed.width = newx;
        choosed.index = i;
      } 
      continue;
    }
    var newx = rects[i].x - rects[i - 1].x - rects[i - 1].width;
    if (choosed.width - newx < 0) {
      choosed.width = newx;
      choosed.index = i;
    } 
  }
  if (choosed.width >= shape.width) {

  }
  console.log(choosed)