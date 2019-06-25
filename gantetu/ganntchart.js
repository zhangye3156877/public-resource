
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
  this.startTime = options.startTime; //暂定数据结构
  this.endTime = options.endTime; //暂定数据结构
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
  this.maskDom.css({
    width: `${this.paddingLeft + this.paddingRight + this.width}px`,
    height: `${this.paddingTop + this.paddingBottom + this.height}px`,
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
    //this.layerAxis.add(this.axis.group);
  }
  // 设备休息区-读取图片
  const readFile = new Promise((resove => {
    if (options.rests !== false) {
      const payload = options.rests || {};
      const image = new Image();
      image.onload =  () => {
        payload.image = image;
        this.rests = new charts.Rests(Object.assign(propsForChildren, payload));
        this.layerBasicShapes.add(this.rests.group);
        console.log(this.rests.group)
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
  //this.width = options.width || this.width;
  //this.height = options.height || this.height;
  this.maskDom.css({
    width: `${this.paddingLeft + this.paddingRight + options.width}px`,
    height: `${this.paddingTop + this.paddingBottom + options.height}px`,
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
charts.GanttChart.prototype.draw = function(x, y) {
  this.layerBasicShapes.destroyChildren();
  this.rests.changeData(x, y);
  this.layerBasicShapes.draw();
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
  const startTime = utils.moment(this.startTime).valueOf();
  const endTime = utils.moment(this.endTime).valueOf();
  const axisXSize = utils.moment(endTime - startTime).valueOf() / this.timeInterval * this.tickXInterval;
  const axisYSize = this.data.length * this.tickYInterval;

  this.base.resize({
    width: axisXSize,
    height: axisYSize
  });
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
    // this.axisXText.add(text);
    // this.gridY.add(line);
  }
  for (let i = 1; i <= axisYSize / this.tickYInterval; i++) {
    // pathTicksForAxis += `M0,${this.tickYInterval * i}L${-this.tickSize},${this.tickYInterval * i}`;
    const str = this.data[i - 1].group.name;
    const num = utils.getBytesLength(str);

    const text = new Konva.Text({
      x:  this.paddingLeft - this.fontSize * num / 2 - this.tickSize - 3,
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
  this.base.layerAxis.add(this.axisX, this.axisY,this.tickX);
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
  for(let i = 0,j = 0; i < 50; i++, j=0){
    for(; j < 5; j++) {
      // const re = new Konva.Image({
      //   x: 150 * i ,
      //   y: 150 * j,
      //   width: 100,
      //   height: 100,
      //   image: this.image,
      //   text: 'ff'
      // });
      const re = new Konva.Text({
        x: 150 *i,
        y: 150 * j,
        text: `${i}列${j}行`,
        fontSize: 30
      })
      this.group.add(re);
    }
  }
}
charts.Rests.prototype.changeData = function(x,y) {
  //console.log(x,y,this.base);
  const l = this.base.width;
  const one = 150 ;
  const offsetX = x % l;
  const start = Math.floor((x + this.paddingLeft) / 350);
  const num = Math.ceil(l / one);
  console.log(start, num);
  for(let i = start,j = 0; i < start + num; i++, j=0){
    for(; j < 5; j++) {
      const re = new Konva.Text({
        x: -150 * (i - start)+ offsetX,
        y: 150 * j,
        text: `${i}列${j}行`,
        fontSize: 30
      })
      this.group.add(re);
    }
  }
  this.base.layerBasicShapes.add(this.group);
}
