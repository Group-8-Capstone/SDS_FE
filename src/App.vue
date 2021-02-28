<template>
  <v-app>
    <Header v-if="$route.name== 'Landing'" id="Header"/>
    <v-main>
      <Sidebar
        v-if="$route.name!= 'Login' && $route.name!= 'LoginDefault' && $route.name!= 'Landing' && $route.name!= 'Register' && $route.name!= 'ForgotPassword'"
        id="Sidebar"
      />
      <content>
        <router-view/>
      </content>
    </v-main>
    <Footer v-if="$route.name== 'Landing'" id="Footer" />
  </v-app>
</template>
<style>
#Sidebar {
  position: absolute;
}
/* #Header {
  position: absolute;
}
#Footer {
  position: absolute;
} */
</style>


<script>
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    Sidebar,
    Header,
    Footer
  },

  data: () => ({
    //
  }),

  mounted() {
    this.setUser();
  },
  methods: {
    setUser() {}
  }

  // mounted(){
  //   if(localStorage.getItem('token') === null && this.$route.path !== '/login'){
  //     this.$router.push("/login")
  //   }
  // }
};
</script>
