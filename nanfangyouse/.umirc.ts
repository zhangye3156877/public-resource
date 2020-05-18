import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  history: 'hash',
  publicPath: './',
  hash: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
    },
    {
      path: '/home',
      component: '../layouts/second',
      routes: [
        {path: '/home', component: './home/index'},
        {path: '/home/s', component: './second/index'},
      ]
    }

  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'nanfangyouse',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  // 下面是webpack配置
  devtool:'source-map'
}

export default config;
