import Vue from 'vue'
import Vuex from 'vuex'
const firebase = require('../firebaseConfig.js')

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {}
  },
  mutations: {
    setCurrentUser(state, val){
      state.currentUser = val
    },
    setUserProfile(state, val){
      state.userProfile = val
    }
  },
  actions: {
    clearData({ commit }) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      // commit('setPosts', null)
      // commit('setHiddenPosts', null)
    },
    fetchUserProfile({commit, state}){
      firebase.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data())
      }).catch(err => {
        console.log(err)
      })
    }
  },
  modules: {
  }
})

// Page refresh state persistance
firebase.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user) // eslint-disable-line
    store.dispatch('fetchUserProfile')   // eslint-disable-line
  }
})

export default store
