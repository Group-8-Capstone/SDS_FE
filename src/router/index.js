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
// import Register from "../views/RegisterComponent.vue";
import Logs from "../views/Logs.vue";
// import CustomerHome from "../views/CustomerHome.vue";
// import Landing from "../views/Landing.vue";
// import Landing from "../views/SampleLanding.vue";
// import MyOrder from "../views/MyOrder.vue";
import { verify } from "crypto";
import axios from "axios";
import ForgotPassword from "../views/ForgotPassword";
import NotFound from "../views/notFound.vue";




Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: "/",
    //   name: "Landing",
    //   component: Landing,
    //   role: ['admin','customer','driver']
    // },
    // {
    //   path: "/",
    //   name: "Landing",
    //   component: Landing
    // },
    {
      path: "/login",
      name: "Login",
      component: Login,
      role: ['admin','customer','driver']
    },
    // {
    //   path: "/register",
    //   name: "Register",
    //   component: Register,
    //   role: ['admin','customer','driver']
    // },
    {
      path: "/forgotPassword",
      name: "ForgotPassword",
      component: ForgotPassword,
      role: ['admin','customer','driver']
    },
    {
      path: "/order",
      name: "Order",
      component: Order,
      meta: {
        requiresAuth: true,
        role: ['admin']
      },
    },
    {
      path: "/stock",
      name: "Stock",
      component: Stock,
      meta: {
        requiresAuth: true,
        role: ['admin']
      },
    },
    {
      path: "/delivered",
      name: "Delivered",
      component: Delivered,
      meta: {
        requiresAuth: true,
        role: ['admin', 'driver']
      },
    },
    // {
    //   path: "/customerHome",
    //   name: "CustomerHome",
    //   component: CustomerHome,
    //   meta: {
    //     requiresAuth: true,
    //     role: ['customer']
    //   },
    // },
    // {
    //   path: "/myorder",
    //   name: "MyOrder",
    //   component: MyOrder,
    //   meta: {
    //     requiresAuth: true,
    //     role: ['customer']
    //   },
    // },
    {
      path: "/delivery",
      name: "Delivery",
      component: Delivery,
      meta: {
        requiresAuth: true,
        role: ['admin','driver']
      },
    },
    {
      path: "/product",
      name: "Product",
      component: Product,
      meta: {
        requiresAuth: true,
        role: ['admin']
      },
    },
    {
      path: "/logs",
      name: "Logs",
      component: Logs,
      meta: {
        requiresAuth: true,
        role: ['admin','rider']
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Home,
      meta: {
        requiresAuth: true,
        role: ['admin']
      },
    },
    {
      path: "/setting",
      name: "BusinessSetting",
      component: Setting,
      meta: {
        requiresAuth: true,
        role: ['admin']
      },
    },
    {
      path: "/profileSetting",
      name: "ProfileSetting",
      component: AccountSetting,
      meta: {
        requiresAuth: true,
        role: ['admin', 'driver', 'customer']
      },
    },
    {
      path: "/ingredients",
      name: "Ingredients",
      component: Ingredients,
      meta: {
        requiresAuth: true,
        role: ['admin']
      },
    },
    {
      path: "/about",
      name: "About",
      meta: {
        requiresAuth: true,
        role: ['admin','customer','driver']
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
      path: "/not_found",
      name: 'notFound',
      component: NotFound,
      meta: {
        role: ['admin','customer','driver']
      },
    }
  ]

});


router.beforeEach(async(to, from, next) => {
  const home = {
    admin: '/dashboard',
    driver: '/delivery',
    // customer: '/customerHome'
  }
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
  if(requiresAuth){
    if(authenticated){
      if(to.meta.role.includes(localStorage.getItem('role').toLowerCase())){
        next();
      }else{
        next('/not_found')
      }
    }else{
      next('/login')
    }
  }else{
    if(to.path === '/not_found'){
      next();
    }else if(authenticated){
      next(home[localStorage.getItem('role').toLowerCase()])
    }else{
      next();
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