import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const originalReplace = VueRouter.prototype.replace;
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const routes = [
  {
    path: '/',
    name: 'nothing',
    component: () => import('@/views/Information/NothingView.vue')
  },
  {
    path: '/',
    name: 'cico',
    component: () => import("../views/Information/CreateView.vue"),
  },
  {
    path: '/',
    name: 'ondemand',
    component: () => import("../views/Information/OndemandView.vue"),
  },
  {
    path: '/',
    name: 'hostpass',
    component: () => import("../views/Information/CreateHostPassView.vue"),
  },
  {
    path: '/',
    name: 'p2p',
    component: () => import('@/views/Information/P2PPaymentView.vue')
  },

  {
    path: '/',
    name: 'checkedin',
    component: () => import('@/views/States/CheckedIn.vue')
  },
  {
    path: '/',
    name: 'checkout',
    component: () => import('@/views/States/ThankYou.vue')
  },
  {
    path: '/',
    name: 'checkin',
    component: () => import('@/views/States/CheckIn.vue')
  },
  {
    path: '/',
    name: 'cancelled',
    component: () => import('@/views/States/CancelledBooking.vue')
  },
  {
    path: '/',
    name: 'expired',
    component: () => import('@/views/States/Expired.vue')
  },
  {
    path: '/',
    name: 'odExtension',
    component: () => import('@/views/States/OdExtension.vue')
  },
  {
    path: '/',
    name: 'success',
    component: () => import('@/views/LoadingStates/CheckinSuccess.vue')
  },
  {
    path: '/',
    name: 'receipt',
    component: () => import('@/views/LoadingStates/Receipt.vue')
  },
  {
    path: '/',
    name: 'pedestrianaccess',
    component: () => import('@/views/LoadingStates/PedestrianAccess.vue')
  },
  {
    path: '/',
    name: 'loadsession',
    component: () => import('@/views/LoadingStates/LoadSession.vue')
  },
  {
    path: '/',
    name: 'invalidbooking',
    component: () => import('@/views/States/InvalidBooking.vue')
  }



]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
