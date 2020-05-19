
const GlobalModel = {
  namespace: 'global',
  state: {
    testNumber: 99
  },
  reducer: {
    change(state:any, payload:any) {
      return {
        ...state,
        testNumber: payload
      }
    }
  }
}
export default GlobalModel