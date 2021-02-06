<template>
  <div id="app">
    <v-container class="change_pass_container">
      <v-stepper v-model="curr" color="green">
        <v-stepper-header class="overflow-x-auto steps">
          <v-stepper-step
            v-for="(step,n) in steps"
            :key="n"
            :complete="stepComplete(n+1)"
            :step="n+1"
            :rules="[value => !!step.valid]"
            :color="stepStatus(n+1)"
          >{{ step.name }}</v-stepper-step>
        </v-stepper-header>
        <v-stepper-content v-for="(step,n) in steps" :step="n+1" :key="n">
          {{ step.label }}
          <div style="padding-top: 15px; padding-bottom: 15px;" v-if="curr === 2">
            {{step.label2}}
          </div>
          <br>
          <br>
          <v-card class="mb-12" height="200px">
            <v-card-text>
              <v-form :ref="'stepForm'" v-model="step.valid" lazy-validation>
                <v-text-field
                  :label="step.placeholder"
                  :rules="step.rules" 
                  :append-icon="value ? (curr === 3) ? 'mdi-eye-off' : '' : (curr === 3) ? 'mdi-eye' : ''"
                  @click:append="() => (value = !value)"
                  :type="value ? (curr === 3) ? 'password' : 'text' : 'text'"
                  :prepend-icon="(curr === 3) ? 'mdi-lock' : ''"
                  v-model="forgotPassData[n]"
                  v-if="curr < 4"
                ></v-text-field>
                <div v-else>
                  <center>
                    <h4> Password Changed Succesfully </h4>
                  </center>
                </div>
                <v-text-field
                  v-if="n === 2"
                  :append-icon="valuePass ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="() => (valuePass = !valuePass)"
                  :type="valuePass ? 'password' : 'text'"
                  prepend-icon="mdi-lock"
                  :label="step.placeholder2"
                  :rules="[passwordConfirmationRule]"
                  v-model="forgotPassData[n+1]"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
          <v-btn
            outlined
            v-if="n+1 < lastStep"
            color="purple"
            @click="validate(n)"
            :disabled="!step.valid"
          >Continue</v-btn>
          <v-btn v-else color="success" @click="done()">Done</v-btn>
          <v-btn outlined class="mt-3" color="orange" @click="back(n)">Back</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-container>
  </div>
  
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    valuePass: true,
    valid: false,
    value: true,
    username: "",
    forgotPassData: [], // [contact number, code, new password, confirmed new password]
    // contactRules: [
    //   v => !!v || "Phone number is required",
    //   v => /^(09|\+639)\d{9}$/.test(v) || "Input valid phone number"
    // ],
    curr: 1 ,
    lastStep: 4,
    steps: [
      {
        name: "Start",
        rules: [
           v => !!v || "Username is required",
           v => /^[a-zA-Z0-9.\-_$@*!]{5,30}$/.test(v) || "Invalid Username",
        ],
        valid: true,
        label: "Username",
        placeholder: " Enter username"
      },
      {
        name: "Step 2",
        rules: [v => !!v || "Valid code is required"],
        valid: true,
        label: "Code" ,
        label2:"Check sent code",
        placeholder: " Enter code"
      },
      {
        name: "Step 3",
        rules: [
          value => !!value || " Password is required",
          value => {
            const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\$%\^&\*])(?=.{8,})/;
            return (
              pattern.test(value) ||
              "Min. 8 characters with at least one capital letter, a number and a special character."
            );
          }
        ],
        valid: true,
        label: "Change Password",
        placeholder: " Enter new password",
        placeholder2: "Re-type new password"
      },
      { name: "Complete" }
    ],
    valid: false,
    stepForm: []
  }),
   computed: {
    passwordConfirmationRule() {
      return () =>
        this.forgotPassData[2] === this.forgotPassData[3] || "Password does not match";
    }
  },
  methods: {
    submit() {
       this.$vloading.show();
      return new Promise((resolve, reject) => {
        switch (this.curr) {
          case 1:
            let userInfo = {
              username: this.forgotPassData[0]
            };
            axios
              .post(this.url + "/api/forgotPassword", userInfo)
              .then(response => {
                console.log(response.data);
                resolve(true);
                    setTimeout(() => {
                      this.$vloading.hide()
                    },1000) 
              });
            break;
          case 2:
            let phoneCode = {
              code: this.forgotPassData[1]
            };
            axios
              .post(this.url + "/api/forgotPassword/code", phoneCode)
              .then(response => {
                setTimeout(() => {
                      this.$vloading.hide()
                    },1000) 
                if (response.data.message === "valid_code") {
                  resolve(true);
                } else {
                  resolve(false);
                }
              })
              .catch(err => {
                rejct(err);
              });
            break;
          case 3:
          let newPassword ={
            pass:this.forgotPassData[2],
            code: this.forgotPassData[1]
          };
          axios.post(this.url+"/api/forgotPassword/newPassword",newPassword).then(response=>{
            setTimeout(() => {
                      this.$vloading.hide()
                    },1000) 
            if(response.data.message === "successfully_password_changed"){
              resolve(true);
            }else{
              resolve(false);
            }
          })
        }
      });
    },
    back(n){
      if(n !== 0){
        this.curr = n
      }else{
         this.$router.push("/login")
      }
    },
    stepComplete(step) {
      return this.curr > step;
    },
    stepStatus(step) {
      return this.curr > step ? "green" : "blue";
    },
    validate(n) {
      this.steps[n].valid = false;
      let v = this.$refs.stepForm[n].validate();
      if (v) {
        this.submit().then(callback => {
          if (callback) {
            this.steps[n].valid = true;
            // continue to next
            this.curr = n + 2;
          } else {
            this.steps[n].valid = false;
            // continue to next
            this.curr = n + 0;
          }
        });
      }
    },
    done() {
       this.$vloading.show();
      this.$router.push("/login")
       setTimeout(() => {
            this.$vloading.hide()
          },1000) 
    }
  }
};
</script>

<style scoped>
#app {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
}
.change_pass_container {
  width: 550px;
}
.steps {
  display: flex !important;
  justify-content: flex-start !important;
}
#submit,
.border-design {
  border-color: purple !important;
  border-width: 2px !important;
  color: purple !important;
}
.v-btn {
  width: 85% !important;
  min-width: 85% !important;
  margin-left: 6%;
}
#cardHeader {
  background-color: purple;
  color: white !important;
}
</style>
