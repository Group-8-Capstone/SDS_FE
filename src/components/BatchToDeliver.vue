<template>
  <div>
    <v-card flat>
      <template>
        <v-row justify="center">
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-row>
                <v-col id="batchCards" v-for="(item, i) in deliveriesGroup" :key="i">
                  <v-card
                    id="cards"
                    class="text-center"
                    min-height="240"
                    max-height="240"
                    min-width="300"
                    max-width="300"
                  >
                    <v-card-title class="deep-purple lighten-5" id="title">{{item.brgy_name}}</v-card-title>
                    <hr>
                    <v-spacer/>
                    <v-card-text id="qty">
                      <b>Number of Orders:</b>
                      {{item.length}}
                    </v-card-text>
                    <v-btn
                      outlined
                      rounded
                      color="purple"
                      v-bind="attrs"
                      v-on="on"
                      @click="viewOrders(item)"
                    >View Orders</v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </template>

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

            <v-card>
              <v-toolbar dark color="purple">
                <v-btn icon dark @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{barangay_name}}</v-toolbar-title>
              </v-toolbar>
              <v-divider></v-divider>
              <template>
                <v-data-table :headers="headers" :items="orders" class="elevation-1">

                  <template v-slot:item.products="{ item }">
                    <v-icon @click="orderItemIcon(item.products)">mdi-information</v-icon>
                  </template>

                  <template v-slot:item.order_status="{ item }">
                    <v-chip :color="getColor(item.order_status)" dark>{{ item.order_status }}</v-chip>
                  </template>
                  <template v-slot:item.action="{ item }">
                    <div>
                      <div v-if="isCanceled(item) === true || isDelivered(item) === true">
                        <v-icon
                          disabled
                          normal
                          class="mr-2"
                          title="Delivered"
                          @click="alertDelivered(item)"
                        >mdi-truck-check-outline</v-icon>
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
                          normal
                          class="mr-2"
                          title="Delivered"
                          @click="alertDelivered(item)"
                        >mdi-truck-check-outline</v-icon>
                        <v-icon
                          @click="alertCancel(item)"
                          normal
                          class="mr-2"
                          title="Cancel"
                        >mdi-cancel</v-icon>
                      </div>
                    </div>
                  </template>
                </v-data-table>
              </template>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
    </v-card>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import axios from "axios";
import { connect } from "tls";
import { setInterval } from "timers";
import Swal from "sweetalert2";
import { constants } from "os";
import { stringify } from "querystring";
import SortLocation from "../components/SortLocation.vue";
export default {
  name: "Delivery",
  components: { SortLocation },
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoiamllbnhpeWEiLCJhIjoiY2tlaTM3d2VrMWcxczJybjc0cmZkamk3eiJ9.JzrYlG2kZ08Pkk24hvKDJw",
      delivery_range: [],
      detailsDialog: false,
      barangay_array: [],
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      brgy_name: null,
      orders: [],
      allOrders: [],
      barangay_name: "",
      delivery_batch: [],
      line_items: [],
      deliveries: [],
      deliveriesByBrngy: {},
      deliveriesGroup: [],
      orderItemDialog: false,
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
        { text: "Actions", value: "action", sortable: false, width: "100px" },
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
  mounted() {
    let pusher = new Pusher("c31b45d58431fd307880", {
      cluster: "ap1",
      encrypted: false
    });

    //Subscribe to the channel we specified
    let channel = pusher.subscribe("order-channel");

    channel.bind("newOrder", data => {
      this.dataGrouping();
    });
  },
  created() {
    // this.fetchOrders();
    this.dataGrouping();
    setInterval(this.dataGrouping(), 3000);
  },

  methods: {
    orderItemIcon(line_items) {
      console.log("line_items: ", line_items);
      this.line_items = line_items;
      this.orderItemDialog = true;
    },
    dialogClose() {
      this.orderItemDialog = false;
      this.line_items = [];
    },
    getColor(status) {
      if (status === "Cancelled") return "orange";
      else if (status === "On order") return "blue";
      else return "green";
    },
    viewOrders(item) {
      console.log("items.order: ", item.orders)
      this.orders = item.orders;
      this.orders.forEach((order, index) => {
            let {
              building_or_street,
              barangay,
              city_or_municipality,
              province,
            } = order;
            var place = building_or_street
              .toString()
              .concat(" ", barangay, " ", city_or_municipality, " ", province);
            this.orders[index]["customer_address"] = place;
            this.orders[index]["time"] = "1PM - 4PM";
      });
      this.barangay_name = item.barangay_name;
      this.dialog = true;
      this.dataGrouping();
    },
    viewDetails(i) {
      this.delivery_batch = i;
      this.delivery_batch.orders.forEach((order, index) => {
        let {
          building_or_street,
          barangay,
          city_or_municipality,
          province,
          ubehalayajar_qty,
          ubehalayatub_qty
        } = order;
        var place = building_or_street
          .toString()
          .concat(" ", barangay, " ", city_or_municipality, " ", province);
        this.delivery_batch.orders[index]["customer_address"] = place;
        this.delivery_batch.orders[index]["total_item"] =
          ubehalayatub_qty + ubehalayajar_qty;
      });
      this.detailsDialog = true;
      this.dataGrouping();
    },
    containsObject(arr, id) {
      return arr.some(function(el) {
        return el.id === id;
      });
    },
    alertDelivered(item) {
      Swal.fire({
        title: "Are you sure item is being delivered?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#CFD8D",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
        reverseButtons: true
      }).then(result => {
        if (result.value) {
          this.deliveredItem(item);
          this.dataGrouping();
        }
      });
    },
    deliveredItem(item) {
      axios
        .post(this.url + "/api/post/updateStat/" + item.id, {}, this.config)
        .then(response => {
          Swal.fire({
            title: "Order has been delivered",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.dataGrouping();
          this.detailsDialog = false;
          this.dialog = false;
        });
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
          this.deleteItem(item);
          this.dataGrouping();
        }
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
          Swal.fire({
            title: "Cancelled!",
            text: "Order has been cancelled",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.dataGrouping();
          this.detailsDialog = false;
          this.dialog = false;
        });
    },
    dataGrouping() {
      this.$vloading.show();
      axios
        .get(this.url + "/api/posts/delivery", this.config)
        .then(response => {
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
          var result = response.data;
          console.log("response: ", response.data)
          var mother_array = [];
          var deliveriesByBrngy = [];
          let groupByMunicipality = [];
          result.forEach(municipyo => {
            let { city_or_municipality } = municipyo;
            groupByMunicipality[city_or_municipality] = result.filter(
              order => order.city_or_municipality == city_or_municipality
            );
            groupByMunicipality[city_or_municipality].forEach(data => {
              let { barangay } = data;
              groupByMunicipality[city_or_municipality][
                barangay
              ] = groupByMunicipality[city_or_municipality].filter(
                order => order.barangay == barangay
              );
            });
            groupByMunicipality[city_or_municipality].splice(
              groupByMunicipality[city_or_municipality],
              groupByMunicipality[city_or_municipality].length
            );
          });

          for (const city_mun in groupByMunicipality) {
            for (const byBrgy in groupByMunicipality[city_mun]) {
              var brgy_city_name = byBrgy + ", " + city_mun;
              deliveriesByBrngy["brgy_name"] = brgy_city_name;
              deliveriesByBrngy["length"] =
                groupByMunicipality[city_mun][byBrgy].length;
              deliveriesByBrngy["orders"] =
                groupByMunicipality[city_mun][byBrgy];
              mother_array.push(deliveriesByBrngy);
              deliveriesByBrngy = [];
            }
          }
          this.deliveriesGroup = mother_array;
        });
    },
    isAdmin() {
      if (localStorage.getItem("role") === "admin") {
        return true;
      }
    },
    isRider() {
      if (localStorage.getItem("role") === "driver") {
        return true;
      }
    },
    isCanceled(item) {
      if (item.order_status == "Cancelled") {
        return true;
      }
    },
    isDelivered(item) {
      if (item.order_status == "Delivered") {
        return true;
      }
    },
    isComplete(item) {
      for (var i = 0; i < item.orders.length; i++) {
        if (
          item.orders[i].order_status === "On order" ||
          item.orders[i].order_status === "Cancelled"
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
};
</script>

<style>
#batchCards {
  flex-grow: 0 !important;
}
#title {
  font-size: 17px;
}
</style>