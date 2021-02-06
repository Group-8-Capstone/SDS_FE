<template>
  <v-footer id="footer" dark padless class="mt-2" no-gutters>
    <div class="mt-2">
        <v-col cols="12">
          <v-row>
            <v-col lg="4" md="4" sm="4" xl="4" align="center" justify="center">
              <p id="texts" class="ml-2">
                <v-icon small>mdi-copyright</v-icon>2020, Wawen's Ube Halaya. All Rights Reserved.
              </p>
            </v-col>
            <v-col lg="8" md="8" sm="8" xl="8" >
              <v-row align="center" justify="center">
                <p id="contactUs">Check us out here:</p>
                <div id="phone">
                  <v-icon id="callIcon" medium>mdi-facebook</v-icon>
                </div>
                <div id="fbPage">
                  <p id="texts" prepend-inner-icon="mdi-facebook">
                    <a
                      href="https://www.facebook.com/ubehalayacebu/reviews/"
                      target="_blank"
                    >Wawen's Ube Halaya</a>
                  </p>
                </div>
                <p id="contactUs">Contact us:</p>
                <div id="phone">
                  <v-icon id="callIcon">mdi-phone</v-icon>
                </div>
                <div>
                  <p id="texts">0945 380 8056</p>
                </div>
                <div id="messenger">
                  <v-icon id="msgIcon" medium>mdi-facebook-messenger</v-icon>
                </div>
                <div id="footerRight">
                  <p id="texts">
                    <a
                      href="https://www.messenger.com/t/ubehalayacebu"
                      target="_blank"
                    >Wawen's Ube Halaya</a>
                  </p>
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
    </div>
  </v-footer>
</template>

<style scoped>
#footer {
  padding: 10px;
  height: 100px;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-weight: normal !important;
}
#footerContent {
  font-weight: normal !important;
}
#texts {
  font-size: 12px;
}
#fbPage {
  margin-right: 15px;
}
#contactUs {
  margin-right: 10px;
  font-size: 12px;
}
.v-btn {
  padding-left: 1px;
  padding-right: 1px;
}
#callIcon {
  margin-right: 0px;
  text-decoration: none;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 12px;
}
#msgIcon {
  margin-right: 0px;
  margin-left: 15px;
  text-decoration: none;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 12px;
}
.v-footer{
  display: inline !important;
}
p {
  margin-bottom: 0 !important;
}
</style>