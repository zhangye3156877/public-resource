
// all
var charts = {
  GanttChart: null,
  Element: null,
  Axis: null,
  utils: null,
}
//工具函数
utils = {
  //lodash
  '_': _, 
  //moment
  moment,
  //获取字符偏移量
  getBytesLength: (str) => {
    let num = str.length;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        num++;
      }
    }
    return num;
  }
}

//各元素继承基类
charts.Element = function(options = {}){
  this.paddingLeft = options.paddingLeft || 100;
  this.paddingRight = options.paddingRight || 100;
  this.paddingTop = options.paddingTop || 100;
  this.paddingBottom = options.paddingBottom || 100;
  this.start = options.start; //暂定数据结构
  this.end = options.end; //暂定数据结构
  this.m = options.m; //暂定数据结构
  this.timeInterval = options.timeInterval || 1000 * 60 * 60 * 24;
  this.tickXInterval = options.tickXInterval || 200; //x轴每时间单位间隔长度，默认1天
  this.tickYInterval = options.tickYInterval || 100; //y轴每个设备单位间距
}
// 甘特图主体
charts.GanttChart = function (options = {}) {
  charts.Element.call(this, options);
  this.container = options.canvas;
  this.scollDom = $(`#container`);
  this.containerDom = $(`#${this.container}`);
  this.maskDom = $('#scroll-mask');
  this.canvasWrapDom = null;
  this.stage = null;
  this.layerAxis = null;
  this.width = options.width || window.innerWidth;
  this.height = options.height || window.innerHeight;
  this.axis = null;
}

charts.GanttChart.prototype.init = function (options = {}) {
  //固定样式
  this.maskDom.css({
    width: `${this.paddingLeft + this.paddingRight + this.width}px`,
    height: `${this.paddingTop + this.paddingBottom + this.height}px`,
  });
  this.containerDom.css({
    width: `${this.width}px`,
    height: `${this.height}px`
  });
  this.scollDom.scroll(this.scoll.bind(this));

  this.stage = new Konva.Stage({
    container: this.container,
    width: this.width,
    height: this.height
  });
  this.layerAxis = new Konva.Layer();
  if (options.axis !== false) {
    const ap = options.axis || {};
    this.axis = new charts.Axis(Object.assign(options.data, ap, {
      base: this,
      paddingLeft: this.paddingLeft,
      paddingRight: this.paddingRight,
      paddingTop: this.paddingTop,
      paddingBottom: this.paddingBottom
    }));
    this.layerAxis.add(this.axis.group);
  }
  this.stage.add(this.layerAxis);
}
// resize
charts.GanttChart.prototype.resize = function(options) {
  this.width = options.width || this.width;
  this.height = options.height || this.height;
  this.maskDom.css({
    width: `${this.paddingLeft + this.paddingRight + this.width}px`,
    height: `${this.paddingTop + this.paddingBottom + this.height}px`,
  });
}
// 滚动方法
charts.GanttChart.prototype.scoll = function (e) {
  const scollDom = this.scollDom;
  const containerDom = this.containerDom;
  const left = scollDom.scrollLeft();
  const top = scollDom.scrollTop();
  console.log(left, top);
  containerDom.css({
    transform: `translate3d(${left}px, ${top}px, 0)`
  });
  this.stage.setAttrs({
    x: -left,
    y: -top
  })
  this.layerAxis.draw();
}
// 轴线格局类
charts.Axis = function (options = {}) {
  charts.Element.call(this, options);
  this.base = options.base || null;
  this.strokeWidth = options.strokeWidth || 2;
  this.fontSize = options.fontSize || 15;
  this.axisColor = options.colors || '#d9d9d9';
  this.tickSize = options.tickSize || 10;
  this.tickXChidren = options.tickXChidren || 6;
  this.tickChidrenSize = options.tickChidrenSize || 5;
  this.gridColor = options.gridColor || '#d9d9d9';
  this.gridStrokeWidth = options.gridStrokeWidth || 1;
  this.axisX = null;
  this.axisY = null;
  this.tickX = null;
  this.tickY = null;
  this.axisXText = null;
  this.axisYText = null;
  this.gridX = null;
  this.gridY = null;
  this.group = new Konva.Group();
  this.init();
};
charts.Axis.prototype.init = function () {
  const start = utils.moment(this.start).valueOf();
  const end = utils.moment(this.end).valueOf();
  const axisXSize = utils.moment(end - start).valueOf() / this.timeInterval * this.tickXInterval;

  const axisYSize = this.m.count * this.tickYInterval;
  
  this.base.resize({
    width: axisXSize,
    height: axisYSize
  })
  this.axisX = new Konva.Line({
    points: [this.paddingLeft, this.paddingTop, this.paddingLeft + axisXSize, this.paddingTop],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  this.axisY = new Konva.Line({
    points: [this.paddingLeft, this.paddingTop, this.paddingLeft, this.paddingTop + axisYSize],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  this.axisXText = new Konva.Group();
  this.axisYText = new Konva.Group();
  this.gridX = new Konva.Group();
  this.gridY = new Konva.Group();
  let pathTicksForAxis = '';
  const childTickInternval = this.tickXInterval / this.tickXChidren;
  for (let i = 1; i <= axisXSize / childTickInternval; i ++) {
    pathTicksForAxis += `M${childTickInternval * i},0L${childTickInternval * i},${-this.tickChidrenSize}`;
  }
  for (let i = 1; i <= axisXSize / this.tickXInterval; i++) {
    pathTicksForAxis += `M${this.tickXInterval * i},0L${this.tickXInterval * i},${-this.tickSize}`;
    const str = utils.moment(start + this.timeInterval * i).format('MM-DD');
    const num = utils.getBytesLength(str);
    const text = new Konva.Text({
      x: this.tickXInterval * i - this.fontSize * num / 4,
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor
    });
    const line = new Konva.Line({
      points: [this.paddingLeft + this.tickXInterval * i, this.paddingTop, this.paddingLeft + this.tickXInterval * i, this.paddingTop + axisYSize],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.axisXText.add(text);
    this.gridY.add(line);
  }
  for (let i = 1; i <= axisYSize / this.tickYInterval; i++) {
    // pathTicksForAxis += `M0,${this.tickYInterval * i}L${-this.tickSize},${this.tickYInterval * i}`;
    const str = this.m.data[i - 1].name;
    const num = utils.getBytesLength(str);

    const text = new Konva.Text({
      x: -this.fontSize * num / 2 - this.tickSize - 3,
      y: this.tickYInterval * (i - .5),
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor,
    });
    const line = new Konva.Line({
      points: [this.paddingLeft , this.paddingTop + this.tickYInterval * i, this.paddingLeft + axisXSize, this.paddingTop + this.tickYInterval * i],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.axisYText.add(text);
    this.gridX.add(line)
  }

  this.tickX = new Konva.Path({
    x: this.paddingLeft,
    y: this.paddingTop,
    data: pathTicksForAxis,
    stroke: this.axisColor,
  });
  this.axisXText.setAttrs({
    x: this.paddingLeft,
    y: this.paddingTop - this.tickSize - this.fontSize
  });
  this.axisYText.setAttrs({
    x: this.paddingLeft,
    y: this.paddingTop,
  })
  this.group.add(this.axisX, this.axisY, this.tickX, this.axisXText, this.axisYText, this.gridX, this.gridY);
};
