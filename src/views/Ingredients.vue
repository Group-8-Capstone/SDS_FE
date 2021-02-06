<template>
  <div>

    <v-card flat class="ma-5 mb-12 pa-5">
      <v-card-title>Ube Halaya List of Ingredients</v-card-title>
      <v-row>
        <v-flex>
          <v-layout wrap>
            <v-flex md4 v-for="item in halayaIngredients" :key="item.id">
              <v-card id="cards" class="card-container ma-5">
                <v-card-title class="deep-purple lighten-5">{{item.ingredients_name}}</v-card-title>
                <hr>
                <v-row class="mx-auto text-center">
                  <v-list-item>
                    Available Quantity :
                    <b>{{ item.ingredients_remaining}} {{item.ingredients_unit}}/s</b>
                  </v-list-item>
                  <v-list-item>
                    Used Quantity :
                    <b>{{ item.total}} {{item.ingredients_unit}}/s</b>
                  </v-list-item>
                  <v-list-item>
                    <v-chip
                      text-color="white"
                      :color="getColor(item.ingredients_status)"
                    >{{item.ingredients_status}}</v-chip>
                  </v-list-item>
                </v-row>
                <v-row class="d-flex justify-end mb-6">
                  <template>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn icon>
                        <v-icon
                          title="Add Quantity"
                          @click="editDialog = !editDialog, editIngredients(item) "
                        >mdi-plus</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <v-icon
                          @click=" addUsedStockDialog=!addUsedStockDialog ,editEstimatedValue(item) "
                          title="Used Quantity"
                        >mdi-minus</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </template>
                </v-row>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-row>
    </v-card>

    <v-card id="cardtable" class="ma-5 mb-12 pa-5">
      <v-row>
        <v-spacer></v-spacer>
        <IngredientsPdf
          :headersIngredients="headersIngredients"
          :displayIngredientsRecords="displayIngredientsRecords"
          class="float-right mr-5"
        ></IngredientsPdf>
      </v-row>
      <v-card-title>
        Ingredients Logs
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
      <v-data-table
        :headers="headersIngredients"
        :items="displayIngredientsRecords"
        :search="search"
      >
        <template #item.used_ingredients_amount="{ item }">{{ item.used_ingredients_amount }} {{ item.ingredients_unit }}</template>
         <template v-slot:item.updated_at="{ item }">
           <span>{{new Date(item.updated_at).toISOString().substring(0,10)}}</span>
         </template>
        <template v-slot:item.action="{ item }">
          <v-icon normal title="Edit">mdi-table-edit</v-icon>
          <v-icon class="mr-3" color="red" normal title="Delete Ingredient">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <template>
      <v-dialog v-model="addUsedStockDialog"  style="height:auto;" width="400px" >
        <v-card class="ma-0 pa-0">
          <v-spacer></v-spacer>
          <v-card-title class=" align-center">
            <v-list-item-title
              class="deep-purple--text d-flex align-center justify-center mx-auto headline"
            >USED QUANTITY</v-list-item-title>
          </v-card-title>
          <v-divider></v-divider>
          <v-container>
            <v-row class="mx-2">
              <v-col cols="12">
                <v-text-field
                  color="purple"
                  label="Ingredient's Name"
                  v-model="editValue.ingredients_name"
                  v-bind:disabled="disabled"
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  color="purple"
           
                  min="1"
                  type="number"
                  label="Quantity"
                  v-model="usedIngredientsAmount"
                  :error-messages="ingredientsUsedAmountErrors"
                  @input="$v.usedIngredientsAmount.$touch()"
                  @blur="$v.usedIngredientsAmount.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  color="purple"
                  label="Unit"
                  v-model="editValue.ingredients_unit"
                  v-bind:disabled="disabled"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small outlined color="orange" @click="addUsedStockDialog = false">CANCEL</v-btn>
            <v-btn small outlined color="purple darken-2" @click="addIngredientsAmount()">SAVE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template>
      <v-dialog v-model="editDialog"  style="height:auto;" width="400px" >
        <v-card class="ma-0 pa-0">
          <v-spacer></v-spacer>
          <v-card-title class="deep-purple--text align-center">
            <v-list-item-title
              class="deep-purple--text d-flex align-center justify-center mx-auto headline"
            >Purchased Quantity</v-list-item-title>
          </v-card-title>
          <v-divider></v-divider>
          <v-container>
            <v-row class="mx-2">
              <v-col cols="12">
                <v-text-field
                 type="number"
                  color="purple"
                  v-model="editStockItem.ingredients_remaining"
                  label="Available Quantity"
                >{{editStockItem.ingredients_remaining}}</v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small outlined color="orange" @click="editDialog = false,reloadDataAddStock()">CANCEL</v-btn>
            <v-btn small outlined color ="purple darken-2" @click=" updateIngredients()">SAVE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

  </div>
</template>
<script>
import IngredientsPdf from "./IngredientsPdf.vue";
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
  name: "Ingredients",
  components: { IngredientsPdf },
  data() {
    return {
      loading: true,
      displayIngredientsRecords: [],
      stockDialog: false,
      editDialog: false,
      addUsedStockDialog: false,
      ingredientsUnit: "",
      ingredientsName: "",
      stockStatus: "calculating...",
      search: "",
      ubeKilo: "",
      stocks: [],
      availableIngredients: "",
      usedIngredientsAmount: "",
      halayaIngredients: [],
      editStockItem: {},
      itemSelect: [],
      editValue: [],
      tabs: null,
      disabled: true,
      headersIngredients: [
        {
          text: "Ingredient's Name",
          align: "start",
          sortable: false,
          value: "ingredients_name"
        },
        { text: "Available Quantity", value: "ingredients_remaining" },
        { text: "Used Quantity", value: "used_ingredients_amount" },
        { text: "Recorded Date", value: "updated_at" }
      ]
    };
  },
  validations: {
    ingredientsUnit: {
      required
    },
    ingredientsName: {
      required
    },
    availableIngredients: {
      required
    },
    usedIngredientsAmount: {
      required
    }
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
    this.getHalayaIngredients();
    this.getAllIngredientsName();
    this.retrieveUsedIngredients();
  },
  props:{
    color: "primary"
  },
  computed: {
    ingredientsNameErrors() {
      const errors = [];
      if (!this.$v.ingredientsName.$dirty) return errors;
      !this.$v.ingredientsName.required && errors.push("name is required.");
      return errors;
    },
    ingredientsUnitErrors() {
      const errors = [];
      if (!this.$v.ingredientsUnit.$dirty) return errors;
      !this.$v.ingredientsUnit.required && errors.push("quantity is required.");
      return errors;
    },
    ingredientsAvailableErrors() {
      const errors = [];
      if (!this.$v.availableIngredients.$dirty) return errors;
      !this.$v.availableIngredients.required &&
        errors.push("name is required.");
      return errors;
    },
    ingredientsUsedAmountErrors() {
      const errors = [];
      if (!this.$v.usedIngredientsAmount.$dirty) return errors;
      !this.$v.usedIngredientsAmount.required &&
        errors.push("unit is required.");
      return errors;
    }
  },
  methods: {

    //return color base on the status of the stock level
    getColor(status) {
      if (status === "Alert! Very Low") return "red";
      else if (status === "Warning! Running Low") return "orange";
      else if (status === "Calculating...") return "blue";
      else return "green";
    },
    getHalayaIngredients() {
      this.loading = true;
      axios
        .get(this.url + "/api/getHalayaIngredients", this.config)
        .then(response => {
          this.loading = false;
          let results = [];
          for (var i = 0; i < response.data.length; i++) {
            if (this.containsObject(results, response.data[i].id)) {
            } else {
              results.push(response.data[i]);
              this.halayaIngredients = results;
            }
            continue;
          }
        });
    },
    editEstimatedValue(item) {
      axios
        .get(
          this.url + "/api/post/updateEstimatedValue/" + item.id,
          this.config
        )
        .then(response => {
          this.editValue = response.data;
        });
    },
    retrieveUsedIngredients() {
      this.$vloading.show();
      axios.get(this.url + "/api/fetchUsedIng", this.config).then(response => {
        console.log('ccccccccccc')
      setTimeout(() => {
            this.$vloading.hide()
          },1000)   
        this.displayIngredientsRecords = response.data;
      });
    },
    getAllIngredientsName() {
      let nameArray = [];
      axios
        .get(this.url + "/api/fetch/ingredientsName", this.config)
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            if (nameArray.includes(response.data[i].ingredients_name)) {
            } else {
              nameArray.push(response.data[i].ingredients_name);
              this.itemSelect = nameArray;
            }
            continue;
          }
        });
    },
    reloadDataAddStock() {
      (this.ingredientsName = ""),
        (this.ingredientsUnit = ""),
        this.getHalayaIngredients();
      this.retrieveUsedIngredients();
      this.$v.$reset();
    },
    reloadDataAddUsedAmount() {
      (this.availableIngredients = ""),
        (this.usedIngredientsAmount = ""),
        this.getHalayaIngredients();
      this.retrieveUsedIngredients();
      this.$v.$reset();
    },
    editIngredients(item) {
      // console.log('sheg', item)
      axios
        .get(this.url + "/api/post/editStock/" + item.id, this.config)
        .then(response => {
          this.editStockItem = response.data;
        });
    },
    updateIngredients() {
      // console.log('sdfsdf', this.editStockItem)
      axios
        .post(
          this.url + "/api/post/updateStock",
          this.editStockItem,
          this.config
        )
        .then(response => {
          this.getHalayaIngredients();
          this.retrieveUsedIngredients();
          this.editDialog = false;
        });
    },
    containsObject(arr, id) {
      return arr.some(function(el) {
        return el.id === id;
      });
    },
    addIngredientsAmount() {
    //  console.log('dhaiueyousd')
      this.$v.$touch();
      if (
        this.editValue.ingredients_name === "" ||
        this.usedIngredientsAmount === ""
      ) {
        this.addUsedStockDialog = true;
      } else {
        let newAddedAmount = {
          availableIngredients: this.editValue.ingredients_name ,
          ingredientsUnit:this.editValue.ingredients_unit,
          usedIngredientsAmount: this.usedIngredientsAmount
        };
        //  console.log('used:', newAddedAmount);
        axios
          .post(
            this.url + "/api/post/usedIngredients",
            newAddedAmount,
            this.config
          )
          .then(response => {
            // console.log('hbsdayg')
            this.reloadDataAddUsedAmount();
            this.retrieveUsedIngredients();
            this.addUsedStockDialog = false;
          });
      }
    }
  }
};
</script>
<style>
#cards {
  padding: 10px !important;
  justify-content: center !important;
}
.v-application .mb-6 {
  margin-bottom: 0px !important;
}
.row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin-right: 0px !important;
  margin-left: 0px !important;
}


</style>
