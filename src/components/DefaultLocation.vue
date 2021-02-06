<template>
  <div id="parent">
    <div id="mapContainer" class="basemap"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default {
  name: "DefaultLocation",
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoiamllbnhpeWEiLCJhIjoiY2tlaTM3d2VrMWcxczJybjc0cmZkamk3eiJ9.JzrYlG2kZ08Pkk24hvKDJw"
    };
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken;

    var map = new mapboxgl.Map({
      container: "mapContainer",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [123.921969, 10.329892],
      zoom: 12
      // maxBounds: [[103.6, 1.1704753], [104.1, 1.4754753]]
    });
    new mapboxgl.Marker().setLngLat([123.921969, 10.329892]).addTo(map); //default marker sa place ni sir clark

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: "purple"
      },
      mapboxgl: mapboxgl
    });

    map.addControl(geocoder);

    // map.addControl(
    //   new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl
    //   })
    // );

    // var mapboxClient = mapboxgl({ accessToken: this.accessToken });
    // mapboxClient.geocoding
    //   .forwardGeocode({
    //     query: "Cebu City",
    //     autocomplete: false,
    //     limit: 1
    //   })
    //   .send()
    //   .then(function(response) {
    //     if (
    //       response &&
    //       response.body &&
    //       response.body.features &&
    //       response.body.features.length
    //     ) {
    //       var feature = response.body.features[0];

    //       var map = new mapboxgl.Map({
    //         container: "map",
    //         style: "mapbox://styles/mapbox/streets-v11",
    //         center: feature.center,
    //         zoom: 10
    //       });
    //       new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
    //     }
    //   });
  }
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
</style>
