<template>
  <div>
    <div>
      <v-card class="pa-5" flat>
        <v-row>
          <v-col class="float-left" cols="2">
            <div>
              <v-btn @click="isEmpty(csvToBeDelivered)" class="float-right" outlined color="purple">
                <download-excel
                  class="btn btn-default"
                  :data="csvToBeDelivered"
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

    <v-card flat>
      <br>
      <v-data-table :headers="headers" :items="todelivered">
        <template v-slot:item.products="{ item }">
          <v-icon @click="orderItemIcon(item.products)">mdi-information</v-icon>
        </template>

        <template v-slot:item.contact_number="{ item }">
          <span>{{item.contact_number}}</span>
        </template>
        <template v-slot:item.distance="{ item }">
          <span>{{item.distance+' km'}}</span>
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
    </v-card>
  </div>
</template>

<script>
import Vue from "vue";
import JsonCSV from "vue-json-csv";
import JsonExcel from "vue-json-excel";
import axios from "axios";
import Swal from "sweetalert2";
Vue.component("downloadExcel", JsonExcel);

export default {
  data() {
    return {
      dialog: false,
      todelivered: [],
      csvToBeDelivered: [],
      is_empty: false,
      orderItemDialog: false,
      line_items: [],
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
        // { text: "Actions", value: "action", sortable: false, width: "100px" },
        { text: "Status", value: "order_status" }
      ]
    };
  },
  beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Access-Control-Allow-Origin": "*"
    };
    this.config = config;
  },
  created() {
    this.getToDelivered();
    this.csvToDeliver();
  },
  methods: {
    getColor(status) {
      if (status === "Canceled") return "orange";
      else if (status === "On order") return "blue";
      else return "green";
    },
    orderItemIcon(line_items){
      this.line_items = line_items;
      this.orderItemDialog = true;
    },
    dialogClose(){
      this.orderItemDialog = false;
      this.line_items = [];
    },
    csvToDeliver() {
      axios
        .get(this.url + "/api/posts/delivery", this.config)
        .then(response => {
          this.csvToBeDelivered = response.data;
          this.csvToBeDelivered.forEach((order, index) => {
            let { products } = order;
            this.csvToBeDelivered[index]["time"] = "1PM - 4PM";
            var name = "";
            var qty = 0;
            for (var i = 0; i < products.length; i++){
              name = products[i].product_name;
              qty = products[i].pivot.order_quantity;
              this.csvToBeDelivered[index][name + " qty"] = products[i].pivot.order_quantity;
            }
          });
        });
    },
    getToDelivered() {
      axios
        .get(this.url + "/api/posts/delivery ", this.config)
        .then(response => {
          this.todelivered = response.data;
          this.todelivered.forEach((order, index) => {
            let {
              building_or_street,
              barangay,
              city_or_municipality,
              province,
            } = order;
            var place = building_or_street
              .toString()
              .concat(" ", barangay, " ", city_or_municipality, " ", province);
            this.todelivered[index]["customer_address"] = place;
            this.todelivered[index]["time"] = "1PM - 4PM";
          });
        });
    },
    isEmpty(todelivered) {
      if (todelivered.length == 0) {
        this.is_empty = true;
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
