<template>
  <div>
    <br>
    <div>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="8">
          <img @click="dialog = true" id="homeImg" fluid src="../assets/photos/jar.png">
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>
    </div>
    <div>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="8">
          <div class="responsive">
            <div class="gallery">
              <img
                @click="dialog = true"
                src="../assets/ube.jpg"
                width="600"
                height="400"
              >
            </div>
          </div>

          <div class="responsive">
            <div class="gallery">
              <img
                @click="dialog = true"
                src="../assets/photos/ubechi.png"
                width="600"
                height="400"
              >
            </div>
          </div>

          <div class="responsive">
            <div class="gallery">
              <img
                @click="dialog = true"
                src="../assets/photos/ubecake.png"
                width="600"
                height="400"
              >
            </div>
          </div>

          <div class="responsive">
            <div class="gallery">
              <img
                @click="dialog = true"
                src="../assets/photos/ubecake.png"
                width="600"
                height="400"
              >
            </div>
          </div>
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>
    </div>

    <div>
      <template>
        <v-row justify="center">
          <v-dialog v-model="dialog" max-width="1500">
            <v-card>
              <v-carousel height="580" hide-delimiter-background show-arrows-on-hover>
                <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src">
                  <v-row align="center" justify="center">
                    <div class="display-1">{{ item.description }}</div>
                  </v-row>
                </v-carousel-item>
              </v-carousel>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "Gallery",
  data() {
    return {
      dialog: false,
      items: [
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
    };
  },
  methods: {}
};
</script>

<style scoped>
#homeImg {
  width: 50%;
  height: auto;
  object-fit: cover;
}
.v-application .display-1,
.v-application .display-2 {
  font-weight: 400;
  font-family: "Nunito", sans-serif !important;
}
.display-1 {
  font-weight: bold !important;
  margin-top: 500px;
}
#galleryTitle {
  font-family: "Nunito", sans-serif !important;
}
/* div.gallery {
  border: 1px solid #ccc;
}

div.gallery:hover {
  border: 1px solid #777;
} */

div.gallery img {
  width: 100%;
  height: auto;
}

div.desc {
  padding: 15px;
  text-align: center;
}

* {
  box-sizing: border-box;
}

.responsive {
  padding: 0 6px;
  float: left;
  width: 24.99999%;
}

@media only screen and (max-width: 700px) {
  .responsive {
    width: 49.99999%;
    margin: 6px 0;
  }
}

@media only screen and (max-width: 500px) {
  .responsive {
    width: 100%;
  }
}

.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
</style>
