<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Receiver Name
          </th>
          <th class="text-left">
            Address
          </th>
          <th class="text-left">
            Distance
          </th>
          <th class="text-left">
            Delivery Date
          </th>
          <th class="text-left">
            Order Details
          </th>
          <th class="text-left">
            Action
          </th>
          <th class="text-left">
            Order Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in orders"
          :key="item"
        >
          <td>{{ item.receiver_name }}</td>
          <td>{{ item.delivery_address }}</td>
          <td>{{ distance }}</td>
          <td>{{ item.confirmed_delivery_date + ' ' + item.confirmed_delivery_time}}</td>
          <td>
            <v-icon
                class="mr-2"
                normal
                title="Order Details"
                >mdi-table-info
            </v-icon>
          </td>
          <td>
            <template>
                <v-icon
                    normal
                    class="mr-2"
                    title="Delivered"
                    >mdi-truck-check-outline</v-icon>
                <v-icon
                    class="mr-2"
                    normal
                    title="Edit"
                    >mdi-table-edit</v-icon>
                <v-icon normal class="mr-2" title="Cancel">mdi-cancel</v-icon>
            </template>
          </td>
          <td>{{item.status}}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
    name: 'orders',
    data() {
        return{
            orders: [],
            distance: 0,
        }
    },
    created(){
        this.loadOrder();
    },
    methods: {
        loadOrder() {
      axios.get(this.url+"/api/orders/confirmed").then(response => {
        console.log('testing orders:', response.data)
        this.orders = response.data;
        // console.log('------------:', this.orders[0].receiver_name)
        // console.log('------------:', this.orders[0].delivery_address)
        // console.log('------------:', this.orders[0].products[0].product_name)
        // console.log('------------:', this.orders[0].products[0].pivot.sub_quantity)
      });
    },
    } 
}
</script>
