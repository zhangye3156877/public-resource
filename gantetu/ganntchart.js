
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
charts.Element = function (options = {}) {
  this.paddingLeft = options.paddingLeft || 100;
  this.paddingRight = options.paddingRight || 100;
  this.paddingTop = options.paddingTop || 100;
  this.paddingBottom = options.paddingBottom || 100;
  this.startTime = utils.moment(options.startTime).valueOf(); //暂定数据结构
  this.endTime = utils.moment(options.endTime).valueOf(); //暂定数据结构
  this.data = options.data; //暂定数据结构
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
  this.maskDomWidth = null;
  this.maskDomHeight = null;
  this.stage = null;
  this.layerAxis = new Konva.FastLayer();
  this.layerBasicShapes = new Konva.Layer();
  this.layerSwitch = new Konva.Layer();
  this.width = options.width || 800;
  this.height = options.height || 600;
  this.axis = null;
  this.rests = null;
}

charts.GanttChart.prototype.init = function (options = {}) {
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

  this.stage = new Konva.Stage({
    container: this.container,
    width: this.width,
    height: this.height
  });
  const propsForChildren = options.data;
  propsForChildren.base = this;

  //坐标轴
  if (options.axis !== false) {
    const payload = options.axis || {};
    this.axis = new charts.Axis(Object.assign(propsForChildren, payload));
  }
  // 设备休息区-读取图片
  const readFile = new Promise((resove => {
    if (options.rests !== false) {
      const payload = options.rests || {};
      const image = new Image();
      image.onload = () => {
        payload.image = image;
        this.rests = new charts.Rests(Object.assign(propsForChildren, payload));
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
  // this.stage.setAttrs({
  //   x: -left,
  //   y: -top
  // })
  // this.layerAxis.draw();
  this.draw(left, top);
}
// 绘图
charts.GanttChart.prototype.draw = function (x, y) {
  // 销毁子集
  this.layerBasicShapes.destroyChildren();
  this.layerAxis.destroyChildren();
  //改变数据集
  this.axis.changeData(x, y);
  this.rests.changeData(x, y);
  // 重绘
  this.layerBasicShapes.batchDraw();
  this.layerAxis.batchDraw();
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
  this.init();
};
charts.Axis.prototype.init = function () {
  const startTime = this.startTime;
  const endTime = this.endTime;
  const axisXSize = this.axisXSize = utils.moment(endTime - startTime).valueOf() / this.timeInterval * this.tickXInterval;
  const axisYSize = this.axisYSize = this.data.length * this.tickYInterval;

  this.base.resize({
    width: axisXSize,
    height: axisYSize
  });
  let axisXLang = this.paddingLeft + this.paddingRight + axisXSize;
  this.axisXLang = axisXLang = axisXLang > this.base.width ? this.base.width : axisXLang;
  this.axisX = new Konva.Line({
    x: this.paddingLeft,
    y: this.paddingTop,
    points: [0, 0, axisXLang, 0],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  let axisYLang = this.paddingTop + this.paddingBottom + axisYSize;
  this.axisYLang = axisYLang = axisYLang > this.base.height ? this.base.height : axisYLang;
  this.axisY = new Konva.Line({
    x: this.paddingLeft,
    y: this.paddingTop,
    points: [0, 0, 0, axisYLang],
    stroke: this.axisColor,
    lineCap: 'round',
    strokeWidth: this.strokeWidth,
  });
  // this.axisXText = new Konva.Group();
  // this.axisYText = new Konva.Group();
  // this.gridX = new Konva.Group();
  // this.gridY = new Konva.Group();
  let pathTicksForAxis = '';
  const childTickInternval = this.tickXInterval / this.tickXChidren;
  for (let i = 1; i <= axisXSize / childTickInternval; i++) {
    pathTicksForAxis += `M${childTickInternval * i},0L${childTickInternval * i},${-this.tickChidrenSize}`;
  }
  for (let i = 1; i <= axisXSize / this.tickXInterval; i++) {
    pathTicksForAxis += `M${this.tickXInterval * i},0L${this.tickXInterval * i},${-this.tickSize}`;
    const str = utils.moment(startTime + this.timeInterval * i).format('MM-DD');
    const num = utils.getBytesLength(str);
    const text = new Konva.Text({
      x: this.paddingLeft + this.tickXInterval * i - this.fontSize * num / 4,
      y: this.paddingTop - this.tickSize - this.fontSize,
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
    this.base.layerAxis.add(text, line);
  }
  for (let i = 1; i <= axisYSize / this.tickYInterval; i++) {
    // pathTicksForAxis += `M0,${this.tickYInterval * i}L${-this.tickSize},${this.tickYInterval * i}`;
    const str = this.data[i - 1].group.name;
    const num = utils.getBytesLength(str);

    const text = new Konva.Text({
      x: this.paddingLeft - this.fontSize * num / 2 - this.tickSize - 3,
      y: this.paddingTop + this.tickYInterval * (i - .5),
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor,
    });
    const line = new Konva.Line({
      points: [this.paddingLeft, this.paddingTop + this.tickYInterval * i, this.paddingLeft + axisXSize, this.paddingTop + this.tickYInterval * i],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    //this.axisYText.add(text);
    //this.gridX.add(line);
    this.base.layerAxis.add(text, line);
  }

  this.tickX = new Konva.Path({
    x: this.paddingLeft,
    y: this.paddingTop,
    data: pathTicksForAxis,
    stroke: this.axisColor,
  });
  this.base.layerAxis.add(this.axisX, this.axisY, this.tickX);
  // this.axisXText.setAttrs({
  //   x: this.paddingLeft,
  //   y: this.paddingTop - this.tickSize - this.fontSize
  // });
  // this.axisYText.setAttrs({
  //   x: this.paddingLeft,
  //   y: this.paddingTop,
  // })
  //this.group.add(this.axisX, this.axisY, this.tickX, this.axisXText, this.axisYText, this.gridX, this.gridY);
};
charts.Axis.prototype.changeData = function (x, y) {
  const paddingLeft = this.paddingLeft;
  const paddingRight = this.paddingRight;
  const paddingTop = this.paddingTop;
  const paddingBottom = this.paddingBottom;
  const diffX = this.base.maskDomWidth - this.base.width;
  const diffY = this.base.maskDomHeight - this.base.height;
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
    itemDiffX = -(x - paddingLeft) % this.tickXInterval;
    startItemX = Math.floor((x - paddingLeft) / this.tickXInterval);
  } else {
    axisXDiffX = 0;
    axisYDiffX = -this.strokeWidth;
    itemDiffX = -(x - paddingLeft) % this.tickXInterval;
    startItemX = Math.floor((x - paddingLeft) / this.tickXInterval);
  }

  if (y <= paddingTop) {
    itemDiffY = axisXDiffY = axisYDiffY = paddingTop - y;
  } else if (y > paddingTop && (diffY - y) < paddingBottom) {
    axisXDiffY = -this.strokeWidth;
    axisYDiffY = diffY - y - paddingBottom;
    itemDiffY = -(y - paddingTop) % this.tickYInterval;
    startItemY = Math.floor((y - paddingTop) / this.tickYInterval);
  } else {
    axisXDiffY = -this.strokeWidth;
    axisYDiffY = 0;
    itemDiffY = -(y - paddingTop) % this.tickYInterval;
    startItemY = Math.floor((y - paddingTop) / this.tickYInterval);
  }

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
  const childTickInternval = this.tickXInterval / this.tickXChidren;
  // for (let i = 1; i <= axisXSize / childTickInternval; i++) {
  //   pathTicksForAxis += `M${childTickInternval * i},0L${childTickInternval * i},${-this.tickChidrenSize}`;
  // }
  for (let i = startItemX; i <= (this.axisXLang / this.tickXInterval + 1 + startItemX); i++) {
    const diff = i - startItemX + 1;
    console.log(startItemX)
    const str = utils.moment(this.startTime + this.timeInterval * (i + 1)).format('MM-DD');
    const num = utils.getBytesLength(str);
    pathTicksForAxis += `M${this.tickXInterval * diff},0L${this.tickXInterval * diff},${-this.tickSize}`;
    for (let j = 1; j <= this.tickXChidren; j++) {
      if (i < (this.axisXLang / this.tickXInterval + 1 + startItemX) - 1) {
        pathTicksForAxis += `M${this.tickXInterval * (diff - 1) + childTickInternval * j},0L${this.tickXInterval * (diff - 1) + childTickInternval * j},${-this.tickChidrenSize}`;
      }
    }
    const text = new Konva.Text({
      x: itemDiffX + this.tickXInterval * diff - this.fontSize * num / 4,
      y: axisYDiffY - this.tickSize - this.fontSize,
      text: str,
      fontSize: this.fontSize,
      fontFamily: 'Calibri',
      fill: this.axisColor
    });
    const line = new Konva.Line({
      x: itemDiffX,
      y: axisYDiffY,
      points: [this.tickXInterval * diff, 0, this.tickXInterval * diff, this.axisYLang],
      stroke: this.gridColor,
      lineCap: 'round',
      strokeWidth: this.gridStrokeWidth,
    });
    this.base.layerAxis.add(line, text);
  }

  for (let i = startItemY; i <= (this.axisYLang / this.tickYInterval + 1 + startItemY); i++) {
    const diff = i - startItemY + 1;

    if (i < this.data.length) {
      const str = this.data[i].group.name;
      const num = utils.getBytesLength(str);
      const text = new Konva.Text({
        x: axisXDiffX - this.fontSize * num / 2 - this.tickSize - 3,
        y: itemDiffY + this.tickYInterval * (diff - .5),
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
      points: [0, this.tickYInterval * diff, this.axisXLang, this.tickYInterval * diff],
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
charts.Main = function (options = {}) {
  charts.Element.call(this, options);

}
charts.Main.prototype.init = function () {

}
// 休息时间
charts.Rests = function (options = {}) {
  charts.Element.call(this, options);
  this.base = options.base || null;
  this.xx = 50;
  this.yy = 5;
  this.image = options.image;
  this.group = new Konva.Group();
  this.init();
}
charts.Rests.prototype.init = function () {
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
        x: 200 * i + this.paddingLeft,
        y: 150 * j,
        text: `${i}列${j}行`,
        fontSize: 30
      })
      this.group.add(re);
      //this.base.layerBasicShapes.add(this.group);
    }
  }
}
charts.Rests.prototype.changeData = function (x, y) {
  //console.log(x,y,this.base);
  const { width, height } = this.base;
  const dw = 200;
  const dh = 150;
  let offsetX;
  let offsetY;
  let startX;
  let startY;
  if (x < this.paddingLeft) {
    offsetX = this.paddingLeft - x;
    startX = 0;
  } else {
    offsetX = -(x - this.paddingLeft) % dw;
    startX = Math.floor((x - this.paddingLeft) / dw);
  }
  if (y < this.paddingTop) {
    offsetY = this.paddingTop - y;
    startY = 0;
  } else {
    offsetY = -(y - this.paddingTop) % dh;
    startY = Math.floor((y - this.paddingTop) / dh);
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
