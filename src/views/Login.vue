<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card >
              <v-list-item
                id="cardHeader"
                size="150"
              >
                <v-list-item-content>
                  <v-list-item-title class="d-flex align-center justify-center pa-3 mx-auto headline">Sign In</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="d-flex align-center justify-center pa-6 mx-auto">
                <img
                  alt="wawen's ube halaya"
                  src="../assets/wawens.png"
                  height="140"
                >
              </v-list-item>
              <v-spacer></v-spacer>
              <v-card-text>
                <v-form>
                  <p v-if="error" class="notif"> Incorrect Username and Password </p>
                  <v-text-field
                    label="Username"
                    name="Username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="user"
                    class="border-design"
                    outlined
                    dense
                    :error="error"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="() => (value = !value)"
                    :type="value ? 'password' : 'text'"
                    prepend-icon="mdi-lock"
                    v-model="pass"
                    class="border-design"
                    outlined
                    dense
                    :error="error"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <!-- <div class="remember ml-9">
              <input type="checkbox" value="lsRememberMe" id="rememberMe" > <label for="rememberMe">Remember me</label>
               </div> -->
               <div align="left" class="forgot mr-5">
                <span>
                  <a href="/forgotPassword" >Forgot Password</a>
                </span>
                </div>
              <center>
                <v-btn
                  id="btnLogin"
                  class="mb-5"
                  block
                  outlined
                  @click="login"
                >Sign in</v-btn>
              </center>
              <div align="center" justify="center">
                  <span>
                    Don't have an account?
                    <a href="/register">Sign up</a>
                    <br>
                    <br>
                  </span>
                </div>
                <v-progress-linear
                  color="deep-purple accent-4"
                  v-show="loading"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped>

#btnLogin,
.border-design {
  border-color: purple !important;
  border-width: 2px !important;
  color: purple !important;
}
.forgot{
  /* text-align:right; */
  margin-top:-30px;
  margin-bottom:20px;
  margin-left: 50px;
}
.remember{
    margin-right: 15px;
}
.v-btn {
  width: 85%  !important;
  min-width: 85% !important;
  margin-left: 5%;
}
#cardHeader {
  background-color: purple;
  color: white !important;
}
.notif{
  text-align: center;
  color: red;
}
</style>


<script>
import axios from "axios";
export default {
  props: {
    source: String,
  },
  data() {
    return {
      loading: false,
      user : '',
      pass : '',
      isAvailable: 0,
      responseMessage: '',
      error : false,
      value: true,

    };
  },
  mounted() {},
  watch: {
    error: function(ol, ne){
      return this.error
    }
  },
  methods: {
    login() {
      this.$vloading.show();
      let userAccount = {
        username: this.user,
        password: this.pass,
      }
  
      axios.post(this.url+"/api/login", userAccount).then((response) => {
        if(response.data.message === 'successfully_login'){
           setTimeout(() => {
            this.$vloading.hide()
          },1000) 
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username", response.data.UserAccount[0].username);
          localStorage.setItem("role", response.data.UserAccount[0].role);
          localStorage.setItem("id", response.data.UserAccount[0].id);
          if(response.data.UserAccount[0].role == 'admin'){
            // this.loading =  false;
             setTimeout(() => {
            this.$vloading.hide()
          },1000) 
            this.$router.push('/dashboard');
          } else if (response.data.UserAccount[0].role == 'customer') {
            // this.loading = false;
             setTimeout(() => {
            this.$vloading.hide()
          },1000) 
            this.$router.push('/customerHome');
          } else {
            // this.loading = false;
             setTimeout(() => {
            this.$vloading.hide()
          },1000) 
            this.$router.push('/delivery');
          }
        }else{
           setTimeout(() => {
            this.$vloading.hide()
          },1000) 
          this.error = true;
        }
      });
    },
  //   checkUsername: function(){
  //     var username = this.username.trim();
  //     if(username != ''){
 
  //      axios.get('http://localhost:8000/api/login', {
  //        params: {
  //          username: username
  //        }
  //      })
  //      .then(function (response) {
  //        app.isAvailable = response.data;
  //        if(response.data == 0){
  //          app.responseMessage = "Username is Available.";
  //        }else{
  //          app.responseMessage = "Username is not Available.";
  //        }
  //      })
  //      .catch(function (error) {
  //        console.log(error);
  //      });

  //    }else{
  //      this.responseMessage = "";
  //    }
  //  }
  },
};
</script>