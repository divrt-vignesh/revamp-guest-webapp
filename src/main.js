import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import loggerMixin from './mixins/loggerMixin';

/* import font awesome icon component */

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import defaultDataOptions from './mixins/defaultDataOptions';
// import loggerMixin from './mixins/loggerMixin';
import PrimeVue from 'primevue/config';
import { library } from '@fortawesome/fontawesome-svg-core'
import BoilerPlate from '@/components/BoilerPlate.vue'
/* import specific icons */
import { faHotel } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faHotel)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('boiler-plate',BoilerPlate)
Vue.use(PrimeVue);
Vue.mixin(loggerMixin);
Vue.config.productionTip = false
/** DIVRT UI Components and mixins */
// Vue.mixin(defaultDataOptions);
// Vue.mixin(loggerMixin);
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
