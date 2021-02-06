<template>
  <v-card class="ma-5 mb-12 pa-5">
    <v-card-title>Stock</v-card-title>
    <v-row>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        class="ml-10"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-list class="mr-10">
        <v-btn color="purple darken-2" rounded outlined dark @click="showDialogUsedAmount">
          <v-icon>mdi-plus</v-icon>
          <label>Used Amount</label>
        </v-btn>
      </v-list>
      <v-list class="mr-10">
        <v-btn color="purple darken-2" rounded outlined dark @click="showDialog">
          <v-icon>mdi-plus</v-icon>
          <label>Add stock item</label>
        </v-btn>
      </v-list>
    </v-row>
    <v-dialog v-model="stockDialog" width="400px">
      <v-card>
        <v-spacer></v-spacer>
        <v-card-title class="deep-purple lighten-1 align-center">
          <v-list-item-title class="d-flex align-center justify-center mx-auto headline">ADD STOCK</v-list-item-title>
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col cols="12">
              <v-text-field
                prepend-icon="mdi-plus"
                placeholder="ingredients name"
                v-model="ingredientsName"
                :error-messages="ingredientsNameErrors"
                @input="$v.ingredientsName.$touch()"
                @blur="$v.ingredientsName.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mdi-plus"
                min="1"
                type="number"
                placeholder="Quantity (kg/number of cans)"
                v-model="ingredientsUnit"
                :error-messages="ingredientsUnitErrors"
                @input="$v.ingredientsUnit.$touch()"
                @blur="$v.ingredientsUnit.$touch()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="stockDialog = false">Cancel</v-btn>
          <v-btn text @click="addStock()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addUsedStockDialog" width="400px">
      <v-card>
        <v-spacer></v-spacer>
        <v-card-title class="deep-purple lighten-1 align-center">
          <v-list-item-title class="d-flex align-center justify-center mx-auto headline">Amount used</v-list-item-title>
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col cols="12">
              <v-select
                :items="itemSelect"
                filled
                label="Available ingredients"
                v-model="availableIngredients"
                :error-messages="ingredientsAvailableErrors"
                @input="$v.availableIngredients.$touch()"
                @blur="$v.availableIngredients.$touch()"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mdi-plus"
                min="1"
                type="number"
                placeholder="Quantity (kg/number of cans)"
                v-model="usedIngredientsAmount"
                :error-messages="ingredientsUsedAmountErrors"
                @input="$v.usedIngredientsAmount.$touch()"
                @blur="$v.usedIngredientsAmount.$touch()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="addUsedStockDialog = false">Cancel</v-btn>
          <v-btn text @click="addIngredientsAmount()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <template>
      <v-dialog v-model="editDialog" width="350px">
        <v-card>
          <v-spacer></v-spacer>
          <v-card-title class="deep-purple lighten-1 align-center">
            <v-list-item-title
              class="d-flex align-center justify-center mx-auto headline"
            >UPDATE AMOUNT</v-list-item-title>
          </v-card-title>
          <v-container>
            <v-row class="mx-2">
              <v-col cols="12">
                <v-text-field
                  v-model="editStockItem.ingredients_remaining"
                  prepend-icon="mdi-map-marker"
                  placeholder="ingredientsAmount"
                >{{editStockItem.ingredients_remaining}}</v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="editDialog = false,reloadDataAddStock()">Cancel</v-btn>
            <v-btn text @click=" updateIngredients()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <v-row class="mx-2">
      <v-col cols="12">
        <v-data-table :headers="headers" :items="IngredientsArray" :search="search">
          <template v-slot:item.ingredients_status="{ item }">
            <v-chip :color="getColor(item.ingredients_status)" dark>{{ item.ingredients_status }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              @click="editDialog = !editDialog, editIngredients(item)"
              class="mr-2"
              normal
              title="Update Item"
            >mdi-table-edit</v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="8">
        <v-card class="mx-auto" outlined></v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<style>
.button {
  font-size-adjust: 12px;
  width: 150px;
}
.enough {
  background-color: lightskyblue;
}
.need {
  background-color: lightcoral;
}
</style>
<script>
import axios from "axios";
import Swal from "sweetalert2";
import { setInterval } from "timers";
import {
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
import { release } from "os";
export default {
  name: "Stock",
  data() {
    return {
      sumOrder: null,
      stockAvailability: null,
      search: "",
      ingredientsUnit: "",
      ingredientsName: "",
      stockStatus: "calculating...",
      search: "",
      ubeKilo: "",
      availableIngredients: "",
      usedIngredientsAmount: "",
      itemSelect: [],
      IngredientsArray: [],
      item: [],
      stocks: [],
      items: ["Ube", "Condensed milk", "Butter", "Sugar", "Evaporated milk"],
      editStockItem: {},
      stockDialog: false,
      editDialog: false,
      addUsedStockDialog: false,
      headers: [
        { text: "Ingredients", value: "ingredients_name" },
        {
          text: "Ingredients Remaining Quantity",
          align: "start",
          sortable: true,
          value: "ingredients_remaining"
        },
        {
          text: "Used Ingredients Quantity",
          align: "start",
          sortable: true,
          value: "total"
        },
        { text: "Status", value: "ingredients_status" },
        { text: "Actions", value: "action", sortable: false }
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
      !this.$v.ingredientsUnit.required && errors.push("unit is required.");
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
  beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      'Access-Control-Allow-Origin':'*'
    };
    this.config = config;
  },
  created() {
    this.fetchStock();
    setInterval(this.fetchStock(), 3000);
  },

  methods: {
    getColor(status) {
      if (status === "Alert! Very Low") return "red";
      else if (status === "Warning! Running Low") return "orange";
      else if (status === "Calculating...") return "blue";
      else return "green";
    },
    showDialog() {
      this.reloadDataAddStock();
      this.stockDialog = !this.stockDialog;
    },
    showDialogUsedAmount() {
      this.reloadDataAddUsedAmount();
      this.addUsedStockDialog = !this.addUsedStockDialog;
    },
    updateIngredients() {
      axios
        .post(this.url+"/api/post/updateStock", this.editStockItem, this.config)
        .then(response => {
          this.fetchStock();
          this.editDialog = false;
        });
    },
    addIngredientsAmount() {
      this.$v.$touch();
      if (
        this.availableIngredients === "" ||
        this.availableIngredients === ""
      ) {
        this.addUsedStockDialog = true;
      } else {
        let newAddedAmount = {
          availableIngredients: this.availableIngredients,
          usedIngredientsAmount: this.usedIngredientsAmount
        };
        axios
          .post(
            this.url+"/api/post/usedIngredients",
            newAddedAmount, this.config
          )
          .then(response => {
            this.reloadDataAddUsedAmount();
            this.addUsedStockDialog = false;
          });
      }
    },
    fetchStock() {
      let nameArray = [];
      axios.get(this.url+"/api/fetch/stock", this.config).then(response => {
        this.stocks = response.data;
        for (var i = 0; i < response.data.length; i++) {
          if (nameArray.includes(response.data[i].ingredients_name)) {
          } else {
            nameArray.push(response.data[i].ingredients_name);
            this.itemSelect = nameArray;
          }
          continue;
        }

        let results = [];
        for (var i = 0; i < response.data.length; i++) {
          if (this.containsObject(results, response.data[i].id)) {
          } else {
            results.push(response.data[i]);
            this.IngredientsArray = results;
          }
          continue;
        }
      });
    },
    containsObject(arr, id) {
      return arr.some(function(el) {
        return el.id === id;
      });
    },
    editIngredients(item) {
      axios
        .get(this.url+"/api/post/editStock/" + item.id, this.config)
        .then(response => {
          this.editStockItem = response.data;
        });
    },
    reloadDataAddStock() {
      (this.ingredientsName = ""),
        (this.ingredientsUnit = ""),
        this.fetchStock();
      this.$v.$reset();
    },
    reloadDataAddUsedAmount() {
      (this.availableIngredients = ""),
        (this.usedIngredientsAmount = ""),
        this.fetchStock();
      this.$v.$reset();
    },

    addStock() {
      this.$v.$touch();
      if (this.ingredientsName === "" && this.ingredientsStatus === "") {
        this.stockDialog = true;
      } else {
        var upperName =
          this.ingredientsName.charAt(0).toUpperCase() +
          this.ingredientsName.slice(1).toLowerCase();
        let newStock = {
          ingredientsName: upperName,
          ingredientsUnit: this.ingredientsUnit,
          stockStatus: this.stockStatus
        };
        let headers = {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        };
        axios
          .post(this.url+"/api/posts/ingredients", newStock, this.config)
          .then(response => {
            if (response.data == "existed") {
              Swal.fire({
                title: "Stock item is already existed",
                text: "You can update stock amount instead",
                showConfirmButton: true,
                icon: "warning",
                timer: 5000
              });
            } else if (response.data == "not existed") {
              Swal.fire({
                title: "Successfully added ingredients item",
                showConfirmButton: true,
                icon: "success",
                timer: 5000
              });
            }
            this.stockDialog = false;
            this.reloadDataAddStock();
          });
      }
    }
  }
};
</script>
