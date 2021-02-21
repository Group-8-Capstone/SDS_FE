<template>
<div>
  <center>
    <v-form ref="form"
    v-model="valid"
    lazy-validation>
     <v-card style="max-width:800px;height:auto;" class="mb-12" >
        <v-spacer></v-spacer>
        <v-card-title class="align-center">
          <v-list-item-title
            class="d-flex align-center justify-center mx-auto headline black--text"
          >ADD ORDER</v-list-item-title>
        </v-card-title>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                prepend-icon="mdi-account-outline"
                label="Customer Name"
                v-model="customerName"
                :error-messages="customerErrors"
                @input="$v.customerName.$touch()"
                @blur="$v.customerName.$touch()"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" >
              <v-text-field
                type="number"
                prepend-icon="mdi-phone"
                label="Mobile Number"
                v-model="contactNumber"
                :rules="contactRules"
                :error-messages="contactNumberErrors"
                @input="$v.contactNumber.$touch()"
                @blur="$v.contactNumber.$touch()"
                required
              ></v-text-field>
            </v-col>
          </v-row>
              <!-- <v-row>
             <v-col cols="6" class="pl-5" >
              <v-img  width="250px" height="200px" src="../assets/halayaJar.jpg"></v-img>
              <h6 class="display-1 font-weight-light orange--text ml-5">{{jarName}}</h6>
              <div id="price" class="font-weight-light grey--text title ml-5">{{jarPrice}}</div>
            </v-col>
            <v-col cols="6" class="pl-5" >
              <v-img  width="250px" height="200px" src="../assets/halayaTab.jpg"></v-img>
               <h6 class="display-1 font-weight-light orange--text ">{{tubName}}</h6>
                <div id="price" class="font-weight-light grey--text title ">{{tubPrice}}</div>
            </v-col>
          </v-row> -->
          <!-- <v-row >
            <v-col cols="6" >
              <v-text-field min="0" type="number" label="Quantity" v-model="jarQuantity">
                <template slot="prepend">
                  <div id="vue-counter">
              <v-icon type="button" v-on:click="increaseJar">mdi-plus</v-icon> 
                <v-icon type="button" v-on:click="decreaseJar" >mdi-minus</v-icon>
              </div>
                </template>
              </v-text-field>
            </v-col>
            <v-col  cols="6" class="pl-12">
               <v-text-field min="0" type="number" label="Quantity" v-model="tabQuantity">
                <template slot="prepend">
                  <div id="vue-counter" >
              <v-icon type="button" v-on:click="increaseTub">mdi-plus</v-icon>
              <v-icon type="button" v-on:click="decreaseTub" disabled:isDisabled class="ml-1">mdi-minus</v-icon>
              </div>
                </template>
              </v-text-field>
            </v-col>
          </v-row> -->
          <v-row>
                <v-col cols="6">
                <v-select
                  label="Product Name"
                  v-model="product_name"
                  :items="availableProducts"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                type="number"
                  v-model="product_quantity"
                  label="Product Quantity"
                  v-bind:disabled="disabled"
                ></v-text-field>
              </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="purple darken-2" @click="placeOrder()">ADD ORDER</v-btn>
        </v-card-actions>
      </v-card>
      </v-form>
      </center>
      <v-dialog v-model="post" width="500">
        <v-text-field                   v-model="product_price"
></v-text-field>
      </v-dialog>

    </div>  
</template>
<script>
import Swal from "sweetalert2";
import axios from "axios";
import { setInterval } from "timers";
import {
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
export default {
    name:"Walkin",
  data() {
    return {
      post:false,
      valid: true,
      loading: false,
      product_price:null,
      accessToken:
        "pk.eyJ1IjoiamllbnhpeWEiLCJhIjoiY2tlaTM3d2VrMWcxczJybjc0cmZkamk3eiJ9.JzrYlG2kZ08Pkk24hvKDJw",
      menu: false,
      btnDisable: true,
      addOrderDialog: false,
      availableProducts:{},
      customerStreet: "Shambala Veterinary Clinic Hernan Cortes Street",
      customerBarangay: "Bakilid",
      customerCity: "Mandaue city",
      customerProvince: "Cebu",
      landmark:'Jollibee',
      longitude: 123.921969,
      latitude: 10.329892,
      postcode: 6014,
      product_quantity:0,
      product_name:null,
      customerName: null,
      contactNumber: null,
      orderQuantity: null,
      jarName:null,
      tubName:null,
      tubPrice:null,
      jarPrice:null,
      orderStatus: null,
      date:  new Date().toISOString().substr(0, 10),
      jarQuantity: "0",
      tabQuantity: "0",
      totalPay:0,
      distance: 0,
      contactRules: [
      v => !!v || "Phone number is required",
      v => /^(09|\+639)\d{9}$/.test(v) || "Input valid phone number"
    ],
    };
  },
  validations: {
    customerName: {
      required
    },
    address: {
      required
    },
    contactNumber: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(11)
    },
    orderQuantity: {
      required
    },
    customerStreet: {
      required
    },
    customerBarangay: {
      required
    },
    customerProvince: {
      required
    },
    date: {
      required
    }
  },
   beforeCreate() {
    let config = {}
    config.headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
    this.config = config
  },

  computed: {
    addressErrors() {
      const errors = [];
      if (!this.$v.address.$dirty) return errors;
      !this.$v.address.required && errors.push("Address is required.");
      return errors;
    },
    customerErrors() {
      const errors = [];
      if (!this.$v.customerName.$dirty) return errors;
      !this.$v.customerName.required && errors.push("Name is required.");
      return errors;
    },
    orderQuantityErrors() {
      const errors = [];
      if (!this.$v.orderQuantity.$dirty) return errors;
      !this.$v.orderQuantity.required && errors.push("Quantity is required.");
      return errors;
    },
    contactNumberErrors() {
      const errors = [];
      if (!this.$v.contactNumber.$dirty) return errors;
      !this.$v.contactNumber.minLength &&
        errors.push("Contact Number must be at atleast 11 characters long");
      !this.$v.contactNumber.maxLength &&
        errors.push(
          "Contact Number must not be greater than 11 characters long"
        );
      !this.$v.contactNumber.required &&
        errors.push("Contact Number is required.");
      return errors;
    },
    customerStreetErrors() {
      const errors = [];
      if (!this.$v.customerStreet.$dirty) return errors;
      !this.$v.customerStreet.required && errors.push("Street is required.");
      return errors;
    },
    customerBarangayErrors() {
      const errors = [];
      if (!this.$v.customerBarangay.$dirty) return errors;
      !this.$v.customerBarangay.required &&
        errors.push("Barangay is required.");
      return errors;
    },
    customerProvinceErrors() {
      const errors = [];
      if (!this.$v.customerProvince.$dirty) return errors;
      !this.$v.customerProvince.required &&
        errors.push("Province is required.");
      return errors;
    },
    deliveryDateErrors() {
      const errors = [];
      if (!this.$v.date.$dirty) return errors;
      !this.$v.date.required && errors.push("Delivery is required.");
      return errors;
    }
  },

  created(){
    this.getHalayaJar()
    this.getHalayaTub()
    this.getProduct()

  },

  methods: {
    showDialog() {
      this.$refs.form.reset();
      this.$v.$reset();
      this.customerStreet = null
      this.customerBarangay = null
      this.customerProvince = null
      this.customerName = null
      this.contactNumber = null
      this.orderQuantity = null
      this.jarQuantity="0"
      this.tabQuantity="0"
      this.date = null
    },

    placeOrder() {
      this.$vloading.show();
      //if (this.jarQuantity=='0' && this.tabQuantity=='0' ){
      //       setTimeout(() => {
      //   this.$vloading.hide()
      //    }, 1000) 
      //    Swal.fire({
      //   position: "center",
      //   icon: "warning",
      //   title: "No order",
      //   showConfirmButton: false,
      //   timer: 1500
      // });
      // } else if(this.jarQuantity <0 ||this.tabQuantity <0){
      //   this.$vloading.hide()
      //   Swal.fire({
      //     position: "center",
      //     icon: "warning",
      //     title: "Your quantity must not be less than 0",
      //     showConfirmButton: false,
      //     timer: 1500
      //   });
      // }
       if(this.customerName == null ||
      this.contactNumber == null){
          this.$v.$touch();
           this.$vloading.hide()
        
      }
      else{
          this.totalPay =
          this.jarQuantity * this.jarPrice + this.tabQuantity * this.tubPrice
      var place = this.customerStreet.concat(
        " ",
        this.customerBarangay,
        " ",
        this.customerCity,
        " ",
        this.customerProvince
      );
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?limit=2&access_token=${
            this.accessToken
          }`
        )
        .then(response => {
          let res = JSON.stringify(response.data);
          let result = JSON.parse(res); 

          var from_place = turf.point([123.921969, 10.329892]);
          var to_place = turf.point(result.features[0].geometry.coordinates);
          var options = { units: "kilometers" };
          var dist = turf.distance(from_place, to_place, options);

          let param = {
            //customer_id: localStorage.getItem("id"),
            receiver_name: this.customerName,
            order_id:Math.floor(Math.random() * 3000), 
            building_street: this.customerStreet,
            barangay: this.customerBarangay,
            city_municipality: this.customerCity,
            province: 6000,
            contactNumber: this.contactNumber,
            deliveryDate: this.date,
            email:'Clark@gmail.com',
            order_status:'completed',
            payment_method:'COD',
            payment_status:'completed',
            landmark:this.landmark,
            product_name:this.product_name,
            product_quantity:this.product_quantity
          };
         
          axios
            .post(this.url+"/api/post/createWalkin", param,this.config)
            .then(response => {
                setTimeout(() => {
                this.$vloading.hide()
                },1000) 
              if (response.data == "success") {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Order saved",
                  showConfirmButton: false,
                  timer: 1500
                });
              this.showDialog();
              }
            });
        });
        } 
    },
       getProduct(item){
        this.$vloading.show();
        axios.get(this.url+"/api/fetchProduct", this.config)
        .then(response => {
          var newArray = response.data.map( function( el ){ 
                                return el.product_name; 
                               });
          this.availableProducts = newArray
        });
    },

    postOrder(){
        axios.get(this.url+"/api/postPrice", this.config)
        .then(response => {
         console.log(response)
         this.product_price = response
         console.log(response)
        });

    },
    
    isDisabled: function() {
      return !this.tabQuantity;
    },

    notLessDate(deliveredDate) {
      return deliveredDate >= new Date().toISOString().substr(0, 10);
    },
    getHalayaTub(item){
        this.$vloading.show();
        axios.get(this.url+"/api/fetchHalayaTub", this.config)
        .then(response => {
            setTimeout(() => {
        this.$vloading.hide()
         },1000) 
          //this.tubName=response.data.product[0].product_name
          //this.tubPrice=response.data.product[0].product_price
        });
    },

    getHalayaJar(item){
        this.$vloading.show();
        axios.get(this.url+"/api/fetchHalayaJar", this.config)
        .then(response => {
            setTimeout(() => {
        this.$vloading.hide()
         },1000) 
          //this.jarName=response.data.product[0].product_name
          //this.jarPrice=response.data.product[0].product_price
        });
    },
     increaseJar: function() {
      this.jarQuantity++;
    },
    decreaseJar:  function() {
      if (this.jarQuantity==0){
        this.jarQuantity=0
      }else{
      this.jarQuantity--;   
}
    },
    resetJar: function() {
      this.jarQuantity = 0;
    },
    increaseTub: function() {
      this.tabQuantity++;
    },
    decreaseTub:  function() {
      if (this.tabQuantity==0){
        this.tabQuantity=0
      }else{
      this.tabQuantity--;   
}
    },

    resetTub: function() {
      this.tabQuantity = 0;
    },

  }
};
</script>
<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

.v-application--wrap {
  min-height: 100vh;
  justify-content: center;
}
</style>