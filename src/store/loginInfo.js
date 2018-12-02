const loginInfo = {
  state: {
    logged: false,
    userInfo: {}
  },
  mutations: {
    login: (state) => {
      state.logged = true
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    }
  }
}
export default loginInfo
