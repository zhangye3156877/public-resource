
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  publicPath: './',
  hash: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {path: '/', component: './index'},
        // {path: '/test', component: './test/test'},
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
      //dynamicImport: false,
      title: '南方有色配料项目',
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
  devtool:'source-map',
  alias:{
    '@': require('path').resolve(__dirname, 'src'),
  }
}
