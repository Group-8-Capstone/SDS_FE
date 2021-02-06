<template>
  <div id="app">
    <v-spacer></v-spacer>
    <v-btn class="mr-5" outlined float-right small color="purple" @click="toolbarClick">
      <v-icon>mdi-download</v-icon>Export as CSV
    </v-btn>
    <ejs-grid
      ref="grid"
      id="Grid"
      :dataSource="data"
      :toolbar="toolbarOptions"
      height="272px"
      :allowExcelExport="true"
      :toolbarClick="toolbarClick"
    >
      <e-columns>
        <e-column field="product_name" headerText="Product Name" textAlign="Right" width="120"></e-column>
        <e-column field="remaining_quantity" headerText="Remaining Quantity" width="150"></e-column>
        <e-column field="total_ordered" headerText="Total Ordered Quantity" width="150"></e-column>
        <e-column field="updated_at" headerText="Date" width="150"></e-column>
      </e-columns>
    </ejs-grid>
  </div>
</template>
<script>
import Vue from "vue";
import { GridPlugin, Toolbar, ExcelExport } from "@syncfusion/ej2-vue-grids";
import { DataManager, ODataAdaptor } from "@syncfusion/ej2-data";
import axios from "axios";

Vue.use(GridPlugin);

export default {
  data() {
    // let SERVICE_URI =
    //   "https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders?$top=7";
    return {
      data: [],
      //   data: new DataManager({
      //     url: SERVICE_URI,
      //     adaptor: new ODataAdaptor()
      //   }),
      toolbarOptions: ["ExcelExport"]
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
    this.fetchRecordedProduct();
  },
  methods: {
    toolbarClick: function(args) {
      if (args.item.id === "Grid_excelexport") {
        // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
        this.$refs.grid.excelExport();
      }
    },
    fetchRecordedProduct() {
      this.$vloading.show();
      axios
        .get(this.url + "/api/fetchRecordedProduct", this.config)
        .then(response => {
          // console.log("-->>", response.data.product);
          setTimeout(() => {
            this.$vloading.hide();
          }, 1000);
          this.data = response.data.product;
        });
    }
  },
  provide: {
    grid: [Toolbar, ExcelExport]
  }
};
</script>
<style>
@import "../../node_modules/@syncfusion/ej2-vue-grids/styles/material.css";
</style>