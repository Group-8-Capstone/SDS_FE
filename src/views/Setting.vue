<template>
  <div>
    <center>
      <v-progress-circular
        class="ma-5 mb-12 pa-5"
        v-show="loading"
        :size="70"
        :width="7"
        color="purple"
        indeterminate
      ></v-progress-circular>
    </center>
    <v-card id="cardtable" class="ma-5 mb-12 pa-5">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-btn small class="ma-5" color="purple darken-2" outlined dark @click="showDialog">
          <!-- <v-icon>mdi-plus</v-icon> -->
          <v-toolbar-title>ADD INGREDIENT</v-toolbar-title>
        </v-btn>
      </v-card-title>
      <template>
        <v-dialog v-model="addDialog" style="height:auto;" width="400px">
          <v-card class="ma-0 pa-0">
            <v-card-title class="deep-purple--text">INGREDIENT DETAILS</v-card-title>
            <v-card-subtitle>Please fill in the required information</v-card-subtitle>
            <v-divider></v-divider>
            <v-container>
              <v-col cols="12">
                <v-text-field
                  color="purple"
                  label="Ingredient's Name"
                  :error-messages="AddedIngredientsNameErrors"
                  @input="$v.addedIngredientsName.$touch()"
                  @blur="$v.addedIngredientsName.$touch()"
                  required
                  hide-details="auto"
                  v-model="addedIngredientsName"
                  outlined
                ></v-text-field>
              </v-col>
              <br>
              <v-col cols="12">
                <v-text-field
                  color="purple"
                  label="Stock Level Basis Qty"
                  :error-messages="AddedIngredientsValueErrors"
                  @input="$v.addedEstimatedAmount.$touch()"
                  @blur="$v.addedEstimatedAmount.$touch()"
                  required
                  hide-details="auto"
                  v-model="addedEstimatedAmount"
                  outlined
                ></v-text-field>
              </v-col>
              <br>
              <v-col cols="12">
                <v-select
                  color="purple"
                  label="Ingredient's Unit"
                  :error-messages="addedIngredientsUnitErrors"
                  @input="$v.addedIngredientsUnit.$touch()"
                  @blur="$v.addedIngredientsUnit.$touch()"
                  required
                  hide-details="auto"
                  v-model="addedIngredientsUnit"
                  outlined
                  :items="items"
                ></v-select>
              </v-col>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="orange" @click="addDialog = false">CANCEL</v-btn>
              <v-btn outlined color="purple darken-2" @click="addEstimatedValue">ADD</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <v-data-table :headers="headersIngredients" :items="estimatedValue" :search="search">
        <template
          #item.ingredients_amount="{ item }"
        >{{ item.ingredients_need_amount }} {{ item.ingredients_unit }}/s</template>
        <template v-slot:item.action="{ item }">
          <v-icon
            @click="editDialog = !editDialog, editEstimatedValue(item) "
            normal
            title="Edit"
          >mdi-table-edit</v-icon>
          <v-icon
            class="mr-3"
            color="red"
            @click="alertDeleteIngredients(item)"
            normal
            title="Delete Ingredient"
          >mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <template>
      <v-dialog v-model="editDialog" style="height:auto;" width="400px">
        <v-card class="ma-0 pa-0">
          <v-card-title class="deep-purple--text">UPDATE INGREDIENT DETAILS</v-card-title>
          <v-card-subtitle>Please fill in the required information</v-card-subtitle>
          <v-divider></v-divider>
          <v-container>
            <v-row class="mx-2">
              <v-col cols="12">
                <v-text-field
                  v-model="editValue.ingredients_name"
                  label="Ingredients Name"
                  v-bind:disabled="disabled"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  label="Ingredient''s Unit"
                  outlined
                  v-model="editValue.ingredients_unit"
                  :items="items"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Stock Level Basis Qty"
                  color="purple"
                  v-model="editValue.ingredients_need_amount"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="orange" @click="editDialog = false">CANCEL</v-btn>
            <v-btn outlined color="purple darken-2" @click="updateEstimatedValue()">SAVE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>
<style>
.addOnsImage {
  width: 150px !important;
  height: 150px !important;
}
.fileStyle {
  font-size: 17px !important;
  width: 200px;
  margin-top: 3%;
  margin-bottom: 3%;
}
.imageview {
  width: 250px !important;
  height: 250px !important;
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
  name: "BusinessSetting",
  data: () => ({
    items: ["kg", "g", "mg", "can"],
    loading: false,
    addedEstimatedAmount: null,
    addedIngredientsName: null,
    addedIngredientsUnit: null,
    addProductDialog: false,
    editProductDialog: false,
    productName: null,
    imageURL: null,
    editProductName: null,
    editImageURL: null,
    editImg: null,
    tabs: null,
    img: null,
    prodId: null,
    addedCategory: "Ube Halaya",
    estimatedValue: [],
    displayProduct: [],
    search: "",
    editDialog: false,
    addDialog: false,
    editValue: [],
    headersIngredients: [
      {
        text: "Ingredient's Name",
        align: "start",
        sortable: false,
        value: "ingredients_name"
      },
      { text: "Needed Quantity", value: "ingredients_amount" },
      { text: "Category", value: "ingredients_category" },
      { text: "Actions", value: "action", sortable: false }
    ],
    disabled: true,
    btnDisabled: false,
    isHidden: true
  }),
  validations: {
    addedIngredientsName: {
      required
    },
    addedEstimatedAmount: {
      required
    },
    addedCategory: {
      required
    },
    addedIngredientsUnit: {
      required
    }
  },
  computed: {
    AddedIngredientsNameErrors() {
      const errors = [];
      if (!this.$v.addedIngredientsName.$dirty) return errors;
      !this.$v.addedIngredientsName.required &&
        errors.push("Ingredient's name is required.");
      return errors;
    },
    AddedIngredientsValueErrors() {
      const errors = [];
      if (!this.$v.addedEstimatedAmount.$dirty) return errors;
      !this.$v.addedEstimatedAmount.required &&
        errors.push("Stock Level Basis Qty is required.");
      return errors;
    },
    addedCategoryErrors() {
      const errors = [];
      if (!this.$v.addedCategory.$dirty) return errors;
      !this.$v.addedCategory.required && errors.push("Category is required.");
      return errors;
    },
    addedIngredientsUnitErrors() {
      const errors = [];
      if (!this.$v.addedIngredientsUnit.$dirty) return errors;
      !this.$v.addedIngredientsUnit.required &&
        errors.push("Unit is required.");
      return errors;
    }
  },
  mounted() {
    this.fetchEstimatedValue();
    setInterval(this.fetchEstimatedValue(), 3000);
  },
  beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Access-Control-Allow-Origin": "*"
    };
    this.config = config;
  },
  created() {},
  methods: {
    editAmount() {
      this.disabled = false;
      this.btnDisabled = true;
      this.isHidden = false;
    },
    reloadData() {
      (this.addedIngredientsName = null),
        (this.addedEstimatedAmount = null),
        (this.addedIngredientsUnit = null),
        this.$v.$reset();
    },

    reloadProduct() {
      (this.productName = null), (this.imageURL = null);
    },
    addEstimatedValue() {
      if (
        this.addedIngredientsName == null ||
        this.addedEstimatedAmount == null ||
        this.addedIngredientsUnit == null
      ) {
        this.addDialog = true;
        this.$v.$touch();
      } else {
        var upperIngredientsName =
          this.addedIngredientsName.charAt(0).toUpperCase() +
          this.addedIngredientsName.slice(1).toLowerCase();
        let param = {
          ingredientsName: upperIngredientsName,
          ingredientsEstimatedAmount: this.addedEstimatedAmount,
          ingredientsUnit: this.addedIngredientsUnit,
          ingredientsCategory: this.addedCategory
        };
        axios
          .post(this.url + "/api/post/neededValue", param, this.config)
          .then(response => {
            this.addDialog = false;
            if (response.data == "existed") {
              Swal.fire({
                title: "Ingredient Already Exists!",
                icon: "warning",
                timer: 3000
              });
            } else {
              Swal.fire({
                title: "Successfully Added",
                icon: "success",
                timer: 3000
              });
            }
            this.fetchEstimatedValue();
          });
      }
    },
    showDialog() {
      this.addDialog = true;
      this.reloadData();
    },

    fetchEstimatedValue() {
      this.$vloading.show();
      axios
        .get(this.url + "/api/fetch/estimatedValue", this.config)
        .then(response => {
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
          this.estimatedValue = response.data;
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
    updateEstimatedValue() {
      this.$vloading.show();
      if (
        this.editValue.ingredients_need_amount === "" ||
        this.editValue.ingredients_unit === ""
      ) {
        Swal.fire({
          title: "Please fill in all required field",
          icon: "warning",
          timer: 3000
        }),
          (this.editDialog = this.editDialog);
      } else {
        axios
          .post(
            this.url + "/api/post/updateNewEstimatedValue",
            this.editValue,
            this.config
          )
          .then(response => {
            this.editDialog = false;
            Swal.fire({
              title: "Successfully Updated",
              icon: "success",
              timer: 3000
            });
            setTimeout(() => {
              this.$vloading.hide();
            }, 2000);
            this.fetchEstimatedValue();
          });
      }
    },
    deleteStockIngredients(item) {
      axios
        .delete(
          this.url + "/api/softDeleteStockIngredients/" + item.id,
          this.config
        )
        .then(response => {});
    },
    deleteIngredients(item) {
      axios
        .delete(this.url + "/api/softDeleteIngredients/" + item.id, this.config)
        .then(response => {
          this.fetchEstimatedValue();
        });
    },
    AlertDelete(item) {
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
          this.deleteProduct(item);
          this.deleteStockProduct(item);
          Swal.fire({
            title: "Deleted!",
            text: "Ingredient has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    },
    alertDeleteIngredients(item) {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "purple",
        cancelButtonColor: "orange",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
        reverseButtons: true
      }).then(result => {
        if (result.value) {
          this.deleteIngredients(item);
          this.deleteStockIngredients(item);
          Swal.fire({
            title: "Deleted!",
            text: "Ingredient has been deleted",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }
};
</script>
