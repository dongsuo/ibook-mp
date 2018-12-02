import Vue from 'vue'
import Vuex from 'vuex'
import loginInfo from './loginInfo'

Vue.use(Vuex)
const count = {
  state: {
    count: 0
  },
  mutations: {
    increment: (state) => {
      const obj = state
      obj.count += 1
    },
    decrement: (state) => {
      const obj = state
      obj.count -= 1
    }
  }
}
const store = new Vuex.Store({
  modules: {
    count,
    loginInfo
  }
})
export default store
