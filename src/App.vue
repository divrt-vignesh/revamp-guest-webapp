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
import API from './api';
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
  async created() {
    const params = new URLSearchParams(window.location.search)

    var self = this;
    if (
      window.location.search.includes("zcode") &&
      (window.location.href.includes("createreservation"))
    ) {
      return;
    } else if (window.location.href.includes("successreservation")) {
      self.$router.replace({ path: "createreservation" });
    } else if (window.location.href.includes("confirmreservation")) {
      self.$router.push({ name: 'hostpass', query: { zcode: '99999', sessiontype: 'hostpass' } });
      return
    } else if (
      window.location.search.includes("zcode") &&
      window.location.href.includes("ondemand")
    ) {
      self.$store.commit('SET_TEMPLATE_FLAGS', 'ondemand-flag')
      self.$router.push({ name: 'ondemand', query: { zcode: '99999', sessiontype: 'ondemand' } });
      return;
    }
    else if ((window.location.search.includes("zcode") ||
      window.location.search.includes("gateid")) && window.location.href.includes('bid')) {
      return;
    }
    else if (
      (window.location.search.includes("zcode") ||
        window.location.search.includes("gateid"))
    ) {
      self.$router.push({ name: 'cico', query: { zcode: '99999', sessiontype: 'cico' } });
      return;
    }
    else if (window.location.search.includes("bid")) {


      let bookingId = params.get('bid');
      let bookingState = bookingId == "/" ? null : await self.getBookingState(bookingId);
      let entryMode = this.bookingDetails?.booking?.entryMode;
      switch (bookingState) {
        case "0":
          self.$router.push({ name: 'checkin', query: { bid: bookingId, state: 'checkin' } });
          break;
        case "2":
          if (entryMode == "OD") {
            self.$router.push({ name: 'odExtension', query: { bid: bookingId, mode: 'extendondemand' } });
            return;
          }
          this.bookingDetails?.booking?.isLPRVerified == "0" &&
            this.bookingDetails?.zone?.isGated == "0"
            ? self.$router.push({ name: 'loadsession', query: { bid: bookingId, state: 'loadsession' } })
            : self.$router.push({ name: 'checkedin', query: { bid: bookingId, state: 'checkedin' } });

          break;
        case "8":
          // console.log(this.prepaidExit)
          if (this.prepaidExit) {
            this.reEnter(bookingId)
          }
          else if (!(window.location.href.includes('/receipt'))) {
            self.$router.push({ name: 'checkout', query: { bid: bookingId, state: 'checkout' } });
          }
          break;
        case "5":
          self.$router.push({ name: 'success', query: { bid: bookingId, state: 'success' } });
          break;
        case "10":
          if (this.prepaidExit) {
            this.reEnter(bookingId);
          }
          else if (!(window.location.href.includes('/receipt'))) {
            self.$router.push({ name: 'checkout', query: { bid: bookingId, state: 'checkout' } });
          }
          break;
        case "11":
          if (this.prepaidExit) {
            this.reEnter(bookingId);
          }
          else if (!(window.location.href.includes('/receipt'))) {
            self.$router.push({ name: 'checkout', query: { bid: bookingId, state: 'checkout' } });
          }
          break;
        case "16":
          self.$router.push({ name: 'unpaidexit', query: { bid: bookingId, state: 'unpaidexit' } });
          break;
        case "19":
          self.$router.push({ name: 'promisetopay', query: { bid: bookingId, mode: 'promisetopay' } });
          break;
        case "-99":
          self.$router.push({ name: 'expired', query: { bid: bookingId, state: 'expired' } });
          break;
        case "99":
          self.$router.push({ name: 'cancelled', query: { bid: bookingId, state: 'cancelled' } });
          break;
        case null:
          self.$router.push({ name: 'invalidbooking', query: { bid: bookingId, state: 'invalidbooking' } });
          break;
      }
    }
    else {
      self.$router.push({ name: 'nothing', })
    }
  },
  methods: {
    async reEnter(bookingId) {
      if (bookingId != null) {
        try {
          var self = this;
          var bDetails = await API.reEnter(bookingId)
          this.$store.commit(
            "SET_BOOKING_DETAILS",
            bDetails.data?.data ? bDetails.data.data : null
          );
          let bookingState = bDetails.data?.data?.booking?.state
          if ((bookingState == 8 || bookingState == 10 || bookingState == 11) && (!(window.location.href.includes('/receipt')))) {
            self.$router.push({ name: 'checkout', query: { bid: bookingId, state: 'checkout' } });
          } else if (bookingState == 2) {
            self.$router.push({ name: 'checkedin', query: { bid: bookingId, state: 'checkedin' } });
          } else if (bookingState == 0) {
            self.$router.push({ name: 'checkin', query: { bid: bookingId, state: 'checkin' } });
          } else {
            setTimeout(async () => {
              await self.reEnter();
            }, 4000);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    async getBookingState(bookingId) {
      try {
        var bookingDetails = await API.getBookingState(bookingId)
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
        console.log(bookingDetails?.data?.data?.booking?.state)
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
