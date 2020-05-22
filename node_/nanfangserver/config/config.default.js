/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1590031853403_2813';

  // add your middleware config here
  config.middleware = [];

  config.security = { 
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    // domainWhiteList: ['http://127.0.0.1:8080'] 
  }

  //config.cors = { origin: '*', allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH' }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
