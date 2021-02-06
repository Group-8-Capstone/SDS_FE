<template>
  <div id="navDiv" class="mb-0">
    <v-toolbar height="70" class="mb-0">
      <v-list-item-avatar size="50" class="pa-0 ml-0 mr-0">
        <img src="../assets/wawens.png">
      </v-list-item-avatar>
      <v-toolbar-title class="deep-purple--text">WAWEN'S UBE HALAYA</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link id="signUp" to="/register" class="hidden-sm-and-down">
        <v-btn id="signUp" color="purple darken-2" text col-lg-4 col-md-4 col-sm-12>Sign Up</v-btn>
      </router-link>
      <router-link id="signIn" to="/login" class="hidden-sm-and-down">
        <v-btn id="signIn" color="purple darken-2" text col-lg-4 col-md-4 col-sm-12>Login</v-btn>
      </router-link>
      <v-menu class="hidden-md-and-up">
        <template v-slot:activator="{ on, attrs }" class="hidden-md-and-up">
          <v-app-bar-nav-icon v-on="on" class="hidden-md-and-up"></v-app-bar-nav-icon>
        </template>
        <v-list>
          <router-link id="signUp" to="/register" class="hidden-md-and-up">
            <v-btn id="signUp" color="purple darken-2" text col-lg-4 col-md-4 col-sm-12>Sign Up</v-btn>
          </router-link>
          <br>
          <router-link id="signIn" to="/login" class="hidden-md-and-up">
            <v-btn id="signIn" color="purple darken-2" text col-lg-4 col-md-4 col-sm-12>Login</v-btn>
          </router-link>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        { icon: "register", title: "Sign Up", link: "/register" },
        { icon: "login", title: "Login", link: "/login" }
      ]
    };
  },
  methods: {
    menuItems() {
      return this.menu;
    }
  }
};
</script>

<style scoped>
.v-toolbar__content,
.v-toolbar__extension {
  padding: 4px 4px !important;
}
#signUp {
  text-decoration: none;
}
#signIn {
  text-decoration: none;
}
</style>