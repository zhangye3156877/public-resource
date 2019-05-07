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
  var chartdom1 = document.getElementById('chart1');
  var chartdom2 = document.getElementById('chart2');
  var chartdom3 = document.getElementById('chart3');


  var stageOptions = {
    container: 'container',
    width: window.innerWidth,
    height: 550,
    ratio: 250 / 190,
    iw: 400,
    n: 3,
    left: 20,
    top: 30,
    font: 30,
    myChart1: null,
    myChart2: null,
    myChart3: null
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
  function resizeFn() {
    var w = window.innerWidth;
    stageOptions.width = w;
    drawResult([...resultJson.Sheets, ...resultJson.Sheets, ...resultJson.Sheets]);
    if (w / 12 * 3 > 400) {
      chartdom1.style.width = '400px';
      chartdom2.style.width = '533px';
      chartdom3.style.width = '666px';
      chartdom1.style.height = '400px';
      chartdom2.style.height = '400px';
      chartdom3.style.height = '400px';
      chartdom1.style.marginLeft = (w - 400 - 540 - 667) / 4 + 'px';
      chartdom2.style.marginLeft = (w - 400 - 540 - 667) / 4 + 'px';
      chartdom3.style.marginLeft = (w - 400 - 540 - 667) / 4 + 'px';
    } else {
      chartdom1.style.width = w / 12 * 3 - 20 + 'px';
      chartdom2.style.width = w / 12 * 4 - 20 + 'px';
      chartdom3.style.width = w / 12 * 5 - 20 + 'px';
      chartdom1.style.height = w / 4 - 20 + 'px';
      chartdom2.style.height = w / 4 - 20 + 'px';
      chartdom3.style.height = w / 4 - 20 + 'px';
      chartdom1.style.marginLeft = '0px';
      chartdom2.style.marginLeft = '0px';
      chartdom3.style.marginLeft = '0px';
    }

    console.log(w)
    stageOptions.myChart1.resize();
    stageOptions.myChart2.resize();
    stageOptions.myChart3.resize();
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
      height: height + 50
    })

    stageOptions.left = margins;
    //console.log(stageOptions.left,)
    data.forEach(function (item, index) {
      var ytimes = Math.floor(index / bx);
      var offsetX = stageOptions.left * (index % bx + 1) + width * (index % bx);
      var offsetY = stageOptions.top * (ytimes + 1) + height * ytimes;
      //var showFont = `${item.name}-利用率:${(item.util.toFixed(4) * 100).toString().substr(0, 5)}%`
      var showFont = `板材${index + 1}`
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
    stageOptions.myChart1 = echarts.init(document.getElementById('chart1'));
    stageOptions.myChart2 = echarts.init(document.getElementById('chart2'));
    stageOptions.myChart3 = echarts.init(document.getElementById('chart3'));
    stageOptions.myChart1.showLoading();
    stageOptions.myChart2.showLoading();
    stageOptions.myChart3.showLoading();
    // 指定图表的配置项和数据
    var option1 = {

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
            value: [62, 15, 99, 78, 36, 83],
            name: '零件数量',
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return params.value;
                }
              }
            },
            lineStyle: {
              normal: {
                type: 'dashed'
              }
            }
          }
        ]
      }]
    };
    var option2 = {
      legend: {},
      tooltip: {},
      title: [
        {
          textAlign: 'center',
          text: '总体利用率',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: 'white'
          },
          left: '20%',
          top: '10%'
        },
        {
          textAlign: 'center',
          text: '板材1利用率',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: 'white'
          },
          left: '70%',
          top: '10%'
        },
        {
          textAlign: 'center',
          text: '板材2利用率',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: 'white'
          },
          left: '20%',
          top: '55%'
        },
        {
          textAlign: 'center',
          text: '板材3利用率',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: 'white'
          },
          left: '70%',
          top: '55%'
        }
      ],
      animationDuration: 2000,
      dataset: {
        source: [
          ['%', 'all', 'sheet1', 'sheet2', 'sheet3'],
          ['利用率', 25, 10, 20, 30],
          ['未利用率', 75, 90, 80, 70],
        ]
      },
      series: [{
        name: 'a',
        type: 'pie',
        radius: 60,
        center: ['25%', '30%'],
        title: 'a',
        encode: {
          itemName: '%',
          value: 'all'
        }
      }, {
        name: 'b',
        type: 'pie',
        radius: 60,
        center: ['75%', '30%'],
        encode: {
          itemName: '%',
          value: 'sheet1'
        }
      }, {
        type: 'pie',
        radius: 60,
        center: ['25%', '75%'],
        encode: {
          itemName: '%',
          value: 'sheet2'
        }
      }, {
        type: 'pie',
        radius: 60,
        center: ['75%', '75%'],
        encode: {
          itemName: '%',
          value: 'sheet3'
        }
      }]
    };
    var option3 = {
      title: [
        {
          textAlign: 'center',
          text: '群智算法',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: 'red'
          },
          left: '50%',
          top: '50%'
        },
        {
          textAlign: 'center',
          text: '普通算法',
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
            color: 'rgba(114, 172, 209, 1)'
          },
          left: '50%',
          top: '75%'
        },
      ],
      xAxis: {
        type: 'category',
        data: ['100', '200', '300', '400', '500', '600', '700'],
        name: '计算数量',
        nameTextStyle: {
          fontSize: 12,
          fontWeight: 'normal',
          color: 'white'
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 'normal',
          color: 'white'
        },
      },
      yAxis: {
        type: 'value',
        name: '效率%',
        nameTextStyle: {
          fontSize: 12,
          fontWeight: 'normal',
          color: 'white'
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 'normal',
          color: 'white'
        },
      },
      series: [
        {
          name: 'a',
          data: [5, 10, 20, 30, 45, 70, 100],
          type: 'line',
          smooth: true,
        },
        {
          name: 'b',
          data: [5, 8, 12, 15, 20, 25, 40],
          lineStyle: {
            color: 'rgba(114, 172, 209, 1)'
          },
          type: 'line',
          smooth: true
        }
      ]
    };

    stageOptions.myChart1.hideLoading();
    stageOptions.myChart2.hideLoading();
    stageOptions.myChart3.hideLoading();
    stageOptions.myChart1.setOption(option1);
    stageOptions.myChart2.setOption(option2);
    stageOptions.myChart3.setOption(option3);
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
    initEcharts();
    resizeFn()
  })
}())