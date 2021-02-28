<template>
  <v-app id="inspire">
    <v-app-bar app  light lights-in height="70" color="white" dense dark elevation="40" fixed>
      <v-btn color="grey" icon @click.stop="drawer = !drawer"  >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-list-item-avatar size="60">
        <img src="../assets/wawens.png">
      </v-list-item-avatar>
      <v-toolbar-title class="deep-purple--text">WAWEN'S UBE HALAYA</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-app-bar-items name="theitem" class="hidden-sm-and-down" app> -->
         <template v-if="isAdmin() === true">
        <div>
          <!-- <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon medium color="black" right>mdi-bell-ring</v-icon>
                <span style="background-color: red; color: white; border-radius: 50%; font-size: 15px; margin-left: -5%; margin-top: -25%; z-index: 9999">{{count > 0 ? '&nbsp;&nbsp;' + count + '&nbsp;&nbsp;' : ''}}</span>
              </v-btn>
            </template>
              <v-list
              v-if="storeData.length > 0"
              style="max-height: 300px; max-width: 300px"
              class="overflow-y-auto notifDropdown"
            >
          
              <v-list-item
                v-for="(item, index) in storeData"
                :key="index"
                @click="getOrder(item, $event)"
              >
                <v-card class="cardNotif" >
                <v-list-item-title style="font-size:12px" v-bind:class='{ "read": item.mark_adminstatus == "Read", "unread": item.mark_adminstatus == "Unread" }'>{{notif(item)}}</v-list-item-title>
                </v-card> 

              </v-list-item>
             
            </v-list>
        
            <v-list
              v-if="storeData.length <= 0"
              style="max-height: 300px; max-width: 300px"
              class="overflow-y-auto notifDropdown"
            >
              <v-list-item>
                <v-list-item-title style="font-size:12px">- - - - No Order - - - -</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
        </div>
         </template>

            <template v-if="isCustomer() === true">
        <div>
          <!-- <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon medium color="black" right>mdi-bell-ring</v-icon>
                <span style="background-color: red; color: white; border-radius: 50%; font-size: 15px; margin-left: -5%; margin-top: -25%; z-index: 9999">{{countPending > 0 ? '&nbsp;&nbsp;' + countPending + '&nbsp;&nbsp;' : ''}}</span>
              </v-btn>
            </template>
              <v-list
              v-if="storeConfirm.length > 0"
              style="max-height: 300px; max-width: 300px"
              class="overflow-y-auto notifDropdown"
            >
            <v-list-item
                v-for="(item, index) in storeConfirm"
                :key="index"
                @click="customerOrder(item, $event)"
              >
              <v-card class="cardNotif" >
                <v-list-item-title style="font-size:12px" v-bind:class='{ "read": item.mark_status == "Read", "unread": item.mark_status == "Unread" }'>{{notifCustomerOrder(item)}}</v-list-item-title>
                </v-card>
              </v-list-item>

            </v-list>
            <v-list
              v-if="storeConfirm.length <= 0"
              style="max-height: 300px; max-width: 300px"
              class="overflow-y-auto notifDropdown"
            >
              <v-list-item>
                <v-list-item-title style="font-size:12px">- - - - No Order - - - -</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
        </div>
         </template>
      <!-- </v-app-bar-items> -->
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      color="purple darken-3"
      dark
      id="drawer"
    >
 <v-sheet color="purple darken-3" >
 <v-row>
<v-list-item-avatar class="ma-2" color="grey darken-1" size="40"> 
<img  :src="image === null ? avatarSrc : this.url+'/'+ image" >
</v-list-item-avatar>
<v-list-item-content>
<v-toolbar-title class="white--text ml-5 ">{{name}}</v-toolbar-title>
</v-list-item-content>
</v-row>
</v-sheet>
      <v-divider></v-divider>
      <!-- <template v-if="isCustomer() === true">
        <v-list>
          <v-list-item
            :key="item.text"
            active-class="white purple--text"
            :to="item.link"
            link
            v-if="!item.subItem"
            v-for="item in customer"
          >
            <v-list-item-icon @click="logout(item)">
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="logout(item)">
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-else-if="item.subItem" active-class="purple--text">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-group>
        </v-list>
      </template> -->
      <template v-if="isAdmin() === true">
        <v-list>
          <v-list-item
            :key="item.text"
            active-class="white purple--text"
            :to="item.link"
            link
            v-if="!item.subItem"
            v-for="item in admin"
          >
            <v-list-item-icon @click="logout(item)">
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="logout(item)">
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-else-if="item.subItem" active-class="purple--text">
            <template v-slot:activator>
              <v-list-item-icon >
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content >
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="_subItem in item.subItem"
              active-class="white purple--text"
              :key="_subItem.title"
              :to="_subItem.link"
              link
            >
              <v-list-item-icon class="ml-3">
                <v-icon>{{ _subItem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="ml-2" >
                <v-list-item-title>{{ _subItem.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </template>

      <template v-if="isDriver() === true">
        <v-list>
          <v-list-item
            :key="item.text"
            active-class="white purple--text"
            :to="item.link"
            link
            v-if="!item.subItem"
            v-for="item in driver"
          >
            <v-list-item-icon @click="logout(item)">
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon >
            <v-list-item-content @click="logout(item)">
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-else-if="item.subItem" active-class="purple--text">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="_subItem in item.subItem"
              active-class="white purple--text"
              :key="_subItem.title"
              :to="_subItem.link"
              link
            >
              <v-list-item-icon>
                <v-icon>{{ _subItem.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ _subItem.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </template>
    </v-navigation-drawer>
  </v-app>
</template>
<style scoped>
.sub_title {
  font-size: 15px;
}
.unread{
  background-color: plum;
  padding: 2%
}
.cardNotif{
  padding: 10px;
  font-size: 15px;
}
</style>
<script>
import axios from "axios";
import { forestgreen } from "color-name";
import moment from 'moment';
export default {
  name: "Sidebar",
  props: {},
  data: () => ({
    storeData: [],
    countPending:0,
    storeConfirm:[],
    avatarSrc:'https://wawenshalaya.herokuapp.com/images/avatar.png',
    image: null,
    name: null,
    dialog: false,
    switch2: true,
    drawer: true,
    model: 1,
    mini: true,
    count: 0,
    sound:'http://soundbible.com/mp3/Elevator Ding-SoundBible.com-685385892.mp3',
    admin: [
      { icon: "mdi mdi-cart-plus", text: "Order", link: "/order" },
      {
            icon: "mdi-clipboard-outline",
            text: "To Deliver",
            link: "/delivery"
      },
      {
        icon: "mdi-content-copy",
        text: "Delivered Orders",
        link: "/delivered"
      },
      { icon: "mdi-logout", text: "Sign out", link: "/login" },
    ],
    customer: [
      { icon: "mdi-home-variant", text: "Home", link: "/customerHome" },
      { icon: "mdi-package-variant-closed", text: "My Order", link: "/myorder" },
      {
        icon: "mdi-account-settings",
        text: "Profile Setting",
        link: "/profileSetting"
      },
      { icon: "mdi-logout", text: "Sign out", link: "/login" }
    ],
    driver: [
      { icon: "mdi-clipboard-outline", text: "To Deliver", link: "/delivery" },
      { icon: "mdi-content-copy", text: "Delivered Orders", link: "/delivered" },
      {
        icon: "mdi-account-settings",
        text: "Profile Setting",
        link: "/profileSetting"
      },
      { icon: "mdi-logout", text: "Sign out", link: "/login" }
    ]
  }),
  mounted(){
    // this.confirmPending()
    // this.retrieve()
    let pusher = new Pusher('c31b45d58431fd307880', {
      cluster: 'ap1',
      encrypted: false
    });
    // let channel = pusher.subscribe('order-channel')
    // channel.bind('newOrder', data => {
    //   // this.retrieve(),
    //   this.confirmPending()
    //   // this.notifCustomerOrder()
    // });
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
    this.avatarRetrieve();
    this.isAdmin();
  },
  methods: {
    playSound () {
        var audio = new Audio(this.sound);
        audio.play();
    },

     getOrder(item, event) {
       this.$router.push('/order').catch(err => {});
       axios.post(this.url + "/api/updateadminStatus/" + item.id, {}, this.config)
        .then(response => {
        });
    },
     notif(item){
      let date = moment(item.created_at).format('MM/DD/YYYY HH:mm');
      return item.receiver_name + ' '+'place an order on'+' '+ date
    },
    customerOrder(item, event) {
       this.$router.push('/myorder').catch(err => {});
      axios.post(this.url + "/api/updateMarkStatus/" + item.id, {}, this.config)
        .then(response => {
        });
  
    },
  // notifCustomerOrder(item){
  //     let date = moment(item.created_at).format('MM/DD/YYYY');
  //     return item.receiver_name +' '+'ordered ube halaya'+' ' + date
  //   },
  //   retrieve(){
  //     axios.get(this.url + "/api/fetchProcessOrder", this.config).then(response => {
  //       this.storeData = response.data.data;
  //       this.playSound();
  //     axios
  //       .get(this.url+"/api/unreadAdminOrder" , this.config)
  //       .then(response => {
  //       this.count =  response.data.post.length
      
  //       });
  //     })
  //   },
    
    // confirmPending(){
    //   let id = localStorage.getItem("id");
    //   axios
    //     .get(this.url+"/api/fetchOngoingOrder/" + id, this.config)
    //     .then(response => {
    //       this.storeConfirm = response.data.post;
    //       // this.playSound();
    //     });
    //   axios
    //     .get(this.url+"/api/unReadOrder/" + id, this.config)
    //     .then(response => {
    //        this.countPending =  response.data.post.length
    //     });
    // },
    goTo(route) {
      alert(route);
      this.$router.push(route);
    },
    avatarRetrieve() {
      let id=localStorage.getItem('id')
      axios.get(this.url+"/api/fetchProfile/"+ id, this.config).then(response => {
        this.name = response.data.account[0].username;
        this.image=response.data.account[0].profile_url
      });
    },
    logout(item) {
      if (item.text == "Sign out") {
        localStorage.clear();
      }
    },
    isAdmin() {
      if (localStorage.getItem("role") == "admin") {
        return true;
      }
    },
    isCustomer() {
      if (localStorage.getItem("role") == "customer") {
        return true;
      }
    },
    isDriver() {
      if (localStorage.getItem("role") == "driver") {
        return true;
      }
    }
  }
};
</script>