<template>
<div class="container-fluid container-fluid-glas h-100">
  <div id="glas-login" class="row h-100">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <!-- <section> -->
      <div class="col-4" id="side-image-login" :style="backgroundGlasgow">
        <!-- <h1>YourGlasNotes</h1>
        <p>Welcome to the place to share and study collaboratively, for the University of Glasgow students.</p>-->
      </div>
      <div class="col-lg-push-5 col-lg-7 d-flex justify-content-center mt-5 pt-5">
        <div class="col-md-push-2 col-md-8 col-md-pull-2 col-xl-push-3 col-xl-6 col-xl-pull-3">
          <div class="text-center">
            <div class="row mb-5 pb-5 justify-content-center">
              <div class="logo logo-auth-page col-centered hidden-xs hidden-sm hidden-md m-b-2"></div>
            </div>
          </div>
          <div class="mt-5" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
            <form v-if="showLoginForm" class="form" @submit.prevent>
              <div class="text-xs-center justify-content-between mb-5">
                <h2>Welcome Back</h2>
                <span class="new-member-register">New to YourGlasNotes?</span>  <a @click.self.prevent="toggleForm" href="">Sign Up</a> 
              </div>
              <div class="form-group">
                <!-- <label for="inputEmail">Email</label> -->
                <input v-model.trim="loginForm.email" type="text" class="form-control" id="email" placeholder="Your email address" />
              </div>

              <div class="form-group">
                <!-- <label for="password1">Password</label> -->
                <input v-model.trim="loginForm.password" type="password" class="form-control" placeholder="Your password" id="password1" />
              </div>

              <button @click="login" class="button btn-lg btn-block" type="button">Log In</button>
              <div class="row my-3">
                <div class="text-right col-12 ">
                  <a class="ml-auto" @click.self.prevent="togglePasswordReset" href="">Forgot Password?</a>
                </div>
              </div>
            </form>
            <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
              <div class="text-xs-center justify-content-between mb-5">
                <h2>Get Started</h2>
              </div>

              <!-- <label for="name">Name</label> -->
              <input v-model.trim="signupForm.name" type="text" class="form-control" placeholder="Your name" id="name" />

              <!-- <label for="email2">Email</label> -->
              <input v-model.trim="signupForm.email" type="email" class="form-control" placeholder="Your glasgow uni email address" id="email2" />

              <!-- <label for="password2">Password</label> -->
              <input v-model.trim="signupForm.password" type="password" class="form-control" placeholder="Create a password" id="password2" />

              <button @click="signup" class="button btn-lg btn-block" type="button">Sign Up</button>

              <div class="row my-3">
                <div class="text-right col-12 ">
                  <a class="ml-auto" href="" @click.self.prevent="toggleForm">Back to Log in?</a>
                </div>
              </div>
            </form>
            <form v-if="showForgotPassword" @submit.prevent class="password-reset form">
              <div v-if="!passwordResetSuccess">
                <div class="text-xs-center justify-content-between mb-5">
                  <h2>Reset Password</h2>
                  <p>We will send you an email to reset your password.</p>
                </div>
                <input v-model.trim="passwordForm.email" type="email" placeholder="Your email"/>
                <button @click="resetPassword" class="button btn-lg btn-block">Send password reset link</button>
                <div class="row my-3">
                  <div class="text-right col-12 ">
                    <a class="ml-auto" href="" @click.self.prevent="togglePasswordReset">Back to Log in?</a>
                  </div>
                </div>
              </div>
              <div v-else>
                <h3>Email Sent</h3>
                <p>Check your email. We've sent you a link to reset your password.</p>
                <button @click.self.prevent="togglePasswordReset" class="button btn-lg btn-block" type="button">Back to login?</button>
              <div class="row my-3">
                <div class="text-right col-12 ">
                  <a class="ml-auto" href="" @click.self.prevent="toggleForm">Back to Log in?</a>
                </div>
              </div>
              </div>
            </form>
            <transition name="fade">
              <div v-if="errorMsg !== ''" class="alert alert-danger">
                {{ errorMsg }}
              </div>
            </transition>
          </div>
        </div>
      </div>
    <!-- </section> -->
  </div>
</div>
</template>

<style scoped>
.container-fluid-glas{
  height: 100vh!important;
}
.form-control::placeholder {
  color: #a8aaac;
  opacity: 1;
}
.form-control {
  display: block;
  width: 100%;
  color: #2e4369;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d3d5d8;
      border-top-color: rgb(211, 213, 216);
      border-right-color: rgb(211, 213, 216);
      border-bottom-color: rgb(211, 213, 216);
      border-left-color: rgb(211, 213, 216);
  -webkit-transition: border-color ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s;
  transition: border-color ease-in-out .15s;
  height: 48px;
  padding: 13px 16px 11px;
  font-size: 16px;
  line-height: 24px;
  border-radius: 3px;
  background-clip: padding-box;
}
.logo{
  background-image: url("https://blackfor.com/wp-content/uploads/2020/01/blackfor-web-x1-black-red.png");
  height: 30px;
  width: 137px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  display:block;
  background-size:cover;
}
.new-member-register{
  color: #5d7079;
}
#side-image-login{
  height: 100%;
  display:none;
  visibility: none;
  opacity: 0;
}
@media only screen and (min-width: 992px){
  #side-image-login{
    display:block;
    visibility: visible;
    opacity: 1;
  }
}
</style>

<script>
  const firebase = require('../firebaseConfig.js')
  export default {
    data(){
      return {
        loginForm: {
          email: '',
          password: ''
        },
        signupForm: {
          name: '',
          //title: '',
          email: '',
          password: ''
        },
        passwordForm: {
          email: ''
        },
        showLoginForm: true,
        showForgotPassword: false,
        passwordResetSuccess: false,
        performingRequest: false,
        errorMsg: '',
        bgImage: require("@/assets/glasgowuni.jpg")
      }
    },
    computed:{
      backgroundGlasgow(){
        return {
          "background": `url(${this.bgImage}) right center / cover no-repeat`
        };
      }
    },
    methods:{
      toggleForm(){
        this.errorMsg = ''
        this.showLoginForm = !this.showLoginForm
        if (this.showForgotPassword){
          this.showForgotPassword = false
          this.passwordResetSuccess = false
          this.errorMsg = ''
        }
      },
      togglePasswordReset(){
        if (this.showForgotPassword){
          this.showLoginForm = true
          this.showForgotPassword = false
          this.passwordResetSuccess = false
          this.errorMsg = ''
        } else{
          this.showLoginForm = false
          this.showForgotPassword = true
          this.errorMsg = ''
        }
      },
      login() {
        this.performingRequest = true
        console.log(this.loginForm.email)
        firebase.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
          this.$store.commit('setCurrentUser', user.user)
          this.$store.dispatch('fetchUserProfile')
          this.performingRequest = false
          this.$router.push('/dashboard')
        }).catch(err => {
          this.performingRequest = false
          console.log(err)
          this.errorMsg = err.message
        })
      },
      signup() {
        this.performingRequest=true
        firebase.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
          console.log("Hi") 
          if(!String(this.signupForm.email).includes("gla.ac.uk")){
            let err = {}
            err.message = "Sorry, but for now only glasgow uni students can access"
            throw err
          }
          this.$store.commit('setCurrentUser', user.user)
          firebase.usersCollection.doc(user.user.uid).set({
            name: this.signupForm.name,
            //title: this.signupForm.title
          }).then( () => {
            this.$store.dispatch('fetchUserProfile')
            this.performingRequest = false
            this.$router.push('/dashboard')
          }).catch(err =>{
            this.performingRequest = false
            console.log(err)
            this.errorMsg = err.message
          })
        }).catch(err => {
          this.performingRequest = false
          console.log(err)
          this.errorMsg = err.message
        })
      },
      resetPassword(){
        this.performingRequest = true
        firebase.auth.sendPasswordResetEmail(this.passwordForm.email).then( ()=>{
          this.performingRequest = false
          this.passwordResetSuccess = true
          this.passwordForm.email = ''
        }).catch(err => {
          console.log(err)
          this.performingRequest=false
          this.errorMsg = err.message
        })
      }
    }

  }
</script>
