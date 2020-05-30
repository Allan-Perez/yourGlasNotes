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

    // Realtime query snapshot of posts.
    firebase.postsCollection.orderBy('createdOn', 'desc').limit(20).onSnapshot(querySnapshot => {
      let lastDoc = querySnapshot.docChanges()[querySnapshot.docChanges().length-1]
      console.log(lastDoc.doc.data())
      let createdByCurrentUser
      if (querySnapshot.docs.length){
        let snapshotUserId = lastDoc.doc.data().userId
        let currentUserId = store.state.currentUser.uid
        createdByCurrentUser = currentUserId == snapshotUserId
      }
      if (querySnapshot.docChanges().length !== querySnapshot.docs.length 
          && lastDoc.type == 'added' && !createdByCurrentUser){
        let post = lastDoc.doc.data()
        post.id  = lastDoc.doc.id
        store.commit('setHiddenPosts', post)
      } else{
        let postsArray=[]
        querySnapshot.forEach(doc => {
          let post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })
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
      if (val) {
        state.posts = val
      } else {
        state.posts = []
      }
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
    },
    updateProfile({ commit, state }, data){
      console.log(commit)
      let name = data.name
      let title = data.title

      firebase.usersCollection.doc(state.currentUser.uid).update({name,title}).then(function(user){//eslint-disable-line
        // update posts
        firebase.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs=>{
          docs.forEach(doc=>{
            firebase.postsCollection.doc(doc.id).update({userName: name})
          })
        })

        // update comments
        firebase.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs=>{
          docs.forEach(doc=>{
            firebase.commentsCollection.doc(doc.id).update({userName: name})
          })
        })
      }).catch(err=>{
        console.log(err)
      })

    }
  },
  modules: {
  }
})


export default store
