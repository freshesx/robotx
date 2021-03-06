// @flow

import Vuex from 'vuex'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import mapRobotStore from '../helpers/mapRobotStore.js'
import '../scss/reset.css'
import '../scss/style.scss'
import '../mixins/dashboard/main.scss'

export default class Robot {
  constructor ({ state, routes, debug }) {
    this.state = state
    this.routes = routes
    this.debug = debug
  }

  install (Vue) {
    this.Vue = Vue
    this.Vue.config.productionTip = this.debug

    this.buildUiComponents()
    const store = this.buildStore()
    const router = this.buildRouter()
    this.buildHelpers()

    new this.Vue({
      el: '#app',
      store,
      router,
      render: h => h(this.renderApp())
    })
  }

  buildUiComponents () {
    this.Vue.use(ElementUI)
  }

  buildRouter () {
    this.Vue.use(VueRouter)

    return new VueRouter({
      routes: [
        ...this.routes
      ]
    })
  }

  buildStore () {
    this.Vue.use(Vuex)

    const robotModule = this.parseState(mapRobotStore())

    return new Vuex.Store({
      modules: {
        ...robotModule
      },
      strict: this.debug
    })
  }

  buildHelpers () {
    this.Vue.prototype.$r = this.Vue.prototype.getState = function (name, defaultValue) {
      return get(this.$store.state, name, defaultValue)
    }

    this.Vue.prototype.$w = this.Vue.prototype.setState = function (name, newValue) {
      return this.$store.commit(name, newValue)
    }
  }

  parseState (stateMap) {
    let newModules = {}

    Object.keys(stateMap).forEach(name => {
      const state = stateMap[name]
      const output = {
        state: state,
        mutations: this.parseMutations(state, name)
      }
      newModules = { ...newModules, ...{ [name]: output } }
    })

    return newModules
  }

  parseMutations (states, prefix) {
    let newMutations = {}

    Object.keys(states).forEach(name => {
      const fn = this.buildMutationFn(name)
      newMutations = { ...newMutations, ...{ [`${prefix}.${name}`]: fn } }
    })

    return newMutations
  }

  buildMutationFn (name) {
    /**
     * @example
     * this.setState('module.some', prev => !prev)
     * this.setState('module.some', false)
     */
    return function (state, props) {
      if (isFunction(props)) {
        // @todo 为 state 判断类型，添加浅度复制，
        // 防止开发者直接修改 state 数据
        state[name] = props(state[name])
      } else {
        state[name] = props
      }
    }
  }

  renderApp () {
    const RouterView = this.Vue.component('router-view')

    return {
      render (h) {
        return <RouterView />
      }
    }
  }
}
