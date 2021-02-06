<template>
<div>
    <v-card id="cardtable" class="ma-5 mb-12 pa-5">
      <v-tabs
        v-model="tabs"
        right
        color="deep-purple accent-4">
        <v-tab>Ingredients</v-tab>
         <v-tab>Products</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
      <v-tab-item>
      <v-card-title>
         <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
       
           </v-card-title>
              <v-data-table :headers="headersIngredients" :items="displayIngredientsRecords" :search="search">
              <template v-slot:item.action="{ item }" >
                <v-icon
                  normal
                  title="Edit"
                >mdi-table-edit</v-icon>
                <v-icon
                class="mr-3"
                color="red"
                normal
                title="Delete Product"
                >mdi-delete
                </v-icon>
              </template>
            </v-data-table>
            </v-tab-item>
            <v-tab-item>
               <v-card-title>
         <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
          </v-card-title>
            <v-data-table :headers="headersProduct" :items="displayProductRecords" :search="search">
                      
              <template v-slot:item.action="{ item }" >
                <v-icon
                  normal
                  title="Edit"
                >mdi-table-edit
                </v-icon>
                <v-icon
                class="mr-3"
                color="red"
                  normal
                  title="Delete Product"
                >mdi-delete
                </v-icon>
              </template>
            </v-data-table>

            </v-tab-item>
        </v-tabs-items>
 
     </v-card>
</div>
</template>
<style>


</style>

<script>
import { required, minLength, maxLength, between } from 'vuelidate/lib/validators'
import axios from "axios";
import Swal from "sweetalert2";
  export default {
    name: "Logs",
    data: () => ({
      
      tabs:null,
      displayIngredientsRecords:[],
      displayProductRecords:[],
      search:'',
      headersIngredients: [
        {
          text: "Ingredient's Name",
          align: "start",
          sortable: false,
          value: 'ingredients_name'
        },
     { text: "Needed Value", value: "ingredients_need_amount" },
         { text: "Category", value: "ingredients_category" },
        { text: "Actions", value: "action", sortable: false },
      ],
        
       headersProduct: [
        {
          text: "Product Name",
          align: "start",
          sortable: false,
          value: 'product_name'
        },
         {
          text: "Remaining Quantity",
          align: "start",
          sortable: false,
          value: 'product_remaining_quantity'
        },
        { text: "Ordered Quantity", value: "order_quantity" },
        { text: "Actions", value: "action", sortable: false },
      ],
        
      alignments: [
        'start',
        'center',
        'end',
      ],
     
      text: "",
      disabled: true,
      btnDisabled:false,
      isHidden: true

    }),

      computed:{
    
},
 
  
    
  }
</script>
