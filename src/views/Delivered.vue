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
              <v-btn @click="isEmpty(deliveredOrder)" class="float-right" outlined color="purple">
                <download-excel
                  class="btn btn-default"
                  :data="deliveredOrder"
                  :fields="csvfields"
                  name="Delivered.xls"
                >Export Excel</download-excel>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- Order Detail Dialog -->
    <div class="text-center">
      <v-dialog v-model="orderItemDialog" width="500">
        <v-card>
          <v-simple-table v-for="i in line_items" :key="i.product_name">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">{{i.product_name}}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ i.pivot.order_quantity }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogClose()">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-data-table :headers="headers" :items="deliveredOrder" :search="search">
      <template v-slot:item.preferred_delivery_date="{ item }">
        <span>{{new Date(item.preferred_delivery_date).toISOString().substring(0,10)}}</span>
      </template>
     
      <template v-slot:item.products="{ item }">
        <v-icon @click="orderItemIcon(item.products)">mdi-information</v-icon>
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
import JsonExcel from "vue-json-excel";
import DeliveredPdf from "./DeliveredPdf.vue";
import axios from "axios";
import Swal from "sweetalert2";

Vue.component("downloadExcel", JsonExcel);

export default {
  name: "Delivery",
  components: { DeliveredPdf },
  data() {
    return {
      deliveredOrder: [],
      search: "",
      month: "",
      year: " ",
      dialog: false,
      orderItemDialog: false,
      line_items: [],
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
      csvfields: {
        "Receiver_Name": "receiver_name",
        "Contact_Number": "contact_number",
        "Email": "email",
        "12Doz_Ube_Halaya_Jars_Desserts_Qty": "12 Doz Ube Halaya Jars Desserts qty",
        "Ube_Quencher_Qty": "UBE Quencher qty",
        "Ubechi_Qty": "Ubechi qty",
        "Ube_Halaya_Square_Bottle_Qty": "Ubehalaya Square Bottle qty",
        "Ubeporado": "Ubeporado qty",
        "Total_Payment": "total_payment",
        "Landmark": "landmark",
        "Building_Or_Street": "building_or_street",
        "Barangay": "barangay",
        "City_Or_Municipality": "city_or_municipality",
        "Province": "province",
        "Preferred_Delivery_Date": "preferred_delivery_date",
        "Order_Status": "order_status",
        "Payment_Method": "payment_method",
        "Payment_Status": "payment_status",
        "Time": "time",
      },
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "receiver_name",
          width: "150px"
        },
        {
          text: "Order Item",
          sortable: false,
          value: "products"
        },
        {
          text: "Total Payment",
          value: "total_payment",
          sortable: false
        },
        {
          text: "Time",
          value: "time",
          sortable: false,
          width: "120px"
        },
        {
          text: "Delivery Date",
          value: "preferred_delivery_date",
          sortable: false,
          width: "120px"
        },
        {
          text: "Address",
          value: "customer_address",
          sortable: false,
          width: "270px"
        },
        { text: "Contact Number", value: "contact_number", sortable: false },
        { text: "Distance", value: "distance" },
        {
          text: "Mode of Payment",
          value: "payment_method",
          sortable: false,
          width: "120px"
        },
        {
          text: "Payment Status",
          value: "payment_status",
          sortable: false,
          width: "120px"
        },
        { text: "Status", value: "order_status" }
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
    orderItemIcon(line_items) {
      this.line_items = line_items;
      this.orderItemDialog = true;
    },
    dialogClose() {
      this.orderItemDialog = false;
      this.line_items = [];
    },
    //fetch all data
    loadDelivered() {
      this.$vloading.show();
      axios
        .get(this.url + "/api/posts/delivered", this.config)
        .then(response => {
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
          this.deliveredOrder = response.data;
            
            this.deliveredOrder.forEach((order, index) => {
            let { products, building_or_street, barangay, city_or_municipality, province, } = order;
            var place = building_or_street
              .toString()
              .concat(" ", barangay, " ", city_or_municipality, " ", province);
            this.deliveredOrder[index]["customer_address"] = place;
            this.deliveredOrder[index]["time"] = "1PM - 4PM";
            var name = "";
            var qty = 0;
            for (var i = 0; i < products.length; i++){
              name = products[i].product_name;
              qty = products[i].pivot.order_quantity;
              this.deliveredOrder[index][name + " qty"] = products[i].pivot.order_quantity;
            }
          });
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
            this.url + `/api/filter/${month_number}/${year}`,
            {},
            this.config
          )
          .then(response => {
            if (response.data.length == 0) {
              this.is_empty = true;
              this.deliveredOrder = response.data;
            } else {
              this.is_empty = false;
              this.deliveredOrder = response.data;
              for (var i = 0; i < this.deliveredOrder.length; i++) {
                var street = response.data[i].building_or_street;
                var barangay = response.data[i].barangay;
                var city = response.data[i].city_or_municipality;
                var province = response.data[i].province;
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
                this.deliveredOrder[i]["time"] = "1PM - 4PM";
              }
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