<template>
  <div>
    <v-spacer></v-spacer>
    <v-btn class="mr-5" text float-right small @click="generateReport">
      Export as PDF
    </v-btn>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="5000"
      :filename="'Product Logs'"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <section class="pdf-item" justify="center">
          <center>
            <div>
              <br>
              <img class="logo" width="50" :src="require('@/assets/wawens.png')">
            </div>
            <div>
              <h4>WAWEN'S UBE HALAYA</h4>
              <h6>PRODUCTS' LOGS</h6>
              <br>
            </div>
          </center>
          <div style="margin:1px" class="pa-0">
            <div>
              <v-data-table :headers="headers" :items="records" :hide-default-footer="true">
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
            </div>
          </div>
        </section>
      </section>
    </vue-html2pdf>
  </div>
</template>
<script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>  
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>
<script>
import VueHtml2pdf from "vue-html2pdf";
export default {
  name: "ProductsPdf",
  props: ["headers", "records"],
  components: {
    VueHtml2pdf
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    }
  }
};
</script>

<style scoped>
.logo {
  border-radius: 50%;
  width: 10%;
  height: 10%;
  margin-left: auto;
  margin-right: auto;
}
v-data-table {
  width: 100%;
}
</style>