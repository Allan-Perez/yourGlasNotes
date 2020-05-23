<template>
  <header>
    <section>
      <div class="navbar navbar-light">
        <router-link to="dashboard" class="header-logo-style"><h2>GlasNotes</h2></router-link>
        <ul class="inline">
          <li><router-link to="dashboard">Dashboard</router-link></li>
          <li><router-link to="settings">Settings</router-link></li>
          <li><a @click.self.prevent="logout">Log Out</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
  const firebase = require("../firebaseConfig.js")

  export default {
    methods:{
      logout() {
        firebase.auth.signOut().then( () => {
          this.$store.dispatch("clearData")
          this.$router.push("/login")
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
