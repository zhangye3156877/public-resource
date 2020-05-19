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
      routes: [
        {path: '/', component: './homepage'},
        {path: '/p1', component: './home/index'},
        {path: '/p2', component: './second/index'},
      ]
    },
    

  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: {
        loadingComponent: './components/loading/index',
        webpackChunkName: true,
      },
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
