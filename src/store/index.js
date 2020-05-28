import Vue from 'vue'
import Vuex from 'vuex'
const firebase = require('../firebaseConfig.js')

Vue.use(Vuex)

// Page refresh state persistance

firebase.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user) // eslint-disable-line
    store.dispatch('fetchUserProfile')   // eslint-disable-line

    firebase.usersCollection.doc(user.uid).onSnapshot(doc =>{
      store.commit('setUserProfile', doc.data())
    })

    // Query snapshot of posts.
    firebase.postsCollection.limit(20).orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
      let createdByCurrentUser
      console.log("Before conditionals")
      console.log(querySnapshot.docs)
      //if (querySnapshot.docs.length){
      //  let snapshotUserId = querySnapshot.docChanges()[0].doc.data().userId 
      //  let currentUserId = store.state.currentUser.uid
      //  createdByCurrentUser = currentUserId == snapshotUserId ? true : false
      //}
      if (store.state.posts.length == 0){
        let postsArray=[]
        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })
        store.commit('setPosts', postsArray)
      }
      else if (querySnapshot.docChanges().lenght !== querySnapshot.docs.length
          && querySnapshot.docChanges()[0].type == 'added' && !createdByCurrentUser){
        let post = querySnapshot.docChanges()[0].doc.data()
        post.id  = querySnapshot.docChanges()[0].doc.id
        store.commit('setHiddenPosts', post)
        console.log("Hidden posts")
      } else{
        let postsArray=[]
        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })
        console.log("Here from page refresh")
        console.log(postsArray)
        store.commit('setPosts', postsArray)
      }
    })
  }
})

const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts:[],
    hiddenPosts: []
  },
  mutations: {
    setCurrentUser(state, val){
      state.currentUser = val
    },
    setUserProfile(state, val){
      state.userProfile = val
    },
    setPosts(state, val){
      console.log("Setting posts")
      console.log(state.posts)
      if (val) {
        state.posts = val
      } else {
        state.posts = []
      }
      console.log(state.posts)
    },
    setHiddenPosts(state, val){
      if (val) {
        // dont add duplicates
        if (!state.hiddenPosts.some(x=>x.id === val.id)){
          state.hiddenPosts.unshift(val)
        }
      } else {
        state.hiddenPosts = []
      }
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


export default store
