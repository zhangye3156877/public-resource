
// all
var charts = {
  GanttChart: null,
  Axis: null,
}
// 甘特图主体
charts.GanttChart = function (options = {}) {
  this.container = options.canvas;
  this.scollDom = null;
  this.canvasWrapDom = null;
  this.stage = null;
  this.layer = null;
  this.width = options.width || window.innerWidth;
  this.height = options.height || window.innerHeight;
  this.paddingLeft = options.paddingLeft || 0;
  this.paddingRight = options.paddingRight || 0;
  this.paddingTop = options.paddingTop || 0;
  this.paddingBottom = options.paddingBottom || 0;
  this.axis = null;
}
charts.GanttChart.prototype.init = function (options = {}) {
  //固定样式
  const scollDom = $(`#container`);
  this.scollDom = scollDom;
  this.canvasWrapDom = $(`#${this.container}`);
  const left = scollDom.scrollLeft();
  const top = scollDom.scrollTop();
  const width = options.axis.axisXSize || 0;
  const height = options.axis.axisYSize || 0;

  $('#scroll-mask').css({
    width: `${this.paddingLeft + this.paddingRight + width}px`,
    height: `${this.paddingTop + this.paddingBottom + height}px`,
  });
  $(`#${this.container}`).css({
    width: `${this.width}px`,
    height: `${this.height}px`
  });
  $('#container').scroll(this.scoll.bind(this));

  this.stage = new Konva.Stage({
    container: this.container,
    width: this.width,
    height: this.height
  });
  this.layer = new Konva.Layer();
  if (options.axis !== false) {
    let ap = options.axis || {};
    this.axis = new charts.Axis(Object.assign(ap, {
      paddingLeft: this.paddingLeft,
      paddingRight: this.paddingRight,
      paddingTop: this.paddingTop,
      paddingBottom: this.paddingBottom
    }));
    this.layer.add(this.axis.group);
  }
  this.stage.add(this.layer);
}

// 滚动方法
charts.GanttChart.prototype.scoll = function (e) {
  const scollDom = this.scollDom;
  const canvasWrapDom = this.canvasWrapDom;
  const left = scollDom.scrollLeft();
  const top = scollDom.scrollTop();
  console.log(left, top);
  canvasWrapDom.css({
    transform: `translate3d(${left}px, ${top}px, 0)`
  });
  this.layer.setAttrs({
    x: -left,
    y: -top
  })
  this.layer.draw();
}
// 轴线格局类
charts.Axis = function (options = {}) {
  this.paddingLeft = options.paddingLeft || 0;
  this.paddingRight = options.paddingRight || 0;
  this.paddingTop = options.paddingTop || 0;
  this.paddingBottom = options.paddingBottom || 0;
  this.strokeWidth = options.strokeWidth || 2;
  this.fontSize = options.fontSize || 15;
  this.axisColor = options.colors || '#d9d9d9';
  this.axisXSize = options.axisXSize || 0;
  this.axisYSize = options.axisYSize || 0;
  this.tickSize = options.tickSize || 10;
  this.tickXInterval = options.tickXInterval || 200;
  this.tickYInterval = options.tickYInterval || 100;
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

  function getBytesLength(str) {
    let num = str.length;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        num++;
      }
    }
    return num;
  }

  this.axisX = new Konva.Line({
    points: [this.paddingLeft, this.paddingTop, this.paddingLeft + this.axisXSize, this.paddingTop],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  this.axisY = new Konva.Line({
    points: [this.paddingLeft, this.paddingTop, this.paddingLeft, this.paddingTop + this.axisYSize],
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
  for (let i = 1; i <= this.axisXSize / childTickInternval; i ++) {
    pathTicksForAxis += `M${childTickInternval * i},0L${childTickInternval * i},${-this.tickChidrenSize}`;
  }
  for (let i = 1; i <= this.axisXSize / this.tickXInterval; i++) {
    pathTicksForAxis += `M${this.tickXInterval * i},0L${this.tickXInterval * i},${-this.tickSize}`;
    const str = `横轴${i}`;
    const num = getBytesLength(str);
    const text = new Konva.Text({
      x: this.tickXInterval * i - this.fontSize * num / 4,
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor
    });
    const line = new Konva.Line({
      points: [this.paddingLeft + this.tickXInterval * i, this.paddingTop, this.paddingLeft + this.tickXInterval * i, this.paddingTop + this.axisYSize],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.axisXText.add(text);
    this.gridY.add(line);
  }
  for (let i = 1; i <= this.axisYSize / this.tickYInterval; i++) {
    // pathTicksForAxis += `M0,${this.tickYInterval * i}L${-this.tickSize},${this.tickYInterval * i}`;
    const str = `纵轴${i}`;
    const num = getBytesLength(str);

    const text = new Konva.Text({
      x: -this.fontSize * num / 2 - this.tickSize - 3,
      y: this.tickYInterval * (i - .5),
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor,
    });
    const line = new Konva.Line({
      points: [this.paddingLeft , this.paddingTop + this.tickYInterval * i, this.paddingLeft + this.axisXSize, this.paddingTop + this.tickYInterval * i],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    console.log(line)
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
