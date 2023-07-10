<template>
    <v-container fluid pa-0> <v-dialog v-model="loading" persistent>
            <v-card class="pa-4">
                <v-progress-circular indeterminate color="red"></v-progress-circular>
                <span class="ml-4" style="font-size: 14px">Please wait...</span>
            </v-card>
        </v-dialog>
        <boiler-plate>
            <div class="timing-values">
                <v-container pa-0>
                    <v-row no-gutters class="parking-time">
                        <v-col cols="12" class=" pb-0">
                            <v-container pl-10>
                                <v-row class="mx-0 pb-0" no-gutters v-if="bookingDetails.hasOwnProperty('booking') &&
                                    bookingDetails.booking.hasOwnProperty('TypeOfBooking') &&
                                    bookingDetails.booking.TypeOfBooking != 'Self reservation'">
                                    <v-col cols="10" class="pl-1">
                                        <v-row no-gutters>
                                            <v-col cols="12" class="pa-0">
                                                <v-skeleton-loader v-show="!bookingDetails.hasOwnProperty('booking') ||
                                                    timeAgo == '' ||
                                                    timeAgo == null
                                                    " height="40px" max-width="200" type="heading"></v-skeleton-loader>
                                                <p v-show="!(validatedDateTime > 0)">
                                                    <span style="font-size: 50px;font-weight: 700;">{{
                                                        timeAgo.split('min')[0] }}</span><span style="font-size: 36px;">{{
        timeAgo.split('min')[0] == '1' ||
        timeAgo.split('min')[0] == '0' ? 'Minute' : 'Minutes'
    }}</span>
                                                    <!-- <span style="font-size:96px;font-weight: 700;">{{ hours }} <span
                                                            style="font-size: 36px;font-weight: 400; "
                                                            v-if="hours !== ''">{{ hours == 1 ? 'Hour' :
                                                                'Hours' }}</span></span>
                                                    <span style="font-size:96px;font-weight: 700;"> {{ mins }} <span
                                                            style="font-size: 36px;font-weight: 400; "
                                                            v-if="mins !== ''">{{ mins == '1' ? 'Minute' : 'Minutes'
                                                            }}</span></span> -->
                                                </p>
                                                <!-- <span
                          class="grey--text text--darken-1 time_ago"
                          v-show="gracePeriodTime > 0"
                          >{{ countDownGracePeriodTime }}</span
                        >-->
                                                <span v-show="bookingDetails.hasOwnProperty('booking') &&
                                                    bookingDetails.booking.hasOwnProperty('validated') &&
                                                    bookingDetails.booking.validated == '1' &&
                                                    validatedDateTime > 0
                                                    ">{{ countDownValidatedTime }}</span>
                                            </v-col>
                                            <v-col cols="12" style="margin-top: -60px;" v-if="bookingDetails.hasOwnProperty('booking') &&
                                                validatedDateTime <= 0
                                                ">
                                                <span style="font-size:36px;">Parked</span>
                                            </v-col>
                                            <!-- <v-col cols="12" v-else-if="bookingDetails.hasOwnProperty('booking') && gracePeriodTime > 0">
                        <span class="grey--text text--darken-1 time_ago_context"
                          >Grace period remaining</span
                        >
                      </v-col>-->
                                            <v-col cols="12" v-else-if="bookingDetails.hasOwnProperty('booking') &&
                                                bookingDetails.booking.hasOwnProperty('validated') &&
                                                bookingDetails.booking.validated == '1' &&
                                                validatedDateTime > 0
                                                ">
                                                <span>Validation time
                                                    remaining</span>
                                            </v-col>
                                            <v-col cols="12" v-show="bookingDetails.hasOwnProperty('booking') &&
                                                bookingDetails.booking.hasOwnProperty('validated') &&
                                                bookingDetails.booking.validated == '1' &&
                                                bookingDetails.booking.hasOwnProperty(
                                                    'validationType'
                                                ) &&
                                                bookingDetails.booking.validationType == 'DIVRT'
                                                ">
                                                <span>Validated until {{
                                                    validated_content
                                                }}</span>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <!-- <v-col cols class="align-self-center text-center" v-show="bookingDetails.hasOwnProperty('booking') &&
                                            bookingDetails.booking.hasOwnProperty('TypeOfBooking') &&
                                            bookingDetails.booking.TypeOfBooking == 'Monthly'
                                            ">
                                        <v-btn class="elevation-0 white--text" tile x-small
                                            color="green darken-2">Monthly</v-btn>
                                    </v-col>
                                    <v-col cols class="align-self-center text-center" v-show="bookingDetails.hasOwnProperty('booking') &&
                                        bookingDetails.booking.hasOwnProperty('TypeOfBooking') &&
                                        bookingDetails.booking.TypeOfBooking == 'Employee'
                                        ">
                                        <v-btn class="elevation-0 white--text" tile x-small
                                            color="green darken-2">Employee</v-btn>
                                     </v-col> -->
                                </v-row>
                            </v-container>
                            <v-row no-gutters align="center" class="my-1">
                                <v-col cols="12" class="pa-0 align-self-center text-center">
                                    <v-btn class="elevation-0 white--text" tile x-small color="green darken-2" v-show="bookingDetails.hasOwnProperty('booking') &&
                                            bookingDetails.booking.hasOwnProperty('validated') &&
                                            bookingDetails.booking.validated == '1'
                                            ">VALIDATED</v-btn>
                                    <!-- <v-icon color="red" class="ml-2" v-show="(bookingDetails.hasOwnProperty('booking') && bookingDetails.booking.validated == '1' && showPaymentCardAdded == '1')" >approval</v-icon> -->
                                </v-col>
                            </v-row>
                            <v-row class="justify-center mb-3" no-gutters v-show="Object.hasOwnProperty.call(bookingDetails, 'zone') &&
                                !(bookingDetails.zone.isGated == '0')
                                ">
                                <span class="grey--text text--darken-1 font-weight-bold"
                                    v-if="showPaymentCardAdded && (isCheckoutEnabled(1) || isCheckoutEnabled(2) || isCheckoutEnabled(3))">Click
                                    an option below to exit</span>
                            </v-row>
                            <v-row class="justify-center my-3" no-gutters
                                v-show="!(isCheckoutEnabled(1) || isCheckoutEnabled(2) || isCheckoutEnabled(3))">
                                <span class="black--text text--darken-1 font-weight-bold text-h5">Checked In</span>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
            <v-container fluid class="text-center px-10" elevation="20">
                <v-card style="border-radius: 10px;">
                    <v-card-text v-if="bookingDetails.hasOwnProperty('booking') &&
                        bookingDetails.booking.hasOwnProperty('TypeOfBooking') &&
                        bookingDetails.booking.TypeOfBooking != 'Self reservation'">
                        <v-container>
                            <v-form>
                                <v-row no-gutters>
                                    <v-col class="text-left mb-5">
                                        <p style="font-weight: 700;font-size: 16px;"
                                            v-if="Object.hasOwnProperty.call(bookingDetails, 'zone') && Object.hasOwnProperty.call(bookingDetails.zone, 'zoneName')">
                                            <span style="font-weight:400">You
                                                have entered</span> <span>{{
                                                    bookingDetails.zone.zoneName }}</span><span style="font-weight: 400;"> with
                                                plate </span><span
                                                v-if="Object.hasOwnProperty.call(bookingDetails, 'booking') && Object.hasOwnProperty.call(bookingDetails.booking, 'vehicleNo')">{{
                                                    bookingDetails.booking.vehicleNo }}</span> <span>{{ booking_content
    }}</span>
                                        </p>
                                    </v-col>
                                </v-row>

                            </v-form>

                        </v-container>
                        <v-card-actions class="text-center justify-center px-0 pb-0 pa-0 rounded-lg" v-if="Object.hasOwnProperty.call(bookingDetails, 'booking') &&
                            !showPaymentCardAdded
                            ">
                            <v-container class="pa-0" fluid>
                                <v-row no-gutters>
                                    <v-col cols="12" 
                                        v-if="iosDevice && Object.hasOwnProperty.call(bookingDetails, 'zone') && Object.hasOwnProperty.call(bookingDetails.zone, 'paymentServices') && Object.hasOwnProperty.call(bookingDetails.zone.paymentServices, 'apple_pay') && bookingDetails.zone.paymentServices.apple_pay == '1'">
                                        <apple-pay width='100%' height="43px"
                                            :ios-device="iosDevice && Object.hasOwnProperty.call(bookingDetails, 'zone') && Object.hasOwnProperty.call(bookingDetails.zone, 'paymentServices') && Object.hasOwnProperty.call(bookingDetails.zone.paymentServices, 'apple_pay') && bookingDetails.zone.paymentServices.apple_pay == '1'"></apple-pay>
                                    </v-col>
                                    <v-col cols="12" 
                                        v-if="!iosDevice && Object.hasOwnProperty.call(bookingDetails, 'zone') && Object.hasOwnProperty.call(bookingDetails.zone, 'paymentServices') && Object.hasOwnProperty.call(bookingDetails.zone.paymentServices, 'google_pay') && bookingDetails.zone.paymentServices.google_pay == '1'">
                                        <google-pay width="100%" height="43px"></google-pay>
                                    </v-col>
                                    <v-col cols="12" >
                                        <v-btn style="font-weight:700" elevation="20"  width="100%"
                                            class="add_credit_card_btn  mb-2" @click="navigateToAddPayment"> Add
                                            Credit
                                            Card</v-btn>
                                    </v-col>
                                    <!-- <v-col cols="12" class="px-4 mt-4 color-black text-center" style="font-size: 12px"
                                    v-show="iosDevice">
                                    <p>
                                        You're only authorizing payment now. We'll charge you automatically when you
                                        checkout based on the
                                        duration of stay.
                                    </p>
                                </v-col> -->
                                    <v-col cols="12" class="mt-4 pb-2 text-center"
                                        v-if="bookingDetails.zone.isPQREndReservation == 1 && (bookingDetails.booking.TypeOfBooking == 'Guest' || bookingDetails.booking.TypeOfBooking == 'Transient')">
                                        <v-btn text color="primary"
                                            style="font-size: 13px;font-weight: bolder;text-decoration: underline;"
                                            @click="hotelGuest">
                                            <font-awesome-icon class="mr-1" icon="fa-solid fa-hotel"
                                                style="font-size: 1.5rem; color: #1E3050;" /> I am an
                                            overnight
                                            hotel guest</v-btn>

                                    </v-col>
                                    <v-col cols="12" class="mt-2 pa-0"
                                        v-if="(bookingDetails.hasOwnProperty('booking') &&
                                            bookingDetails.booking.hasOwnProperty('validated') &&
                                            bookingDetails.booking.validated != '1' &&
                                            bookingDetails.booking.isValidationEnabled == '1') || Object.hasOwnProperty.call(bookingDetails, 'zone') && Object.hasOwnProperty.call(bookingDetails.zone, 'isLoyaltySupported') && bookingDetails.zone.isLoyaltySupported == '1' && bookingDetails.booking.validated != '1' && (bookingDetails.booking.TypeOfBooking == 'Guest' || bookingDetails.booking.TypeOfBooking == 'Transient' || bookingDetails.booking.TypeOfBooking == 'Self reservation')">
                                        <v-card flat color="#F4F4F4" class="ma-0 rounded-lg pb-5" tile max-width="100%">
                                            <v-card-text class="pb-0">
                                                <v-row class="text-center pt-0" no-gutters>
                                                    <v-col cols="12" class="pa-0">
                                                        <p style="font-size: 15px;color:#0000008C;font-weight: bolder;">
                                                            CLAIM
                                                            YOUR PARKING DISCOUNT</p>
                                                    </v-col>
                                                    <v-col cols="12"
                                                        v-if="Object.hasOwnProperty.call(bookingDetails, 'zone') && Object.hasOwnProperty.call(bookingDetails.zone, 'isLoyaltySupported') && bookingDetails.zone.isLoyaltySupported == '1' && bookingDetails.booking.validated != '1' && (bookingDetails.booking.TypeOfBooking == 'Guest' || bookingDetails.booking.TypeOfBooking == 'Transient' || bookingDetails.booking.TypeOfBooking == 'Self reservation')">
                                                        <v-btn color="black" rounded class="pa-0 ma-0" width="230"
                                                            height="50" elevation="20" @click="loyalty = true">
                                                            <v-img src="@/assets/newGoldenNugget.jpg"
                                                                style="border-radius: 1.2rem;" class max-width="230"
                                                                height="60"></v-img>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                                <v-col cols="12" class="mt-1 px-4" v-show="bookingDetails.hasOwnProperty('booking') &&
                                                    bookingDetails.booking.hasOwnProperty('validated') &&
                                                    bookingDetails.booking.validated != '1' &&
                                                    bookingDetails.booking.isValidationEnabled == '1'
                                                    ">
                                                    <v-btn text style="font-size:15px;text-transform: none;" color="#3D4C56
" class="no-upper-case" @click="openValidationDialog()">Apply
                                                        Your Validation</v-btn>
                                                </v-col>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>

                            </v-container>
                        </v-card-actions>
                    </v-card-text>
                </v-card>
            </v-container>
            <footer>
                <v-row class="text-center parking.com pb-3 px-5" no-gutters>
                    <v-col cols="12" class="mt-4 text-center color-black px-4" style="font-size: 12px;" v-show="Object.hasOwnProperty.call(bookingDetails, 'zone') &&
                        !(bookingDetails.zone.isGated == '0')
                        ">
                        <p>
                            You won't be able to exit the garage until your payment method is on file.
                            Please
                            enter your payment method now to avoid slow down at exit.
                        </p>
                    </v-col>
                    <v-col cols="12" class="mt-4 text-center color-black px-4" style="font-size: 12px" v-show="Object.hasOwnProperty.call(bookingDetails, 'zone') &&
                        !(bookingDetails.zone.isGated == '1') &&
                        validatedDateTime <= 0
                        ">
                        <p>
                            A valid credit card is required to park. Without one, you
                            could be subject to a parking violation and issued a
                            citation.
                        </p>
                    </v-col>
                    <v-col cols="12" class="mt-4 color-black  text-center px-4" style="font-size: 10px" v-show="bookingDetails.hasOwnProperty('booking') &&
                        bookingDetails.booking.hasOwnProperty('validated') &&
                        bookingDetails.booking.validated == '1' &&
                        validatedDateTime > 0
                        ">
                        <p>
                            Exiting after the validated time period will require a valid
                            credit card to continue parking. Without one, you could be
                            subject to a parking violation and issued a citation.
                        </p>
                    </v-col>
                    <v-col cols="12">
                        <v-img alt="PARKING.COM" class="my-3" height="42" contain src="@/assets/logo_huge_drk.png" />
                    </v-col>
                </v-row>
            </footer>
        </boiler-plate>
    </v-container>
</template>
<script>
// import Calendar from '../uiComponents/Calendar/Calendar';
import BoilerPlate from '@/components/BoilerPlate';
// import Estimate from '../components/Estimate.vue'
import APIHelper from "@/apiHelper";
import "primevue/resources/themes/saga-blue/theme.css"       //theme
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"
import GooglePay from "@/components/GooglePay.vue";
// import loggerHelper from "../loggerHelper";
import { mapGetters } from "vuex";
// import { QrcodeStream } from "vue-qrcode-reader";
// import QrCodeScanner from "@/views/QrCodeScanner.vue";
// import ValidationQrCodeScanner from "@/views/ValidationQrCodeScanner.vue";
import ApplePay from "@/components/ApplePay.vue";
import { round } from '@/utils/util'
import { formatDateTime } from "@/utils/formatDateTime";
import { EventBus } from "@/lib/EventBus";
import {
    secondsToMs,
    secondsToHms,
    //  secondsToDHms
} from "@/utils/formatDateTime";
import { addMinutes, addDays, addHours, set } from "date-fns";
import { format, isValid } from "date-fns";
import { dateToTimeZoneDate } from "@/utils/formatDateTime";
// import QrScanner from 'qr-scanner';
export default {
    name: "CheckIn",
    components: {
        // QrCodeScanner,
        //  ValidationQrCodeScanner,
        ApplePay,
        GooglePay,
        // Calendar,
        //  Estimate 
        BoilerPlate
    },
    data: () => ({
        // rules: {
        //   counter: value => value.length <= 6 || "Max 6 characters"
        // },
        time: "",
        openTimePicker: false,
        openDatePicker: false,
        minTimeDate: null,
        maxTimeDate: null,
        beforeEstimate: null,
        currentDate: format((new Date()), 'yyyy-MM-dd'),
        loyalty24knum: "",
        alertIcon: "mdi-check-circle",
        alertDialog: false,
        alertMsg: "",
        loyalty: false,
        extDateAndTime: null,
        extendBtnLoading: false,
        loading: false,
        extensionDialog: false,
        stopTime: "",
        exitTimeSelected: {},
        timePickerHrRange: null,
        timeExceeded: false,
        timePickerMinRange: null,
        minDate: null,
        maxDate: null,
        Timemenu: false,
        startDate: "",
        maxDateTime: null,
        estimate: null,
        Datemenu: false,
        exitDate: null,
        dateFormatted: null,
        exitDateTime: 0,
        exitTimeInterval: null,
        iosDevice: false,
        invalidValidationQRDialog: false,
        cameraStatus: false,
        validationCameraStatus: false,
        validatedDateTime: 0,
        gracePeriodTime: 0,
        validatedInterval: "",
        duration: 300,
        offset: 0,
        pedestrianAccessDialog: false,
        pedestrianAccessText: "",
        easing: "easeInOutCubic",
        pageHeight: window.outerHeight,
        qrCodeDialog: false,
        countUpTime: "",
        interval: "",
        isValid: undefined,
        camera: "auto",
        smsText: "",
        smsDialog: false,
        dialerDialog: false,
        invalidQRMsg: "",
        invalidValidationQRMsg: "",
        invalidQRDialog: false,
        invalidSMSMsg: "",

        invalidSMSDialog: false,
        smsPending: false,
        validateBookingPending: false,
        validateBookingDialog: false,
        validateBookingTxt: "",
        validateQRCodePending: false,
        validateQRCodeDialog: false,
    }),
    computed: {
        ...mapGetters({
            bookingId: "getterBookingId",
            bookingDetails: "getterBookingDetails",
            zoneDetails: "getterZoneDetails",
            entryTime: "getterEntryTime",
            exitGateCodes: "getterExitGateCodes",
            isPQREndReservation: "getterZoneIsPQREndReservation",

        }),
        logoHeight() {
            return Object.hasOwnProperty.call(this.bookingDetails, 'booking') && Object.hasOwnProperty.call(this.bookingDetails.booking, 'TypeOfBooking') && this.bookingDetails.booking.TypeOfBooking == 'Self reservation' ? '100px' : '150px';
        },
        computedDateFormatted() {
            return this.time !== null && this.time !== "" && this.time !== undefined ? format(this.time, 'yyyy/MM/dd') : new Date()
        },
        formattedTime() {
            return this.time ? format(this.time, 'hh:mm aa') : ""
        },
        formattedDateTime() {
            return this.time !== null && this.time !== "" ? format(this.time, 'iii, LLL dd') : ""
        },
        formattedYear() {
            return this.time !== null && this.time !== "" ? format(this.time, 'yyyy') : ""
        },
        formattedEntryDisplayTime() {
            return Object.hasOwnProperty.call(this.bookingDetails, 'booking') && Object.hasOwnProperty.call(this.bookingDetails.booking, 'entrytime') && this.bookingDetails.booking.entrytime !== null && this.bookingDetails.booking.entrytime !== undefined && this.bookingDetails.booking.entrytime !== "" ? format(new Date(this.formatDateTime(this.bookingDetails?.booking?.entrytime, 'date')), "hh:mm a") : format(dateToTimeZoneDate(new Date(), this.bookingDetails?.zone?.timezone), 'hh:mm a');
        },
        singleQuotes() {

            return Object.hasOwnProperty.call(this.bookingDetails, 'zone') && Object.hasOwnProperty.call(this.bookingDetails.zone, 'timePickerConfiguration') && this.bookingDetails.zone.timePickerConfiguration == "0" ? ((this.time !== null && this.time !== undefined && this.time !== "" && this.minDate !== null && this.minDate !== undefined && this.minDate !== "" && format(this.time, 'yyyy-MM-dd') == format(this.minDate, 'yyyy-MM-dd')) || (this.beforeEstimate !== null && this.beforeEstimate !== undefined && this.beforeEstimate !== "" && this.estimate !== null && this.estimate !== undefined && this.estimate !== "" && this.beforeEstimate.grandTotal == this.estimate.grandTotal)) : true
        },
        doubleQuotes() {
            return Object.hasOwnProperty.call(this.bookingDetails, 'zone') && Object.hasOwnProperty.call(this.bookingDetails.zone, 'timePickerConfiguration') && this.bookingDetails.zone.timePickerConfiguration == "0" ? ((this.time !== null && this.time !== undefined && this.time !== "" && this.minDate !== null && this.minDate !== undefined && this.minDate !== "" && format(this.time, 'yyyy-MM-dd') != format(this.minDate, 'yyyy-MM-dd')) && (this.beforeEstimate !== null && this.beforeEstimate !== undefined && this.beforeEstimate !== "" && this.estimate !== null && this.estimate !== undefined && this.estimate !== "" && this.beforeEstimate.grandTotal != this.estimate.grandTotal)) : false
        },
        disableLoyalty() {
            let disabled = this.loyalty24knum === undefined || this.loyalty24knum === null || this.loyalty24knum == ""
            return disabled
        },
        disableExtend() {
            let disabled = (
                this.time === null || this.time === "" || this.time === undefined || this.estimate === null || this.estimate === undefined || Object.keys(this.estimate).length === 0) || (this.bookingDetails?.zone?.timePickerConfiguration == '0' && (format(this.time, 'yyyy-MM-dd') == format(this.maxDate, 'yyyy-MM-dd')) ? true : false)
            return disabled;
        },
        countDownExitTime() {
            if (this.exitDateTime < 0) {
                this.$store.commit("SET_VALIDATED_TIME_STATUS", true);
                clearInterval(this.exitTimeInterval);
            }
            return secondsToHms(this.exitDateTime / 1000 + 59);
        },
        countDownEstimateTime() {
            if (this.exitDateTime < 0) {
                this.$store.commit("SET_VALIDATED_TIME_STATUS", true);
                clearInterval(this.exitTimeInterval);
            }
            return secondsToHms(this.exitDateTime / 1000 + 59);
        },
        isExtra() {
            return window.location.pathname.includes("/gx/");
        },
        options() {
            return {
                duration: this.duration,
                offset: this.offset,
                easing: this.easing,
            };
        },
        showPaymentCardAdded: function getCardStatus() {
            var cardOnFile = this.bookingDetails?.booking?.cardOnfile
                ? this.bookingDetails.booking.cardOnfile
                : null;
            var validatedState = this.bookingDetails?.booking?.validated
                ? this.bookingDetails.booking.validated
                : null;
            var state =
                cardOnFile == "1"
                    ? true
                    : cardOnFile == "2" &&
                    validatedState == "1" &&
                    this.validatedDateTime > 0;
            return state;
        },
        days() {
            if (this.timeAgo[0] !== '' && this.timeAgo[0] != null && this.timeAgo[0] !== undefined) {
                return this.timeAgo[0]
            }
            return '';
        },
        hours() {
            // if (this.bookingDetails?.booking?.TypeOfBooking !== 'Self reservation') {
            //     return this.timeAgo.includes('h') ? this.timeAgo.split('h')[0] : ''
            // }
            // else {
            if (this.timeAgo[1] !== '' && this.timeAgo[1] != null && this.timeAgo[1] !== undefined) {
                return this.timeAgo[1]
            }
            // }
            return '';
        },
        mins() {
            // if (this.bookingDetails?.booking?.TypeOfBooking !== 'Self reservatiion') {
            //     let h = this.timeAgo.includes('h') ? this.timeAgo.split('h')[1] : this.timeAgo;
            //     return h.split('min')[0]
            // }

            // else {
            if (this.timeAgo[2] !== '' && this.timeAgo[2] != null && this.timeAgo[2] !== undefined) {
                return this.timeAgo[2].includes('mins') ? [this.timeAgo[2].split('mins')[0], 'mins'] : [this.timeAgo[2].split('min')[0], 'min']
            }
            // }
            return '';
        },

        timeAgo: function getTimeAgo() {
            return this.countUpTime;
        },
        validationPending: function qrValidation() {
            return this.isValid === undefined && this.camera === "off";
        },
        booking_content() {
            let dateTime = formatDateTime(
                Number(this.bookingDetails.booking.entrytime)
            );
            return " on " + dateTime[1] + " " + dateTime[2] + " " + dateTime[0];
        },
        checkin_content() {
            return this.formatDateTime(this.bookingDetails.booking.entrytime, 'checkin');
        },
        checkout_content() {
            return 'Checkout before ' + this.formatDateTime(this.bookingDetails.booking.revEnd, 'expire')
        },
        validated_content() {
            if (this.bookingDetails?.zone?.timezoneoffset) {
                let dateTime = this.bookingDetails.booking.type == "13" ? formatDateTime(
                    Number(this.bookingDetails.booking.revStart) +
                    Number(this.bookingDetails.booking.couponValidTime)
                ) : formatDateTime(
                    Number(this.bookingDetails.booking.entrytime) +
                    Number(this.bookingDetails.booking.couponValidTime)
                );
                return dateTime[0] + ", " + dateTime[1] + " " + dateTime[2];
            }
            return "";
        },
        countDownValidatedTime() {
            if (this.validatedDateTime < 0) {
                this.$store.commit("SET_VALIDATED_TIME_STATUS", true);
                clearInterval(this.validatedInterval);
            }
            return secondsToHms(this.validatedDateTime / 1000 + 59);
        },
        countDownGracePeriodTime() {
            if (this.gracePeriodTime < 0) {
                this.$store.commit("SET_GRACE_PERIOD_TIME_STATUS", true);
                clearInterval(this.gracePeriodInterval);
            }
            //add 59 sec to graceperiod time to skip 0 min.
            return secondsToHms(this.gracePeriodTime / 1000 + 59);
        },
        // gracePeriodCountDownTime,
        // countDownValidationtime(){
        //   return
        // }
    },
    watch: {
        time(newVal, oldVal) {
            if (oldVal != null && newVal != null && oldVal != newVal && oldVal != "" && newVal != "" && (isValid(newVal))) {
                this.bookingDetails?.zone?.timePickerConfiguration == '1' ? round(newVal) : set(newVal, { hour: 23, minutes: 59, seconds: 59 })
            }
        },
    },
    created() { },
    mounted: function () {
        EventBus.$on('SET_TIME', () => {
            this.onTimePickerChange();
        })
        this.exitDateTime = this.calculateExitDateTime();
        this.exitTimeInterval = setInterval(() => {
            if (
                this.bookingDetails?.zone?.timezone

            ) {
                this.exitDateTime = this.calculateExitDateTime();
            }
        }, 1000);
        if (
            this.entryTime != null &&
            !this.bookingDetails?.booking?.exittime &&
            this.bookingDetails?.zone?.timezone &&
            this.bookingDetails?.booking?.gracePeriod
        ) {
            this.countUpTime = this.calculateParkingTime(
                this.entryTime,
                this.bookingDetails.booking.gracePeriod,
                this.bookingDetails.zone.timezone
            );
        }
        this.interval = setInterval(() => {
            if (
                this.entryTime != null &&
                !this.bookingDetails?.booking?.exittime &&
                this.bookingDetails?.zone?.timezone &&
                this.bookingDetails?.booking?.gracePeriod
            ) {
                this.countUpTime = this.calculateParkingTime(
                    this.entryTime,
                    this.bookingDetails.booking.gracePeriod,
                    this.bookingDetails.zone.timezone
                );
            }
        }, 1000);
        if (
            this.bookingDetails?.booking?.exittime &&
            this.bookingDetails.booking.exittime != null &&
            this.bookingDetails.booking.exittime != ""
        ) {
            clearInterval(this.interval);
        }
        if (
            this.bookingDetails?.booking?.validated &&
            this.bookingDetails.booking.validated == "1" &&
            this.bookingDetails?.booking?.validationType &&
            this.bookingDetails.booking.validationType == "DIVRT"
        ) {
            this.validatedDateTime = this.calculateValidatedTime();
        }

        this.validatedInterval = setInterval(() => {
            if (
                this.bookingDetails?.zone?.timezone &&
                this.bookingDetails?.booking?.validated &&
                this.bookingDetails.booking.validated == "1" &&
                this.bookingDetails?.booking?.validationType &&
                this.bookingDetails.booking.validationType == "DIVRT"
            ) {
                this.validatedDateTime = this.calculateValidatedTime();
            }
        }, 1000);
        if (
            this.bookingDetails?.booking?.validated &&
            this.bookingDetails.booking.validated == "1" &&
            this.bookingDetails?.booking?.validationType &&
            this.bookingDetails.booking.validationType == "DIVRT"
        ) {
            if (this.validatedDateTime < 0) {
                this.$store.commit("SET_VALIDATED_TIME_STATUS", true);
                clearInterval(this.validatedInterval);
            }
        }

        if (this.bookingDetails?.booking?.gracePeriod > 0) {
            this.gracePeriodTime = this.calculateGracePeriodTime();
        }

        this.gracePeriodInterval = setInterval(() => {
            if (this.bookingDetails?.zone?.timezone) {
                this.gracePeriodTime = this.calculateGracePeriodTime();
            }
        }, 1000);
        if (this.bookingDetails?.booking?.gracePeriod > 0) {
            if (this.gracePeriodTime < 0) {
                this.$store.commit("SET_GRACE_PERIOD_TIME_STATUS", true);
                clearInterval(this.gracePeriodInterval);
            }
        }
        EventBus.$on("sms-qr-result", (result) => {
            this.onDecode(result);
        });
        EventBus.$on("validation-qr-result", (result) => {
            this.onValidateQRCode(result);
        });

        // if(this.bookingDetails?.zone?.isPedestrian=='1'){
        //   this.pedestrianAccess=true
        // }
    },
    destroyed() {
        clearInterval(this.interval);
        clearInterval(this.validatedInterval);
        clearInterval(this.gracePeriodInterval);
    },
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            vm.getMobileOperatingSystem() === 'iOS' ? vm.iosDevice = true : vm.iosDevice = false;
            if (
                vm.bookingDetails?.booking?.exittime &&
                vm.bookingDetails.booking.exittime != null &&
                vm.bookingDetails.booking.exittime != ""
            ) {
                clearInterval(vm.interval);
            }
            if (vm.bookingDetails?.booking?.validated == "0") {
                if (vm.validatedDateTime < 0) {
                    vm.$store.commit("SET_VALIDATED_TIME_STATUS", true);
                    clearInterval(vm.validatedInterval);
                }
            }
        });
    },
    methods: {
        loyaltyValid() {
            if (!(/^[a-z0-9]+$/i).test(this.loyalty24knum)) {
                this.loyalty24knum = this.loyalty24knum.replace(/[^\w\s]/gi, '')
            }
        },
        async submitLoyalty(code) {
            try {
                this.validateBookingPending = true;
                let result = await this.validateBooking(code);
                if (!result.data.status) {
                    this.invalidSMSMsg = result?.data?.message
                        ? result.data.message
                        : "Validation not recognized. Please try again";
                    this.invalidSMSDialog = true;
                    this.validateBookingPending = false;
                    this.postToLoggerAPI({
                        phone: this.bookingDetails.user.contact,
                        refId: this.bookingId,
                        error: this.invalidSMSMsg,
                        icon: "redeem",
                        statusText:
                            "Error in validating the session on entering validation code - " +
                            this.validateBookingTxt,
                    });
                } else {
                    this.postToLoggerAPI({
                        phone: this.bookingDetails.user.contact,
                        refId: this.bookingId,
                        icon: "redeem",
                        statusText:
                            "Parker validated the session successfully by entering validation code - " +
                            this.validateBookingTxt,
                    });
                    this.validateBookingPending = false;
                    this.validateBookingDialog = false;
                    this.$store.commit(
                        "SET_VALIDATED_MERCHANT",
                        result?.data?.merchantName
                    );
                    this.$router.replace({ path: "/validatesuccess" });
                }
            } catch (error) {
                console.log(error);
                this.validateBookingPending = false;
            }
        },
        closeAlertDialog() {
            this.alertDialog = false;

        },
        getPaymentType(type) {
            switch (type) {
                case 'APPLE_PAY': {
                    return 'Apple Pay';
                }
                case 'GOOGLE_PAY': {
                    return 'Google Pay'
                }
                case 'Card': {
                    return 'Card'
                }
            }
        },

        /** @methods to find the the UTC date 
    @params the bookings date value , type 'exit (2023-12-02)' or 'formatdate (12/02/2023)'
    */
        formatUTCDefaultDate(defaultDate, type) {
            let utcDate = new Date(defaultDate * 1000).toUTCString();
            let month = utcDate.split(",")[1].split(" ")[2]; // Jan
            let date = utcDate.split(",")[1].split(" ")[1]; // 27
            let year = utcDate.split(",")[1].split(" ")[3]; //2023
            let exitformat = format(new Date(month + " " + date + " " + year), 'yyyy-MM-dd');
            let dateformat = format(new Date(month + " " + date + " " + year), "MM/dd/yyyy");
            return type === "exit" ? exitformat : dateformat;

        },
        async extendEDT() {
            try {
                //format(new Date(this.checkinDate), "yyyy-MM-dd'T'HH:mm:ss");
                this.extendBtnLoading = true;
                let timeconfig = format(this.time, 'yyyy/MM/dd') + " " + "11:59 PM";
                let time = this.bookingDetails?.zone?.timePickerConfiguration == '0' ? new Date(timeconfig) : this.time
                let exitDateTime = time != null || time !== undefined || time != "" ?
                    format(time, 'yyyy/MM/dd')
                    +
                    " " +
                    format(time, 'hh:mm a') : new Date();
                let data = {
                    bid: this.bookingDetails?.booking?.bid,
                    extendedTime: format(new Date(exitDateTime), "yyyy-MM-dd HH:mm:ss")//"2022-12-29T02:26:00.000",
                };
                var extendSessionRes = await APIHelper(
                    "POST",
                    "/api/v1/prepaid/extendReservation", data
                );
                if (extendSessionRes?.data?.message == "Successfully updated!!") {
                    await this.getBookingDetails();
                    this.extendBtnLoading = false;
                    this.extensionDialog = false;
                } else {
                    this.alertDialog = true;
                    this.alertMsg = extendSessionRes?.data?.message || "Error in extending the session"
                }

            } catch (error) {
                this.extendBtnLoading = false;
                console.log(error);
            }
        },
        formatDate(date) {
            let stringdate = date.toString();
            if (!date) return null;

            const [year, month, day] = stringdate.split("-");
            return `${month}/${day}/${year}`;
        },
        parseDate(date) {
            if (!date) return null;

            const [month, day, year] = date.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        },
        async openExtDialog() {

            // await axios.get(
            //   process.env.VUE_APP_ON_DEMAND_URL + "/" + "32899"+ ".json"
            // );
            this.setDefaultDate();
            this.setDatePicker();
            // this.setTimePicker();
            this.extensionDialog = true;
            this.extendBtnLoading = false;
        },

        setDefaultDate() {
            //formatted exit date value to display
            this.dateFormatted =
                this.bookingDetails?.booking?.reservationEndDate ? this.formatUTCDefaultDate(this.bookingDetails?.booking?.revEnd
                    , 'format') : "";
            this.time = new Date(this.formatDateTime(this.bookingDetails?.booking?.revEnd, 'date'))
            this.exitDate = this.time;
            let fifteenTime = this.time;

            this.time = format(this.time, 'mm') == '15' || format(this.time, 'mm') == '30' || format(this.time, 'mm') == '45' || format(this.time, 'mm') == '00' ? fifteenTime : this.bookingDetails?.zone?.timePickerConfiguration == '1' ? round(this.time) : set(this.time, { hour: 23, minutes: 59, seconds: 59 });
            // this.dateTimeChange()
            // Object.hasOwnProperty.call(this.bookingDetails.booking, 'isGated') && this.bookingDetails.booking?.isGated == "1" && format(this.time, 'yyyy-MM-dd') != format(dateToTimeZoneDate(new Date(), this.bookingDetails?.zone?.timezone), 'yyyy-MM-dd') ? this.beforeDateTimeChange() : "";

        },
        onTimePickerChange() {
            let exitdate = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'yyyy/MM/dd') : "";
            let selectedMins = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'mm') : "";
            let selectedHours = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'HH') : "";
            let selectedAMPM = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'a') : "";
            this.stopTime = selectedMins != null && selectedMins != "" && selectedHours != null && selectedHours != "" && selectedAMPM != null && selectedAMPM != "" ? selectedHours + ":" + selectedMins + ":" + "00" : "";
            let currenTime = this.bookingDetails.zone.timezone
                ? format(
                    dateToTimeZoneDate(new Date(),
                        this.bookingDetails.zone.timezone
                    ),
                    "yyyy-MM-dd HH:mm:ss"
                )
                : format(new Date(), "yyyy-MM-dd  HH:mm:ss");
            if (
                selectedMins != null && selectedMins != "" && selectedHours != null && selectedHours != "" && selectedAMPM != null && selectedAMPM != "" &&
                new Date(exitdate + " " + this.stopTime).getTime() >
                new Date(currenTime).getTime()
            ) {
                format(this.time, 'yyyy-MM-dd') != format(this.minDate, 'yyyy-MM-dd') ? this.beforeDateTimeChange() : "";
                this.dateTimeChange();
            }
        },
        setDatePicker() {
            //set the minimum date to today date(zone time zone date)
            this.minDate = this.bookingDetails.zone.timezone
                ?
                new Date(this.formatDateTime(this.bookingDetails?.booking?.revEnd, 'date'))
                :
                dateToTimeZoneDate(
                    new Date(Number(this.bookingDetails?.booking?.revEnd) * 1000 - Number(this.bookingDetails.zone.timezoneoffset) * 1000)
                    , this.bookingDetails.zone.timezone
                );
            //calculate max parkign time in seconds
            let maxPark = this.bookingDetails != null ? this.bookingDetails?.zone?.maxParkingTime : null;

            let addeddays = addDays(new Date(), maxPark?.days);
            let addedhours = addHours(addeddays, maxPark?.hours);
            let addedmins = addMinutes(addedhours, maxPark?.minutes);
            //get max date in seconds based on max parking time
            let maxZoneDate = addedmins;
            this.maxDate = this.bookingDetails?.zone.timezone
                ?
                dateToTimeZoneDate(
                    maxZoneDate,
                    this.bookingDetails?.zone?.timezone
                )
                : new Date(maxZoneDate);
            //get max date with time and set it to maxDateTime
            this.maxDateTime = this.bookingDetails?.zone?.timezone
                ? format(
                    dateToTimeZoneDate(
                        new Date(maxZoneDate),
                        this.bookingDetails?.zone?.timezone
                    ),
                    "yyyy-MM-dd hh:mm aaaaa"
                )
                : format(new Date(), "yyyy-MM-dd hh:mm aaaaa");
        },
        // onOpen() {
        //   this.setTimePicker(this.exitTimeSelected);
        // },
        /** @methods to find the estimate rate 
       @params startDate , stopDate,zcode, type , env_overRide
       */
        async beforeDateTimeChange() {
            if (!this.bookingDetails.zone.zcode) {
                return
            }
            try {
                // format(new Date(this.checkinDate), "yyyy-MM-dd'T'HH:mm:ss");

                let edtEntryTime = this.bookingDetails?.booking?.entrytime
                this.startDate = edtEntryTime !== null && edtEntryTime !== undefined && edtEntryTime !== "" ? format(new Date(this.formatDateTime(edtEntryTime, 'date')), "yyyy-MM-dd'T'HH:mm:ss") : this.bookingDetails.zone.timezone
                    ? format(
                        dateToTimeZoneDate(
                            new Date(),
                            this.bookingDetails.zone.timezone
                        ),
                        "yyyy-MM-dd'T'HH:mm:ss"
                    )
                    : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
                let stopTime = this.stopTime
                let selectedHours = this.bookingDetails.booking.entrytime != null && this.bookingDetails.booking.entrytime !== undefined && this.bookingDetails.booking.entrytime != "" ? format(new Date(this.formatDateTime(this.bookingDetails?.booking?.entrytime, 'date')), "HH") : format(dateToTimeZoneDate(new Date(), this.bookingDetails.zone.timezone), 'HH');
                let selectedMins = this.bookingDetails.booking.entrytime != null && this.bookingDetails.booking.entrytime !== undefined && this.bookingDetails.booking.entrytime != "" ? format(new Date(this.formatDateTime(this.bookingDetails?.booking?.entrytime, 'date')), "mm") : format(dateToTimeZoneDate(new Date(), this.bookingDetails.zone.timezone), 'mm');
                let exittime = Object.hasOwnProperty.call(this.bookingDetails, 'zone') && Object.hasOwnProperty.call(this.bookingDetails.zone, 'timePickerConfiguration') && this.bookingDetails.zone.timePickerConfiguration == '1' ? 'T' + stopTime : 'T' + selectedHours + ":" + selectedMins + ":00";
                let exitdate = format(this.time, 'yyyy-MM-dd');
                let stopDate = exitdate + exittime;
                let data = {
                    startAt: this.startDate,
                    stopAt: stopDate,
                    zcode: this.bookingDetails.zone.zcode,
                };
                this.addPaymentBtnLoading = true;
                var getRate = await APIHelper("POST", "/api/v2/getRate", data);
                //condition to check if the date time selected is lesser than current time
                if (!getRate?.data?.status && !this.getRateCall) {
                    this.disableAddPaymentBtn = true;
                    this.alertDialog = true;
                    this.alertMsg =
                        getRate?.data?.message || "Error in getting rate details";
                    this.openDatePicker = false;
                    this.openTimePicker = false;
                } else {
                    this.disableAddPaymentBtn = false;
                    this.openDatePicker = false;
                    this.openTimePicker = false;
                }
                this.beforeEstimate = Object.assign({}, getRate?.data?.data);
                // estimatedVal != "" &&
                // estimatedVal != null &&
                // estimatedVal != undefined
                //   ? Number(estimatedVal).toFixed(2)
                //   : estimatedVal;
                this.addPaymentBtnLoading = false;
            }
            catch (error) {
                this.addPaymentBtnLoading = false;
                console.log(error);
            }
        },
        async dateTimeChange() {
            if (!this.bookingDetails.zone.zcode) {
                return
            }
            this.extendBtnLoading = true;

            try {
                // format(new Date(this.checkinDate), "yyyy-MM-dd'T'HH:mm:ss");
                let edtEntryTime = this.bookingDetails?.booking?.entrytime
                this.startDate = edtEntryTime !== null && edtEntryTime !== undefined && edtEntryTime !== "" ? format(new Date(this.formatDateTime(edtEntryTime, 'date')), "yyyy-MM-dd'T'HH:mm:ss") : this.bookingDetails.zone.timezone
                    ? format(
                        dateToTimeZoneDate(
                            new Date(),
                            this.bookingDetails.zone.timezone
                        ),
                        "yyyy-MM-dd'T'HH:mm:ss"
                    )
                    : format(dateToTimeZoneDate(new Date(), this.bookingDetails.zone.timezone), "yyyy-MM-dd'T'HH:mm:ss");
                // console.log(this.exitTimeSelected?.hh+":"+this.exitTimeSelected.mm+":00")
                // this.exitDate + "T23:59:00";
                let selectedHours = this.time !== null && this.time !== "" && this.time !== undefined ? format(this.time, 'HH') : format(dateToTimeZoneDate(new Date(), this.bookingDetails.zone.timezone), 'HH')
                let selectedMins = this.time !== null && this.time !== "" && this.time !== undefined ? format(this.time, 'mm') : format(dateToTimeZoneDate(new Date(), this.bookingDetails.zone.timezone), 'mm')
                let exitdate = this.time !== null && this.time !== "" && this.time !== undefined ? format(this.time, 'yyyy-MM-dd') : "";
                let exittime = Object.hasOwnProperty.call(this.bookingDetails, 'zone') && Object.hasOwnProperty.call(this.bookingDetails.zone, 'timePickerConfiguration') && this.bookingDetails?.zone?.timePickerConfiguration == '1' ? 'T' + selectedHours + ":" + selectedMins + ":00" : "T23:59:00"
                let stopDate = exitdate + exittime;

                let data = {
                    startAt: this.startDate,
                    stopAt: stopDate,
                    zcode: this.bookingDetails?.zone?.zcode,
                };
                this.addPaymentBtnLoading = true;
                var getRate = await APIHelper("POST", "/api/v2/getRate", data);
                this.extendBtnLoading = false;
                this.extDateAndTime = stopDate;
                //condition to check if the date time selected is lesser than current time
                if (!getRate?.data?.status && !this.getRateCall) {
                    this.disableAddPaymentBtn = true;
                    this.alertDialog = true;
                    this.alertMsg =
                        getRate?.data?.message || "Error in getting rate details";
                    this.openDatePicker = false;
                    this.openTimePicker = false;
                    EventBus.$emit('datetime-set');
                } else {
                    this.disableAddPaymentBtn = false;
                    this.openDatePicker = false;
                    this.openTimePicker = false;
                    EventBus.$emit('datetime-set');
                }
                this.estimate = Object.assign({}, getRate?.data?.data);
                // estimatedVal != "" &&
                // estimatedVal != null &&
                // estimatedVal != undefined
                //   ? Number(estimatedVal).toFixed(2)
                //   : estimatedVal;
                this.addPaymentBtnLoading = false;
            }
            catch (error) {
                this.addPaymentBtnLoading = false;
                console.log(error);
            }
        },
        calculateExitDateTime() {
            if (this.bookingDetails?.zone?.timezone) {
                //   var currentTime =
                // new Date().getTime() +
                // (Number(this.bookingDetails.zone.timezoneoffset) * 1000 +
                //   Number(this.bookingDetails.zone.timezonedstoffset) * 1000);
                var currentTime =
                    new Date().getTime() +
                    (Number(this.bookingDetails.zone.timezoneoffset) * 1000 +
                        Number(this.bookingDetails.zone.timezonedstoffset) * 1000);
                var exitTime =
                    new Date(this.bookingDetails.booking.reservationEndDate).getTime();
                this.$store.commit("SET_EXIT_TIME_TIME_STATUS", this.exitDateTime < 0);
                exitTime - currentTime < 0
                    ? clearInterval(this.exitInterval)
                    : "";
                return exitTime - currentTime;
            }
            return 0

        },
        hotelGuest() {
            let url = window.location.origin + '?zcode=' + this.bookingDetails?.zone?.locationCode + '#/createsession';
            let plate = this.bookingDetails?.booking?.vehicleNo || "";
            let phone = this.bookingDetails?.user?.contact || "";
            let bid = this.bookingDetails?.booking?.bid || "";
            let checkindate = this.bookingDetails?.booking?.entrytime || "";
            let params = '/?phone=' + phone + '&bid=' + bid + '&plate=' + plate + '&entrytime=' + checkindate;
            window.location.replace(url + params);
            // this.$router.replace({path:'/'});

        },
        closeQRCodeDialog() {
            this.qrCodeDialog = false;
            this.cameraStatus = false;
        },
        closeValidationQRDialog() {
            this.validationCameraStatus = false;
            this.validateBookingDialog = true;
            this.validateQRCodeDialog = false;
        },
        reScanQR() {
            this.invalidQRDialog = false;
            this.cameraStatus = true;
        },
        reScanValidationQR() {
            this.invalidValidationQRDialog = false;
            this.validationCameraStatus = true;
        },
        openSmsQrScanner() {
            this.qrCodeDialog = true;
            this.cameraStatus = true;
        },
        openSMSDialog() {
            this.smsDialog = true;
            let exitLanes =
                this.exitGateCodes.length > 0
                    ? this.exitGateCodes.filter((a) => a.isPedestrian == "0")
                    : [];
            if (
                this.bookingDetails?.booking?.prePopulateGateCodes &&
                this.bookingDetails.booking.prePopulateGateCodes == "1"
            ) {
                this.smsText = exitLanes.length == 1 ? exitLanes[0].sms_code : "";
            }
        },
        scrollToSubmit() {
            const el = document.querySelector("#submitsmsbtn");
            if (el) {
                el.scrollIntoView(this.options);
            }
        },
        scrollToValidateBtn() {
            const el = document.querySelector("#validatebookingbtn");
            if (el) {
                el.scrollIntoView(this.options);
            }
        },
        calculateGracePeriodTime() {
            var currentTime =
                new Date().getTime() +
                (Number(this.bookingDetails.zone.timezoneoffset) * 1000 +
                    Number(this.bookingDetails.zone.timezonedstoffset) * 1000);
            var gracePeriodTime =
                (Number(this.bookingDetails.booking.entrytime) +
                    Number(this.bookingDetails.booking.gracePeriod)) *
                1000; //
            this.$store.commit(
                "SET_GRACE_PERIOD_TIME_STATUS",
                this.gracePeriodTime <= 0
            );
            return gracePeriodTime - currentTime;
        },
        calculateValidatedTime() {
            var currentTime =
                new Date().getTime() +
                (Number(this.bookingDetails.zone.timezoneoffset) * 1000 +
                    Number(this.bookingDetails.zone.timezonedstoffset) * 1000);
            var validatedTime = this.bookingDetails.booking.type == "13" ?
                (Number(this.bookingDetails.booking.revStart) +
                    Number(this.bookingDetails.booking.couponValidTime)) *
                1000 : (Number(this.bookingDetails.booking.entrytime) +
                    Number(this.bookingDetails.booking.couponValidTime)) *
                1000
            this.$store.commit("SET_VALIDATED_TIME_STATUS", this.validatedTime < 0);
            validatedTime - currentTime < 0
                ? clearInterval(this.validatedInterval)
                : "";
            return validatedTime - currentTime;
        },
        calculateParkingTime(parkingStartTime, gracePeriod, zone) {
            var currentTime = new Date();
            currentTime.toLocaleString("en-US", { timeZone: zone });
            var differenceTime =
                gracePeriod > 0
                    ? currentTime.getTime() - parkingStartTime * 1000 // - gracePeriod * 1000 to exclude grace period
                    : currentTime.getTime() - parkingStartTime * 1000;
            let parkedTime = secondsToMs(differenceTime / 1000);
            return parkedTime;
        },
        isCheckoutEnabled(type) {
            if (Object.hasOwnProperty.call(this.bookingDetails, 'exitOptions') && this.bookingDetails.exitOptions.length != 0) {
                let option = this.bookingDetails.exitOptions.some(
                    (t) => t.techType == type
                );
                return option;
            }
            return false;

        },
        async getBookingDetails() {
            try {
                let bookingId = window.location.pathname.substring(3);
                var bookingDetails = await APIHelper(
                    "GET",
                    "/api/v1/booking/config/" + bookingId
                );
                this.$store.commit(
                    "SET_BOOKING_DETAILS",
                    bookingDetails.data?.data ? bookingDetails.data.data : null
                );
            } catch (error) {
                console.log(error);
            }
        },
        async getpedestrianAccess() {
            try {
                // let bookingId = window.location.pathname.substring(3);
                var pedesAccess = await APIHelper(
                    "POST",
                    "api/v1/open/" + this.bookingId,
                    { source: "webView" }
                );
                // console.log(pedesAccess)
                // console.log(pedesAccess?.data?.status)
                if (pedesAccess?.data?.status) {
                    this.postToLoggerAPI({
                        phone: this.bookingDetails.user.contact,
                        refId: this.bookingId,
                        image: "https://sppl-dev.divrt.co/img/pedestrain_door.042f0927.png",
                        statusText: "Parker accessed pedestrian door successfully.",
                    });
                    this.$router.replace({ path: "/pedestrianaccess" });
                } else {
                    this.pedestrianAccessText = pedesAccess.data.message;
                    this.postToLoggerAPI({
                        phone: this.bookingDetails.user.contact,
                        refId: this.bookingId,
                        error: this.pedestrianAccessText,
                        image: "https://sppl-dev.divrt.co/img/pedestrain_door.042f0927.png",
                        statusText: "Error in opening the pedestrian door.",
                    });
                    this.pedestrianAccessDialog = true;
                }
            } catch (error) {
                console.log(error);
            }
            // this.$router.replace({ path: "/pedestrianaccess/"+true });
        },
        navigateToAddPayment() {
            this.postToLoggerAPI({
                phone: this.bookingDetails.user.contact,
                refId: this.bookingId,
                statusText: "Parker clicked on ADD CREDIT CARD btn.",
            });
            this.$router.replace({ path: "/addpayment" });
        },
        openValidationDialog() {
            this.validateBookingDialog = true;
        },
        async openSMSApp() {
            this.postToLoggerAPI({
                phone: this.bookingDetails.user.contact,
                refId: this.bookingId,
                statusText: "Parker clicked on SMS submit btn.",
            });
            if (this.smsText == null || this.smsText == "") {
                this.invalidSMSMsg = "Gate code cannot be empty";
                this.invalidSMSDialog = true;
            } else {
                try {
                    this.smsPending = true;
                    var preValidateSendSMS = await APIHelper("POST", "/receive_sms", {
                        bid: this.bookingId,
                        From: this.bookingDetails.user.contact,
                        Text: this.smsText,
                        To: this.bookingDetails.zone.ToMobileNo,
                        Mode: "SMS",
                        webView: "1",
                        preValidate: 1,
                    });
                    this.smsPending = false;
                    if (
                        preValidateSendSMS?.data?.status &&
                        preValidateSendSMS.data.status
                    ) {
                        this.smsDialog = false;
                        this.$router.replace({ path: "/success" });
                        try {
                            var sendSMS = await APIHelper("POST", "/receive_sms", {
                                bid: this.bookingId,
                                From: this.bookingDetails.user.contact,
                                Text: this.smsText,
                                To: this.bookingDetails.zone.ToMobileNo,
                                Mode: "SMS",
                                webView: "1",
                            });
                            if (sendSMS?.data?.status && sendSMS.data.status) {
                                this.smsDialog = false;
                                this.postToLoggerAPI({
                                    phone: this.bookingDetails.user.contact,
                                    refId: this.bookingId,
                                    icon: "logout",
                                    statusText:
                                        "Parker checked out successfully using SMS - " +
                                        this.smsText,
                                });
                            } else {
                                this.invalidSMSMsg = sendSMS?.data?.message
                                    ? sendSMS.data.message
                                    : "Please try again";
                                this.invalidSMSDialog = true;
                                this.postToLoggerAPI({
                                    phone: this.bookingDetails.user.contact,
                                    refId: this.bookingId,
                                    error: this.invalidSMSMsg,
                                    icon: "logout",
                                    statusText:
                                        "Error occured while checking out using SMS - " +
                                        this.smsText,
                                });
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        this.invalidSMSMsg = preValidateSendSMS?.data?.message
                            ? preValidateSendSMS.data.message
                            : "Please try again";
                        this.invalidSMSDialog = true;
                        this.postToLoggerAPI({
                            phone: this.bookingDetails.user.contact,
                            refId: this.bookingId,
                            error: this.invalidSMSMsg,
                            icon: "logout",
                            statusText:
                                "Error occured while checking out using SMS - " + this.smsText,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        getMobileOperatingSystem() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            // Windows Phone must come first because its UA also contains "Android"
            if (/windows phone/i.test(userAgent)) {
                return "Windows Phone";
            }

            if (/android/i.test(userAgent)) {
                return "Android";
            }

            // iOS detection from: http://stackoverflow.com/a/9039885/177710
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                return "iOS";
            }
            return "unknown";
        },
        getExitIcon(exitId) {
            let exitDetails = this.bookingDetails.exitOptions.find(
                (p) => p.techType == exitId
            );
            return exitDetails.icon;
        },
        getExitText(exitId) {
            let exitDetails = this.bookingDetails.exitOptions.find(
                (p) => p.techType == exitId
            );
            return exitDetails.name;
        },
        openDialerApp() {
            this.postToLoggerAPI({
                phone: this.bookingDetails.user.contact,
                refId: this.bookingId,
                statusText: "Parker clicked on dialer submit btn.",
            });
            this.dialerDialog = false;
            var url = "tel:" + this.bookingDetails.zone.ToMobileNo;
            window.location.href = url;
            if (this.getMobileOperatingSystem() == "Android") {
                window.close();
            }
        },
        turnCameraOn() {
            this.camera = "auto";
        },

        turnCameraOff() {
            this.camera = "off";
        },
        validateDecodedString(str) {
            let validateDivrtStr = str.startsWith("divrt://");
            let validateMMID = str.split("/")[2] == this.bookingDetails.booking.mmid;
            let validateMajorId =
                str.split("/")[3] == this.bookingDetails.booking.majorid;
            let validateMinorId = this.bookingDetails.booking.minor_ids.includes(
                str.split("/")[4]
            );
            return (
                validateDivrtStr && validateMMID && validateMajorId && validateMinorId
            );
        },
        async onDecode(decodedString) {
            var self = this;
            this.qrCode = decodedString;
            this.cameraStatus = false;
            try {
                var preValidateQrResult = await APIHelper(
                    "POST",
                    "/api/v1/checkout/" + this.bookingId,
                    {
                        beaconId: decodedString,
                        preValidate: 1,
                        zid: this.bookingDetails.zone.locationCode
                    }
                );
                if (preValidateQrResult.data.status) {
                    try {
                        self.$router.replace({ path: "/success" });
                        var qrResult = await APIHelper(
                            "POST",
                            "/api/v1/checkout/" + this.bookingId,
                            {
                                beaconId: decodedString,
                                zid: this.bookingDetails.zone.locationCode
                            }
                        );
                        if (qrResult.data.status) {
                            this.postToLoggerAPI({
                                phone: self.bookingDetails.user.contact,
                                refId: self.bookingId,
                                icon: "logout",
                                statusText:
                                    "Parker successfully checked out using QR - " + decodedString,
                            });
                            this.$store.commit("SET_CHECKOUT", true);
                        } else {
                            this.invalidQRMsg = qrResult?.data?.message
                                ? qrResult.data.message
                                : "Please try again";
                            this.invalidQRDialog = true;
                            this.postToLoggerAPI({
                                phone: self.bookingDetails.user.contact,
                                refId: self.bookingId,
                                error: self.invalidQRMsg,
                                icon: "logout",
                                statusText:
                                    "Error Occured while checking out using QR - " +
                                    decodedString,
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    this.invalidQRMsg = preValidateQrResult?.data?.message
                        ? preValidateQrResult.data.message
                        : "Please try again";
                    this.invalidQRDialog = true;
                    this.postToLoggerAPI({
                        phone: self.bookingDetails.user.contact,
                        refId: self.bookingId,
                        icon: "logout",
                        error: self.invalidQRMsg,
                        statusText:
                            "Error Occured while checking out using QR - " + decodedString,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
        async onInit(promise) {
            try {
                await promise;
            } catch (error) {
                if (error.name === "NotAllowedError") {
                    this.invalidQRMsg = "Please grant camera access permisson";
                } else if (error.name === "NotFoundError") {
                    this.invalidQRMsg = "No camera found on this device";
                } else if (error.name === "NotSupportedError") {
                    this.invalidQRMsg = "Secure context required (HTTPS, localhost)";
                } else if (error.name === "NotReadableError") {
                    this.invalidQRMsg = "Is the camera already in use? Please check.";
                } else if (error.name === "OverconstrainedError") {
                    this.invalidQRMsg = "Installed camera is not suitable";
                } else if (error.name === "StreamApiNotSupportedError") {
                    this.invalidQRMsg = "Stream API is not supported in this browser";
                }
                this.invalidQRDialog = true;
            }
        },
        async onValidateText() {
            this.validateBookingPending = true;
            let result = await this.validateBooking(this.validateBookingTxt);
            if (!result.data.status) {
                this.invalidSMSMsg = result?.data?.message
                    ? result.data.message
                    : "Validation not recognized. Please try again";
                this.invalidSMSDialog = true;
                this.validateBookingPending = false;
                this.postToLoggerAPI({
                    phone: this.bookingDetails.user.contact,
                    refId: this.bookingId,
                    error: this.invalidSMSMsg,
                    icon: "redeem",
                    statusText:
                        "Error in validating the session on entering validation code - " +
                        this.validateBookingTxt,
                });
            } else {
                this.postToLoggerAPI({
                    phone: this.bookingDetails.user.contact,
                    refId: this.bookingId,
                    icon: "redeem",
                    statusText:
                        "Parker validated the session successfully by entering validation code - " +
                        this.validateBookingTxt,
                });
                this.goldenNugget = false;
                this.validateBookingPending = false;
                this.validateBookingDialog = false;
                this.$store.commit(
                    "SET_VALIDATED_MERCHANT",
                    result?.data?.merchantName
                );
                this.$router.replace({ path: "/validatesuccess" });
            }
        },
        async validateBooking(code) {
            try {
                let validateResult = await APIHelper(
                    "POST",
                    "/api/v1/validate/" + this.bookingId,
                    {
                        coupon: code,
                        zid: this.bookingDetails.zone.locationCode
                    }
                );
                return validateResult;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
        async openScanValidationCode() {
            this.validateBookingDialog = false;
            this.validateBookingTxt = "";
            this.validateQRCodeDialog = true;
            this.validationCameraStatus = true;
        },
        async onValidateQRCode(decodedString) {
            this.validationCameraStatus = false;
            this.validateQRCodePending = true;
            try {
                let result = await this.validateBooking(decodedString);
                if (!result.data.status) {
                    this.invalidValidationQRMsg = result?.data?.message
                        ? result.data.message
                        : "Validation not recognized. Please try again";
                    this.invalidValidationQRDialog = true;
                    this.validateQRCodePending = false;
                    this.postToLoggerAPI({
                        phone: this.bookingDetails.user.contact,
                        refId: this.bookingId,
                        error: this.invalidQRMsg,
                        icon: "redeem",
                        statusText:
                            "Error in validating the session on scanning validation QR - " +
                            decodedString,
                    });
                } else {
                    this.postToLoggerAPI({
                        phone: this.bookingDetails.user.contact,
                        refId: this.bookingId,
                        icon: "redeem",
                        statusText:
                            "Parker validated the session successfully by scanning validation QR - " +
                            decodedString,
                    });
                    this.validateQRCodePending = false;
                    this.validateQRCodeDialog = false;
                    this.$store.commit(
                        "SET_VALIDATED_MERCHANT",
                        result?.data?.merchantName
                    );
                    this.$router.replace({ path: "/validatesuccess" });
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
}
</script>
<style>
.timing-values {
    color: white;
    font-size: 52px;

}
</style>