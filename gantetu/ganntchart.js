
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
  this.layerFast = new Konva.FastLayer();
  this.layerBasicShapes = new Konva.Layer();
  this.layerSwitch = new Konva.Layer();
  this.width = options.width || 1500;
  this.height = options.height || 600;
  this.paddingLeft = options.paddingLeft || 100;
  this.paddingRight = options.paddingRight || 100;
  this.paddingTop = options.paddingTop || 100;
  this.paddingBottom = options.paddingBottom || 100;
  this.data = options.data;
  this.timeIntervalSelection = [
    1000 * 60 * 60 * 6, // 6hour
    1000 * 60 * 60 * 12, // 12hour
    1000 * 60 * 60 * 24, //1 day
    1000 * 60 * 60 * 24 * 7, // 1 week
    1000 * 60 * 60 * 24 * 7 * 2, //2 week
    1000 * 60 * 60 * 24 * 7 * 4, // 4 week
  ];
  this.timeIntervalSelected = options.timeIntervalSelected || 2;
  this.timeInterval = this.timeIntervalSelection[this.timeIntervalSelected];
  this.tickXInterval = options.tickXInterval || 200; //x轴每时间单位间隔长度，默认1天
  this.tickYInterval = options.tickYInterval || 100; //y轴每个设备单位间距
  this.startTime = utils.moment(options.startTime).valueOf();
  this.endTime = utils.moment(options.endTime).valueOf();
  this.itemDiffX = this.paddingLeft; // x轴偏移量
  this.itemDiffY = this.paddingTop; // y轴偏移量
  this.startItemX = 0; // x轴当前起始显示数据位数
  this.startItemY = 0; // y轴当前起始显示数据位数
  this.renderCountX = 0; // x轴可渲染数量
  this.renderCountY = 0; // y轴可渲染数量
  this.startTimeShow = 0; // 当前显示范围起始时间
  this.endTimeShow = 0; // 当前显示范围结束时间
  this.restTime = options.restTime || {
    // 一周各天休息分布，0为周日
    '1': [{ '00:00:00': 2 * 1000 * 60 * 60 }, { '23:00:00': 2 * 1000 * 60 * 60 }],
    '2': [{ '00:00:00': 4 * 1000 * 60 * 60 }],
    '3': [{ '00:00:00': 4 * 1000 * 60 * 60 }],
    '4': [{ '00:00:00': 4 * 1000 * 60 * 60 }],
    '5': [{ '00:00:00': 4 * 1000 * 60 * 60 }],
    '6': [{ '00:00:00': 24 * 1000 * 60 * 60 }],
    '0': [{ '00:00:00': 24 * 1000 * 60 * 60 }],
  };
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
    this.stage.add(this.layerFast, this.layerBasicShapes);
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
  this.layerFast.destroyChildren();
  //改变数据集
  this.axis.upDate(x, y);
  this.working.upDate();
  this.rests.upDate(x, y);
  // 重绘
  this.layerBasicShapes.batchDraw();
  this.layerFast.batchDraw();
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
  this.axisXLang = 0;
  this.axisYLang = 0;
  this.xEnd = 0;
  this.yEnd = 0;
  this.axisXDiffX = this.base.paddingLeft;
  this.axisXDiffY = this.base.paddingTop;
  this.axisYDiffX = this.base.paddingLeft;
  this.axisYDiffY = this.base.paddingTop;
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
    tickYInterval,
    startItemX,
  } = this.base;
  const axisXSize = utils.moment(endTime - startTime).valueOf() / timeInterval * tickXInterval;
  const axisYSize = data.length * tickYInterval;
  this.base.resize({
    width: axisXSize,
    height: axisYSize
  });
  let axisXLang = paddingLeft + paddingRight + axisXSize;
  this.axisXLang = axisXLang = axisXLang > width ? width : axisXLang;
  let axisYLang = paddingTop + paddingBottom + axisYSize;
  this.axisYLang = axisYLang = axisYLang > height ? height : axisYLang;
  const renderCountX = this.base.renderCountX = this.axisXLang / tickXInterval + 1;
  const renderCountY = this.base.renderCountY = this.axisYLang / tickYInterval + 1;
  const startTimeShow = this.base.startTimeShow = startTime + startItemX * timeInterval;
  this.base.endTimeShow = startTimeShow + renderCountX * timeInterval;
  this.xEnd = renderCountX;
  this.yEnd = renderCountY;
  this.render();
};
charts.Axis.prototype.upDate = function (x, y) {
  const {
    width,
    height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    maskDomWidth,
    maskDomHeight,
    startTime,
    timeInterval,
    tickXInterval,
    tickYInterval,
    renderCountX,
    renderCountY
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

  this.axisXDiffX = axisXDiffX;
  this.axisXDiffY = axisXDiffY;
  this.axisYDiffX = axisYDiffX;
  this.axisYDiffY = axisYDiffY;
  this.base.itemDiffX = itemDiffX;
  this.base.itemDiffY = itemDiffY;
  this.base.startItemX = startItemX;
  this.base.startItemY = startItemY;
  const startTimeShow = this.base.startTimeShow = startTime + startItemX * timeInterval;
  this.base.endTimeShow = startTimeShow + renderCountX * timeInterval;
  this.xEnd = renderCountX + startItemX;
  this.yEnd = renderCountY + startItemY;
  this.render();
}
charts.Axis.prototype.render = function () {
  const {
    startTime,
    endTime,
    data,
    startItemX,
    startItemY,
    itemDiffX,
    itemDiffY,
    timeInterval,
    tickXInterval,
    tickYInterval
  } = this.base;
  
  this.axisX = new Konva.Line({
    x: this.axisXDiffX,
    y: this.axisXDiffY,
    points: [0, 0, this.axisXLang, 0],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  this.axisY = new Konva.Line({
    x: this.axisYDiffX,
    y: this.axisYDiffY,
    points: [0, 0, 0, this.axisYLang],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  let pathTicksForAxis = '';
  const childTickInternval = tickXInterval / this.tickXChidren;
  
  for (let i = startItemX; i <= this.xEnd; i++) {
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
    console.log(this.axisYDiffY)
    const text = new Konva.Text({
      x: itemDiffX + tickXInterval * diff - this.fontSize * num / 4,
      y: this.axisYDiffY - this.tickSize - this.fontSize,
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor
    });
    const line = new Konva.Line({
      x: itemDiffX,
      y: this.axisYDiffY,
      points: [tickXInterval * diff, 0, tickXInterval * diff, this.axisYLang],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.base.layerFast.add(line, text);
  }

  for (let i = startItemY; i <= this.yEnd; i++) {
    const diff = i - startItemY + 1;
    if (i < data.length) {
      const str = data[i].group.name;
      const num = utils.getBytesLength(str);
      const text = new Konva.Text({
        x: this.axisXDiffX - this.fontSize * num / 2 - this.tickSize - 3,
        y: itemDiffY + tickYInterval * (diff - .5),
        text: str,
        fontSize: this.fontSize,
        fontFamily: 'Calibri',
        fill: this.axisColor,
      });
      this.base.layerFast.add(text);
    }

    const line = new Konva.Line({
      x: this.axisXDiffX,
      y: itemDiffY,
      points: [0, tickYInterval * diff, this.axisXLang, tickYInterval * diff],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.base.layerFast.add(line);
  }

  this.tickX = new Konva.Path({
    x: itemDiffX,
    y: this.axisYDiffY,
    data: pathTicksForAxis,
    stroke: this.axisColor,
  });
  this.base.layerFast.add(this.axisX, this.axisY, this.tickX);
}

// 工序类
charts.Working = function (options = {}) {
  this.base = options.base;
  this.group = new Konva.Group();
  this.init();
}
charts.Working.prototype.init = function () {
  this.render();

}
charts.Working.prototype.upDate = function () {
  this.render();
}
charts.Working.prototype.render = function() {
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
    startTimeShow, 
    endTimeShow,
    } = this.base;

  this.startTime = utils.moment('2019-06-22').valueOf();
  this.endTime = utils.moment('2019-06-24').valueOf();

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
  //this.base.layerBasicShapes.add(this.group);
}
// 休息时间
charts.Rests = function (options = {}) {
  this.base = options.base;
  this.image = options.image;
  this.group = new Konva.Group();
  this.init();
}
charts.Rests.prototype.init = function () {
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
    renderCountY,
  } = this.base;
  
  this.render();
}
charts.Rests.prototype.upDate = function (x, y) {
  const { width, height, paddingLeft, paddingRight, paddingTop, paddingBottom } = this.base;

}
charts.Rests.prototype.render = function() {
  const {
    data,
    timeInterval,
    tickXInterval,
    tickYInterval,
    startTime,
    endTime,
    itemDiffX,
    itemDiffY,
    startItemX,
    startItemY,
    renderCountX,
    renderCountY,
    startTimeShow, 
    endTimeShow,
  } = this.base;

  const scaleX = tickXInterval / this.image.width;
  const scaleY = tickYInterval / this.image.height;
  const img = new Konva.Rect({
    x: 100,
    width: 200,
    height: 100,
    fillPatternImage: this.image,
    fillPatternScale: {
      x: scaleX,
      y: scaleY
    }
  });
  const img2 = new Konva.Rect({
    x: 300,
    width: 200,
    height: 100,
    fillPatternImage: this.image,
    fillPatternScale: {
      x: scaleX,
      y: scaleY
    }
  });
  
 

  //for (let i = )
  if (this.endTime > startTimeShow && this.startTime < endTimeShow && startItemY < 1) {
    const start = Math.max(startTimeShow, this.startTime);
    const end = Math.min(endTimeShow, this.endTime, endTime);
    const rect = new Konva.Rect({
      x: itemDiffX + (start - startTimeShow) / timeInterval * tickXInterval,
      y: itemDiffY,
      width: (end - start) / timeInterval * tickXInterval,
      height: 200,
      fill: 'yellow'
    });
    this.group.add(rect);
  }
  this.base.layerFast.add(img,img2);
}
