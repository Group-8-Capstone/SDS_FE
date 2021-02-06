<template>
  <div>
    <br>
    <div id="label">
      <h3 class="ml-2">Color Coding Label</h3>
      <v-row>
        <v-col cols="3">
          <v-btn color="purple" style="height:13px;"></v-btn>&nbsp; Wawen's Store
        </v-col>
        <v-col cols="3">
          <v-btn color="blue" style="height:13px;"></v-btn>&nbsp; Ongoing Order
        </v-col>
        <v-col cols="3">
          <v-btn color="green" style="height:13px;"></v-btn>&nbsp; Delivered Order
        </v-col>
        <v-col cols="3">
          <v-btn color="orange" style="height:13px;"></v-btn>&nbsp; Canceled Order
        </v-col>
      </v-row>
    </div>
    <br>
    <div id="parent">
      <div id="mapContainer" class="basemap"></div>
    </div>
  </div>
</template>
<style scoped>
</style>

<script>
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import axios from "axios";
import { connect } from "tls";
import { orange } from "color-name";

export default {
  name: "SortLocation",
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoiamllbnhpeWEiLCJhIjoiY2tlaTM3d2VrMWcxczJybjc0cmZkamk3eiJ9.JzrYlG2kZ08Pkk24hvKDJw",
      address: [],
      customData: {
        features: []
      }
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
  mounted() {
    mapboxgl.accessToken = this.accessToken;
    var map = new mapboxgl.Map({
      container: "mapContainer",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [123.921969, 10.329892],
      zoom: 12
    });

    new mapboxgl.Marker({ color: "purple" })
      .setLngLat([123.921969, 10.329892])
      .setPopup(
        new mapboxgl.Popup() // add popups
          .setHTML("<h3>Wawen's Ube Halaya Store</h3>")
      )
      .addTo(map); //default marker sa place ni sir clark

    axios.get(this.url + "/api/posts/delivery", this.config).then(response => {
      setTimeout(() => {
        this.$vloading.hide();
      }, 1000);
      var result = response.data.data;
      // console.log("=====", result);
      result.forEach(element => {
        let {
          building_or_street,
          barangay,
          city_or_municipality,
          province,
          latitude,
          longitude,
          order_status,
          distance
        } = element;

        let full_address = building_or_street.concat(
          " ",
          barangay,
          " ",
          city_or_municipality,
          " ",
          province
        );

        // add markers to map
        var el = document.createElement("div");
        el.className = "marker";
        if (
          building_or_street ===
          "Shambala Veterinary Clinic Hernan Cortes Street" && order_status == "Delivered"
        ) {
          new mapboxgl.Marker({ color: "purple" })
            .setLngLat([123.921969, 10.329892])
            .setPopup(
              new mapboxgl.Popup() // add popups
                .setHTML("<h3>Wawen's Ube Halaya Store</h3>")
            )
            .addTo(map); //default marker sa place ni sir clark
        } else if (order_status == "Delivered") {
          // make a marker for each feature and add to the map
          new mapboxgl.Marker({ color: "green" })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup() // add popups
                .setHTML(
                  "<h3>" +
                    full_address +
                    "</h3><p>" +
                    distance +
                    " kilometers away from your location</p>"
                )
            )
            .addTo(map);
        } else if (order_status == "Canceled") {
          // make a marker for each feature and add to the map
          new mapboxgl.Marker({ color: "orange" })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup() // add popups
                .setHTML(
                  "<h3>" +
                    full_address +
                    "</h3><p>" +
                    distance +
                    " kilometers away from your location</p>"
                )
            )
            .addTo(map);
        } else {
          // make a marker for each feature and add to the map
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup() // add popups
                .setHTML(
                  "<h3>" +
                    full_address +
                    "</h3><p>" +
                    distance +
                    " kilometers away from your location</p>"
                )
            )
            .addTo(map);
        }
      });
    });
  },
  methods: {}
};
</script>

<style scoped>
.basemap {
  width: 100%;
  height: 80vh !important;
}
#parent {
  padding-left: 10px;
  padding-right: 10px;
  height: 80vh;
}
.marker {
  /* background-image: url("../assets/mapbox-icon.png"); */
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.mapboxgl-popup {
  max-width: 200px;
}

.mapboxgl-popup-content {
  text-align: center;
  font-family: "Open Sans", sans-serif;
}
</style>
