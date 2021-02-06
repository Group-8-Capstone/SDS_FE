import Vue from "vue";
import VueRouter from "vue-router";
import Order from "../views/Order.vue";
import Stock from "../views/Stock.vue";
import Delivery from "../views/OrderToDeliver.vue";
import Login from "../views/Login.vue"
import Delivered from "../views/Delivered.vue";
import Home from "../views/Home.vue";
import Setting from "../views/Setting.vue";
import Ingredients from "../views/IngredientsStock.vue";
import Product from "../views/ProductsStock.vue";
import AccountSetting from "../components/ProfileAccount.vue";
import Register from "../views/RegisterComponent.vue";
import Logs from "../views/Logs.vue";
import CustomerHome from "../views/CustomerHome.vue";
// import Landing from "../views/Landing.vue";
import Landing from "../views/SampleLanding.vue";
import MyOrder from "../views/MyOrder.vue";
import { verify } from "crypto";
import axios from "axios";
import ForgotPassword from "../views/ForgotPassword";




Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Landing",
      component: Landing
    },
    // {
    //   path: "/",
    //   name: "Landing",
    //   component: Landing
    // },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/forgotPassword",
      name: "ForgotPassword",
      component: ForgotPassword
    },
    {
      path: "/order",
      name: "Order",
      component: Order,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/stock",
      name: "Stock",
      component: Stock,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/delivered",
      name: "Delivered",
      component: Delivered,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/customerHome",
      name: "CustomerHome",
      component: CustomerHome,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/myorder",
      name: "MyOrder",
      component: MyOrder,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/delivery",
      name: "Delivery",
      component: Delivery,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/product",
      name: "Product",
      component: Product,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/logs",
      name: "Logs",
      component: Logs,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/setting",
      name: "BusinessSetting",
      component: Setting,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/profileSetting",
      name: "ProfileSetting",
      component: AccountSetting,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/ingredients",
      name: "Ingredients",
      component: Ingredients,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/about",
      name: "About",
      meta: {
        requiresAuth: true,
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "../views/About.vue")
    }
  ]

});


router.beforeEach(async(to, from, next) => {
  const authenticated = await verify_auth().then(res=> {
    return res
  });
  const requiresAuth = await to.matched.some(record => record.meta.requiresAuth);
  // if (requiresAuth && authenticated){
  //   console.log("authenticated")
  //   next();
  // }else{
  //   console.log("not authenticated")
  //   next('/login')
  // }
  // next();
  // console.log(to)
  if(requiresAuth){
    if(authenticated ){
      // console.log(from.path)
      next();
    }else{
      next('/login')
    }
  }
  next();
});
const verify_auth = () => {
  let url="http://localhost:8000"
  // let url="https://wawenshalaya.herokuapp.com"
  return new Promise((resolve, reject) => {
    if(localStorage.getItem("token") === null){
      resolve(false);
    }else{
      let config = {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("token")
        }
      }
      axios.post(url+"/api/verify_auth", {}, config).then((response) => {
        if(response.data.status.toLowerCase() !== 'token is invalid' 
        && response.data.status.toLowerCase() !== 'token is expired' 
        && response.data.status.toLowerCase() !== 'authorization token not found'
        && response.data.status.toLowerCase() === 'verified'){
          resolve(true)
        }else{
          localStorage.clear();
          resolve(false)
        } 
      }).catch(err=> {
        reject(err)
      })
    }
  })
  return rtrn;
}
// router.beforeEach((to, from, next) => {
//   const authenticatedUser = null;
//   const requiresAuth = to.matched.some(record => record.meta.guest);

//   if (requiresAuth && ! authenticatedUser) next('/login')
//   else next();
// })
export default router;