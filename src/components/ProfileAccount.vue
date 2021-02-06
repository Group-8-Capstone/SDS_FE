<template>
 <div class="container " >
   <center>
            <v-card style="max-width:500px;height:auto;" class="ml-10">
                 <v-card-title >ACCOUNT PROFILE</v-card-title>
                 <div class="modal-body">
                        <form @submit="formSubmit" enctype="multipart/form-data" action>
                          <v-container>
                                  <center>
                                    <img style="max-width:100%;height:auto;" class="addOnsImage" :src="imageURL"><br>
                                     <h4 class=" gray--text">{{username}}</h4>
                                     <br>
                                     <p class=" gray--text">Update Profile Picture</p>
                                    <input type="file" class="fileStyle deep-purple--text"  accept="image/jpeg, image/png, image/gif" id="imageUpload"  v-on:change="onImageChange">     
                            </center>
                            </v-container>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn small type="submit"  for="imageUpload" class="ma-3" color="purple darken-2" outlined>UPLOAD PICTURE</v-btn>
                      </v-card-actions>
                        </form>
                  </div>
                  <v-divider></v-divider>
                    <v-card-title >ACCOUNT PASSWORD</v-card-title>
                    <span id="message"></span>
                  <v-row>
                    <v-col cols="12">  <v-text-field
                      v-model="userPassword"
                      prepend-icon="mdi-lock"
                      label="Enter New password"
                      :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="() => (value = !value)"
                      :type="value ? 'password' : 'text'"
                      :rules="[rules.password]"
                      outlined
                      dense
                      :error-messages="userPasswordErrors"
                      @input="$v.userPassword.$touch()"
                      @blur="$v.userPassword.$touch()"
                      required
                    ></v-text-field>
                    <v-text-field
                     
                      label="Confirm New Password"
                      :append-icon="valuePass ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="() => (valuePass = !valuePass)"
                      :type="valuePass ? 'password' : 'text'"
                      name="password"
                      prepend-icon="mdi-lock"
                      v-model="confirmPassword"
                      :rules="[passwordConfirmationRule]"
                      class="border-design"
                      outlined
                      dense
                      :error-messages="confirmPasswordErrors"
                      @input="$v.confirmPassword.$touch()"
                      @blur="$v.confirmPassword.$touch()"
                      required
                    ></v-text-field></v-col>
                  </v-row>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                  <v-btn outlined small @click="updatePassword" class="ma-3" color="purple darken-2">UPDATE PASSWORD</v-btn>
                  </v-card-actions>
            </v-card>
        </center>
 </div>
</template>
<style>
.addOnsImage{
    width: 150px !important; 
    height: 150px !important; 
  
}
.fileStyle{
    font-size: 17px !important;
    width: 50%;
    margin-top: 3%;
    margin-bottom: 3%;
    
}


</style>


<script>
import axios from "axios";
import Swal from "sweetalert2";
import {
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
  export default {
    name: "BusinessSetting",
    data: () => ({
      rules: [
        value => !!value || 'Required.',
      ],
      alignments: [
        'start',
        'center',
        'end',
      ],
    
      ownersName:null,
      imageURL: null,
      errorMessage:null,
      disabled: true,
      btnDisabled:false,
      isHidden: true,
      username:null,
      rules: {
      required: value => !!value || " Password is required.",
      password: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\$%\^&\*])(?=.{8,})/;
        return (
          pattern.test(value) ||
          "Min. 8 characters with at least one capital letter, a number and a special character."
        );
      }
    },
    confirmPassword: null,
    userPassword: null,
    valuePass: true,
    value: true,

    }),
     validations: {
    userPassword: {
      required
    },
    confirmPassword: {
      required
    }
     },
    beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      'Access-Control-Allow-Origin':'*'
    };
    this.config = config;
  },
   computed: {
    passwordConfirmationRule() {
      return () =>
        this.userPassword === this.confirmPassword || "Password does not match";
    },
    userPasswordErrors() {
      const errors = [];
      if (!this.$v.userPassword.$dirty) return errors;
      !this.$v.userPassword.required && errors.push("Pasword is required.");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.required && errors.push("Pasword is required.");
      return errors;
    },
  },

    mounted() {
        this.avatarRetrieve()
    
    },

    methods: {
      reloadPassword(){
        this.userPassword=null,
        this.confirmPassword=null
      },
      editAmount(){
        this.disabled= false
        this.btnDisabled=true
        this.isHidden=false
      },

      saveChanges(){
        this.disabled= true
        this.btnDisabled=false
        this.isHidden = true

      },
      onImageChange(e){
            this.image = e.target.files[0]
            this.imageURL = URL.createObjectURL(e.target.files[0])
        },
     formSubmit(e) {
        this.$vloading.show();
            if(this.image !== null ){
                e.preventDefault();
                let currentObj = this;
                const config = {
                    headers: { 'content-type': 'multipart/form-data' }
                }
                this.addProductDialog=false
                let formData = new FormData();
                let id=localStorage.getItem('id')
                formData.append('image', this.image)
                axios.post(this.url+'/api/ProfilePicUpdate/'+id, formData, this.config).then(function (response) {
                    currentObj.success = response.data.success
                    window.location.reload()
                  
                    this.$vloading.hide()
               
                     
                })
                .catch(function (error) {
                    currentObj.output = error;
                });
            }else{
                this.errorMessage = 'All fields are required!'
            }
           this.$vloading.hide()
                 
               
        },
      avatarRetrieve() {
      this.$vloading.show();
      let id=localStorage.getItem('id')
      axios.get(this.url+"/api/fetchProfile/"+ id, this.config).then(response => {
        setTimeout(() => {
        this.$vloading.hide()
         },1000)   
        this.username=response.data.account[0].username
        if(response.data.account[0].profile_url==null){
          this.imageURL=this.url+'/images/avatar.png'
        }else{
          this.imageURL=this.url+"/"+response.data.account[0].profile_url
        }
      });
    },
    updatePassword(){
      if (this.userPassword ==null || this.confirmPassword ==null){
         this.$v.$touch();
      }else if(this.userPassword != this.confirmPassword){
          Swal.fire({
                  position: "center",
                  icon: "warning",
                  text: "Mismatch password!",
                  showConfirmButton: false,
                  timer: 1500
          });
      }
      else{
      this.$vloading.show();
      let id=localStorage.getItem('id')
      let param={
        confirmPassword:this.confirmPassword
      }
      axios.post(this.url+'/api/passwordUpdate/'+id, param, this.config)
            .then(response => {
              this.$vloading.hide()
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Your updated your password",
                  showConfirmButton: false,
                  timer: 1500
                });
              })
        this.$v.$reset();
      
    }
    }
    }

 
    
  }
</script>

