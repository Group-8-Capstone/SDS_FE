<template>
  <v-card class="ma-5 mb-12 pa-5">
    <v-card-title>Delivered Orders</v-card-title>
    <div>
      <v-card class="pa-5" flat>
        <h4>Filter</h4>
        <v-row>
          <v-col cols="3">
            <v-select v-model="month" label="Month" :items="months"></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="year" label="Year"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn @click="filter(month,year)" outlined medium color="purple">Apply</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <div>
              <!-- <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <div> -->
                    <download-csv
                        class="btn float-right outlined"
                        :data="deliveredOrder"
                        name="Delivered.csv"
                      >Export as CSV</download-csv>
                    <!-- <v-btn
                      @click="isEmpty(deliveredOrder)"
                      class="float-right"
                      outlined
                      color="purple"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-download</v-icon>Export
                    </v-btn> -->
                  <!-- </div>
                </template> -->
                <!-- <v-list v-show="is_empty === false">
                  <v-col>
                    <DeliveredPdf :headers="headers" :deliveredOrder="deliveredOrder"></DeliveredPdf>
                    <div>
                      <download-csv
                        class="btn btn-default pa-2"
                        :data="deliveredOrder"
                        name="Delivered.csv"
                      >Export as CSV</download-csv>
                    </div>
                  </v-col>
                </v-list> -->
              <!-- </v-menu> -->
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <v-data-table :headers="headers" :items="deliveredOrder" :search="search">
      <template v-slot:item.preferred_delivery_date="{ item }">
        <span>{{new Date(item.preferred_delivery_date).toISOString().substring(0,10)}}</span>
      </template>
      <template v-slot:item.order_status="{ item }">
        <v-chip color="green" text-color="white">{{ item.order_status }}</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from "vue";
import JsonCSV from "vue-json-csv";
import DeliveredPdf from "./DeliveredPdf.vue";
import axios from "axios";
import Swal from "sweetalert2";

Vue.component("downloadCsv", JsonCSV);
export default {
  name: "Delivery",
  components: { DeliveredPdf },
  data() {
    return {
      deliveredOrder: [],
      search: "",
      month: "",
      year: " ",
      is_empty: false,
      months: [
        "All",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      headers: [
        {
          text: "Receiver Name",
          align: "start",
          sortable: false,
          value: "receiver_name"
        },
        { text: "Address", value: "customer_address" },
        { text: "Mobile Number", value: "contact_number", sortable: false },
        { text: "Distance", value: "distance" },
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
        { text: "Delivered Date", value: "preferred_delivery_date" },
        { text: "Order Status", value: "order_status" }
      ]
    };
  },
  mounted() {
    this.loadDelivered();
  },
  beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Access-Control-Allow-Origin": "*"
    };
    this.config = config;
  },
  methods: {

    //fetch all data
    loadDelivered() {                      
      this.$vloading.show();
      axios
        .get(this.url + "/api/posts/delivered", this.config)
        .then(response => {
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
          this.deliveredOrder = response.data.data;
          for (var i = 0; i < this.deliveredOrder.length; i++) {
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
            this.deliveredOrder[i]["customer_address"] = place;
          }
        });
    },

    //return month number
    getMonthNumber(month) {
      switch (month) {
        case "January":
          return "01";
          break;
        case "February":
          return "02";
          break;
        case "March":
          return "03";
          break;
        case "April":
          return "04";
          break;
        case "May":
          return "05";
          break;
        case "June":
          return "06";
          break;
        case "July":
          return "07";
          break;
        case "August":
          return "08";
          break;
        case "September":
          return "09";
          break;
        case "October":
          return "10";
          break;
        case "November":
          return "11";
          break;
        case "December":
          return "12";
      }
    },

    //filter data with month and year
    filter(month, year) {
      if (month == "All") {
        this.year = " ";
        this.loadDelivered();
      } else if (this.year == " ") {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Year cannot be empty",
          showConfirmButton: true
        });
      } else {
        let month_number = this.getMonthNumber(month);
        axios
          .post(
            this.url + `/api/filter/${month_number}/${year}`, {}, this.config
          )
          .then(response => {
            if (response.data.data.length == 0) {
              this.is_empty = true;
              this.deliveredOrder = response.data.data;
            } else {
              this.is_empty = false;
              this.deliveredOrder = response.data.data;
            }
          });
      }
    },

    //check if array -deliveredOrder which holds the data fetched from the database is not empty
    isEmpty(deliveredOrder) {
      if (deliveredOrder.length == 0) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Cannot be Downloaded. No Data Available",
          showConfirmButton: true
        });
      } else {
        this.is_empty = false;
      }
    }
  }
};
</script>