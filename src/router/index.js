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
    component: () => import('@/views/information/NothingView.vue')
  },
  {
    path: '/',
    name: 'cico',
    component: () => import("../views/information/CreateView.vue"),
  },
  {
    path: '/',
    name: 'ondemand',
    component: () => import("../views/information/OndemandView.vue"),
  },
  {
    path: '/',
    name: 'hostpass',
    component: () => import("../views/information/CreateHostPassView.vue"),
  },
  {
    path: '/',
    name: 'p2p',
    component: () => import('@/views/information/P2PPaymentView.vue')
  },

  {
    path: '/',
    name: 'checkedin',
    component: () => import('@/views/session/CheckedIn.vue')
  },
  {
    path: '/',
    name: 'checkout',
    component: () => import('@/views/session/ThankYou.vue')
  },
  {
    path: '/',
    name: 'checkin',
    component: () => import('@/views/session/CheckIn.vue')
  },
  {
    path: '/',
    name: 'cancelled',
    component: () => import('@/views/session/CancelledBooking.vue')
  },
  {
    path: '/',
    name: 'expired',
    component: () => import('@/views/session/Expired.vue')
  },
  {
    path: '/',
    name: 'odExtension',
    component: () => import('@/views/session/OdExtension.vue')
  },
  {
    path: '/',
    name: 'success',
    component: () => import('@/views/loadingstates/CheckinSuccess.vue')
  },
  {
    path: '/',
    name: 'receipt',
    component: () => import('@/views/loadingstates/Receipt.vue')
  },
  {
    path: '/',
    name: 'pedestrianaccess',
    component: () => import('@/views/loadingstates/PedestrianAccess.vue')
  },
  {
    path: '/',
    name: 'loadsession',
    component: () => import('@/views/loadingstates/LoadSession.vue')
  },
  {
    path: '/',
    name: 'invalidbooking',
    component: () => import('@/views/session/InvalidBooking.vue')
  },
  {
    path:'/',
    name: 'makepayment',
    component: () => import('@/views/session/AddPayment.vue')
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
