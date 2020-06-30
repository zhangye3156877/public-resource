export default {
  namespace: 'global',
  state: {
    config: {
      host: '127.0.0.1',
      port: 7001
    },
    page1List: []
  },
  reducers: {
    changeConfig(state, payload) {
      
      return {
        ...state, 
        config: {
          host: payload.host || '127.0.0.1',
          port: payload.port || 7001
        }
      };
    },
  },
}