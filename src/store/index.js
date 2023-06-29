import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    odDetails: { userDetail: {}, cardDetail: {}, payment: {} },
    bookingDetails: {},
    buildMode: "",
    isValidatedTimeOver: true,
    isGracePeriodTimeOver: true,
    isODExitTimeOver: true,
    zoneDetails: {},
    validatedMerchant: "",
    hostPassData: {},
    templateFlags: '',
    findUserData: {},
    onDemandZoneDetails: {},
    casinoDetails: { userDetail: {}, cardDetail: {}, payment: {} },
  },
  mutations: {
    SET_BOOKING_DETAILS(state, bDetails) {
      state.bookingDetails = Object.assign({}, bDetails);
    },
    SET_TEMPLATE_FLAGS(state, data) {
      state.templateFlags = data
    },
    SET_BUILD_MODE(state, mode) {
      state.buildMode = mode;
    },
    SET_ZONE_DETAILS(state, zone) {
      state.zoneDetails = Object.assign({}, zone);
    },
    SET_ON_DEMAND_ZONE_DETAILS(state, zone) {
      state.onDemandZoneDetails = Object.assign({}, zone);
    },
    SET_VALIDATED_TIME_STATUS(state, status) {
      state.isValidatedTimeOver = status;
    },
    SET_EXIT_TIME_TIME_STATUS(state, status) {
      state.isODExitTimeOver = status;
    },
    SET_GRACE_PERIOD_TIME_STATUS(state, status) {
      state.isGracePeriodTimeOver = status;
    },
    SET_VALIDATED_MERCHANT(state, merchant) {
      state.validatedMerchant = merchant;
    },
    SET_HOSTPASS_DATA(state, data) {
      state.hostPassData = data;
    },
    SET_FINDUSER_DATA(state, data) {
      state.findUserData = data;
    },
    SET_ONDEMAND_USERDETAILS(state, data) {
      state.odDetails.userDetail = data;
    },
    SET_ONDEMAND_CARDDETAILS(state, data) {
      state.odDetails.cardDetail = data;
    },
    SET_ONDEMAND_PAYMENT(state, data) {
      state.odDetails.payment = data;
    },
    SET_CASINO_USERDETAILS(state, data) {
      state.casinoDetails.userDetail = data;
    },
    SET_CASINO_CARDDETAILS(state, data) {
      state.casinoDetails.cardDetail = data;
    },
    SET_CASINO_PAYMENT(state, data) {
      state.casinoDetails.payment = data;
    }
  },
  actions: {},
  modules: {},
  getters: {
    getterBookingDetails: (state) => {
      return state.bookingDetails;
    },
    getterBookingId: (state) => {
      return state.bookingDetails?.booking?.bid
        ? state.bookingDetails.booking.bid
        : null;
    },
    getterTemplateFlags: (state) => {
      return state.templateFlags;
    },
    getterEntryTime: (state) => {
      let isValidatedTimeOver = state.isValidatedTimeOver;
      if (
        state.bookingDetails?.booking?.validated &&
        state.bookingDetails.booking.validated == "1" &&
        isValidatedTimeOver &&
        state.bookingDetails?.booking?.validationType &&
        state.bookingDetails.booking.validationType == "DIVRT"
      ) {
        return (
          Number(state.bookingDetails.booking.entrytime) -
          Number(state.bookingDetails.zone.timezoneoffset) -
          Number(state.bookingDetails.zone.timezonedstoffset)
        );
      } else {
        return state.bookingDetails?.booking?.entrytime
          ? Number(state.bookingDetails.booking.entrytime) -
          Number(state.bookingDetails.zone.timezoneoffset) -
          Number(state.bookingDetails.zone.timezonedstoffset)
          : null;
      }
    },
    getterODExitTime: (state) => {
      return state.bookingDetails?.booking?.entrytime
        ? Number(state.bookingDetails.booking.entrytime) -
        Number(state.bookingDetails.zone.timezoneoffset) -
        Number(state.bookingDetails.zone.timezonedstoffset)
        : null;
    },
    getterHostPassData: (state) => {
      return state.hostPassData;
    },
    getterCasinoDetails: (state) => {
      return state.casinoDetails;
    },
    getterOdDetails: (state) => {
      return state.odDetails;
    },
    getterFindUserData: (state) => {
      return state.findUserData;
    },
    getterBuildMode: (state) => {
      return state.buildMode;
    },
    getterZoneDetails: (state) => {
      return state.zoneDetails;
    },
    getterOnDemandZoneDetails: (state) => {
      return state.onDemandZoneDetails;
    },
    getterEntryGateCodes: (state) => {
      return state.bookingDetails?.gateCodes.length > 0
        ? state.bookingDetails.gateCodes.filter(
          (a) => a.lane_type_current == "IN"
        )
        : [];
    },
    getterExitGateCodes: (state) => {
      return state.bookingDetails?.gateCodes.length > 0
        ? state.bookingDetails.gateCodes.filter(
          (a) => a.lane_type_current == "OUT"
        )
        : [];
    },
    getterValidatedMerchant: (state) => {
      return state.validatedMerchant;
    },
    getterZoneIsPQREndReservation : (state) =>{
      return state.zoneDetails?.isPQREndReservation == "1" ? true : false;
    }
  },
});
