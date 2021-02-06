<template>
  <div>
    <div>
      <div class="homeContainer">
        <img id="homeImg" fluid-grow src="../assets/ubeCard.jpg">
        <div class="centered">
          <h3
            id="imgText1"
            class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h4 [2] text-lg-h3 [2] text-xl-h3 [2] text-truncate"
          >Welcome to Wawen's Ube Halaya</h3>
          <h5
            id="imgText2"
            class="font-weight-thin text-h9 [1] text-sm-11 [1] text-md-h7 [2] text-lg-h6 [2] text-xl-h6 [2] text-truncate"
          >
            <i>
              Cebu’s First Locally Produced Authentic Ube Halaya
              <br>Prepared with Patience and Attention
              <br>And bottled with Love and Care
            </i>
          </h5>
          <br>
          <router-link to="/register" id="createBtn" justify="end">
            <v-btn color="purple darken-2" rounded dark>
              <v-toolbar-title>Order Now</v-toolbar-title>
            </v-btn>
          </router-link>
        </div>
      </div>
      <div>
        <v-col class="text-center" cols="12" id="text">
          <h2
            id="ourStory"
            class="mb-1 font-weight-bold text-h6 [1] text-sm-h6 [1] text-md-h6 [2] text-lg-h5 [2] text-xl-h5 [2]"
          >OUR STORY</h2>
          <v-row align="center" justify="center">
            <v-col cols="10">
              <div>
                <template>
                  <v-card flat class="mx-auto mt-1" max-width="400">
                    <v-card-text id="story" class="font-weight-bold">
                      <p id="textStory">
                        12 Ube Halaya jars.
                        1 Facebook post.
                        <br>
                        <br>That's how our story began in October 17, 2019.
                        <br>
                        <br>Today, we are privileged to have bottled and distributed more than 16,000 jars and counting.
                      </p>
                    </v-card-text>
                  </v-card>
                </template>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </div>
      <div>
        <v-card flat class="pa-1 mt-1">
          <v-row align="center" justify="center" class="mt-1">
            <div id="planHeader" class="text-center">
              <h1
                id="productHeader"
                class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
              >Ways To Enjoy Wawen's Ube Halaya</h1>
            </div>
          </v-row>
          <v-row>
            <v-col sm="3" md="3" lg="3" xl="3" v-for="(item, i) in gallery" :key="i">
              <div>
                <v-hover v-slot:default="{ hover }">
                  <v-card flat :elevation="8" data-aos="zoom-out">
                    <v-img id="photo" height="315" :src="item.src">
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          justify="center"
                          align="center"
                          class="d-flex transition-fast-in-fast-out purple darken-2 v-card--reveal display-1 white--text"
                          style="height: 100%;"
                        >{{item.description}}</div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </div>
            </v-col>
          </v-row>
          <br>
        </v-card>
      </div>
      <div>
        <v-row>
          <v-col cols="12">
            <v-row id="infos" align="center" justify="center">
              <v-col sm="12" md="4" lg="4" xl="4">
                <v-col sm="12" class="pl-0">
                  <v-card
                    shaped
                    id="infoCards"
                    light
                    max-width="315"
                    height="auto"
                    :elevation="8"
                    data-aos="fade-right"
                  >
                    <v-card-title>
                      <v-icon large left>mdi-bullhorn</v-icon>Suwayi na!
                      <v-card-text class="text-wrap" id="textAreas">
                        "Ube Halaya na lami, apan dili bidli. Basta matilwan,
                        dili na gyud mabinlan. Matud pa nila, maablihan
                        na gani ang botelya sa Wawen's Ube Halaya - dili
                        na gyud katugpa sa lamesa."
                      </v-card-text>
                    </v-card-title>
                  </v-card>
                  <br>
                  <v-card
                    shaped
                    id="infoCards"
                    light
                    max-width="315"
                    height="auto"
                    :elevation="8"
                    data-aos="fade-right"
                  >
                    <v-card-title>
                      <v-icon large left>mdi-truck</v-icon>Delivery
                      <v-card-text class="text-wrap">
                        <v-icon>mdi-clock</v-icon>3:00 PM onwards
                      </v-card-text>
                      <v-card-text class="text-wrap">
                        <v-icon>mdi-calendar</v-icon>Monday - Saturday
                      </v-card-text>
                      <v-card-text class="text-wrap">
                        <v-icon>mdi-cart</v-icon>For orders of 10 jars or more, order a day ahead.
                      </v-card-text>
                    </v-card-title>
                  </v-card>
                  <br>
                </v-col>
                <v-layout wrap>
                  <v-flex>
                    <v-col sm="12" class="pl-0">
                      <v-card
                        shaped
                        flat
                        id="infoCrd"
                        max-width="315"
                        height="auto"
                        :elevation="8"
                        data-aos="fade-right"
                      >
                        <v-card-title class="purple darken-2 white--text">
                          <v-icon color="white" large light>mdi-information</v-icon>
                        </v-card-title>
                        <center>
                          <v-img src="../assets/order.png" height="100px" width="100px"></v-img>
                        </center>
                        <v-list-item class="justify-center">
                          <h2>You can now place your order online!</h2>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                          <h2>How to pay?</h2>
                        </v-list-item>
                        <center>
                          <v-img src="../assets/Pay_on_Delivery.png" height="100px" width="100px"></v-img>
                        </center>
                        <v-list-item class="justify-center">
                          <h2>Cash On Delivery</h2>
                        </v-list-item>
                      </v-card>
                    </v-col>
                  </v-flex>
                </v-layout>
              </v-col>
              <v-col sm="12" md="8" lg="8" xl="8">
                <v-card flat id="mainContent">
                  <div align="center" id="planHeader" class="text-center mt-0">
                    <h1
                      id="productsHeader"
                      class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
                    >RETAIL</h1>
                    <br>
                  </div>
                  <v-row align="center" justify="center">
                    <v-col sm="12" md="6" lg="6" xl="6">
                      <v-hover id="productsTub" v-slot:default="{ hover }">
                        <v-card
                          height="auto"
                          width="310"
                          color="grey lighten-4"
                          :elevation="8"
                          @click="dialog = true"
                        >
                          <v-img width="310" height="220" src="../assets/halayaTab.jpg">
                            <v-expand-transition>
                              <div
                                v-if="hover"
                                align="center"
                                justify="center"
                                class="d-flex transition-fast-in-fast-out purple darken-2 v-card--reveal display-1 white--text"
                                style="height: 100%;"
                              >Click To See Tub Promo</div>
                            </v-expand-transition>
                          </v-img>
                          <v-card-text class="pt-6">
                            <center>
                              <div
                                class="font-weight-light grey--text title mb-2"
                              >Best for Bakers & Cake Makers</div>
                              <h1 class="font-weight-light orange--text mb-2">{{tubName}}</h1>
                              <p>1000g (1kg)</p>
                              <div
                                id="price"
                                class="font-weight-light grey--text title mb-2"
                              >₱{{tubPrice}}</div>
                            </center>
                          </v-card-text>
                          <v-dialog v-model="dialog" width="500px">
                            <v-img
                              justify="center"
                              align="center"
                              width="500px"
                              src="../assets/ad1.png"
                            ></v-img>
                          </v-dialog>
                        </v-card>
                      </v-hover>
                    </v-col>
                    <v-col sm="12" md="6" lg="6" xl="6">
                      <v-hover id="productsJar" v-slot:default="{ hover }">
                        <v-card height="auto" width="310" color="grey lighten-4" :elevation="8">
                          <v-img width="310" height="220" src="../assets/halayaJar.jpg"></v-img>
                          <v-card-text class="pt-6">
                            <center>
                              <div class="font-weight-light grey--text title mb-2">Perfect for Snack</div>
                              <h1 class="font-weight-light orange--text mb-2">{{jarName}}</h1>
                              <p>230g</p>
                              <div
                                id="price"
                                class="font-weight-light grey--text title mb-2"
                              >₱{{jarPrice}}</div>
                            </center>
                          </v-card-text>
                        </v-card>
                      </v-hover>
                    </v-col>
                  </v-row>
                  <div align="center" justify="center" id="planHeader" class="text-center">
                    <br>
                    <br>
                    <h1
                      id="adHeader"
                      class="mb-1 font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
                    >WHOLESALE</h1>
                  </div>
                  <div>
                    <v-col cols="12" sm="12">
                      <v-row align="center" justify="center">
                        <v-col sm="6">
                          <v-card width="330" flat :elevation="8">
                            <v-img src="../assets/ad2.png"></v-img>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-col>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import VueResponsiveImage from "vue-responsive-image";
import axios from "axios";
export default {
  name: "Home",
  data: () => ({
    dialog: false,
    menu: false,
    model: null,
    jarName: null,
    tubName: null,
    tubPrice: null,
    jarPrice: null,
    gallery: [
      {
        src: require("../assets/photos/jar.png"),
        description: "UBErwhelming Snack"
      },
      {
        src: require("../assets/ube.jpg"),
        description: "UBElicious Spread"
      },
      {
        src: require("../assets/photos/ubechi.png"),
        description: "Ube-Filled Butchi"
      },
      {
        src: require("../assets/photos/ubecake.png"),
        description: "UBEdazzling Cake"
      }
    ]
  }),
  created() {
    this.getHalayaTub(), this.getHalayaJar();
  },
  methods: {
    getHalayaTub(item) {
      axios.get(this.url + "/api/fetchHalayaTubLanding").then(response => {
        this.tubName = response.data.product[0].product_name;
        this.tubPrice = response.data.product[0].product_price;
      });
    },

    getHalayaJar(item) {
      axios.get(this.url + "/api/fetchHalayaJarLanding").then(response => {
        this.jarName = response.data.product[0].product_name;
        this.jarPrice = response.data.product[0].product_price;
      });
    }
  }
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
.v-application--wrap {
  min-height: 100vh;
  justify-content: center;
}
#btnCard {
  margin-top: 12px;
  margin-right: 20px;
}
#createBtn {
  text-decoration: none;
}
#about {
  padding-left: 0;
  padding-top: 0;
  justify-content: center;
  align-content: center;
}
#infoCards {
  background-color: rgb(217, 167, 252);
  margin-top: 3px;
  padding-top: 0;
  padding-bottom: 0;
}
#infoCrd {
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
}
.homeContainer {
  height: 400px;
  width: 100%;
  position: relative;
  text-align: center;
  background-color: black;
  display: inline-block;
}
#homeImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  display: inline;
}
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inherit;
}
@media (min-width: 100%) {
  #imgText1 {
    font-size: 1em;
  }
  #imgText2 {
    font-size: 0.75em;
  }
}
#imgText1 {
  align-content: center;
  justify-content: center;
  color: white;
}
#imgText2 {
  align-content: center;
  color: white;
}
#ourStory {
  margin-top: 20px;
}
#infos {
  margin-top: 40px;
  margin-left: 2px;
  justify-content: center;
}
#textAreas {
  word-wrap: initial;
}
#photo {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: flex;
}
#story {
  font-weight: thin;
  color: black;
  text-align: justify;
  justify-content: center;
  justify-items: center;
}
/* #textStory {
  margin-right: 50px !important;
  margin-left: 30px !important;
  
} */
#productHeader {
  align-content: center;
  font-size: 2em;
}
/* #productsHeader {
  align-content: center;
  font-size: 2.5em;
} */
#mainContent {
  max-width: 85% !important;
}
#productsJar {
  margin-right: 0px;
  margin-left: 53px;
}
#adHeader,
#productsHeader {
  align-content: center;
  color: white;
  font-size: 2.5em;
  text-transform: uppercase;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(45deg, #7794ff, #44107a, #ff1361, #fff800);
  animation: 0.8s shake infinite alternate;
}
@keyframes shake {
  0% {
    transform: skewX(-15deg);
  }
  5% {
    transform: skewX(15deg);
  }
  10% {
    transform: skewX(-15deg);
  }
  15% {
    transform: skewX(15deg);
  }
  20% {
    transform: skewX(0deg);
  }
  100% {
    transform: skewX(0deg);
  }
}
</style>