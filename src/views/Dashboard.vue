<template>
    <section>
  <div id="dashboard" class="row container-fluid mt-5 pt-5">
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="mx-1 mt-1 mb-3 card profile">
          <h5>{{ userProfile.name }}</h5>
          <h6>{{ userProfile.title }}</h6>
          <div class="create-post">
            <p>Create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button @click.self.prevent="createPost" :disabled="post.content == ''" type="button" class="button">post</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-8 col-md-6 col-sm-12">
          <transition name="fade">
            <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
              <p>
                Show new updates (<span class="new-posts">{{ hiddenPosts.length }}</span>)
              </p>
            </div>
          </transition>
          <div v-if="posts.length">
            <div v-for="post in posts" :key="post.id" class="card mx-1 my-1 py-5 px-3">
              <h5>{{ post.userName }}</h5>
              <div class="container">
                <span class="meta">{{ post.createdOn | formatDate }}</span>
              </div>
              <p>{{ post.content | trimLength  }}</p>
              <ul>
                <li><a @click="openCommentModal(post)">comments {{ post.comments }}</a></li>
                <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes}}</a></li>
                <li><a @click="viewPost(post)">More</a></li>
              </ul>
            </div>
          </div>
          <div v-else>
            <div class="card mx-1 my-2 py-5 px-3">
              <p class="py-5 my-5">There are no notes just now.</p>
            </div>
          </div>
          <transition name="fade">
            <div v-if="showCommentModal" class="c-modal">
              <div class="c-container">
                <a @click="closeCommentModal">X</a>
                <p>Add a comment</p>
                <form @submit.prevent>
                  <textarea v-model.trim="comment.content"></textarea>
                  <button @click="addComment" :disabled="comment.content == ''" class="button">Add comment</button>
                </form>
              </div>
            </div>
          </transition>
          <transition name="fade">
            <div v-if="showPostModal" :key="fullPost.id" class="p-modal">
              <div class="p-container">
                <a @click="closePostModal" class="close">X</a>
                <div class="post">
                  <h5>{{ fullPost.userName }}</h5>
                  <span>{{ fullPost.cretedOn | formatDate }}</span>
                  <p>{{ fullPost.content }}</p>
                  <ul>
                    <li><a>Comments {{ fullPost.comments }}</a></li>
                    <li><a @click="likePost(fullPost.id, fullPost.likes)">Likes {{ fullPost.likes }}</a></li>
                  </ul>
                </div>
                <div v-show="postComments.length" class="comments">
                  <div v-for="comment in postComments" :key="comment.id" class="comment">
                    <p>{{ comment.userName }}</p>
                    <span>{{ comment.createdOn | formatDate }}</span>
                    <p>{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
      </div>
  </div>
    </section>
</template>
<style lang="scss">
@import "../assets/scss/_vars.scss";
body{
  background-color: $light!important;
}
.meta{
  opacity: 0.8;
  a{
    opacity: 0.8;
  }
  span{
    opacity: 0.8;
  }
}
</style>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  const firebase = require('../firebaseConfig.js')

  export default {
    data() {
      return {
        post: {
          content: ''
        },
        comment:{
          postId: '',
          userId: '',
          content: '',
          postComments: 0
        },
        showCommentModal: false,
        showPostModal: false,
        fullPost: {},
        postComments: []
      }
    },
    computed: {
      ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts'])
    },
    methods: {
      createPost() {
        firebase.postsCollection.add({
          createdOn: new Date(),
          content: this.post.content,
          userId: this.currentUser.uid,
          userName: this.userProfile.name,
          comments: 0,
          likes: 0
        }).then(ref => {
          this.post.content = ''
          console.log(ref)
        }).catch(err => {
          console.log(err)
        })
      },
      showNewPosts() {
        console.log("hey")
        let updatedPostsArray = this.hiddenPosts.concat(this.posts)
        console.log("new post from hid")
        console.log(updatedPostsArray)
        this.$store.commit('setHiddenPosts', null)
        this.$store.commit('setPosts', updatedPostsArray)
      },
      openCommentModal(post){
        this.comment.postId = post.id
        this.comment.userId = post.userId
        this.comment.postComments = post.comments
        this.showCommentModal = true
      },
      closeCommentModal(){
        this.comment.postId = ''
        this.comment.userId = ''
        this.comment.content = ''
        this.showCommentModal = false
      },
      addComment(){
        let postId = this.comment.postId
        let postComments = this.comment.postComments

        firebase.commentsCollection.add({
          createdOn: new Date(),
          content: this.comment.content,
          postId: postId,
          userId: this.currentUser.uid,
          userName: this.userProfile.name
        }).then(doc => {
          console.log(doc)
          firebase.postsCollection.doc(postId).update({
            comments: postComments+1
          }).then(()=>{
            this.closeCommentModal()
          })
        }).catch(err => {
          console.log(err)
        })
      },
      likePost(postId, postLikes){
        let docId = `${this.currentUser.uid}_${postId}`
        firebase.likesCollection.doc(docId).get().then(doc=>{
          if (doc.exists){
            console.log("You can't like the post many times")
            return
          }
          firebase.likesCollection.doc(docId).set({
            postId: postId,
            userId: this.currentUser.uid
          }).then(()=>{
            firebase.postsCollection.doc(postId).update({
              likes: postLikes+1
            })
          })
        }).catch(err=>{
          console.log(err)
        })
      },
      viewPost(post){
        firebase.commentsCollection.where('postId', '==', post.id).limit(5).get().then(docs => {
          let commentsArray = []

          docs.forEach(doc => {
            let comment = doc.data()
            comment.id = doc.id
            commentsArray.push(comment)
          })

          this.postComments = commentsArray
          this.fullPost = post
          this.showPostModal = true
        }).catch(err => {
          console.log(err)
        })
      },
      closePostModal() {
        this.postComments = []
        this.showPostModal = false
      }
    },
    filters: {
      formatDate(val){
        if(!val){ return '--'}
        let date = val.toDate()
        return moment(date).fromNow()
      },
      trimLength(val){
        if (val.length < 200){
          return val
        }
        return `${val.substring(0,200)}...`
      }
    }
  }
</script>
