<template>
  <div>
    <v-card class="ma-5 mb-12 pa-5">
      <v-tabs v-model="tabs" right color="deep-purple accent-4">
        <v-tab>Products</v-tab>
        <v-tab>Products' Log</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <div>
            <v-row>
              <v-layout wrap class="justify-center">
                <v-card
                  class="card-container ma-5 productCard"
                  style="max-width:500px;height:auto;"
                >
                  <v-card-title class="justify-center productName">{{jarName}}</v-card-title>
                  <v-divider></v-divider>
                  <v-list-item class="justify-center mt-5">
                    <img src="../assets/ubeJar.jpg" alt width="100" height="100">
                  </v-list-item>
                  <v-list-item
                    class="justify-center"
                  >Remaining Quantity: {{halayaJarAvailability1}} pcs</v-list-item>
                  <v-list-item class="justify-center">Price: {{jarPrice}} Pesos</v-list-item>
                  <center>
                    <v-chip :color="comparedJarAvailability()" dark>{{ jarStat }}</v-chip>
                  </center>
                  <v-list-item class="justify-center">Ordered Quantity: {{totalJar}} pcs</v-list-item>
                  <v-divider></v-divider>
                  <v-card-actions class="justify-end">
                    <v-btn small outlined color="primary" @click="JarDialog=true">EDIT</v-btn>
                    <v-btn small outlined color="purple darken-2" @click="recordProductJar">RECORD</v-btn>
                  </v-card-actions>
                </v-card>
                <v-card
                  class="card-container ma-5 productCard"
                  style="max-width:500px;height:auto;"
                >
                  <v-card-title class="justify-center productName">{{tubName}}</v-card-title>
                  <v-divider></v-divider>
                  <v-list-item class="justify-center mt-5">
                    <img src="../assets/ubeTab.jpg" alt width="100" height="100">
                  </v-list-item>
                  <v-list-item
                    class="justify-center"
                  >Remaining Quantity: {{halayaTubAvailability1}} pcs</v-list-item>
                  <v-list-item class="justify-center">Price: {{tubPrice}} Pesos</v-list-item>
                  <center>
                    <v-chip :color="comparedTubAvailability()" dark>{{ tubStat }}</v-chip>
                    <v-list-item class="justify-center">Ordered Quantity: {{totalTub}} pcs</v-list-item>
                  </center>
                  <v-divider></v-divider>
                  <v-card-actions class="justify-end">
                    <v-btn small outlined color="primary" @click="TubDialog=true">EDIT</v-btn>
                    <v-btn small outlined color="purple darken-2" @click="recordProductTub">RECORD</v-btn>
                  </v-card-actions>
                </v-card>
              </v-layout>
            </v-row>
            <template>
              <v-dialog v-model="JarDialog" width="350px">
                <v-card class="ma-0 pa-0">
                  <v-spacer></v-spacer>
                  <v-card-title class="align-center">
                    <v-list-item-title
                      class="deep-purple--text d-flex align-center justify-center mx-auto headline"
                    >Update Jar Info</v-list-item-title>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-container>
                    <v-row class="mx-2">
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedJarPrice"
                          color="purple"
                          outlined
                          label="Price"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedJarAvail"
                          color="purple"
                          outlined
                          label="Produced Products Quantity"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      small
                      outlined
                      color="orange"
                      @click="JarDialog=false,getHalayaJar()"
                    >CANCEL</v-btn>
                    <v-btn small outlined color="purple darken-2" @click="editHalayaJar()">UPDATE</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template>
              <v-dialog v-model="TubDialog" width="350px">
                <v-card class="ma-0 pa-0">
                  <v-spacer></v-spacer>
                  <v-card-title class="align-center">
                    <v-list-item-title
                      class="deep-purple--text d-flex align-center justify-center mx-auto headline"
                    >Update Tub Info</v-list-item-title>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-container>
                    <v-row class="mx-2">
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedTubPrice"
                          color="purple"
                          outlined
                          label="Price"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedTubAvail"
                          color="purple"
                          outlined
                          label="Produced Products Quantity"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      small
                      outlined
                      color="orange"
                      @click="TubDialog=false,getHalayaTub()"
                    >CANCEL</v-btn>
                    <v-btn small outlined color="purple darken-2" @click="editHalayaTub()">UPDATE</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div>
            <v-card class="ma-5 mb-12 pa-5">
              <!-- <v-row>
                <v-spacer></v-spacer>
                <ProductsPdf :headers="headers" :records="records" class="float-right mr-5"></ProductsPdf>
                <ProductsExcel ></ProductsExcel>
              </v-row>-->
              <div>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn outlined small color="purple" v-bind="attrs" v-on="on">
                      <v-icon>mdi-download</v-icon>Export
                    </v-btn>
                  </template>
                  <v-list>
                    <v-col>
                      <ProductsPdf
                        :headers="headers"
                        :records="records"
                      ></ProductsPdf>
                      <div>
                        <!-- <v-btn class="float-right mr-5" text small>Export as CSV</v-btn> -->
                        <ProductsExcel :dataSource="records"></ProductsExcel>
                      </div>
                    </v-col>
                  </v-list>
                </v-menu>
              </div>
              <v-card-title>
                Products' Log
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-spacer></v-spacer>
              <v-data-table :headers="headers" :items="records" :search="search">
                <template v-slot:item.created_at="{ item }">
                  <span>{{new Date(item.created_at).toISOString().substring(0,10)}}</span>
                </template>
                <template v-slot:item.action="{ item }">
                  <v-icon
                    normal
                    class="mr-2"
                    title="Delivered"
                    @click="alertDelivered(item)"
                  >mdi-truck-check-outline</v-icon>
                  <v-icon
                    @click="editDialog = !editDialog, editItem(item) "
                    class="mr-2"
                    normal
                    title="Edit"
                  >mdi-table-edit</v-icon>
                  <v-icon @click="alertCancel(item)" normal class="mr-2" title="Cancel">mdi-cancel</v-icon>
                </template>
              </v-data-table>
            </v-card>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<style scoped>
.productCard {
  background-color: #ffffff !important;
}
.productName {
  color: rgb(79, 53, 122);
}
</style>
<script>
import ProductsPdf from "./ProductPdf.vue";
import ProductsExcel from "./ProductsExcel.vue";
import {
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  name: "Delivery",
  components: { ProductsPdf, ProductsExcel },
  data() {
    return {
      records: [],
      deliveredOrder: [],
      TubDialog: false,
      JarDialog: false,
      product: [],
      search: "",
      editedTubPrice: null,
      editedJarPrice: null,
      editedTubAvail: null,
      editedJarAvail: null,
      productId: null,
      totalJar: null,
      totalTub: null,
      halayaTubAvailability: 0,
      halayaJarAvailability: 0,
      tubPrice: null,
      jarPrice: null,
      tubId: null,
      jarId: null,
      jarStat: null,
      tubStat: null,
      jarName: null,
      tubName: null,
      halayaTubAvailability1: null,
      halayaJarAvailability1: null,
      tabs: null,
      halayaTab: [],
      headers: [
        {
          text: "Product Name",
          align: "start",
          sortable: false,
          value: "product_name"
        },
        { text: "Remaining Quantity", value: "remaining_quantity" },
        { text: "Total Ordered Quantity", value: "total_ordered" },
        { text: "Date", value: "created_at" }
      ],
      products: [
        { title: "Ube Halaya in Jar", image: require("@/assets/ubeJar.jpg") },
        { title: "Ube Halaya in Tub", image: require("@/assets/ubeTab.jpg") }
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
    this.getTotalJar();
    this.gettotalTub();
    this.getHalayaTub();
    this.getHalayaJar();
    this.comparedJarAvailability();
    this.comparedTubAvailability();
    this.fetchRecordedProduct();
  },
  validations: {
    newRemainingProduct: {
      required
    }
  },
  computed: {
    remainingProductErrors() {
      const errors = [];
      if (!this.$v.newRemainingProduct.$dirty) return errors;
      !this.$v.newRemainingProduct.required &&
        errors.push("Quantity is required.");
      return errors;
    }
  },
  methods: {
    getColor(status) {
      if (status === "low stock") return "orange";
      else if (status === "good") return "green";
      else return "green";
    },
    getTotalJar(item) {
      axios.get(this.url + "/api/totalJar", this.config).then(response => {
        this.totalJar = response.data;
      });
    },
    gettotalTub(item) {
      axios.get(this.url + "/api/totalTab", this.config).then(response => {
        this.totalTub = response.data;
      });
    },

    getHalayaTub(item) {
      axios
        .get(this.url + "/api/fetchHalayaTub", this.config)
        .then(response => {
          this.tubId = response.data.product[0].id;
          this.tubName = response.data.product[0].product_name;
          this.editedTubPrice = response.data.product[0].product_price;
          this.editedTubAvail = response.data.product[0].product_availability;
          this.tubPrice = response.data.product[0].product_price;
          this.halayaTubAvailability =
            response.data.product[0].product_availability - this.totalTub;
          this.halayaTubAvailability1 =
            this.halayaTubAvailability < 1 ? 0 : this.halayaTubAvailability;
        });
    },

    getHalayaJar(item) {
      axios
        .get(this.url + "/api/fetchHalayaJar", this.config)
        .then(response => {
          this.jarId = response.data.product[0].id;
          this.jarName = response.data.product[0].product_name;
          this.editedJarPrice = response.data.product[0].product_price;
          this.editedJarAvail = response.data.product[0].product_availability;
          this.jarPrice = response.data.product[0].product_price;
          this.halayaJarAvailability =
            response.data.product[0].product_availability - this.totalJar;
          this.halayaJarAvailability1 =
            this.halayaJarAvailability < 1 ? 0 : this.halayaJarAvailability;
        });
    },

    editHalayaTub() {
      let param = {
        product_price: this.editedTubPrice,
        product_availability: this.editedTubAvail
      };
      axios
        .post(this.url + "/api/editTub/" + this.tubId, param, this.config)
        .then(response => {
          Swal.fire({
            title: "Successfully Added",
            icon: "success",
            timer: 3000
          });
          this.TubDialog = false;
          this.getHalayaTub();
        });
    },

    editHalayaJar() {
      let param = {
        product_price: this.editedJarPrice,
        product_availability: this.editedJarAvail
      };
      axios
        .post(this.url + "/api/editTub/" + this.jarId, param, this.config)
        .then(response => {
          Swal.fire({
            title: "Successfully Added",
            icon: "success",
            timer: 3000
          });
          this.JarDialog = false;
          this.getHalayaJar();
        });
    },
    comparedJarAvailability() {
      if (this.totalJar < this.halayaJarAvailability) {
        this.jarStat = "Enough";
        return "green";
      } else {
        this.jarStat = "Lacking";
        return "red";
      }
    },
    comparedTubAvailability() {
      if (this.totalTub < this.halayaTubAvailability) {
        this.tubStat = "Enough";
        return "green";
      } else {
        this.tubStat = "Lacking";
        return "red";
      }
    },

    recordProductJar() {
      this.$vloading.show();
      let param = {
        product_name: this.jarName,
        remaining_quantity: this.halayaJarAvailability,
        total_ordered: this.totalJar,
        availability_status: this.jarStat
      };
      axios
        .post(this.url + "/api/dailyRecords", param, this.config)
        .then(response => {
          if (response.data == "success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Recorded!",
              showConfirmButton: false,
              timer: 1500
            });
            this.fetchRecordedProduct();
          } else {
            Swal.fire({
              position: "center",
              icon: "warning",
              titleText: "Recorded",
              text: "See Record on Products' Log",
              showConfirmButton: false,
              timer: 1500
            });
          }
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
        });
    },

    recordProductTub() {
      this.$vloading.show();
      let param = {
        product_name: this.tubName,
        remaining_quantity: this.halayaTubAvailability,
        total_ordered: this.totalTub,
        availability_status: this.tubStat
      };
      axios
        .post(this.url + "/api/dailyRecords", param, this.config)
        .then(response => {
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
          if (response.data == "success") {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Recorded!",
              showConfirmButton: false,
              timer: 1500
            });
            this.fetchRecordedProduct();
          } else {
            Swal.fire({
              position: "center",
              icon: "warning",
              titleText: "Recorded",
              text: "See Record on Products' Log",
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
    },
    fetchRecordedProduct() {
      this.$vloading.show();
      axios
        .get(this.url + "/api/fetchRecordedProduct", this.config)
        .then(response => {
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
          this.records = response.data.product;
        });
    }
  }
};
</script>