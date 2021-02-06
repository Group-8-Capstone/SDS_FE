<template>
  <div>
    <!-- <v-card  class="ma-5 mb-12 pa-5">
      <default-location/>
    </v-card>-->
    <v-card id="cardtable" class="ma-5 mb-12 pa-5">
      <v-tabs v-model="tabs" right color="deep-purple accent-4">
        <v-tab>Received Orders</v-tab>
        <v-tab>Pending Orders</v-tab>
        <v-tab>Walk in</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card-title>
            Received Orders
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-row>
            <v-data-table :headers="headers" :items="orders" :search="search">
              <template v-slot:item.preferred_delivery_date="{ item }">
                <span>{{new Date(item.preferred_delivery_date).toISOString().substring(0,10)}}</span>
              </template>
               <template v-slot:item.contact_number="{ item }">
              <span>{{'0'+item.contact_number}}</span>
            </template>
             <template v-slot:item.distance="{ item }">
              <span>{{item.distance+'km'}}</span>
            </template>
              <template v-slot:item.order_status="{ item }">
                <v-chip :color="getColor(item.order_status)" dark>{{ item.order_status }}</v-chip>
              </template>
              <template v-slot:item.action="{ item }">
                <div v-if="isCanceled(item) === true">
                  <v-icon
                    disabled
                    @click="editDialog = !editDialog, editItem(item) "
                    class="mr-2"
                    normal
                    title="Edit"
                  >mdi-table-edit</v-icon>
                  <v-icon
                    disabled
                    @click="alertCancel(item)"
                    normal
                    class="mr-2"
                    title="Cancel"
                  >mdi-cancel</v-icon>
                </div>
                <div v-else>
                  <v-icon
                    @click="editDialog = !editDialog, editItem(item) "
                    class="mr-2"
                    normal
                    title="Edit"
                  >mdi-table-edit</v-icon>
                  <v-icon @click="alertCancel(item)" normal class="mr-2" title="Cancel">mdi-cancel</v-icon>
                </div>
              </template>
            </v-data-table>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-card-title>
            Pending Orders
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search1"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="pendingOrders" :search="search1">
            <template v-slot:item.preferred_delivery_date="{ item }">
              <span>{{new Date(item.preferred_delivery_date).toISOString().substring(0,10)}}</span>
            </template>
            <template v-slot:item.contact_number="{ item }">
              <span>{{'0'+item.contact_number}}</span>
            </template>
            <template v-slot:item.order_status="{ item }">
              <v-chip :color="getColor(item.order_status)" dark>{{ item.order_status }}</v-chip>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon
                normal
                class="mr-2"
                title="Confirm Order"
                @click="confirmOrder(item)"
              >mdi mdi-checkbox-marked-outline</v-icon>
              <v-icon @click="alertCancel(item)" normal class="mr-2" title="Cancel">mdi-cancel</v-icon>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <Walkin/>
        </v-tab-item>
      </v-tabs-items>
      <template>
          <v-form ref="form"
          v-model="valid"
          lazy-validation>
        <v-dialog v-model="editDialog" style="height:auto;" width="400px">
          <v-card>
            <v-spacer></v-spacer>
            <v-card-title class="deep-purple--text">UPDATE ORDER</v-card-title>
            <v-card-subtitle>Please fill in the required information</v-card-subtitle>
            <v-divider></v-divider>
            <v-container>
              <v-row class="mx-2">
                <v-col class="align-center justify-space-between" cols="12">
                  <v-row align="center" class="mr-0">
                    <v-text-field
                      prepend-icon="mdi-account-outline"
                      label="Receiver's Name"
                       :rules="nameRules"
                       required
                      v-model="post.receiver_name"
                    ></v-text-field>
                  </v-row>
                </v-col>
                <v-icon class="pl-4">mdi-map-marker</v-icon>
                <label>Receiver Address</label>
                <v-row class="pl-5">
                  <v-col cols="6">
                    <v-text-field v-model="post.building_or_street" label="Building Name/Street" :rules="streetRules"
                       required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="post.barangay" label="Barangay" :rules="barangayRules"
                       required></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="pl-5">
                  <v-col cols="6">
                    <v-text-field v-model="post.city_or_municipality" label="Municipality/City"
                    :rules="municipalityRules"
                       required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="post.province" label="Province" :rules="provinceRules"
                       required></v-text-field>
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <v-menu
                    ref="updateDateMenu"
                    v-model="updateDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="post.preferred_delivery_date"
                        label="Preferred Delivey Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="deliveryRules"
                       required
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="post.preferred_delivery_date "
                      color="deep-purple lighten-1"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="post.ubehalayajar_qty"
                    prepend-icon="mdi-plus"
                    min="1"
                    type="number"
                    label="Halaya Jar Quantity"
                    v-bind:disabled="disabled"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="post.ubehalayatub_qty"
                    prepend-icon="mdi-plus"
                    min="1"
                    type="number"
                    label="Halaya Tub Quantity"
                    v-bind:disabled="disabled"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small outlined color="orange" @click="editDialog = false,cancel()">CANCEL</v-btn>
              <v-btn small outlined color="purple darken-2" @click=" updateItem()">UPDATE</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
          </v-form>
      </template>
    </v-card>
  </div>
</template>
<style>
.mr-2:hover {
  color: purple;
}

.headline {
  color: white;
}

.date-color {
  color: #00b300;
  font-weight: 900;
}
.validation {
  color: red;
}
.cancel {
  color: red;
  background-color: #00b300;
}
.order {
  color: #00b300;
}
#closeBtn {
  float: right !important;
}
</style>

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
import * as turf from "@turf/turf";
import { connect } from "tls";
import Walkin from "../components/Walkin.vue";
import { constants } from "zlib";
import Pusher from 'pusher-js' // import Pusher
// import Order from "../components/Orders.vue";
// import DefaultLocation from "../components/DefaultLocation.vue"

export default {
  name: "Order",
  components: {
    Walkin
    // DefaultLocation,
    // Order
  },
  data() {
    return {
    valid:true,
      accessToken:
        "pk.eyJ1IjoiamllbnhpeWEiLCJhIjoiY2tlaTM3d2VrMWcxczJybjc0cmZkamk3eiJ9.JzrYlG2kZ08Pkk24hvKDJw",
      deliveryDate: new Date().toISOString().substr(0, 10),
      addDateMenu: false,
      updateDateMenu: false,
      tabs: null,
      message: "",
      post: {},
      orders: [],
      pendingOrders: [],
      distance: 0,
      status: "On order",
      orderedProducts: [],
      msg: [],
      date2: new Date(),
      hover: false,
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      dialog: false,
      editDialog: false,
      search1: null,
      customerName: "",
      complete_address: "",
      address: "",
      coordinates: [],
      contactNumber: "",
      orderQuantity: "",
      orderStatus: "On order",
      search: "",
      dialog: false,
      disabled: true,
      headers: [
        {
          text: "Receiver Name",
          align: "start",
          sortable: false,
          value: "receiver_name"
        },
        { text: "Address", value: "customer_address", sortable: false },
        { text: "Mobile Number", value: "contact_number", sortable: false },
        { text: "Distance", value: "distance" },
        {
          text: "Delivery Date",
          value: "preferred_delivery_date",
          sortable: false
        },
        {
          text: "Ube Halaya Jar(Quantity)",
          value: "ubehalayajar_qty",
          sortable: false
        },
        {
          text: "Ube Halaya Tub(Quantity)",
          value: "ubehalayatub_qty",
          sortable: false
        },
        {
          text: "Total Payment",
          value: "total_payment",
          sortable: false
        },
        { text: "Actions", value: "action", sortable: false },
        { text: "Status", value: "order_status" }
      ],
      nameRules: [
        v => !!v || 'Name is required',
      ],
      provinceRules: [
        v => !!v || 'Province is required',

      ],
      barangayRules: [
        v => !!v || 'Barangay is required',
      ],
      streetRules: [
        v => !!v || 'Street is required',
      ],
      municipalityRules: [
        v => !!v || 'Municipality is required',

      ],
      contactRules: [
      v => !!v || 'Mobile number is required',
      v => /^(09|\+639)\d{9}$/.test(v) || "Input valid phone number"
    ],
    deliveryRules: [
        v => !!v || 'Delivery Date is required',

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
    }
  },
  mounted() {
    let pusher = new Pusher('c31b45d58431fd307880', {
        cluster: 'ap1',
        encrypted: false
      });

      //Subscribe to the channel we specified 
    let channel = pusher.subscribe('order-channel')

    channel.bind('newOrder', data => {
      console.log(data.order);
      this.fetchOrders();
      this.fetchPendingOrders();
    });
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
    getEndDate() {
      var endDate = new Date(
        this.date2.getFullYear(),
        this.date2.getMonth() + 1,
        10
      );
      return endDate.toISOString().slice(0, 10);
    }
  },
  beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Access-Control-Allow-Origin": "*"
    };
    this.config = config;
    console.log("this.config", this.config);
  },
  created() {
    this.fetchPendingOrders();
    // this.fetchOrders();
    setInterval(this.fetchOrders(), 3000);
  },
  methods: {
    getColor(status) {
      if (status === "Canceled") return "orange";
      else if (status === "On order") return "blue";
      else return "green";
    },
    showDialog() {
      this.reloadData();
      this.dialog = !this.dialog;
    },

    orderedProduct(id) {
      this.orderDetails = true;
      for (var i = 0; i < this.orders.length; i++) {
        if (id == this.orders[i].id) {
          for (var j = 0; j < this.orders[i].products.length; j++) {
            this.orderedProducts.push(this.orders[i].products[j]);
          }
        }
      }
      console.log("orderedProducts: ", this.orderedProducts);
    },
    closeDialog() {
      this.orderDetails = false;
      this.orderedProducts = [];
    },
    updateItem() {
       
      if (
        this.post.receiver_name === "" ||
        this.post.building_or_street === "" ||
        this.post.barangay === "" ||
        this.post.city_or_municipality === "" ||
        this.post.province === "" ||
        this.post.preferred_delivery_date === ""
      ) {
        Swal.fire({
          title: "Please fill in all required fields",
          icon: "warning",
          timer: 3000
        }),
          (this.editDialog = this.editDialog);
      } else {
      
        this.editDialog = false;
        this.$vloading.show();
       
        var place = this.post.building_or_street.concat(
          " ",
          this.post.barangay,
          " ",
          this.post.city_or_municipality,
          " ",
          this.post.province
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
            var coordinates = result.features[0].geometry.coordinates;
            var from_place = turf.point([123.921969, 10.329892]);
            var to_place = turf.point(coordinates);
            var options = { units: "kilometers" };
            var dist = turf.distance(from_place, to_place, options);
            this.post.distance = dist;
            axios
              .post(this.url + "/api/post/update", this.post, this.config)
              .then(response => {
                this.$vloading.hide()
                Swal.fire({
                  title: "Successfully Updated",
                  icon: "success",
                  timer: 3000
                }),
                  this.fetchOrders();
              });
          });
      }
    },
    cancel(){
      this.$refs.form.reset()
    },
    reloadData() {
      (this.customerName = ""),
        (this.address = ""),
        (this.contactNumber = ""),
        (this.orderQuantity = ""),
        (this.deliveryDate = new Date().toISOString().substr(0, 10)),
        this.fetchOrders();
      this.getColor();
      this.$v.$reset();
    },
    updateDeliveredStatus() {
      axios
        .post(this.url + "/api/post/update", this.post, this.config)
        .then(response => {
          this.fetchOrders();
        });
    },
    deleteItem(item) {
      axios
        .post(
          this.url + "/api/post/updateCanceledStat/" + item.id,
          {},
          this.config
        )
        .then(response => {
          this.loading = false;
          this.fetchOrders();
          this.fetchPendingOrders();
        });
    },
    editItem(item) {
      axios
        .get(this.url + "/api/post/edit/" + item.id, this.config)
        .then(response => {
          this.post = response.data;
        });
    },
    orderDetail() {
      this.orderDetails = true;
    },
    alertCancel(item) {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#CFD8D",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
        reverseButtons: true
      }).then(result => {
        if (result.value) {
          this.$vloading.show();
          this.deleteItem(item);
          this.$vloading.hide()
          Swal.fire({
            title: "Canceled!",
            text: "Order is being canceled",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
        }else {
        }
      });
    },
    addOrder() {
      this.$v.$touch();
      let param = {
        name: this.customerName,
        address: this.address,
        contactNumber: this.contactNumber,
        orderQuantity: parseInt(this.orderQuantity) * 1,
        deliveryDate: this.deliveryDate,
        orderStatus: this.orderStatus,
        longitude: this.coordinates[0],
        latitude: this.coordinates[1],
        distance: this.distance
      };
      axios
        .post(this.url + "/api/post", param, this.config)
        .then(response => {
          Swal.fire({
            title: "Successfully Added",
            icon: "success",
            timer: 3000
          });
          this.reloadData();
          this.dialog = false;
        })
        .catch(response => {
          console.log(response);
        });
    },
    getHalayaJarQty(item) {
      let halayaJarQty = 0;
      for (var i = 0; i < item.products.length; i++) {
        let name = item.products[i].product_name;
        if (name.includes("Jar")) {
          halayaJarQty += item.products[i].pivot.sub_quantity;
        }
      }
      return halayaJarQty;
    },
    getUbechiQty(item) {
      let ubechiQty = 0;
      for (var i = 0; i < item.products.length; i++) {
        let name = item.products[i].product_name;
        if (name.includes("Ubechi")) {
          ubechiQty += item.products[i].pivot.sub_quantity;
        }
      }
      return ubechiQty;
    },
    fetchOrders() {
      this.$vloading.show();
        
        axios.get(this.url + "/api/posts/order", this.config).then(response => {
        setTimeout(() => {
        this.$vloading.hide()
         },1000)  
         //use your own credentials you get from Pusher
         
 
      this.orders = response.data.data;
       for (var i = 0; i < this.orders.length; i++) {
          var street = response.data.data[i].building_or_street;
          var barangay = response.data.data[i].barangay;
          var city = response.data.data[i].city_or_municipality;
          var province = response.data.data[i].province;
          var place = street
            .toString()
            .concat(
              " ",
              barangay.toString(),
              " ",
              city.toString(),
              " ",
              province.toString()
            );
          this.orders[i]["customer_address"] = place;
        }
    // });
       
       
      });
    },
    fetchPendingOrders() {
      this.$vloading.show();
      axios
        .get(this.url + "/api/fetch/pending-orders", this.config)
        .then(response => {
           setTimeout(() => {
        this.$vloading.hide()
         },1000)   
          this.pendingOrders = response.data.data;
          for (var i = 0; i < this.pendingOrders.length; i++) {
            var street = response.data.data[i].building_or_street;
            var barangay = response.data.data[i].barangay;
            var city = response.data.data[i].city_or_municipality;
            var province = response.data.data[i].province;
            var place = street
              .toString()
              .concat(
                " ",
                barangay.toString(),
                " ",
                city.toString(),
                " ",
                province.toString()
              );
            this.pendingOrders[i]["customer_address"] = place;
          }
          // console.log("ordersssssss: ", this.orders);
        });
    },
    confirmOrder(item) {
     this.$vloading.show();
      axios
        .post(this.url + "/api/post/confirm/" + item.id, {}, this.config)
        .then(response => {
          console.log(response.data)
          this.$vloading.hide()
          Swal.fire({
            title: "Order has been confirmed",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          }),
            this.fetchPendingOrders();
          this.fetchOrders();
        });
    },
    isCanceled(item) {
      if (item.order_status == "Canceled") {
        return true;
      }
    }
  }
};
</script>