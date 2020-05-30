<template class="justify-content-center">
  <section>
  <div id="settings" class="row d-flex justify-content-center">
    <div class="col-6 py-5">
      <h3>Settings</h3>
      <h6>Update your profile</h6>
      <transition>
        <p v-if="showSuccess" class="success">Profile updated</p>
      </transition>
      <form @submit.prevent class="form-group">
        <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" class="form-control"/>
        <input v-model.trim="title" type="text" :placeholder="userProfile.title" id="title" class="form-control"/>
        <button @click="updateProfile" class="button btn-lg btn-block">Update Profile</button>
      </form>
    </div>
  </div>
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data(){
      return {
        name: '',
        title: '',
        showSuccess: false
      }
    },
    computed: {
      ...mapState(['userProfile'])
    },
    methods:{
      updateProfile(){
        this.$store.dispatch('updateProfile',{
          name: this.name !=='' ? this.name : this.userProfile.name,
          title: this.title !=='' ? this.title : this.userProfile.title
        })
        this.name = ''
        this.title = ''
        this.showSuccess = true
        setTimeout(() =>{
          this.showSuccess = false
        }, 2500)
      }
    }
  }
</script>
