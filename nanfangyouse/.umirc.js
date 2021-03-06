
// ref: https://umijs.org/config/
export default {
  // treeShaking: true,
  // history: 'hash',
  publicPath: './',
  hash: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/peiliao', 
          component: './main/peiliao', 
          title: '南方有色配料项目',
        },
        {
          path: '/pingheng', 
          component: './main/pingheng',
          title: '南方金属平衡项目',
        },
      ]
    },
  ],
  dynamicImport: {
          loading: '@/components/loading/index',
        },
  //devtool:'source-map',
  alias:{
    '@': require('path').resolve(__dirname, 'src'),
  },
  // exportStatic: { 
  //   htmlSuffix: true,
  //   dynamicRoot: true
  // },
  chunks: ['vendors', 'umi', 'xlsx'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 0,
          minChunks: 1,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 1,
            },
            xlsx: {
              name: 'xlsx',
              test: /[\\/]node_modules[\\/](xlsx)[\\/]/,
              priority: 2,
            },
          },
        },
      }
    });
  },
}
