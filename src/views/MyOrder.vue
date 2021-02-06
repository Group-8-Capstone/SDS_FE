<template>
  <div>
    <v-card id="cardtable" class="ma-5 mb-12 pa-5">
      <v-card-title>
      Transaction History
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
      <v-tabs v-model="tabs" right color="deep-purple accent-4">
        <v-tab>On going</v-tab>
        <v-tab>Delivered</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-data-table :headers="headers" :items="onOrder" :search="search">
              <template v-slot:item.preferred_delivery_date="{ item }">
           <span>{{new Date(item.preferred_delivery_date).toISOString().substring(0,10)}}</span>
         </template>
            <template v-slot:item.order_status="{ item }">
              <v-chip :color="getColor(item.order_status)" dark>{{ item.order_status }}</v-chip>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <v-data-table :headers="headers2" :items="deliveredOrder" :search="search">
            <template v-slot:item.preferred_delivery_date="{ item }">
              <span>{{new Date(item.preferred_delivery_date).toISOString().substring(0,10)}}</span>
            </template>
            <template v-slot:item.order_status="{ item }">
              <v-chip :color="getColor(item.order_status)" dark>{{ item.order_status }}</v-chip>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<style>
.v-data-table {
  overflow-x: auto !important;
}
</style>
<script>
import {
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "MyOrder",
  data: () => ({
    scrollHorizontal: true,
    search: "",
    deliveredOrder: [],
    dialogOnOrder: false,
    dialogDelivered: false,
    onOrder: [],
    tabs: null,
    ubeJar: null,
    ubeTab: null,
    headers: [
      { text: "Receivers Name", value: "receiver_name" },
      { text: "Prefered Delivery Date", value: "preferred_delivery_date" },
      { text: "Halaya Jar Quantity", value: "ubehalayajar_qty" },
      { text: "Halaya Tub Quantity", value: "ubehalayatub_qty" },
      { text: "Total Payment", value: "total_payment" },
      { text: "Status", value: "order_status" }
    ],
    headers2: [
      { text: "Receivers Name", value: "receiver_name" },
      { text: "Delivered Date", value: "preferred_delivery_date" },
      { text: "Halaya Jar Quantity", value: "ubehalayajar_qty" },
      { text: "Halaya Tub Quantity", value: "ubehalayatub_qty" },
      { text: "Status", value: "order_status" }
    ]
  }),
  beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Access-Control-Allow-Origin": "*"
    };
    this.config = config;
  },
  created() {
    this.retrieveOnOrder();
    this.retrieveDeliveredOrder();
  },
  mounted(){
    let pusher = new Pusher('c31b45d58431fd307880', {
        cluster: 'ap1',
        encrypted: false
      });

    //Subscribe to the channel we specified 
    let channel = pusher.subscribe('order-channel')
    channel.bind('newOrder', data => {
      this.retrieveDeliveredOrder();
      this.retrieveOnOrder()
    
    });
  },
  methods: {
    retrieveOnOrder() {
      this.$vloading.show();
      let id = localStorage.getItem("id");
      axios
        .get(this.url + "/api/fetchOngoingOrder/" + id, this.config)
        .then(response => {
            this.$vloading.hide()
          this.onOrder = response.data.post;
        });
    },
    getColor(status) {
      if (status === "Canceled") return "orange";
      else if (status === "On order") return "blue";
      else return "green";
    },
    retrieveDeliveredOrder() {
      this.$vloading.show();
      let id = localStorage.getItem("id");
      axios
        .get(this.url + "/api/fetchDeliveredOrder/" + id, this.config)
        .then(response => {
            this.$vloading.hide()
          this.deliveredOrder = response.data.post;
        });
    },
    details(item) {
      this.ubeJar = item.ubehalayajar_qty;
      this.ubeTab = item.ubehalayatub_qty;
    }
  }
};
</script>
