<template>
  <div id="dashboard" class="row container-fluid mt-5 pt-5">
    <!-- <section> -->
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
                <li><a>comments {{ post.comments }}</a></li>
                <li><a>likes {{ post.likes}}</a></li>
                <li><a>More</a></li>
              </ul>
            </div>
          </div>
          <div v-else>
            <div class="card mx-1 my-2 py-5 px-3">
              <p class="py-5 my-5">There are no notes just now.</p>
            </div>
          </div>
      </div>
    <!-- </section> -->
  </div>
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
        }
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
        let updatedPostsArray = this.hiddenPosts.concat(this.posts)
        this.$store.commit('setHiddenPosts', null)
        this.$store.commit('setPosts', updatedPostsArray)
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
