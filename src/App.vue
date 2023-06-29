<template>
  <v-app>
    <v-main>
      <v-system-bar absolute dark color="red" v-if="buildMode == 'dev'" class="justify-space-between"><span>version : {{
        version
      }}</span><span>build : development</span></v-system-bar>
      <transition name="zoom" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import api from './api.js';
import { mapGetters } from "vuex";
export default {
  name: 'App',

  data: () => ({
    //
  }),
  computed: {
    ...mapGetters({
      buildMode: "getterBuildMode",
      bookingDetails: "getterBookingDetails",
    }),
    prepaidExit() {
      return this.bookingDetails.booking?.type == 13 && this.checkReservationEndDate
    },
    checkReservationEndDate() {
      return this.bookingDetails?.booking?.revEnd &&
        new Date((Number(this.bookingDetails.booking.revEnd) - Number(this.bookingDetails.zone.timezoneoffset)) * 1000).getTime() - new Date().getTime() > 0
        ? true
        : false;
    },
    version() {
      return process.env.VUE_APP_VERSION;
    },
  },
  mounted() {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        // stop running expensive task
      } else if (window.location.hash == "#/addpayment" || window.location.hash == "#/createreservation" || window.location.hash == "#/successreservation" || window.location.hash == "#/confirmreservation" || window.location.hash == "#/ondemand/odReceipt" || window.location.hash == "#/ondemand/makepayment" || window.location.hash == "#/ondemand" || window.location.hash == "#/prepaidhost/odReceipt" || window.location.hash == "#/prepaidhost/makepayment" || window.location.hash == "#/prepaidhost") {
        // page has focus, begin running task
      } else {
        window.location.reload();
      }
    });
  },
  methods: {
    async getBookingState(bookingId) {
      try {
        var bookingDetails = api.getBookingState(bookingId)
        // bookingDetails.data.serverName == 'dev' ? document.querySelector('meta[name="theme-color"]').setAttribute("content", "#43A047") : "";
        this.$store.commit(
          "SET_BOOKING_DETAILS",
          bookingDetails.data?.data ? bookingDetails.data.data : null
        );
        this.$store.commit(
          "SET_BUILD_MODE",
          bookingDetails.data?.serverName
            ? bookingDetails.data.serverName
            : null
        );
        return bookingDetails.data?.data?.booking?.state
          ? bookingDetails.data.data.booking.state
          : null;
      } catch (error) {
        console.log(error);
      }
    },
  }
};

</script>
