<template>
  <v-app light>
    <v-content>
      <section>
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
      </section>

      <section>
        <v-layout column wrap class="my-5" align-center>
          <v-flex xs12 sm4 class="my-3">
            <div id="planHeader" class="text-center">
              <h1
                id="productHeader"
                class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
              >Our Story</h1>
              <br>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md3></v-flex>
                <v-flex xs12 md6>
                  <v-card class="elevation-0 transparent">
                    <v-card-text>
                      <p>
                        "Ube Halaya na lami, apan dili bidli. Basta matilwan,
                        dili na gyud mabinlan. Matud pa nila, maablihan
                        na gani ang botelya sa Wawen's Ube Halaya - dili
                        na gyud katugpa sa lamesa."
                      </p>

                      <p>
                        12 Ube Halaya jars.
                        1 Facebook post. That's how our story began in October 17, 2019. Today, we are
                        privileged to have bottled and distributed more than 16,000 jars and counting.
                        We are currently located at Mandaue City, Cebu.
                      </p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md3></v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section>
        <div id="planHeader" class="text-center">
          <h1
            id="productHeader"
            class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
          >Ways To Enjoy Wawen's Ube Halaya</h1>
          <br>
        </div>
        <!-- <v-parallax src="../assets/background.png" height="420"> -->
        <v-card style="background-color: #ffdd99;">
          <div>
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
          </div>
        </v-card>
        <!-- </v-parallax> -->

        <!-- <Gallery/> -->
      </section>

      <br>
      <br>

      <section>
        <br>
        <br>
        <div id="planHeader" class="text-center">
          <h1
            id="productHeader"
            class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
          >Products</h1>

          <br>
          <p>
            10 or more Wawen's Ube Halaya Jars are considered as a wholesale order.
            9 Jars and below will be considered as a retail order.
          </p>
          <br>
        </div>
        <div>
          <!-- <v-row justify="center"> -->
          <!-- <v-col class="col-sm-4 col-md-4 col-xl-4 col-lg-4">
              <template>
                <v-card flat>
                  <v-card-title>
                    <h1 class="header">Ube Halaya in a Tab</h1>
                  </v-card-title>
                  <v-card-text class="font-weight-bold">
                    <h1>Best for Bakers and Cake Makers</h1>
                    <br>
                    <p>Price: ₱ {{tubPrice}}</p>
                    <p>Unit: 1000 grams</p>
                  </v-card-text>
                </v-card>
              </template>
            </v-col>
            <v-col class="col-sm-4 col-md-4 col-xl-4 col-lg-4">
              <template>
                <v-card flat>
                  <img
                    class="white--text align-end"
                    style="width: 100%; height: 100%;"
                    src="../assets/halayaTab.jpg"
                  >
                </v-card>
              </template>
            </v-col>
          </v-row>
        </div>
        <br>
        <div>
          <v-row justify="center">
            <v-col class="col-sm-4 col-md-4 col-xl-4 col-lg-4">
              <template>
                <v-card flat>
                  <img
                    class="white--text align-end"
                    style="width: 100%; height: 100%;"
                    src="../assets/halayaJar.jpg"
                  >
                </v-card>
              </template>
            </v-col>
            <v-col class="col-sm-4 col-md-4 col-xl-4 col-lg-4">
              <template>
                <v-card flat>
                  <v-card-title>
                    <h1 class="header">Ube Halaya in a Jar</h1>
                  </v-card-title>
                  <v-card-text class="font-weight-bold">
                    <h1>Perfect for Snack</h1>
                    <br>
                    <p>Price: ₱ {{jarPrice}}</p>
                    <p>Unit: 230 grams</p>
                    <p> 10 or more Wawen's Ube Halaya Jars are considered as a wholesale order. 
                        9 Jars and below will be considered as a retail order.</p>
                  </v-card-text>
                </v-card>
              </template>
          </v-col>-->
          <v-row>
            <v-col sm="12" md="2" lg="2" xl="2"></v-col>
            <v-col align="center" justify="center" sm="12" md="4" lg="4" xl="4">
              <v-hover id="productsTub" v-slot:default="{ hover }">
                <v-card
                  height="auto"
                  width="310"
                  color="grey lighten-4"
                  :elevation="8"
                  @click="dialog = true"
                >
                  <v-img width="310" height="220" src="../assets/halayaTab.jpg">
                    <!-- <v-expand-transition>
                      <div
                        v-if="hover"
                        align="center"
                        justify="center"
                        class="d-flex transition-fast-in-fast-out purple darken-2 v-card--reveal display-1 white--text"
                        style="height: 100%;"
                      >Click To See Tub Promo</div>
                    </v-expand-transition> -->
                  </v-img>
                  <v-card-text class="pt-6">
                    <center>
                      <div
                        class="font-weight-light grey--text title mb-2"
                      >Best for Bakers & Cake Makers</div>
                      <h1 class="font-weight-light orange--text mb-2">{{tubName}}</h1>
                      <p>1000g (1kg)</p>
                      <div id="price" class="font-weight-light grey--text title mb-2">₱{{tubPrice}}</div>
                    </center>
                  </v-card-text>
                  <v-dialog v-model="dialog" width="500px">
                    <v-img justify="center" align="center" width="500px" src="../assets/ad1.png"></v-img>
                  </v-dialog>
                </v-card>
              </v-hover>
            </v-col>

            <v-col align="center" justify="center" sm="12" md="4" lg="4" xl="4">
              <v-hover id="productsJar" v-slot:default="{ hover }">
                <v-card height="auto" width="310" color="grey lighten-4" :elevation="8">
                  <v-img width="310" height="220" src="../assets/halayaJar.jpg"></v-img>
                  <v-card-text class="pt-6">
                    <center>
                      <div class="font-weight-light grey--text title mb-2">Perfect for Snack</div>
                      <h1 class="font-weight-light orange--text mb-2">{{jarName}}</h1>
                      <p>230g</p>
                      <div id="price" class="font-weight-light grey--text title mb-2">₱{{jarPrice}}</div>
                    </center>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
            <v-col sm="12" md="2" lg="2" xl="2"></v-col>
          </v-row>
          <!-- </v-row> -->
        </div>
      </section>

      <br>
      <br>
      <section>
        <div id="planHeader" class="text-center">
          <h1
            id="productHeader"
            class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
          >Promotions</h1>
          <br>
        </div>
        <!-- <v-parallax src="../assets/background.png" height="420"> -->
        <v-card style="background-color: purple;">
          <v-container grid-list-xl>
            <v-layout row wrap justify-center class="my-5">
              <v-flex xs12 sm4>
                <v-card class="elevation-0 transparent">
                  <v-img src="../assets/ad2.png"></v-img>
                </v-card>
              </v-flex>
              <v-flex xs12 sm4>
                <v-card class="elevation-0 transparent">
                  <v-img src="../assets/ad1.png"></v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <!-- </v-parallax> -->
      </section>

      <br>
      <br>
      <section>
        <div id="planHeader" class="text-center">
          <h1
            id="productHeader"
            class="font-weight-bold text-h6 [1] text-sm-h5 [1] text-md-h5 [2] text-lg-h4 [2] text-xl-h4 [2]"
          >Business Information</h1>
          <br>
        </div>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-5">
            <v-flex xs12 sm4>
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
                    <v-icon>mdi-clock</v-icon>3:00 PM until all orders for the day are delivered
                  </v-card-text>
                  <v-card-text class="text-wrap">
                    <v-icon>mdi-calendar</v-icon>Monday - Saturday
                  </v-card-text>
                  <v-card-text class="text-wrap">
                    <v-icon>mdi-cart</v-icon>For orders of 10 jars or more, order a day ahead.
                  </v-card-text>
                </v-card-title>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-layout wrap>
                <v-flex>
                  <v-col sm="12" class="pl-0">
                    <v-card
                      shaped
                      flat
                      id="infoCards"
                      max-width="315"
                      height="auto"
                      :elevation="8"
                      data-aos="fade-right"
                    >
                      <v-card-title class="purple darken-2 white--text">
                        <v-icon color="white" large light>mdi-information</v-icon>
                      </v-card-title>
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
            </v-flex>
          </v-layout>
        </v-container>
      </section>
    </v-content>
  </v-app>
</template>

<script>
import Gallery from "../components/Gallery.vue";
import axios from "axios";
export default {
  name: "App",
  components: { Gallery },
  data: function() {
    return {
      jarName: null,
      tubName: null,
      tubPrice: null,
      jarPrice: null,
      //   title: "Endorfine",
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
      ],
      email: "",
      emailRules: [
        v => {
          return !!v || "E-mail is required";
        },
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      subscribed: false
    };
  },
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
  },

  computed: {
    imgHeight: function() {
      var offset = 320;
      console.log("new image height is " + (this.pageHeight - offset));
      return this.pageHeight - offset;
    }
  },

  mounted: function() {
    this.calculateHeight();
  }
};
</script>

<style scoped>
#adHeader {
  align-content: center;
  color: white;
  font-size: 2.5em;
  text-transform: uppercase;
  /* -webkit-background-clip: text; */
  /* -webkit-text-fill-color: transparent; */
  /* background-image: linear-gradient(45deg, #7794ff, #44107a, #ff1361, #fff800); */
  animation: 0.8s shake infinite alternate;
}
#productHeader {
  color: orange;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif !important;
}
#createBtn {
  text-decoration: none;
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
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inherit;
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
.finedTitle {
  font-weight: 900;
  text-shadow: 2px 2px #000000;
}

.social-icon {
  font-size: 21px;
  color: white;
}
</style>
