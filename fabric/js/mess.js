(function () {

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
    width: window.innerWidth,
    height: 550,
    ratio: 250 / 190,
    iw: 400,
    n: 1,
    left: 20,
    top: 30,
    font: 30,
  }
  var data = null;
  var timer = null;

  var stage = new Konva.Stage({
    container: stageOptions.container,
    width: stageOptions.width,
    height: stageOptions.height
  });

  var layer = new Konva.Layer();
  var group = new Konva.Group();

  function random(min, max) {
    return parseInt(Math.random() * (max - min) + 1) + min;
  }
  function resizeFn() {
    var w = window.innerWidth * .8;
    stageOptions.width = w;
    drawResult(data);
  }
  function drawResult(data) {
    group.destroyChildren();
    console.log(data)
    if (data === null) return;
    // 每行最大放置数
    // var bx = Math.floor(stageOptions.width / stageOptions.iw);
    var bx = stageOptions.n;
    var bh = Math.round(data.length / bx);
    // var margins = (stageOptions.width - stageOptions.iw * bx) / (bx + 1);
    var margins = stageOptions.left;
    //适配的框高
    //var ratio = json.sheet.width / json.sheet.height;
    var ratio = stageOptions.ratio;
    var width = stageOptions.width * .8;
   
    // var newH = bh * height + (bh + 1) * stageOptions.top;
    if (width > 900) {
      width = 900;
    }
    var height = width / ratio;
    stage.size({
      width: width + 2 * margins,
      height: height + 50
    })

    stageOptions.left = margins;
    //console.log(stageOptions.left,)
    data.forEach(function (item, index) {
      var ytimes = Math.floor(index / bx);
      var offsetX = stageOptions.left * (index % bx + 1) + width * (index % bx);
      var offsetY = stageOptions.top * (ytimes + 1) + height * ytimes;
      var showFont = `${item.name}-利用率:${(item.util.toFixed(4) * 100).toString().substr(0, 5)}%`
      // var showFont = `板材${index + 1}`
      //var offsetFont = offsetX + (width - stageOptions.font * showFont.length) / 2;
      console.log(stageOptions.font * showFont.length)
      var text = new Konva.Text({
        x: offsetX + 10,
        y: offsetY - 30,
        text: showFont,
        fontSize: stageOptions.font,
        fontFamily: 'Calibri',
        fill: 'white'
      });

      var rect = new Konva.Rect({
        x: offsetX,
        y: offsetY,
        width,
        height,
        //height: item.height,
        fill: 'rgba(42,48,157,.37)',
        stroke: '#617bb5'
      });
      group.add(rect, text);
      item.Parts.forEach(function (i, n) {
        var shape = new Konva.Line({
          x: offsetX,
          y: offsetY,
          points: i.points,
          fill: 'red',
          stroke: '#617bb5',
          strokeWidth: 1,
          opacity: 0,
          closed: true,
        })
        shape.scale({
          x: width / item.width,
          y: height / item.height
        });
        group.add(shape);
        var tween = new Konva.Tween({
          node: shape,
          duration: .5,
          opacity: 1,
          easing: Konva.Easings.EaseInOut,
          onFinish: () => {
            shape.setAttrs({
              fill: i['hight_light'] === 1? 'green' : '#8498d1',
            })
          }
        });
        setTimeout(() => {
          tween.play();
        }, 100 * n)
      })

    })

    layer.draw();
  }

  function request() {
    axios.get('http://192.168.1.136:8000/recv')
    .then(function(res) {
      console.log(res.data);
      if (res.data.Sheets) {
        data = res.data.Sheets;
        drawResult(res.data.Sheets);
      } 
      setTimeout(function() {
        request();
      }, 2000)
    })
  }

  window.addEventListener('resize', (function (timer) {
    return function () {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        resizeFn()
      }, 300)
    }
  }(null)))

  window.addEventListener('DOMContentLoaded', function () {
    console.log('文档载入完毕哦');
    stage.add(layer);
    layer.add(group);
    resizeFn();
    request();
  })
}())