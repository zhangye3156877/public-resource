
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

// 甘特图主体
charts.GanttChart = function (options = {}) {
  this.container = options.canvas;
  this.scollDom = $(`#container`);
  this.containerDom = $(`#${this.container}`);
  this.maskDom = $('#scroll-mask');
  this.canvasWrapDom = null;
  this.maskDomWidth = null;
  this.maskDomHeight = null;
  this.stage = null;
  this.layerAxis = new Konva.FastLayer();
  this.layerBasicShapes = new Konva.Layer();
  this.layerSwitch = new Konva.Layer();
  this.width = options.width || 1000;
  this.height = options.height || 600;
  this.paddingLeft = options.paddingLeft || 100;
  this.paddingRight = options.paddingRight || 100;
  this.paddingTop = options.paddingTop || 100;
  this.paddingBottom = options.paddingBottom || 100;
  this.data = options.data;
  this.timeInterval = options.timeInterval || 1000 * 60 * 60 * 24;
  this.tickXInterval = options.tickXInterval || 200; //x轴每时间单位间隔长度，默认1天
  this.tickYInterval = options.tickYInterval || 100; //y轴每个设备单位间距
  this.startTime = utils.moment(options.startTime).valueOf();
  this.endTime = utils.moment(options.endTime).valueOf();
  this.itemDiffX = this.paddingLeft;
  this.itemDiffY = this.paddingTop;
  this.startItemX = 0;
  this.startItemY = 0;
  this.renderCountX = 0;
  this.renderCountY = 0;
  this.axisOption = options.axisOption || {};
  this.restsOptions = options.restsOptions || {};
  this.axis = null;
  this.rests = null;
  this.init();
}

charts.GanttChart.prototype.init = function () {
  //固定样式
  const width = this.paddingLeft + this.paddingRight + this.width;
  const height = this.paddingTop + this.paddingBottom + this.height;
  this.maskDomWidth = width;
  this.maskDomHeight = height;

  this.maskDom.css({
    width: `${width}px`,
    height: `${height}px`,
  });
  this.containerDom.css({
    width: `${this.width}px`,
    height: `${this.height}px`
  });
  $("#container").css({
    width: `${this.width}px`,
    height: `${this.height}px`
  })
  this.scollDom.scroll(this.scoll.bind(this));
  //this.scollDom.scroll(utils._.debounce(this.scoll.bind(this), 20));
  this.stage = new Konva.Stage({
    container: this.container,
    width: this.width,
    height: this.height
  });

  //坐标轴
  if (this.axisOption !== false) {
    this.axis = new charts.Axis(Object.assign({ base: this }, this.axisOption));
  }
  // 工序
  if (this.workingOptions !== false) {
    this.working = new charts.Working(Object.assign({ base: this }, this.workingOptions));
  }
  // 设备休息区-读取图片
  const readFile = new Promise((resove => {
    if (this.restsOptions !== false) {
      const image = new Image();
      image.onload = () => {
        this.restsOptions.image = image;
        this.rests = new charts.Rests(Object.assign({ base: this }, this.restsOptions));
        resove();
      };
      image.src = './img/texture.png';
    } else {
      resove();
    }
  }))

  readFile.then(() => {
    this.stage.add(this.layerAxis, this.layerBasicShapes);
  })

}
// resize
charts.GanttChart.prototype.resize = function (options) {
  const width = this.paddingLeft + this.paddingRight + options.width;
  const height = this.paddingTop + this.paddingBottom + options.height;
  this.maskDomWidth = width;
  this.maskDomHeight = height;
  this.maskDom.css({
    width: `${width}px`,
    height: `${height}px`,
  });
}
// 滚动方法
charts.GanttChart.prototype.scoll = function (e) {
  const scollDom = this.scollDom;
  const containerDom = this.containerDom;
  const left = scollDom.scrollLeft();
  const top = scollDom.scrollTop();
  containerDom.css({
    transform: `translate3d(${left}px, ${top}px, 0)`
  });
  this.draw(left, top);
}
// 绘图
charts.GanttChart.prototype.draw = function (x, y) {
  // 销毁子集
  this.layerBasicShapes.destroyChildren();
  this.layerAxis.destroyChildren();
  //改变数据集
  this.axis.upDate(x, y);
  this.working.upDate();
  this.rests.upDate(x, y);
  // 重绘
  this.layerBasicShapes.batchDraw();
  this.layerAxis.batchDraw();
}
// 轴线格局类
charts.Axis = function (options = {}) {
  this.base = options.base;
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
  this.init();
};
charts.Axis.prototype.init = function () {
  const {
    startTime,
    endTime,
    data,
    width,
    height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    timeInterval,
    tickXInterval,
    tickYInterval
  } = this.base;
  const axisXSize = utils.moment(endTime - startTime).valueOf() / timeInterval * tickXInterval;
  const axisYSize = data.length * tickYInterval;
  this.base.resize({
    width: axisXSize,
    height: axisYSize
  });
  let axisXLang = paddingLeft + paddingRight + axisXSize;
  this.axisXLang = axisXLang = axisXLang > width ? width : axisXLang;

  this.axisX = new Konva.Line({
    x: paddingLeft,
    y: paddingTop,
    points: [0, 0, axisXLang, 0],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  let axisYLang = paddingTop + paddingBottom + axisYSize;
  this.axisYLang = axisYLang = axisYLang > height ? height : axisYLang;
  this.axisY = new Konva.Line({
    x: paddingLeft,
    y: paddingTop,
    points: [0, 0, 0, axisYLang],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });

  let pathTicksForAxis = '';
  const childTickInternval = tickXInterval / this.tickXChidren;
  for (let i = 1; i <= axisXSize / childTickInternval; i++) {
    pathTicksForAxis += `M${childTickInternval * i},0L${childTickInternval * i},${-this.tickChidrenSize}`;
  }
  for (let i = 1; i <= axisXSize / tickXInterval; i++) {
    pathTicksForAxis += `M${tickXInterval * i},0L${tickXInterval * i},${-this.tickSize}`;
    const str = utils.moment(startTime + timeInterval * i).format('MM-DD');
    const num = utils.getBytesLength(str);
    const text = new Konva.Text({
      x: paddingLeft + tickXInterval * i - this.fontSize * num / 4,
      y: paddingTop - this.tickSize - this.fontSize,
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor
    });
    const line = new Konva.Line({
      points: [paddingLeft + tickXInterval * i, paddingTop, paddingLeft + tickXInterval * i, paddingTop + axisYSize],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.base.layerAxis.add(text, line);
  }
  for (let i = 1; i <= axisYSize / tickYInterval; i++) {
    const str = data[i - 1].group.name;
    const num = utils.getBytesLength(str);

    const text = new Konva.Text({
      x: paddingLeft - this.fontSize * num / 2 - this.tickSize - 3,
      y: paddingTop + tickYInterval * (i - .5),
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor,
    });
    const line = new Konva.Line({
      points: [paddingLeft, paddingTop + tickYInterval * i, paddingLeft + axisXSize, paddingTop + tickYInterval * i],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.base.layerAxis.add(text, line);
  }

  this.tickX = new Konva.Path({
    x: paddingLeft,
    y: paddingTop,
    data: pathTicksForAxis,
    stroke: this.axisColor,
  });
  this.base.layerAxis.add(this.axisX, this.axisY, this.tickX);
};
charts.Axis.prototype.upDate = function (x, y) {
  const {
    startTime,
    endTime,
    data,
    width,
    height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    maskDomWidth,
    maskDomHeight,
    timeInterval,
    tickXInterval,
    tickYInterval
  } = this.base;

  const diffX = maskDomWidth - width;
  const diffY = maskDomHeight - height;
  let axisXDiffX;
  let axisXDiffY;
  let axisYDiffX;
  let axisYDiffY;
  let startItemX = 0;
  let startItemY = 0;
  let itemDiffX;
  let itemDiffY;

  if (x <= paddingLeft) {
    itemDiffX = axisXDiffX = axisYDiffX = paddingLeft - x;
  } else if (x > paddingLeft && (diffX - x) < paddingRight) {
    axisXDiffX = diffX - x - paddingRight;
    axisYDiffX = -this.strokeWidth;
    itemDiffX = -(x - paddingLeft) % tickXInterval;
    startItemX = Math.floor((x - paddingLeft) / tickXInterval);
  } else {
    axisXDiffX = 0;
    axisYDiffX = -this.strokeWidth;
    itemDiffX = -(x - paddingLeft) % tickXInterval;
    startItemX = Math.floor((x - paddingLeft) / tickXInterval);
  }

  if (y <= paddingTop) {
    itemDiffY = axisXDiffY = axisYDiffY = paddingTop - y;
  } else if (y > paddingTop && (diffY - y) < paddingBottom) {
    axisXDiffY = -this.strokeWidth;
    axisYDiffY = diffY - y - paddingBottom;
    itemDiffY = -(y - paddingTop) % tickYInterval;
    startItemY = Math.floor((y - paddingTop) / tickYInterval);
  } else {
    axisXDiffY = -this.strokeWidth;
    axisYDiffY = 0;
    itemDiffY = -(y - paddingTop) % tickYInterval;
    startItemY = Math.floor((y - paddingTop) / tickYInterval);
  }

  this.base.itemDiffX = itemDiffX;
  this.base.itemDiffY = itemDiffY;
  this.base.startItemX = startItemX;
  this.base.startItemY = startItemY;
  this.base.renderCountX = this.axisXLang / tickXInterval + 1;
  this.base.renderCountY = this.axisYLang / tickYInterval + 1;
  const xEnd = this.base.renderCountX + startItemX;
  const yEnd = this.base.renderCountY + startItemY;
  this.axisX = new Konva.Line({
    x: axisXDiffX,
    y: axisXDiffY,
    points: [0, 0, this.axisXLang, 0],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  this.axisY = new Konva.Line({
    x: axisYDiffX,
    y: axisYDiffY,
    points: [0, 0, 0, this.axisYLang],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  let pathTicksForAxis = '';
  const childTickInternval = tickXInterval / this.tickXChidren;

  for (let i = startItemX; i <= xEnd; i++) {
    const diff = i - startItemX + 1;
    const str = utils.moment(startTime + timeInterval * (i + 1)).format('MM-DD');
    const num = utils.getBytesLength(str);
    pathTicksForAxis += `M${tickXInterval * diff},0L${tickXInterval * diff},${-this.tickSize}`;
    const chidrenXEnd = timeInterval * (i + 1) + startTime <= + endTime;
    for (let j = 1; j < this.tickXChidren; j++) {
      if (chidrenXEnd) {
        pathTicksForAxis += `M${tickXInterval * (diff - 1) + childTickInternval * j},0L${tickXInterval * (diff - 1) + childTickInternval * j},${-this.tickChidrenSize}`;
      }
    }
    const text = new Konva.Text({
      x: itemDiffX + tickXInterval * diff - this.fontSize * num / 4,
      y: axisYDiffY - this.tickSize - this.fontSize,
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor
    });
    const line = new Konva.Line({
      x: itemDiffX,
      y: axisYDiffY,
      points: [tickXInterval * diff, 0, tickXInterval * diff, this.axisYLang],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.base.layerAxis.add(line, text);
  }

  for (let i = startItemY; i <= yEnd; i++) {
    const diff = i - startItemY + 1;
    if (i < data.length) {
      const str = data[i].group.name;
      const num = utils.getBytesLength(str);
      const text = new Konva.Text({
        x: axisXDiffX - this.fontSize * num / 2 - this.tickSize - 3,
        y: itemDiffY + tickYInterval * (diff - .5),
        text: str,
        fontSize: this.fontSize,
        fontFamily: 'Calibri',
        fill: this.axisColor,
      });
      this.base.layerAxis.add(text);
    }

    const line = new Konva.Line({
      x: axisXDiffX,
      y: itemDiffY,
      points: [0, tickYInterval * diff, this.axisXLang, tickYInterval * diff],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.base.layerAxis.add(line);
  }

  this.tickX = new Konva.Path({
    x: itemDiffX,
    y: axisYDiffY,
    data: pathTicksForAxis,
    stroke: this.axisColor,
  });
  this.base.layerAxis.add(this.axisX, this.axisY, this.tickX);

}
// 工序类
charts.Working = function (options = {}) {
  this.base = options.base;
  this.group = new Konva.Group();
  this.init();
}
charts.Working.prototype.init = function () {
  const { data, itemDiffX, itemDiffY } = this.base;
  const rect = new Konva.Rect({
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    fill: 'red'
  });
  this.group.add(rect);
  this.base.layerBasicShapes.add(this.group);

}
charts.Working.prototype.upDate = function () {
  const {
    data,
    timeInterval,
    tickXInterval,
    startTime,
    endTime,
    itemDiffX,
    itemDiffY,
    startItemX,
    startItemY,
    renderCountX,
    renderCountY } = this.base;

  this.startTime = utils.moment('2019-06-29').valueOf();
  this.endTime = utils.moment('2019-07-01').valueOf();
  const startTimeShow = startTime + startItemX * timeInterval;
  const endTimeShow = startTimeShow + renderCountX * timeInterval;
  if (this.endTime > startTimeShow && this.startTime < endTimeShow && startItemY < 1) {
    const start = Math.max(startTimeShow, this.startTime);
    const end = Math.min(endTimeShow, this.endTime, endTime);
    const rect = new Konva.Rect({
      x: itemDiffX + (start - startTimeShow) / timeInterval * tickXInterval,
      y: itemDiffY,
      width: (end - start) / timeInterval * tickXInterval,
      height: 100,
      fill: 'red'
    });
    this.group.add(rect);
  }


  
  this.base.layerBasicShapes.add(this.group);
}
// 休息时间
charts.Rests = function (options = {}) {
  this.base = options.base;
  this.xx = 50;
  this.yy = 5;
  this.image = options.image;
  this.group = new Konva.Group();
  this.init();
}
charts.Rests.prototype.init = function () {
  const { width, height, paddingLeft, paddingRight, paddingTop, paddingBottom } = this.base;
  for (let i = 0, j = 0; i < 50; i++ , j = 0) {
    for (; j < 5; j++) {
      // const re = new Konva.Image({
      //   x: 150 * i ,
      //   y: 150 * j,
      //   width: 100,
      //   height: 100,
      //   image: this.image,
      //   text: 'ff'
      // });
      const re = new Konva.Text({
        x: 200 * i + paddingLeft,
        y: 150 * j,
        text: `${i}列${j}行`,
        fontSize: 30
      })
      this.group.add(re);
      //this.base.layerBasicShapes.add(this.group);
    }
  }
}
charts.Rests.prototype.upDate = function (x, y) {
  //console.log(x,y,this.base);
  const { width, height, paddingLeft, paddingRight, paddingTop, paddingBottom } = this.base;
  const dw = 200;
  const dh = 150;
  let offsetX;
  let offsetY;
  let startX;
  let startY;
  if (x < paddingLeft) {
    offsetX = paddingLeft - x;
    startX = 0;
  } else {
    offsetX = -(x - paddingLeft) % dw;
    startX = Math.floor((x - paddingLeft) / dw);
  }
  if (y < paddingTop) {
    offsetY = paddingTop - y;
    startY = 0;
  } else {
    offsetY = -(y - paddingTop) % dh;
    startY = Math.floor((y - paddingTop) / dh);
  }

  const numX = Math.floor(width / dw) + 1;
  const numY = Math.floor(height / dh) + 1;

  for (let i = startX, j = startY; i < startX + numX; i++ , j = startY) {
    for (; j < startY + numY; j++) {
      const rr = new Konva.Rect({
        x: 200 * (i - startX) + offsetX,
        y: 150 * (j - startY) + offsetY,
        width: 196,
        height: 146,
        stroke: 'red'
      })
      const re = new Konva.Text({
        x: 200 * (i - startX) + offsetX,
        y: 150 * (j - startY) + offsetY,
        text: `${i}列${j}行`,
        fontSize: 30
      })
      this.group.add(re, rr);
    }
  }
  // this.base.layerBasicShapes.add(this.group);
}
