export default {
  namespace: 'global',
  state: {
    config: {
      host: '127.0.0.1',
      port: 7001
    }
  },
  reducers: {
    changeConfig(state, payload) {
      console.log(payload)
      return {
        ...state, 
        config: {
          ...state.config,
          ...payload
        }
      };
    },
  },
}