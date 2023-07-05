<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card elevation="0" class="pa-0 fill-height fit-width">
            <v-card-title class="justify-center add_payment_title">
                <v-spacer></v-spacer>
                <span>Add Payment</span>
                <v-spacer></v-spacer>
                <v-icon @click="navigateToCheckIn">mdi-close</v-icon>
            </v-card-title>
            <v-divider style="background-color: #a0c5d8"></v-divider>
            <v-card-text class="pa-2">
                <v-dialog v-model="addPaymentLoading" persistent>
                    <v-card class="pa-4">
                        <v-progress-circular indeterminate color="red"></v-progress-circular>
                        <span class="ml-4" style="font-size: 14px">Please wait...</span>
                    </v-card>
                </v-dialog>

                <div class="form-wrapper">
                    <form id="iframes" action method="GET">
                        <v-container class="pa-2" fluid>
                            <v-row no-gutters>
                                <v-col cols="12" class="pa-0">
                                    <label for="iframesCardNumber">CREDIT CARD*</label>
                                    <div id="iframesCardNumber" style="width: 100%"></div>
                                </v-col>
                                <v-col cols="6" class="pa-0">
                                    <label for="iframesCardExpiration">EXP DATE*</label>
                                    <div id="iframesCardExpiration"></div>
                                </v-col>
                                <v-divider vertical class="mx-2 my-4"></v-divider>
                                <v-col class="pa-0">
                                    <label for="iframesCardCvv">CVV*</label>
                                    <div id="iframesCardCvv"></div>
                                </v-col>
                                <v-col cols="12" class="pa-0 mb-2">
                                    <label class="hps_label" for="postalCode">POSTAL CODE*</label>
                                    <div>
                                        <input ref="postalCodeInput" v-model="postalCode" class="hps_input" type="text"
                                            id="postal_code" maxlength="10" placeholder="Enter Postal Code"
                                            name="postalCode" @focus="$vuetify.goTo($refs.postalCodeInput, options)"
                                            @mouseup="$vuetify.goTo($refs.postalCodeInput, options)" />
                                    </div>
                                </v-col>
                                <!-- <v-col cols="12" v-show="!checkPostalCode">
                      <p
                        style="
                          color: #d3838d;
                          font-weight: bolder;
                          font-size: smaller;
                        "
                      >
                        *This payment method applies for [US | CANADIAN] locations
                        only.
                      </p>
                    </v-col> -->
                                <v-col cols="12" class="pa-0">
                                    <label class="hps_label" for="email">EMAIL*</label>
                                    <div>
                                        <input ref="emailInput" v-model="email" class="hps_input" id="email_address"
                                            placeholder="Enter Email" name="email" v-on:keyup.enter="onFormSubmit()"
                                            @focus="$vuetify.goTo($refs.emailInput, options)"
                                            @mouseup="$vuetify.goTo($refs.emailInput, options)" />
                                    </div>
                                </v-col>
                                <v-col cols="10" class="pa-0"
                                    v-if="templateFlags == 'ondemand-flag' || (casinoDetails.hasOwnProperty('userDetail') && casinoDetails.userDetail.hasOwnProperty('bid') && (casinoDetails.userDetail.bid != undefined || casinoDetails.userDetail.bid != '' || casinoDetails.userDetail.bid != null))">
                                    <v-checkbox v-model="defaultCreditCardCB"
                                        label="Save my card for faster checkout next time" hide-details="auto"></v-checkbox>
                                </v-col>
                                <v-col cols="2" class="pa-0 text-left pl-10 align-self-end"
                                    v-if="templateFlags == 'ondemand-flag' || (casinoDetails.hasOwnProperty('userDetail') && casinoDetails.userDetail.hasOwnProperty('bid') && (casinoDetails.userDetail.bid != undefined || casinoDetails.userDetail.bid != '' || casinoDetails.userDetail.bid != null))">
                                    <v-icon @click="openInfoDialog()" color="primary">mdi-information</v-icon>
                                </v-col>
                                <!-- <p class="px-8 font-weight-bold text-decoration-underline" style="font-size: 11px;"
                    v-if="templateFlags == 'ondemand-flag' || (casinoDetails.hasOwnProperty('userDetail') && casinoDetails.userDetail.hasOwnProperty('bid') && (casinoDetails.userDetail.bid != undefined || casinoDetails.userDetail.bid != '' || casinoDetails.userDetail.bid != null))">
                    (Do not check this box
                    for a car you don't own, like a rental)
                  </p> -->

                                <!-- <v-col
                      cols="10"
                      class="pa-0"
                      v-show="
                       defaultCreditCardCB == true && bookingDetails.booking.isLPRAutocheckInEnabled == '1'
                      "
                    >
                      <v-checkbox
                        v-model="autoCheckinCB"
                        label="Save my license plate and automatically let me in next time"
                        hide-details="auto"
                      ></v-checkbox>
                    </v-col>
                     <v-col
                      cols="2"
                      class="pa-0 text-left align-self-center"
                      v-show="
                       defaultCreditCardCB == true && bookingDetails.booking.isLPRAutocheckInEnabled == '1'
                      "
                    >
                     <p v-show="
                    defaultCreditCardCB == true &&
                    bookingDetails.booking.isLPRAutocheckInEnabled == '1'
                  " class="px-8 font-weight-bold text-decoration-underline" style="font-size: 12px;">(Do not check this
                    box if this is a rental car.)</p>
                    <v-icon @click="openAutoCheckinInfoDialog()" color="primary" >mdi-information</v-icon>
                     </v-col> -->
                                <v-col cols="12" class="mt-10 text-center" v-show="showPaymentBtn">
                                    <v-btn ref="submitBtn" rounded block elevation="20" :loading="odSessionLoading"
                                        class="white--text exit_dialog_btn" @click="onFormSubmit()">Submit</v-btn>
                                </v-col>
                                <!-- <v-col cols="12" class="mt-10 text-center">
                      <div id="iframesSubmit" v-show="showPaymentBtn"></div>
                    </v-col>-->
                            </v-row>
                        </v-container>
                    </form>
                </div>
            </v-card-text>
        </v-card>
        <v-dialog v-model="errDialog" max-width="fit-content">
            <v-card class="pa-0">
                <v-card-title class="justify-center">
                    <v-icon x-large color="red accent-2">mdi-alert-outline</v-icon>
                </v-card-title>
                <v-card-text class="text-center mt-5">
                    <span style="font-size: 20px">
                        {{ errMsg }}
                    </span>
                </v-card-text>
                <v-card-actions class="text-center pb-6">
                    <v-container pa-0 fluid>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-btn rounded block elevation="0" class="white--text exit_dialog_btn"
                                    @click="errDialog = false">OK</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="infoDialog" max-width="fit-content">
            <v-card class="pa-0">
                <v-card-title class="justify-center">
                    <v-icon x-large color="red accent-2">mdi-information</v-icon>
                </v-card-title>
                <v-card-text class="text-center mt-5">
                    <span style="font-size: 20px">
                        {{ infoMsg }}
                    </span>
                </v-card-text>
                <v-card-actions class="text-center pb-6">
                    <v-container pa-0 fluid>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-btn rounded block elevation="0" class="white--text exit_dialog_btn"
                                    @click="infoDialog = false">OK</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
  
<script>
import Heartland from "@/plugins/securesubmit";
// import axios from "axios";
import { format } from "date-fns";
// import loggerHelper from "../loggerHelper";
// import { EventBus } from "@/lib/EventBus";
import API from '@/api';
import { mapGetters } from "vuex";
export default {
    name: "AddPayment",
    data: () => ({
        regex_US: /^(?=.{2,10}$)([0-9]{1,9}([-s]{1}[0-9]+)?)$/,
        regex_CA: /.*[a-zA-Z].*$/,
        defaultCreditCardCB: false,
        autoCheckinCB: false,
        odSessionLoading: false,
        hps: "",
        postalCode: "",
        email: "",
        addPaymentLoading: false,
        showPaymentBtn: true,
        duration: 300,
        offset: 100,
        easing: "easeInOutCubic",
        errDialog: false,
        errMsg: "",
        infoDialog: false,
        infoMsg: ""
    }),
    computed: {
        ...mapGetters({
            bookingId: "getterBookingId",
            casinoDetails: 'getterCasinoDetails',
            bookingDetails: "getterBookingDetails",
            zoneDetails: "getterZoneDetails",
            templateFlags: 'getterTemplateFlags',
            odDetails: "getterOdDetails",
        }),
        options() {
            return {
                duration: this.duration,
                offset: this.offset,
                easing: this.easing,
            };
        },
        checkPostalCode() {
            return (
                /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.postalCode) ||
                /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(this.postalCode)
            );
        },
    },
    created() { },
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            vm.$vuetify.goTo(0);
            const params = new URLSearchParams(window.location.search)
            let searchParamKey = params.has('zcode') ? '?zcode' : params.has('gateId') !== null ? '?gateId' : "";
            let searchParamValue = params.has('zcode') ? params.get('zcode') : params.has('gateId') !== null ? params.get('gateId') : "";
            switch (searchParamKey) {
                case "?zcode":
                    await vm.getZoneDetails(searchParamKey, searchParamValue);
                    if (vm.isPQREndReservation) {
                        await vm.getOnDemandZoneDetails(searchParamValue);
                        vm.setDefaultDate();
                    }
                    break;
                case "?gateid":
                    //await self.getZoneDetails(searchParamKey, searchParamValue);
                    break;
            }
            if (localStorage.getItem('odCCDetails')) {
                let odCCDetails = localStorage.getItem('odCCDetails');
                odCCDetails = odCCDetails ? JSON.parse(odCCDetails) : {};
                vm.postalCode = odCCDetails?.postalCode ? odCCDetails.postalCode : vm.postalCode;
                vm.email = odCCDetails?.email ? odCCDetails.email : vm.email;
            }
        });
    },
    mounted: function () {
        if (window.location.href.includes('prepaidhost')) {
            this.$store.commit("SET_TEMPLATE_FLAGS", 'atlantic-flag');
        }
        else if (window.location.href.includes('ondemand')) {
            this.$store.commit("SET_TEMPLATE_FLAGS", 'ondemand-flag');

        }
        this.initHPSform();
    },
    methods: {
        async createODSession() {
            try {
                this.odSessionLoading = true;
                let exitDateTime = format(
                    new Date(this.odDetails?.userDetail?.exitTime.replaceAll("-", "/")),
                    "yyyy-MM-dd HH:mm:ss"
                );
                let entryDateTime = format(
                    new Date(this.odDetails?.userDetail?.entryTime.replaceAll("-", "/")),
                    "yyyy-MM-dd HH:mm:ss"
                );
                let postData = {
                    userDetail: {
                        plate: this.odDetails?.userDetail?.plate,
                        contact: this.odDetails?.userDetail?.contact,
                        exitTime: exitDateTime,
                        eventType: "OD",
                    },
                    cardDetail: {
                        cardType: this.odDetails?.cardDetail?.cardType,
                        userDevice: "2",
                        orderType: "3",
                        entry: [
                            {
                                locationCode: this.zoneDetails?.zcode,
                                startAt: entryDateTime,
                                quantity: "1",
                            },
                        ],
                        payment: {
                            lastFourDigits: this.odDetails?.payment?.lastFourDigits,
                            expirationMonth: this.odDetails?.payment?.expirationMonth,
                            expirationYear: this.odDetails?.payment?.expirationYear,
                            postalCode: this.odDetails?.payment?.postalCode,
                            authorizationToken: this.odDetails?.payment?.authorizationToken,
                            email: this.odDetails?.payment?.email,
                            saveCard: this.odDetails?.payment?.saveCard,
                            isDefault: this.odDetails?.payment?.isDefault,
                            preAuthorizedOnly: this.odDetails?.payment?.preAuthorizedOnly,
                        },
                    },
                    mid: this.zoneDetails.mid,
                    source: "web"
                };
                var odAddCard = await API.prepaidAddCard(postData)
                if (odAddCard?.data?.status == true) {
                    let url = window.location.origin + "/g/" + odAddCard?.data?.data?.bid;
                    window.location.replace(url);
                } else if (odAddCard?.data?.status == false) {
                    this.alertDialog = true;
                    this.alertMsg = odAddCard?.data?.message;
                }
                this.odSessionLoading = false;
                // this.$router.replace({ path: 'odExtension' })
            } catch (error) {
                this.odSessionLoading = false;
                console.log(error);
            }
        },

        //Atlantic flow create session

        async casinoSession() {
            try {
                this.odSessionLoading = true;
                let exitDateTime = format(
                    new Date(
                        this.casinoDetails?.userDetail?.exitTime.replaceAll("-", "/")
                    ),
                    "yyyy-MM-dd HH:mm:ss"
                );
                let entryDateTime = format(
                    new Date(
                        this.casinoDetails?.userDetail?.entryTime.replaceAll("-", "/")
                    ),
                    "yyyy-MM-dd HH:mm:ss"
                );
                let postData = {
                    mid: this.zoneDetails.mid,
                    userDetail: {
                        plate: this.casinoDetails?.userDetail?.plate,
                        contact: this.casinoDetails?.userDetail?.contact,
                        exitTime: exitDateTime,
                        eventType: "PaidHostPass",
                    },

                    cardDetail: {
                        cardType: this.casinoDetails?.cardDetail?.cardType,
                        userDevice: "2",
                        orderType: "3",
                        entry: [
                            {
                                locationCode: this.zoneDetails?.zcode,
                                startAt: entryDateTime,
                                quantity: "1",
                            },
                        ],
                        payment: {
                            lastFourDigits: this.casinoDetails?.payment?.lastFourDigits,
                            expirationMonth: this.casinoDetails?.payment?.expirationMonth,
                            expirationYear: this.casinoDetails?.payment?.expirationYear,
                            postalCode: this.casinoDetails?.payment?.postalCode,
                            authorizationToken:
                                this.casinoDetails?.payment?.authorizationToken,
                            email: this.casinoDetails?.payment?.email,
                            saveCard: this.casinoDetails?.payment?.saveCard,
                            isDefault: this.casinoDetails?.payment?.isDefault,
                            preAuthorizedOnly: this.casinoDetails?.payment?.preAuthorizedOnly,
                        },

                    },
                    bid: this.casinoDetails?.userDetail?.bid,
                };
                var addCard = await API.prepaidAddCard(postData)
                if (addCard?.data?.status == true) {
                    let url = window.location.origin + "/g/" + addCard?.data?.data?.bid;
                    window.location.replace(url);
                } else if (addCard?.data?.status == false) {
                    this.alertDialog = true;
                    this.alertMsg = addCard?.data?.message;
                }
                this.odSessionLoading = false;
                // this.$router.replace({ path: 'odExtension' })
            } catch (error) {
                this.odSessionLoading = false;
                console.log(error);
            }
        },

        async getZoneDetails(searchParamKey, searchParamValue) {
            try {
                var zoneDetails = await API.getZoneDetails(searchParamKey, searchParamValue)
                this.$store.commit("SET_ZONE_DETAILS", zoneDetails?.data?.zone);
            } catch (error) {
                console.log(error);
            }
        },
        /**
             * @method getOnDemandZoneDetails fetch the ondemand zone details from Pcom and commit SET_ZONE_DETAILS mutation.
             */
        async getOnDemandZoneDetails(searchParamValue) {
            this.loading = true;
            try {
                var zoneDetails = await API.getOnDemandZoneDetails(searchParamValue);
                this.loading = false;
                if (zoneDetails.data?.lot) {
                    this.$store.commit(
                        "SET_ON_DEMAND_ZONE_DETAILS",
                        zoneDetails.data?.lot
                    );
                } else {
                    this.alertMsg =
                        zoneDetails?.data?.message || "Error in loading location details.";
                    this.alertDialog = true;
                }
            } catch (error) {
                this.loading = false;
                console.log(error);
            }
        },
        onFormSubmit() {
            this.addPaymentLoading = true;
            this.showPaymentBtn = false;
            //check US Postal code Regex
            if (this.casinoDetails?.userDetails?.estimate) {
                this.postToLoggerAPI({
                    plate: this.casinoDetails?.userDetail?.plate,
                    contact: this.casinoDetails?.userDetail?.contact,
                    statusText: "Parker clicked on ADD PAYMENT btn with postal code- " + this.postalCode + ". Last 4 characters of MID - " + this.zoneDetails.MIDs.HPS_PUBLIC_KEY_US.slice(-4),
                });
            }
            else {
                this.postToLoggerAPI({
                    plate: this.odDetails?.userDetail?.plate,
                    contact: this.odDetails?.userDetail?.contact,
                    statusText: "Parker clicked on ADD PAYMENT btn with postal code- " + this.postalCode + ". Last 4 characters of MID - " + this.zoneDetails.MIDs.HPS_PUBLIC_KEY_US.slice(-4),
                });
            }
            if (this.regex_US.test(this.postalCode)) {
                this.hps.options.publicKey = this.zoneDetails?.MIDs
                    ?.HPS_PUBLIC_KEY_US
                    ? this.zoneDetails.MIDs.HPS_PUBLIC_KEY_US
                    : "";
                if (this.casinoDetails?.userDetails?.estimate) {
                    this.postToLoggerAPI({
                        plate: this.casinoDetails?.userDetail?.plate,
                        contact: this.casinoDetails?.userDetail?.contact,
                        statusText: "Parker clicked on ADD PAYMENT btn with postal code- " + this.postalCode + ". Last 4 characters of MID - " + this.zoneDetails.MIDs.HPS_PUBLIC_KEY_US.slice(-4),
                    });
                }
                else {
                    this.postToLoggerAPI({
                        plate: this.odDetails?.userDetail?.plate,
                        contact: this.odDetails?.userDetail?.contact,
                        statusText: "Parker clicked on ADD PAYMENT btn with postal code- " + this.postalCode + ". Last 4 characters of MID - " + this.zoneDetails.MIDs.HPS_PUBLIC_KEY_US.slice(-4),
                    });
                }
                console.log("Parker clicked on ADD PAYMENT btn with postal code- " + this.postalCode)
                this.hps.tokenize();
            }
            //check CA Postal code Regex
            else if (this.regex_CA.test(this.postalCode)) {
                this.hps.options.publicKey = this.zoneDetails?.MIDs
                    ?.HPS_PUBLIC_KEY_CA
                    ? this.zoneDetails.MIDs.HPS_PUBLIC_KEY_CA
                    : "";
                this.postToLoggerAPI({
                    plate: this.odDetails?.userDetail?.plate,
                    contact: this.odDetails?.userDetail?.contact,
                    statusText: "Parker clicked on ADD PAYMENT btn with postal code- " + this.postalCode + ". Last 4 characters of MID - " + this.zoneDetails.MIDs.HPS_PUBLIC_KEY_CA.slice(-4),
                });
                console.log("Parker clicked on ADD PAYMENT btn with postal code- " + this.postalCode)
                this.hps.tokenize();
            } else {
                this.addPaymentLoading = false;
                this.showPaymentBtn = true;
                this.errDialog = true;
                this.errMsg =
                    this.postalCode.length > 0
                        ? "Invalid postal code"
                        : "Postal code cannot be empty";
            }
        },
        initHPSform() {
            var self = this;
            this.hps = new Heartland.HPS({
                type: "iframe",
                fields: {
                    cardNumber: {
                        target: "iframesCardNumber",
                        placeholder: "Enter Card Number",
                    },
                    cardExpiration: {
                        target: "iframesCardExpiration",
                        placeholder: "MM / YYYY",
                    },
                    cardCvv: {
                        target: "iframesCardCvv",
                        placeholder: "ex - 123",
                    },
                },
                // Collection of CSS to inject into the iframes.
                // These properties can match the site's styles
                // to create a seamless experience.
                style: {
                    input: {
                        background: "#fff",
                        border: "1px solid",
                        "border-color": "#bbb3b9 #c7c1c6 #c7c1c6",
                        "box-sizing": "border-box",
                        "font-family": "serif",
                        "font-size": "16px",
                        "line-height": "1",
                        margin: "0 .5em 0 0",
                        "max-width": "100%",
                        outline: "0",
                        padding: "0.5278em",
                        "vertical-align": "baseline",
                        height: "50px",
                        width: "100% !important",
                    },
                    "#heartland-field": {
                        "font-family": "sans-serif",
                        "box-sizing": "border-box",
                        display: "block",
                        height: "50px",
                        padding: "6px 6px",
                        "font-size": "14px",
                        "line-height": "1.42857143",
                        color: "#555",
                        "background-color": "#fff",
                        "border-bottom": "1px solid #ccc",
                        "border-top": "0px",
                        "border-left": "0px",
                        "border-right": "0px",
                        "border-radius": "0px",
                        // "-webkit-box-shadow": "inset 0 1px 1px rgba(0,0,0,.075)",
                        // "box-shadow": "inset 0 1px 1px rgba(0,0,0,.075)",
                        "-webkit-transition":
                            "border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s",
                        "-o-transition":
                            "border-color ease-in-out .15s,box-shadow ease-in-out .15s",
                        transition:
                            "border-color ease-in-out .15s,box-shadow ease-in-out .15s",
                        width: "100%",
                    },
                    "#heartland-field[name=submit]": {
                        "background-color": "#F1555C",
                        "font-family": "sans-serif",
                        "text-transform": "uppercase",
                        height: "50px",
                        color: "#ffffff",
                        border: "0px solid transparent",
                        "border-radius": "2px",
                        "font-weight": "bolder",
                        "font-size": "medium",
                    },
                    "#heartland-field[name=submit]:focus": {
                        "background-color": "#F1555C",
                        "font-family": "sans-serif",
                        "text-transform": "uppercase",
                        height: "50px",
                        color: "#ffffff",
                        border: "0px solid transparent !important",
                        "border-radius": "2px",
                        "font-weight": "bolder",
                        "font-size": "medium",
                    },
                    "#heartland-field[name=submit]:hover": {
                        "background-color": "#F1555C",
                        "font-family": "sans-serif",
                        "text-transform": "uppercase",
                        height: "50px",
                        color: "#ffffff",
                        border: "0px solid transparent !important",
                        "border-radius": "2px",
                        "font-weight": "bolder",
                        "font-size": "medium",
                    },
                    "#heartland-field-wrapper #heartland-field:focus": {
                        "border-left": "0px",
                        "border-top": "0px",
                        "border-right": "0px",
                        "border-bottom": "1px solid #3989e3",
                        outline: "none",
                        "box-shadow": "none",
                        height: "50px",
                    },
                    "heartland-field-wrapper #heartland-field": {
                        height: "50px",
                    },
                    "input[type=submit]": {
                        "box-sizing": "border-box",
                        display: "inline-block",
                        padding: "6px 12px",
                        "margin-bottom": "0",
                        "font-size": "14px",
                        "font-weight": "400",
                        "line-height": "1.42857143",
                        "text-align": "center",
                        "white-space": "nowrap",
                        "vertical-align": "middle",
                        "-ms-touch-action": "manipulation",
                        "touch-action": "manipulation",
                        cursor: "pointer",
                        "-webkit-user-select": "none",
                        "-moz-user-select": "none",
                        "-ms-user-select": "none",
                        "user-select": "none",
                        "background-image": "none",
                        border: "1px solid transparent",
                        "border-radius": "4px",
                        color: "#fff",
                        "background-color": "#337ab7",
                        "border-color": "#2e6da4",
                    },
                    "#heartland-field[placeholder]": {
                        "letter-spacing": "1px",
                    },
                    "::placeholder": {
                        color: "#8CA2AD",
                    },
                    "#heartland-field[name=cardCvv]": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/cvv1.png?raw=true) no-repeat right",
                        "background-size": "63px 40px",
                    },
                    "input#heartland-field[name=cardNumber]": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-inputcard-blank@2x.png?raw=true) no-repeat right",
                        "background-size": "55px 35px",
                    },
                    "#heartland-field.invalid.card-type-visa": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-visa@2x.png?raw=true) no-repeat right",
                        "background-size": "83px 88px",
                        "background-position-y": "-44px",
                    },
                    "#heartland-field.valid.card-type-visa": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-visa@2x.png?raw=true) no-repeat right top",
                        "background-size": "82px 86px",
                    },
                    "#heartland-field.invalid.card-type-discover": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-discover@2x.png?raw=true) no-repeat right",
                        "background-size": "85px 90px",
                        "background-position-y": "-44px",
                    },
                    "#heartland-field.valid.card-type-discover": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-discover@2x.png?raw=true) no-repeat right",
                        "background-size": "85px 90px",
                        "background-position-y": "1px",
                    },
                    "#heartland-field.invalid.card-type-amex": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-savedcards-amex@2x.png?raw=true) no-repeat right",
                        "background-size": "50px 90px",
                        "background-position-y": "-44px",
                    },
                    "#heartland-field.valid.card-type-amex": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-savedcards-amex@2x.png?raw=true) no-repeat right top",
                        "background-size": "50px 90px",
                    },
                    "#heartland-field.invalid.card-type-mastercard": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-mastercard.png?raw=true) no-repeat right",
                        "background-size": "62px 105px",
                        "background-position-y": "-52px",
                    },
                    "#heartland-field.valid.card-type-mastercard": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-mastercard.png?raw=true) no-repeat right",
                        "background-size": "62px 105px",
                        "background-position-y": "-1px",
                    },
                    "#heartland-field.invalid.card-type-jcb": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-jcb@2x.png?raw=true) no-repeat right",
                        "background-size": "55px 94px",
                        "background-position-y": "-44px",
                    },
                    "#heartland-field.valid.card-type-jcb": {
                        background:
                            "transparent url(https://github.com/hps/heartland-php/blob/master/examples/end-to-end/assets/images/ss-saved-jcb@2x.png?raw=true) no-repeat right top",
                        "background-size": "55px 94px",
                        "background-position-y": "2px",
                    },
                    "input#heartland-field[name=cardNumber]::-ms-clear": {
                        display: "none",
                    },
                },
                // Callback when a token is received from the service
                onTokenSuccess: function (resp) {
                    // self.postToLoggerAPI({
                    //   phone: self.bookingDetails.user.contact,
                    //   refId: self.bookingId,
                    //   statusText: "HPS token generated successfully",
                    // });
                    self.onSubmit(resp);
                },
                // Callback when an error is received from the service
                onTokenError: function (resp) {
                    self.addPaymentLoading = false;
                    self.showPaymentBtn = true;
                    self.errDialog = true;
                    self.errMsg = resp.error.message;
                    // self.postToLoggerAPI({
                    //   phone: self.bookingDetails.user.contact,
                    //   refId: self.bookingId,
                    //   error: resp.error.message,
                    //   statusText: "Error in generating HPS token.",
                    // });
                    // alert("There was an error: " + resp.error.message);
                },
                // Callback when an event is fired within an iFrame
                onEvent: function () { },
            });
        },
        navigateToCheckIn() {
            if (this.templateFlags === 'ondemand-flag') {
                this.$router.replace({ path: "/ondemand" });
            }
            else {
                // this.$router.replace({ path: `/createsession/?phone=${this.casinoDetails?.userDetail?.contact}&bid=${this.casinoDetails?.userDetail?.bid}&plate=${this.casinoDetails?.userDetail?.plate}` })
                if (!this.casinoDetails?.userDetail?.bid) {
                    this.$router.replace({ path: `/createsession` });
                }
                else {
                    // let contact = this.casinoDetails?.userDetail?.contact.substring(1, this.casinoDetails?.userDetail?.contact.length)
                    // console.log(this.casinoDetails?.userDetail)
                    // let url = window.location.origin+`/?zcode=${this.zoneDetails?.zcode}#/createsession/?phone=${contact}&bid=${this.casinoDetails?.userDetail?.bid}&plate=${this.casinoDetails?.userDetail?.plate}&entrytime=${new Date(this.casinoDetails?.userDetail?.formatEntrytime).getTime()}`
                    // window.location.replace(url)
                    // console.log(url)
                    let url = window.location.origin + `/?zcode=${this.zoneDetails?.zcode}#/createsession` + this.casinoDetails?.userDetail?.edtParams
                    window.location.replace(url)
                }
            }
        },
        async onSubmit(resp) {
            this.showPaymentBtn = false;
            let email_value = this.email.trim(); // document.getElementById("email_address").value;
            let postalCode_value = this.postalCode.trim(); //document.getElementById("postal_code").value;
            if (
                this.validateEmail(email_value) &&
                this.validatePostalCode(postalCode_value) &&
                this.validateExpDate(resp.exp_month, resp.exp_year)
            ) {
                if (resp?.token_value) {
                    this.addPaymentLoading = true;
                    let cardData = {
                        cardType: resp.card_type,
                        userDevice: "2",
                        orderType: "3",
                        entry: [
                            {
                                locationCode: this.zoneDetails.zcode,
                                startAt: '',
                                quantity: "1",
                            },
                        ],
                    };
                    // The conditional functions to check for the flags ondemand or atlantic flow
                    switch (this.templateFlags) {
                        case 'ondemand-flag': {
                            let paymentData = {
                                lastFourDigits: resp.last_four,
                                expirationMonth: resp.exp_month,
                                expirationYear: resp.exp_year,
                                postalCode: postalCode_value,
                                authorizationToken: resp.token_value,
                                email: email_value,
                                saveCard: this.defaultCreditCardCB.toString(),
                                isDefault: this.defaultCreditCardCB,
                                preAuthorizedOnly: this.autoCheckinCB
                            };
                            this.$store.commit('SET_ONDEMAND_CARDDETAILS', cardData)
                            this.$store.commit('SET_ONDEMAND_PAYMENT', paymentData);
                            if (this.templateFlags === 'ondemand-flag') {
                                localStorage.setItem("odCCDetails", JSON.stringify({ email: email_value, postalCode: postalCode_value }));
                            }
                            this.createODSession();
                            break;
                        }
                        case 'atlantic-flag': {
                            let paymentData = {
                                lastFourDigits: resp.last_four,
                                expirationMonth: resp.exp_month,
                                expirationYear: resp.exp_year,
                                postalCode: postalCode_value,
                                authorizationToken: resp.token_value,
                                email: email_value,
                                saveCard: this.defaultCreditCardCB.toString(),
                                isDefault: this.defaultCreditCardCB,
                                preAuthorizedOnly: this.autoCheckinCB
                            };
                            this.$store.commit('SET_CASINO_CARDDETAILS', cardData)
                            this.$store.commit('SET_CASINO_PAYMENT', paymentData)
                            this.casinoSession()
                            break;
                        }

                    }
                }
            }
        },
        validateExpDate(month, year) {
            if (month.length > 0 && year.length > 0) {
                return true;
            } else {
                this.errDialog = true;
                this.errMsg = "Expiration date cannot be empty.";
                this.addPaymentLoading = false;
                this.showPaymentBtn = true;
                return false;
            }
        },
        validateEmail(email) {
            const re =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(email).toLowerCase())) {
                return true;
            } else {
                this.errDialog = true;
                this.errMsg =
                    email.length > 0 ? "Invalid email" : "Email cannot be empty";
                this.addPaymentLoading = false;
                this.showPaymentBtn = true;
                return false;
            }
        },
        validatePostalCode(code) {
            if ((this.regex_US.test(code) || this.regex_CA.test(code)) && String(code).length <= 10) {
                return true;
            } else {
                this.errDialog = true;
                this.errMsg =
                    code.length > 0
                        ? "Invalid postal code"
                        : "Postal code cannot be empty";
                this.addPaymentLoading = false;
                this.showPaymentBtn = true;
                return false;
            }
        },
        openInfoDialog() {
            this.infoDialog = true;
            this.infoMsg = "By checking this box you agree to let us to securely save your credit card details so you don't have to enter them every time you visit."
        },
        openAutoCheckinInfoDialog() {
            this.infoDialog = true;
            this.infoMsg = "By checking this box you agree to let us securely save your license plate number and automatically let you in and out each time you visit.";
        }
    },
    beforeDestroy: function () {
        this.hps.dispose();
    },
};
</script>
<style lang="less">
input {
    background: "#fff";
    border: "1px solid";
    border-color: "#bbb3b9 #c7c1c6 #c7c1c6";
    box-sizing: "border-box";
    font-family: "serif";
    font-size: "16px";
    line-height: "1";
    margin: "0 .5em 0 0";
    max-width: "100%";
    outline: "0";
    padding: "0.5278em";
    vertical-align: "baseline";
    height: "50px";
    width: "100% !important";
}

#heartland-frame-cardNumber {
    width: 100% !important;
}

#heartland-frame-cardExpiration,
#heartland-frame-cardCvv {
    width: 100% !important;
}

body {
    font-family: sans-serif;
}

label[for="iframesCardNumber"],
label[for="iframesCardExpiration"],
label[for="iframesCardCvv"],
label[for="postalCode"] {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 13px;
    color: #8ca2ad;
    line-height: 1.5;
}

user agent stylesheet div {
    display: block;
}

.form-row {
    margin-top: 10px;
}

.form-wrapper {
    display: block;
    width: 100%;
    margin: 10px auto;
}

.hps_input {
    font-family: sans-serif;
    box-sizing: border-box;
    display: block;
    height: 50px;
    padding: 6px 6px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-radius: 0px;
    -webkit-transition: border-color ease-in-out 0.15s,
        -webkit-box-shadow ease-in-out 0.15s;
    -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    width: 100%;
}

.add_payment_title {
    background-color: #f7f9fa;

    span {
        font-weight: 600;
        color: #44515a;
    }
}

.hps_label {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 13px;
    color: #8ca2ad;
    line-height: 1.5;
}

.hps_input[placeholder] {
    letter-spacing: 1px;
}

.hps_input:focus {
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-bottom: 1px solid #3989e3;
    outline: none;
    box-shadow: none;
    height: 50px;
}

#heartland-frame-submit {
    border-radius: 40px;
    height: 50px !important;
    width: 100%;
}

::placeholder {
    color: #8ca2ad;
}

:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #8ca2ad;
}

::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #8ca2ad;
}
</style>