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
    ratio: 250 / 210,
    iw: 400,
    n: 3,
    left: 20,
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

  function random(min, max) {
    return parseInt(Math.random() * (max - min) + 1) + min;
  }

  function drawResult(data) {
    group.destroyChildren();
    console.log(data)
    // 每行最大放置数
    // var bx = Math.floor(stageOptions.width / stageOptions.iw);
    var bx = stageOptions.n;
    var bh = Math.round(data.length / bx);
    // var margins = (stageOptions.width - stageOptions.iw * bx) / (bx + 1);
    var margins = stageOptions.left;
    //适配的框高
    //var ratio = json.sheet.width / json.sheet.height;
    var ratio = stageOptions.ratio;
    var width = (stageOptions.width - (bx + 1) * stageOptions.left) / bx;
    if (width > 400) {
      width = 400;
      margins = (stageOptions.width - bx * width) / (bx + 1);
    }
    var height = width / ratio;
    // var newH = bh * height + (bh + 1) * stageOptions.top;
    stage.size({
      width: stageOptions.width,
      height: height + 100
    })

    stageOptions.left = margins;
    //console.log(stageOptions.left,)
    data.forEach(function (item, index) {
      var ytimes = Math.floor(index / bx);
      var offsetX = stageOptions.left * (index % bx + 1) + width * (index % bx);
      var offsetY = stageOptions.top * (ytimes + 1) + height * ytimes;
      //var showFont = `${item.name}-利用率:${(item.util.toFixed(4) * 100).toString().substr(0, 5)}%`
      var showFont = `${item.name}`
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
              fill: '#8498d1',
            })
          }
        });
        setTimeout(() => {
          tween.play();
        }, 500 * n)
      })

    })

    layer.draw();
  }

  function initEcharts() {
    var myChart = echarts.init(document.getElementById('chart1'));

    // 指定图表的配置项和数据
    var option = {

      tooltip: {},
      // legend: {
      //   data: ['零件数量']
      // },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: '零件A', max: 100 },
          { name: '零件B', max: 100 },
          { name: '零件C', max: 100 },
          { name: '零件D', max: 100 },
          { name: '零件E', max: 100 },
          { name: '零件F', max: 100 }
        ],
        splitArea: {
          areaStyle: {
            color: ['rgba(114, 172, 209, 0.2)',
              'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
              'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10
          }
        },
      },
      series: [{
        name: '??',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [12, 5, 1, 18, 66, 33],
            name: '零件数量',
            label: {
              normal: {
                  show: true,
                  formatter:function(params) {
                      return params.value;
                  }
              }
            }
          }
        ]
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

  window.addEventListener('resize', (function (timer) {
    return function () {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        stageOptions.width = window.innerWidth;
        drawResult([...resultJson.Sheets, ...resultJson.Sheets, ...resultJson.Sheets]);
      }, 500)
    }
  }(null)))

  window.addEventListener('DOMContentLoaded', function () {
    console.log('文档载入完毕哦');
    stage.add(layer);
    layer.add(group);
    drawResult([...resultJson.Sheets, ...resultJson.Sheets, ...resultJson.Sheets]);
    initEcharts();
  })
}())