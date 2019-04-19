var json = {
  "sheet": {
    "width": 250,
    "height": 210,
  },
  "parts": [
    {
      "name": "square",
      "points": [
        20, 20,
        20, -20,
        -20, -20,
        -20, 20,
        20, 20
      ],
      "num": 0
    },
    {
      "name": "rectangle",
      "points": [
        20, 10,
        20, -10,
        -20, -10,
        -20, 10,
        20, 10
      ],
      "num": 0
    },
    {
      "name": "echelo1",
      "points": [
        20, 20,
        40, -20,
        -40, -20,
        -20, 20,
        20, 20
      ],
      "num": 0
    },
    {
      "name": "echelo2",
      "points": [
        20, 20,
        20, -20,
        -40, -20,
        -20, 20,
        20, 20
      ],
      "num": 0
    }
  ]
}
var inputs = document.querySelectorAll('input[type="text"]');
var btn = document.getElementById('btn');
var btn2 = document.getElementById('btn2');
var dsquare = document.getElementById('square');
var drectangle = document.getElementById('rectangle');
var dechelo1 = document.getElementById('echelo1');
var dechelo2 = document.getElementById('echelo2');
var dwidth = document.getElementById('width');
var dheight = document.getElementById('height');
var dallutil = document.getElementById('allutil');

var stageOptions = {
  container: 'container',
  width: 1000,
  height: 550,
  iw: 400,
  left: 0,
  top: 50,
  font: 30
}
var stage = new Konva.Stage({
  container: stageOptions.container,
  width: stageOptions.width,
  height: stageOptions.height
});

var layer = new Konva.Layer();
var group = new Konva.Group();
stage.add(layer);
layer.add(group);
function random(min, max) {
  return parseInt(Math.random() * (max - min) + 1) + min;
}

function offset(points, strokeWidth) {
  var maxX = 0, maxY = 0, minX = 0, minY = 0;
  strokeWidth += 1;
  points.forEach(function (item, index) {
    if (index % 2 === 0) {
      maxX = Math.max(item, maxX);
      minX = Math.min(item, minX);
    } else {
      maxY = Math.max(item, maxY);
      minY = Math.min(item, minY);
    }
  })
  var offsetX = [-minX + strokeWidth, stageOptions.width - maxX - strokeWidth];
  var offsetY = [-minY + strokeWidth, stageOptions.height - maxY - strokeWidth];
  return {
    width: offsetX,
    height: offsetY
  };
}


function checkCollision(group, shape, offset) {
  var shapeInfo = shape.getClientRect();
  //console.log(shapeInfo,shape)
  var posX = offset.width;
  var posY = offset.height;
  if (group.children.length === 0) {
    shape.setAttrs({
      width: shapeInfo.width,
      height: shapeInfo.height
    })
    return true;
  }

  var rects = [];
  group.children.each(function (item) {
    rects.push(item.attrs);
  });
  var times = 0;
  var n = 0;
  var x = shape.attrs.x;
  var y = shape.attrs.y;
  //console.log(x,y)
  while (n < rects.length) {
    times++;
    if (times >= 10000) {
      console.log('终止循环');
      return false;
      //break;
    }
    var bol = !((x - posX[0]) > (rects[n].x + rects[n].width - rects[n].minx) || (x + shapeInfo.width - posX[0]) < (rects[n].x - rects[n].minx)
      || (y - posY[0]) > (rects[n].y + rects[n].height - rects[n].miny) || (y + shapeInfo.height - posY[0]) < (rects[n].y - rects[n].miny))
    //console.log(bol)
    if (bol) {
      x = random(posX[0], posX[1]);
      y = random(posY[0], posY[1]);
      n = 0;
    } else {
      n++;
    }
  }
  //console.log(x,y)
  shape.setAttrs({
    x: x,
    y: y,
    width: shapeInfo.width,
    height: shapeInfo.height
  })
  return true;
}

function draw(data) {
  group.destroyChildren();
  var all = data.map(function (item) {
    return Array(item.num > 20 ? 20 : item.num).fill(item);
  })
  all = all.flat();
  //console.log(all);
  all.forEach(function (item, index) {
    var points = item.points;
    var pos = offset(points, 1);
    //console.log(posX)
    var shape = new Konva.Line({
      x: random(pos.width[0], pos.width[1]),
      y: random(pos.height[0], pos.height[1]),
      minx: pos.width[0],
      miny: pos.height[0],
      points: points,
      fill: '#8498d1',
      stroke: '#617bb5',
      strokeWidth: 1,
      closed: true,
    });

    var checkPass = checkCollision(group, shape, pos);

    if (checkPass) {
      group.add(shape)
    }
    //group.add(shape)
    //console.log(group.children);

  });

  layer.draw();
}

function drawResult(data) {
  group.destroyChildren();
  // 每行最大放置数
  var bx = Math.floor(stageOptions.width / stageOptions.iw);
  var bh = Math.round(data.length / bx);
  var margins = (stageOptions.width - stageOptions.iw * bx) / (bx + 1);
  //适配的框高
  var ratio = json.sheet.width / json.sheet.height;
  var width = stageOptions.iw;
  var height = stageOptions.iw / ratio;
  var newH = bh * height + (bh + 1) * stageOptions.top;
  //console.log(newH,stageOptions.height,height,bh)
  if (newH > stageOptions.height) {
    stage.size({
      width: stageOptions.width,
      height: newH
    })
  }

  stageOptions.left = margins;
  //console.log(stageOptions.left,)
  data.forEach(function (item, index) {
    var ytimes = Math.floor(index / bx);
    var offsetX = stageOptions.left * (index % bx + 1) + width * (index % bx);
    var offsetY = stageOptions.top * (ytimes + 1) + height * ytimes;
    var showFont = `${item.name}-利用率:${(item.util.toFixed(4) * 100).toString().substr(0,5)}%`
    //var offsetFont = offsetX + (width - stageOptions.font * showFont.length) / 2;
    console.log(stageOptions.font * showFont.length)
    var text = new Konva.Text({
      x: offsetX + 10,
      y: offsetY - 30,
      text: showFont,
      fontSize: stageOptions.font,
      fontFamily: 'Calibri',
      fill: 'green'
    });
    
    var rect = new Konva.Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
      //height: item.height,
      //fill: 'gray',
      stroke: '#617bb5'
    });
    group.add(rect,text);
    item.parts.forEach(function (i, n) {
      var shape = new Konva.Line({
        x: offsetX,
        y: offsetY,
        points: i.points,
        fill: '#8498d1',
        stroke: '#617bb5',
        strokeWidth: 1,
        closed: true,
      })
      shape.scale({
        x: width / item.width,
        y: height / item.height
      });
      group.add(shape);
    })

  })

  layer.draw();
}

// document.addEventListener('DOMContentLoaded',function() {
//   console.log('文档载入完毕哦');
//   stageOptions.width = window.innerWidth * .8;
//   stageOptions.height = window.innerWidth * .8 / 1.19;
//   stage.size({
//     width: stageOptions.width,
//     height: stageOptions.height
//   })
// })

// window.addEventListener('resize',function() {
//   console.log(stage)
//   var oldWidth = stageOptions.width;
//   var oldHeight = stageOptions.height;
//   stageOptions.width = window.innerWidth * .8;
//   stageOptions.height = window.innerWidth * .8 / 1.5;
//   stage.size({
//     width: stageOptions.width,
//     height: stageOptions.height
//   })

//   layer.scale({
//     x: 2,
//     y:2
//   })
//   layer.draw();
// })

control.addEventListener('focus', function (e) {
  var id = e.target.id;
  if (id === 'square' || id === 'rectangle' || id === 'echelo1' || id === 'echelo2' || id === 'width' || id === 'height') {
    console.log(e.target.value)
    e.target.value = '';
  }
}, {
    capture: true
  })

width.addEventListener('change', function (e) {
  if (e.target.value > 1000) {
    e.target.value = '1000';
  }
})

height.addEventListener('change', function (e) {
  if (e.target.value > 550) {
    e.target.value = '550';
  }
})

btn.addEventListener('click', function () {
  var value = {
    square: dsquare.value,
    rectangle: drectangle.value,
    echelo1: dechelo1.value,
    echelo2: dechelo2.value,
    width: dwidth.value,
    height: dheight.value
  }
  var parts = json.parts;
  parts.forEach(function (item) {
    console.log(item)
    item.num = Number(value[item.name]);
  })
  json.sheet.width = Number(value.width);
  json.sheet.height = Number(value.height);
  draw(json.parts);
  console.log(json.parts)
})

btn2.addEventListener('click', function () {

  console.log(json)
  axios.post('http://192.168.1.136:8000/nest',{
  // axios.post('http://redmine.deepsingularity.net:18000/nest', {
    json
  })
    .then(function (res) {
      console.log(res.data);
      
      var str = (res.data.allutil.toFixed(4) * 100).toString().substr(0,5) + '%';
      dallutil.value = str;
      drawResult(res.data.Sheets);
    })
    .catch(function (error) {
      console.log(error);
    });

})
// draw(json.parts);