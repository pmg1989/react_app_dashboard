
export default {
  namespace: 'modal',
  state: {
    loading: false,
    visible: false,
    type: 'create',
    curItem: {}
  },
  reducers: {
    showLoading (state) {
      return { ...state, loading: true }
    },
    hideLoading (state, action) {
      return { ...state, loading: false, ...action.payload }
    },
    showModal (state, action) {
      return { ...state, visible: true, ...action.payload }
    },
    hideModal (state) {
      return { ...state, visible: false, loading: false, curItem: {} }
    },
    setOtherItem (state, action) {
      const { key, value, loading } = action.payload
      const { curItem } = state
      return { ...state, curItem: { ...curItem, [key]: value }, loading }
    },
    setSubItem (state, action) {
      const { curItem } = state
      return { ...state, curItem: { ...curItem, ...action.payload }, loading: false }
    }
  }
}
