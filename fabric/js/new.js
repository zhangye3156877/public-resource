
// var inputs = document.querySelectorAll('input[type="text"]');
// var btn = document.getElementById('btn');
// var btn2 = document.getElementById('btn2');
// var dsquare = document.getElementById('square');
// var drectangle = document.getElementById('rectangle');
// var dechelo1 = document.getElementById('echelo1');
// var dechelo2 = document.getElementById('echelo2');
// var dwidth = document.getElementById('width');
// var dheight = document.getElementById('height');
// var dallutil = document.getElementById('allutil');

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
function draw(data) {
  group.destroyChildren();
  var flats = data.map(function (item) {
    return Array(item.num > 20 ? 20 : item.num).fill(item);
  })
  var all = [];
  flats.forEach((item) => {
    all.push(...item);
  })
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
  console.log(data)
  // 每行最大放置数
  var bx = Math.floor(stageOptions.width / stageOptions.iw);
  var bh = Math.round(data.length / bx);
  var margins = (stageOptions.width - stageOptions.iw * bx) / (bx + 1);
  //适配的框高
  //var ratio = json.sheet.width / json.sheet.height;
  var ratio = 250 / 210;
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
    item.Parts.forEach(function (i, n) {
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
      var radius = Math.random() * 100 + 20;
      var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
      var color = colors[Math.round(Math.random() * 5)];
      new Konva.Tween({
        node: shape,
        duration: 1,
        x: Math.random() * stage.width(),
        y: Math.random() * stage.height(),
        rotation: Math.random() * 360,
        radius: radius,
        opacity: (radius - 20) / 100,
        easing: Konva.Easings.EaseInOut,
        fill: color
      }).play();
    })

  })

  layer.draw();
}

drawResult(resultJson.Sheets);

