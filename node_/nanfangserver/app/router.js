'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/calculate', controller.main.calculate);
  router.get('/api/getInventory', controller.main.getInventory);
  router.post('/api/quick_update', controller.main.quickupdate)
};
