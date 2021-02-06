<template>
  <div>
    <v-row>
      <v-hover v-slot:default="{ hover }">
        <v-layout wrap>
          <v-flex md4 v-for="item in products" :key="item.id">
            <v-card  class="card-container ma-5" elevation="2" shaped>
              <v-card-title ><v-icon class="mr-2">{{item.icon}}</v-icon>{{item.title}}</v-card-title>
              <v-row class="mx-auto text-center">
              <v-list-item class="justify-center">{{item.description}}</v-list-item>
              </v-row>
            </v-card>
          </v-flex>
        </v-layout>
      </v-hover>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      products: [
        {
          title: "Delivery Time",
          description: "Starts at 3:00 PM until orders for the day are all delivered",
          icon:"mdi-clock",
          image: require("@/assets/order.png")
        },
        {
          title: "Delivery Schedule",
          description: "Monday to Saturday",
          icon:"mdi-calendar",
          image: require("@/assets/store.png")
        },
        {
          title: "Payment Method",
          description: "Cash On Delivery",
          icon:"mdi-cash",
          image: require("@/assets/Pay_on_Delivery.png")
        }
      ]
    };
  },
  props: {
    source: String
  }
};
</script>
