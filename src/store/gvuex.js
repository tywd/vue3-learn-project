// 手写迷你 Vuex
import { inject, reactive, computed } from 'vue'

const STORE_KEY = '__store__'
function useStore () {
  return inject(STORE_KEY)
}
function createStore (options) {
  return new Store(options)
}
class Store {
  constructor (options) {
    this.$options = options
    this._state = reactive({
      data: options.state()
    })
    this._mutations = options.mutations
    this._actions = options.actions
    const getters = options.getters || {}
    this.getters = {}

    Object.keys(getters).forEach(name => {
      const fn = getters[name]
      this.getters[name] = computed(() => fn(this.state))
    })
  }

  get state () {
    return this._state.data
  }

  commit = (type, payload) => {
    const entry = this._mutations[type]
    entry && entry(this.state, payload)
  }

  dispatch (type, payload) {
    const entry = this._actions[type]
    return entry && entry(this, payload)
  }

  install (app) {
    app.provide(STORE_KEY, this)
  }
}
export { createStore, useStore }
