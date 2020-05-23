import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
const firebase = require('./firebaseConfig.js')

import './assets/scss/app.scss'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

// handle page reload
let app
/* eslint-disable no-unused-vars*/
firebase.auth.onAuthStateChanged(user => {
  if(!app){
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})
/* eslint-enable no-unused-vars*/

// new Vue({
//  router,
//  store,
//  render: h => h(App)
//}).$mount('#app')
