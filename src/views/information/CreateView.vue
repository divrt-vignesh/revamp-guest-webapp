<template>
    <v-container fluid pa-0>
        <v-dialog v-model="loading" persistent>
            <v-card class="pa-4">
                <v-progress-circular indeterminate color="red"></v-progress-circular>
                <span class="ml-4" style="font-size: 14px">Please wait...</span>
            </v-card>
        </v-dialog>
        <boiler-plate>
            <div class="parking-values ">
                <v-container pa-0 class="text-center">
                    <v-row no-gutters class="location-values ">
                        <v-col cols="12" class=" pb-0">
                            <v-container pl-10>
                                <p class="welcome text-start">Welcome to</p>
                                <p class="location text-start">{{ zoneName }}</p>
                            </v-container>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
            <v-container fluid class="text-center px-10" elevation="20">
                <v-card style="border-radius: 10px;">
                    <v-card-text>
                        <v-container>
                            <v-form>
                                <v-row no-gutters>
                                    <v-col class="text-left mb-5">
                                        <span style="font-weight: 700;font-size: 14px; ">Your Information</span>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters class="mb-5">
                                    <v-col cols="12" v-if="!edtPhoneInput">
                                        <sphere-phone-number-input v-model="contactObj.phoneNumber" size="md"
                                            @update="onContactInput" show-code-on-list
                                            :default-country-code="contactOptions.defaultCountry"
                                            :disabled="contactDisabled" :color="contactOptions.color"
                                            :valid-color="contactOptions.validColor"
                                            :error-color="contactOptions.errorColor"
                                            :border-radius="contactOptions.contactBorderRadius" :error="!isContactValid"
                                            required
                                            :translations="contactOptions.translations"></sphere-phone-number-input>
                                    </v-col>
                                    <v-col cols="11" v-if="edtPhoneInput">
                                        <v-text-field v-model="contactObj.phoneNumber" disabled oulined></v-text-field>
                                    </v-col>
                                    <v-col cols="1"> </v-col>
                                    <v-col cols="11" v-if="!isPQREndReservation">
                                        <span style="font-size: 10px; line-height: 1.5">Phone number is mandatory for
                                            generating
                                            the
                                            receipt</span>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters class="mb-3">
                                    <v-col>
                                        <v-text-field class="pt-0" v-model="licencePlate" hide-details="auto" maxlength="8"
                                            dense outlined :rules="[rules.alphaNumeric]" @keyup="uppercase"
                                            label="License Plate *" clearable>

                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
                                    <v-col cols="12" class="text-left pb-1" style="font-size: 10px;font-weight: 300;">
                                        <p class="mb-0" v-if="zoneDetails.lpr_status == '1'">
                                            Enter your license plate and phone number for hassle-free
                                            parking
                                        </p>
                                        <p class="mb-0" v-else>
                                            Enter your phone number for hassle-free parking
                                        </p>
                                    </v-col>

                                </v-row>
                                <v-row no-gutters v-if="isPQREndReservation">
                                    <v-col cols="12">
                                        <v-row no-gutters class=" text-left pa-0 mb-0">
                                            <v-col cols="12">
                                                <p style="font-weight: 700;color: #3D4C56;margin-bottom: 3px;">
                                                    Set Your Exit Date <span
                                                        v-if="isPQREndReservation && Object.hasOwnProperty.call(zoneDetails, 'timePickerConfiguration') && zoneDetails.timePickerConfiguration == '1'">and
                                                        Time</span>
                                                </p>
                                                <p class="text-left ma-0"
                                                    style="color: #6F6F6F;font-size: 10px; font-weight: 300; "
                                                    v-if="isPQREndReservation">
                                                    If you're a hotel guest, this is your checkout date.
                                                </p>
                                            </v-col>
                                        </v-row>
                                        <v-row no-gutters>
                                            <v-col cols="12" class=" text-center color-black" style="font-size: 12px">

                                                <v-row no-gutters class="py-2">

                                                    <v-col cols="12">
                                                        <v-text-field v-model="computedDateFormatted" outlined dense
                                                            class="date-text" @click="() => { openDatePicker = true }"
                                                            hide-details="auto" readonly>
                                                            <template v-slot:prepend-inner>
                                                                <v-icon class="material-icons-outlined"
                                                                    color="#3D4C56">calendar_today</v-icon>
                                                                <v-divider color="grey" vertical
                                                                    class="ml-3 mr-3"></v-divider>
                                                            </template>
                                                        </v-text-field>
                                                        <v-dialog v-model="openDatePicker" max-width="450px">
                                                            <v-card
                                                                style="background-color: #F2555C;color: white;"><v-card-title>
                                                                    <v-row no-gutters>
                                                                        <v-col class="text-left" cols="12">
                                                                            <span style="font-size:15px;color: #fabbbe;">{{
                                                                                time
                                                                                !== null && time !== "" ?
                                                                                formattedYear : "" }}</span>
                                                                        </v-col>
                                                                        <v-col>
                                                                            <span style="font-size:30px"> {{ time !== null
                                                                                &&
                                                                                time !== "" ? formattedDateTime :
                                                                                ""
                                                                            }}</span>
                                                                        </v-col>
                                                                    </v-row>
                                                                </v-card-title></v-card>
                                                            <Calendar inline class="text-left" value :stepMinute="15"
                                                                hourFormat="12" :minDate="minTimeDate"
                                                                @date-select="onTimePickerChange" :maxDate="maxTimeDate"
                                                                v-model="time" />
                                                        </v-dialog>
                                                    </v-col>
                                                </v-row>
                                                <v-row no-gutters class="pt-2"
                                                    v-if="Object.hasOwnProperty.call(zoneDetails, 'timePickerConfiguration') && zoneDetails.timePickerConfiguration == '1'">
                                                    <v-col cols="12">
                                                        <v-row no-gutters class="pb-0">
                                                            <v-col class="pb-0">
                                                                <v-text-field class="date-text" v-model="formattedTime"
                                                                    dense outlined @click="() => {
                                                                        openTimePicker = true;
                                                                    }" readonly>
                                                                    <template v-slot:prepend-inner>
                                                                        <v-icon class="material-icons-outlined"
                                                                            color="#3D4C56">schedule</v-icon>
                                                                        <v-divider color="grey" vertical
                                                                            class="ml-3 mr-3"></v-divider>
                                                                    </template>
                                                                </v-text-field>
                                                                <v-dialog v-model="openTimePicker" max-width="300px"
                                                                    @click:outside="() => { setDefaultDate(); onTimePickerChange() }">
                                                                    <v-card
                                                                        style="background-color: #F2555C;color: white;"><v-card-title>What
                                                                            time will you
                                                                            exit?</v-card-title></v-card>
                                                                    <Calendar inline time-only show-time class="text-left "
                                                                        value :stepMinute="15" hourFormat="12"
                                                                        :minDate="minTimeDate" :maxDate="maxTimeDate"
                                                                        v-model="time" />
                                                                </v-dialog>
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="text-left mt-0  py-0 pb-3">
                                                    <v-col class="pt-0">
                                                        <p style="
                                                    font-size: 10px; 
                                                    font-weight: 700;
                              color: #3D4C56;
                              line-height: 13px;
                            " class="ma-0">
                                                            HOURS OF OPERATION
                                                        </p>
                                                        <p class="ma-0" style="font-size: 9px; ">
                                                            Today :
                                                            {{
                                                                onDemandZoneDetails.hasOwnProperty(
                                                                    "todaysHoursOfOperation"
                                                                ) &&
                                                                onDemandZoneDetails.todaysHoursOfOperation.hasOwnProperty(
                                                                    "is24HourOpen"
                                                                ) &&
                                                                onDemandZoneDetails.todaysHoursOfOperation
                                                                    .is24HourOpen == true
                                                                ? "Open 24 / 7"
                                                                : ""
                                                            }}
                                                        </p>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                        <v-row no-gutters class=" information pa-0" v-if="estimate != null && Object.keys(estimate).length != 0
                                                ">
                                            <v-col cols="10" class="text-left">
                                                <p style="color: #3D4C56; font-weight: bolder">
                                                    Your Parking Fees
                                                </p>
                                            </v-col>
                                        </v-row>

                                        <Estimate :singleQuotes="singleQuotes" :doubleQuotes="doubleQuotes"
                                            :estimate="estimate" :beforeEstimate="beforeEstimate"
                                            :formattedEntryDisplayTime="formattedEntryDisplayTime"></Estimate>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-container>
                        <v-card-actions class="">
                            <v-container class="pa-0 text-center" v-if="isPQREndReservation">
                                <v-row no-gutters>
                                    <v-col cols="12">
                                        <v-btn class="add_licence_plate_btn" width="100%" :disabled="disableSubmitBtn"
                                            :loading="addPaymentBtnLoading" @click="addPayment">Add
                                            Payment</v-btn>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
                                    <v-col cols="12" class="px-2 mt-4">
                                        <v-btn rounded elevation="20" width="50%" class="white--text" color="primary"
                                            v-if="this.casinoDetails.userDetail.bid" @click="reloadBooking">Cancel</v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-container class="pa-0" fluid v-else>
                                <v-row no-gutters>
                                    <v-col cols="12" class="px-2">
                                        <v-btn rounded elevation="20" class="add_licence_plate_btn white--text"
                                            :loading="addLicencePlateBtnLoading" :disabled="disableAddLicencePlateBtn"
                                            @click="createSession()">{{
                                                reEnterPlate ? "Confirm" : "Continue" }}</v-btn>
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
                                    <v-col cols="12" class="mt-2 text-center color-black px-2" style="font-size: 12px">
                                        <p class="mb-0" v-show="reEnterPlate">
                                            Please provide correct license plate and phone number.
                                            Without one, you could be subject to a parking violation and
                                            issued a citation.
                                        </p>
                                        <p class="mb-0">
                                            A valid credit card is required to park. Without one, you
                                            could be subject to a parking violation and issued a
                                            citation.
                                        </p>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-actions>
                    </v-card-text>

                </v-card>
            </v-container>
            <footer>
                <v-row class="text-center parking.com pb-3" no-gutters>
                    <v-col cols="12">
                        <v-img alt="PARKING.COM" class="my-3" height="42" contain src="@/assets/logo_huge_drk.png" />
                    </v-col>
                </v-row>
            </footer>
        </boiler-plate>

    </v-container>
</template>
<script>
// import Vue from "vue";
import Estimate from '@/components/Estimate.vue';
import API from '@/api';
import Calendar from '@/uiComponents/Calendar/Calendar.vue'
import { EventBus } from "@/lib/EventBus";
import { mapGetters } from "vuex";
import { addMinutes, addDays, addHours } from "date-fns";
import { format, isValid } from "date-fns";
import "primevue/resources/themes/saga-blue/theme.css"       //theme
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"                           //icons
import { dateToTimeZoneDate } from "@/utils/formatDateTime";
// import axios from "axios";
import SpherePhoneNumberInput from '@/uiComponents/SpherePhoneNumberInput/VuePhoneNumberInput'


import APIHelper from "@/api";
// import VuePhoneNumberInput from "vue-phone-number-input";
// import "vue-phone-number-input/dist/vue-phone-number-input.css";
// import moment from "moment";
// Vue.use(moment);
import rules from "@/utils/rules";
export default {
    data: () => ({
        date: "",
        time: "",
        openTimePicker: false,
        openDatePicker: false,
        minTimeDate: null,
        maxTimeDate: null,
        // isPQREndReservation: true,
        currentDate: format(new Date(), 'yyyy-MM-dd'),
        edtEntryTime: null,
        edtPhoneInput: false,
        contactDisabled: false,
        selectedPlate: "",
        reEnterPlate: false,
        edtBid: null,
        confirmCreateSessionDialog: false,
        addLicencePlateBtnLoading: false,
        errDialog: false,
        errMsg: "",
        alertDialog: false,
        alertMsg: "",
        stopTime: "",
        exitTimeSelected: {},
        timePickerHrRange: null,
        timeExceeded: false,
        timePickerMinRange: null,

        disableAddPaymentBtn: false,
        maxDateTime: null,
        getRateCall: false,
        getRateText: "",
        Timemenu: false,
        startDate: "",
        estimate: null,
        beforeEstimate: null,
        Datemenu: false,
        exitDate: null,
        dateFormatted: null,
        rules: rules,
        isContactValid: true,
        licencePlate: "",
        contactObj: {},
        loading: false,
        contactOptions: {
            color: "#0288D1",
            validColor: "#0288D1",
            contactBorderRadius: 0,
            errorColor: "#FF5252",
            defaultCountry: "US",
            translations: {
                phoneNumberLabel: "Contact No",
            },
        },
        addPaymentBtnLoading: false,
    }),
    components: {
        // VuePhoneNumberInput,
        Calendar, Estimate, SpherePhoneNumberInput
    },
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            const params = new URLSearchParams(window.location.search)
            let searchParamKey = params.has('zcode') !== null ? '?zcode' : params.has('gateId') !== null ? '?gateId' : "";
            let searchParamValue = params.has('zcode') !== null ? params.get('zcode') : params.has('gateId') !== null ? params.get('gateId') : "";
            switch (searchParamKey) {
                case "?zcode":
                    await vm.getZoneDetails(searchParamKey, searchParamValue);
                    if (vm.isPQREndReservation) {
                        await vm.getOnDemandZoneDetails(searchParamValue);
                    }
                    break;
                case "?gateid":
                    //await self.getZoneDetails(searchParamKey, searchParamValue);
                    break;
            }
            if (vm.isPQREndReservation) {
                vm.contactObj =
                    vm.casinoDetails != null &&
                        Object.hasOwnProperty.call(vm.casinoDetails, "userDetail") &&
                        Object.hasOwnProperty.call(vm.casinoDetails?.userDetail, "contact") &&
                        vm.casinoDetails?.userDetail?.contact != undefined &&
                        vm.casinoDetails?.userDetail?.contact != null
                        ? Object.assign(vm.contactObj, {
                            countryCode:
                                vm.casinoDetails?.userDetail?.contact.slice(0, -10) == "+91"
                                    ? "IN"
                                    : vm.casinoDetails?.userDetail?.contact.slice(0, -10) ==
                                        "+1"
                                        ? "US"
                                        : "",
                            phoneNumber: vm.casinoDetails?.userDetail?.contact,
                            formattedNumber: "+" + vm.casinoDetails.userDetail.contact,
                        })
                        : {};
                vm.licencePlate = vm.casinoDetails?.userDetail.plate
                    ? vm.casinoDetails?.userDetail.plate
                    : "";
                if (window.location.href.includes('bid')) {
                    let hrefParams = window.location.href.split('createsession');
                    let paramArray = hrefParams[1].split('&')
                    let phoneParam = paramArray.length >= 1 ? paramArray[0].split('=')[1] : "";
                    let bidParam = paramArray.length >= 2 ? paramArray[1].split('=')[1] : "";
                    let plateParam = paramArray.length >= 3 ? paramArray[2].split('=')[1] : "";
                    let entrytimeparam = paramArray.length >= 4 ? paramArray[3].split('=')[1] : "";          // vm.contactObj.phoneNumber = phoneParam;
                    vm.edtEntryTime = entrytimeparam != null && entrytimeparam !== "" && entrytimeparam != undefined ? format(new Date(vm.formatExitDateTime(entrytimeparam, 'date')), "yyyy-MM-dd'T'HH:mm:ss") : format(dateToTimeZoneDate(new Date(), vm.zoneDetails.timezone), "yyyy-MM-dd'T'HH:mm:ss")
                    vm.licencePlate = plateParam;
                    vm.edtBid = bidParam;
                    let guestContact = phoneParam ? {
                        countryCode:
                            phoneParam.slice(0, -10) == "91"
                                ? "IN"
                                : phoneParam.slice(0, -10) == "1"
                                    ? "US"
                                    : "",
                        phoneNumber: phoneParam,
                        formattedNumber: "+" + phoneParam,
                    } : vm.contactObj;
                    if (phoneParam !== "" && phoneParam !== null && phoneParam != undefined) {
                        vm.edtPhoneInput = true;
                        vm.contactObj = Object.assign({}, guestContact);
                        vm.contactDisabled = true;
                        vm.contactObj.isValid = true;
                    }
                    let commitData = {
                        plate: vm.licencePlate,
                        contact: vm.contactObj?.formattedNumber,
                        bid: vm.edtBid,
                        entrytime: vm.edtEntryTime,
                        edtParams: hrefParams[1]
                    }
                    vm.$store.commit("SET_CASINO_USERDETAILS", commitData);
                    vm.$store.commit("SET_TEMPLATE_FLAGS", 'atlantic-flag');

                }
            }
            else {
                vm.edtPhoneInput = false;
            }
        });
    },
    watch: {
        time(newVal, oldVal) {
            if (oldVal != null && newVal != null && oldVal != newVal && oldVal != "" && newVal != "" && (isValid(newVal))) {
                this.round(newVal);
            }
            // this.setTimePicker(newVal);
        },
    },
    computed: {
        zoneName() {
            return this.isPQREndReservation ? this.onDemandZoneDetails?.name
                ? this.onDemandZoneDetails?.name
                : "" : this.zoneDetails?.zoneName
                ? this.zoneDetails?.zoneName
                : ""
        },
        formattedDateTime() {
            return this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'iii, LLL dd') : ""
        },
        formattedYear() {
            return this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'yyyy') : ""
        },
        formattedTime() {
            return this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'hh:mm aa') : ""
        },
        ...mapGetters({
            casinoDetails: "getterCasinoDetails",
            zoneDetails: "getterZoneDetails",
            onDemandZoneDetails: "getterOnDemandZoneDetails",
            templateFlags: "getterTemplateFlags",
            isPQREndReservation: "getterZoneIsPQREndReservation",
        }),
        singleQuotes() {
            return this.time !== null && this.time !== undefined && this.time !== "" && Object.hasOwnProperty.call(this.zoneDetails, 'timePickerConfiguration') && this.zoneDetails.timePickerConfiguration == "0" ? (format(this.time, 'yyyy-MM-dd') == this.currentDate || (this.beforeEstimate !== null && this.beforeEstimate !== undefined && this.beforeEstimate !== "" && this.estimate !== null && this.estimate !== undefined && this.estimate !== "" && this.beforeEstimate.grandTotal == this.estimate.grandTotal)) : true
        },
        doubleQuotes() {
            return this.time !== null && this.time !== undefined && this.time !== "" && Object.hasOwnProperty.call(this.zoneDetails, 'timePickerConfiguration') && this.zoneDetails.timePickerConfiguration == "0" ? (format(this.time, 'yyyy-MM-dd') != this.currentDate && (this.beforeEstimate !== null && this.beforeEstimate !== undefined && this.beforeEstimate !== "" && this.estimate !== null && this.estimate !== undefined && this.estimate !== "" && this.beforeEstimate.grandTotal != this.estimate.grandTotal)) : false
        },
        formattedEntryDisplayTime() {
            return this.casinoDetails.userDetail.entrytime !== null && this.casinoDetails.userDetail.entrytime !== undefined && this.casinoDetails.userDetail.entrytime !== "" ? format((new Date(this.casinoDetails.userDetail.entrytime)), 'hh:mm a') : format(dateToTimeZoneDate(new Date(), this.zoneDetails.timezone), 'hh:mm a');
        },
        infoFlag() {
            return this.contactObj == null ||
                !this.contactObj.isValid ||
                this.contactObj.phoneNumber == "" ||
                this.contactObj.phoneNumber == null ||
                this.licencePlate === "" ||
                this.licencePlate === null
                ? false
                : true;
        },
        timeFlag() {
            return this.time == null ||
                this.disableAddPaymentBtn ||
                this.estimate === null ||
                this.estimate === "" || (Object.hasOwnProperty.call(this.zoneDetails, 'timePickerConfiguration') && this.zoneDetails.timePickerConfiguration == "1" && format(this.time, 'yyyy-MM-dd') != format(this.minTimeDate, 'yyyy-MM-dd') && (this.beforeEstimate === null || this.beforeEstimate == "" || this.beforeEstimate == undefined)) ||
                this.time === "" || this.time == undefined
                ? false
                : true;
        },
        paymentFlag() {
            return this.estimate === null ||
                this.estimate === "" ||
                this.estimate.hasOwnProperty.call("grandTotal") ||
                this.estimate.hasOwnProperty.call("totalPrice") ||
                this.estimate.hasOwnProperty.call("totalFee") ||
                this.estimate.hasOwnProperty.call("totalTax") || (this.zoneDetails?.timePickerConfiguration == '1' && this.beforeEstimate === null && this.beforeEstimate === "" && this.beforeEstimate === null && this.beforeEstimate.hasOwnProperty.call("totalPrice") && this.beforeEstimate.hasOwnProperty.call("totalFee") && this.beforeEstimate.hasOwnProperty.call("totalTax"))
                ? false
                : true;
        },
        computedDateFormatted() {
            return this.time != null && this.time != "" && this.time != undefined ? format(this.time, 'MM/dd/yyyy') : ""
        },
        disableSubmitBtn() {
            let disabled =
                this.contactObj == null ||
                !this.contactObj.isValid ||
                this.contactObj.phoneNumber == "" ||
                this.contactObj.phoneNumber == null ||
                this.licencePlate === "" ||
                this.licencePlate === null ||
                this.disableAddPaymentBtn ||
                this.estimate === null ||
                this.estimate === ""
            this.exitDate === "";
            let selectedMins = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'mm') : new Date();
            let selectedHours = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'hh') : new Date();
            let selectedAMPM = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'aaa') : new Date();
            disabled =
                disabled ||
                selectedMins == null ||
                selectedMins === "" ||
                selectedMins == undefined ||
                selectedHours == null ||
                selectedHours === "" ||
                selectedHours == undefined || selectedAMPM == null ||
                selectedAMPM === "" ||
                selectedAMPM == undefined || this.time === null || this.time === "" || this.time === undefined
            disabled =
                this.licencePlate != "" && this.licencePlate != null
                    ? disabled || /^[a-z0-9]+$/i.test(this.licencePlate) === false
                    : disabled;
            return disabled;
        },
        disableAddLicencePlateBtn() {
            if (this.zoneDetails.lpr_status == "0") {
                return this.isContactValid == false ? true : false;
            } else {
                return this.isContactValid == false ||
                    this.licencePlate == "" ||
                    this.licencePlate == null ||
                    /^[a-z0-9]+$/i.test(this.licencePlate) === false
                    ? true
                    : false;
            }
        },
    },
    mounted() {
        EventBus.$on('SET_TIME', () => {
            this.onTimePickerChange();
        })
        // this.setDefaultDate();
    },
    methods: {
        round(time) {
            let exitdate = time !== null && time !== '' ? format(time, 'yyyy/MM/dd') : new Date();

            let selectedMins = time !== null && time !== '' ? format(time, 'mm') : new Date();
            let selectedHours = time !== null && time !== '' ? format(time, 'hh') : new Date();
            let selectedAMPM = time !== null && time !== '' ? format(time, 'aaa') : new Date();
            if (exitdate != null && selectedMins != '15' && selectedMins != '30' && selectedMins != '45' && selectedMins != '00' && selectedMins != null && selectedMins != "" && selectedHours != null && selectedHours != "" && selectedAMPM != null && selectedAMPM != "") {
                let intervalMilliseconds = 900000
                let datetime = new Date(exitdate + " " + selectedHours + ":" + selectedMins + " " + selectedAMPM)
                let interval = datetime.getTime() % intervalMilliseconds;
                let delta = interval === 0 ? 0 : datetime.getTime() - interval;
                delta += intervalMilliseconds;
                // this.exitTimeSelected = Object.assign(this.exitTimeSelected, { hh: format(new Date(delta), 'hh'), mm: format(new Date(delta), 'mm'), a: format(new Date(delta), 'a'), })
                return interval !== 0 ? new Date(delta) : datetime;
            }
        },
        dateChange() {
            this.dateTimeChange();
            Object.hasOwnProperty.call(this.zoneDetails, 'timePickerConfiguration') && this.zoneDetails?.timePickerConfiguration == "1" ? this.beforeDateTimeChange() : "";
        },
        formatExitDateTime(time, val) {
            if (time !== null && time !== undefined && time != '') {
                let utcDate = new Date(time * 1000).toUTCString(); //"Wed, 27 Jan 2021 13:59:04 GMT"
                let month = utcDate.split(",")[1].split(" ")[2]; // Jan
                let date = utcDate.split(",")[1].split(" ")[1]; // 27
                let year = utcDate.split(",")[1].split(" ")[3];
                let hr = utcDate.split(",")[1].split(" ")[4].split(":")[0]; // 13
                let min = utcDate.split(",")[1].split(" ")[4].split(":")[1]; //59
                let formatHr = Number(hr) > 12 ? Number(hr) - 12 : Number(hr); // 1
                formatHr = Number(formatHr) >= 10 ? Number(formatHr) : formatHr; //01
                let amOrpm = Number(hr) >= 12 ? "p" : "a"; //PM
                let ampm = Number(hr) >= 12 ? "PM" : "AM";
                switch (val) {
                    case 'hour': {
                        return formatHr + amOrpm;
                    }
                    case 'mins': {
                        return min
                    }
                    case 'date': {
                        return month + " " + date + ", " + year + " " + formatHr + ":" + min + " " + ampm;
                    }
                }
            }
            //Jan 27, 01:59 PM
        },
        reloadBooking() {
            let url = window.location.origin + "/g/" + this.casinoDetails.userDetail.bid;
            window.location.replace(url);
        },
        setDefaultDate() {
            this.dateFormatted = this.zoneDetails.timezone ? format(
                dateToTimeZoneDate(addMinutes(new Date(), 15),
                    this.zoneDetails.timezone
                ),
                "MM/dd/yyyy"
            )
                : format(addMinutes(new Date(), 15), "MM/dd/yyyy");
            this.time = this.zoneDetails.timezone
                ?
                dateToTimeZoneDate(
                    addMinutes(new Date(), 15),
                    this.zoneDetails.timezone
                )
                : addMinutes(new Date(), 15);
            let fifteenTime = this.time;
            this.time = format(this.time, 'mm') === '15' || format(this.time, 'mm') === '30' || format(this.time, 'mm') === '45' || format(this.time, 'mm') === '00' ? fifteenTime : this.round(this.time);
            let selectedMins = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'mm') : "";
            let selectedHours = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'HH') : "";
            let selectedAMPM = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'a') : "";
            this.stopTime = selectedMins != null && selectedMins != "" && selectedHours != null && selectedHours != "" && selectedAMPM != null && selectedAMPM != "" ? selectedHours + ":" + selectedMins + ":" + "00" : "";
            // this.dateTimeChange()
            // Object.hasOwnProperty.call(this.zoneDetails, 'timePickerConfiguration') && this.zoneDetails?.timePickerConfiguration == "1" && format(this.time, 'yyyy-MM-dd') != format(dateToTimeZoneDate(new Date(), this.zoneDetails.timezone), 'yyyy-MM-dd') ? this.beforeDateTimeChange() : "";
        },
        onTimePickerChange() {
            let exitdate = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'yyyy/MM/dd') : "";
            let selectedMins = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'mm') : "";
            let selectedHours = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'HH') : "";
            let selectedAMPM = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'a') : "";
            this.stopTime = selectedMins != null && selectedMins != "" && selectedHours != null && selectedHours != "" && selectedAMPM != null && selectedAMPM != "" ? selectedHours + ":" + selectedMins + ":" + "00" : "";
            let currenTime = this.zoneDetails.timezone
                ? format(
                    dateToTimeZoneDate(new Date(),
                        this.zoneDetails.timezone
                    ),
                    "yyyy-MM-dd HH:mm:ss"
                )
                : format(new Date(), "yyyy-MM-dd  HH:mm:ss");
            if (
                selectedMins != null && selectedMins != "" && selectedHours != null && selectedHours != "" && selectedAMPM != null && selectedAMPM != "" &&
                new Date(exitdate + " " + this.stopTime).getTime() >
                new Date(currenTime).getTime()
            ) {
                format(this.time, 'yyyy-MM-dd') != format(this.minTimeDate, 'yyyy-MM-dd') ? this.beforeDateTimeChange() : "";
                this.dateTimeChange();

            }
        },
        setDatePicker() {
            //set the minimum date to today date(zone time zone date)
            this.minTimeDate = this.zoneDetails.timezone ? this.round(this.zoneDetails.timezone
                ?
                dateToTimeZoneDate(addMinutes(new Date(), 15),
                    this.zoneDetails.timezone
                )
                : addMinutes(new Date(), 15)) : this.zoneDetails.timezone
                ?
                dateToTimeZoneDate(addMinutes(new Date(), 15),
                    this.zoneDetails.timezone
                )
                : addMinutes(new Date(), 15)
            //calculate max parkign time in seconds
            let maxPark = this.zoneDetails != null && this.zoneDetails !== undefined && this.zoneDetails != "" ? this.zoneDetails?.maxParkingTime : null;

            let addeddays = addDays(new Date(), maxPark?.days);
            let addedhours = addHours(addeddays, maxPark?.hours);
            let addedmins = addMinutes(addedhours, maxPark?.minutes);

            //get max date in seconds based on max parking time
            let maxZoneDate = addedmins
            this.maxTimeDate = this.zoneDetails.timezone
                ?
                dateToTimeZoneDate(
                    new Date(maxZoneDate),
                    this.zoneDetails.timezone
                )
                : new Date(maxZoneDate);
            //get max date with time and set it to maxDateTime
            this.maxDateTime = this.zoneDetails.timezone
                ? format(
                    dateToTimeZoneDate(
                        new Date(maxZoneDate),
                        this.zoneDetails.timezone
                    ),
                    "yyyy-MM-dd hh:mm aaaaa"
                )
                : format(new Date(), "yyyy-MM-dd hh:mm aaaaa");
        },

        /** @methods to find the estimate rate 
         @params startDate , stopDate,zcode, type , env_overRide
         */

        async dateTimeChange() {
            if (!this.zoneDetails.zcode) {
                return
            }
            try {
                // format(new Date(this.checkinDate), "yyyy-MM-dd'T'HH:mm:ss");
                let href = window.location.href;
                let edtEntryTime = ""
                if (href.includes('entrytime')) {
                    let params = href.split('?');
                    let timeparam = params[2].split('entrytime')[1];
                    edtEntryTime = timeparam.substring(1, timeparam.length)
                }

                this.startDate = edtEntryTime !== null && edtEntryTime !== undefined && edtEntryTime !== "" ? format(new Date(this.formatExitDateTime(edtEntryTime, 'date')), "yyyy-MM-dd'T'HH:mm:ss") : this.zoneDetails.timezone
                    ? format(
                        dateToTimeZoneDate(
                            new Date(),
                            this.zoneDetails.timezone
                        ),
                        "yyyy-MM-dd'T'HH:mm:ss"
                    )
                    : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
                // console.log(this.exitTimeSelected?.hh+":"+this.exitTimeSelected.mm+":00")
                // this.exitDate + "T23:59:00"
                let stopTime = this.stopTime;
                let exitdate = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'yyyy-MM-dd') : "";
                let exittime = Object.hasOwnProperty.call(this.zoneDetails, 'timePickerConfiguration') && this.zoneDetails?.timePickerConfiguration == '1' ? 'T' + stopTime : "T23:59:00";
                let stopDate = exitdate + exittime;
                let data = {
                    startAt: this.startDate,
                    stopAt: stopDate,
                    zcode: this.zoneDetails.zcode,
                };
                this.addPaymentBtnLoading = true;
                var getRate = await API.getRate(data);
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
                this.openDatePicker = false;
                this.openTimePicker = false;
                this.addPaymentBtnLoading = false;
            }
            catch (error) {
                this.addPaymentBtnLoading = false;
                console.log(error);
            }
        },
        async beforeDateTimeChange() {
            if (!this.zoneDetails.zcode) {
                return
            }
            try {
                // format(new Date(this.checkinDate), "yyyy-MM-dd'T'HH:mm:ss");

                let href = window.location.href;
                let edtEntryTime = ""
                if (href.includes('entrytime')) {
                    let params = href.split('?');
                    let timeparam = params[2].split('entrytime')[1];
                    edtEntryTime = timeparam.substring(1, timeparam.length)
                }
                this.startDate = edtEntryTime !== null && edtEntryTime !== undefined && edtEntryTime !== "" ? format(new Date(this.formatExitDateTime(edtEntryTime, 'date')), "yyyy-MM-dd'T'HH:mm:ss") : this.zoneDetails.timezone
                    ? format(
                        dateToTimeZoneDate(
                            new Date(),
                            this.zoneDetails.timezone
                        ),
                        "yyyy-MM-dd'T'HH:mm:ss"
                    )
                    : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
                let stopTime = this.stopTime;
                let selectedHours = this.casinoDetails.userDetail.entrytime != null && this.casinoDetails.userDetail.entrytime !== undefined && this.casinoDetails.userDetail.entrytime != "" ? format(new Date(this.casinoDetails.userDetail.entrytime), 'HH') : format(dateToTimeZoneDate(new Date(), this.zoneDetails.timezone), 'HH');
                let selectedMins = this.casinoDetails.userDetail.entrytime != null && this.casinoDetails.userDetail.entrytime !== undefined && this.casinoDetails.userDetail.entrytime != "" ? format(new Date(this.casinoDetails.userDetail.entrytime), 'mm') : format(dateToTimeZoneDate(new Date(), this.zoneDetails.timezone), 'mm');
                let exitdate = this.time !== null && this.time !== undefined && this.time !== "" ? format(this.time, 'yyyy-MM-dd') : "";
                let exittime = Object.hasOwnProperty.call(this.zoneDetails, 'istimePickerConfigurationGated') && this.zoneDetails?.timePickerConfiguration == '0' ? 'T' + stopTime : 'T' + selectedHours + ":" + selectedMins + ":00";

                let stopDate = exitdate + exittime;
                let data = {
                    startAt: this.startDate,
                    stopAt: stopDate,
                    zcode: this.zoneDetails.zcode,
                };
                this.addPaymentBtnLoading = true;
                var getRate = await API.getRate(data);
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
        async addPayment() {
            let exitDate = this.time != null || this.time !== undefined || this.time != "" ? format(this.time, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            let exitTime = this.time != null || this.time !== undefined || this.time != "" ? Object.hasOwnProperty.call(this.zoneDetails, 'timePickerConfiguration') && this.zoneDetails.timePickerConfiguration == 1 ? format(this.time, 'hh:mm a') : "11:59 PM" : "";
            let exitDateTime = exitDate + " " + exitTime
            let entryDateTime = this.zoneDetails.timezone
                ? format(
                    dateToTimeZoneDate(new Date(), this.zoneDetails.timezone),
                    "yyyy-MM-dd hh:mm a"
                )
                : format(new Date(), "yyyy-MM-dd'T'HH:mm a");
            let commitData = {
                plate: this.licencePlate,
                contact: this.contactObj?.formattedNumber,
                entryTime: entryDateTime,
                edtParams: this.casinoDetails?.userDetail?.edtParams,
                exitTime: exitDateTime,
                estimate: this.estimate,
            };
            let details = await API.prepaidOpenTransaction({
                vehicleNo: this.licencePlate,
                contact: this.contactObj?.formattedNumber,
                exitTime: exitDateTime, zcode: this.zoneDetails?.zcode,
                mid: this.zoneDetails?.mid,
                eventType: "PaidHostPass",
            });

            if (details?.data?.status) {
                this.$store.commit("SET_CASINO_USERDETAILS", commitData);
                this.$router.push({ name: 'makepayment', query: { zcode: this.zoneDetails?.zcode, state: 'makepayment' } });
            } else {
                if (details?.data?.message == "Booking Already Exists") {
                    let commitData = {
                        plate: this.licencePlate,
                        contact: this.contactObj.formattedNumber,
                        entryTime: entryDateTime,
                        edtParams: this.casinoDetails?.userDetail?.edtParams,
                        exitTime: exitDateTime,
                        estimate: this.estimate,
                        bid: details?.data?.data?.bid
                    };
                    if (details?.data?.data?.cardOnFile == 0 || details?.data?.data?.cardOnFile == 2) {
                        this.$store.commit("SET_CASINO_USERDETAILS", commitData);
                        this.$router.replace({ path: "/prepaidhost/makepayment" });
                    }
                    else if (details?.data?.data?.cardOnFile == 1) {
                        // this.$store.commit("SET_CASINO_USERDETAILS", commitData);
                        // this.$router.replace({ path: "/prepaidhost/odReceipt" });
                        let url = window.location.origin + "/g/" + details?.data?.data?.bid;
                        window.location.replace(url);
                    }
                }
                this.alertMsg = details?.data?.message ? details?.data?.message : "";

                this.alertDialog = true;
            }
        },

        uppercase() {
            if (rules.alphaNumeric(this.licencePlate) === "Must be alphanumeric") {
                this.licencePlate = this.licencePlate.replace(/[^\w\s]/gi, '')
            }
            this.licencePlate = this.licencePlate.trim()
            this.licencePlate = this.licencePlate.toUpperCase();
        },
        /**
         * @method getZoneDetails fetch the zone details and commit SET_ZONE_DETAILS mutation.
         */
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
                this.setDefaultDate();
                this.loading = false;
                if (zoneDetails.data?.lot) {
                    this.$store.commit(
                        "SET_ON_DEMAND_ZONE_DETAILS",
                        zoneDetails.data?.lot
                    );
                    this.setDatePicker();
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
        onContactInput(contactDetails) {
            this.isContactValid = contactDetails?.isValid;
            this.contactObj = Object.assign({}, contactDetails);
        },
        setReenterPlateFlag() {
            this.licencePlate = this.selectedPlate || "";
            this.reEnterPlate = true;
            this.confirmCreateSessionDialog = false;
        },
        /**
         * @method createSession Fetch booking id on add booking and fetch the booking info.
         */
        async createSession() {
            this.addLicencePlateBtnLoading = true;
            let postObj = {
                contact: this.contactObj?.formattedNumber,
                uniqueID: this.contactObj?.nationalNumber,
                vehicleNo: this.licencePlate.toUpperCase(),
                locationCode: this.zoneDetails.zcode,
                zid: this.zoneDetails.zid,
                entrytime: format(
                    new Date(
                        new Date().toLocaleString("en-US", {
                            timeZone: this.zoneDetails.timezone,
                        })
                    ),
                    "yyyy-MM-dd HH:mm:ss"
                ),
                source: "appclip",
                webView: "1",
                type: "2",
                state: 2,
                payment_status: 0,
                txnID_addCC: 0,
            };
            if (this.reEnterPlate) {
                Object.assign(postObj, { createNewSession: 1 });
            }
            try {
                var session = await APIHelper("POST", "/api/v1/addBooking", postObj);
                let bid = session?.data?.refno;
                if (session.data.status === false) {
                    this.errMsg = session?.data?.message ? session.data.message : "";
                    if (
                        session?.data?.showCreateNewSessionPopup &&
                        session.data.showCreateNewSessionPopup == 1
                    ) {
                        this.postToLoggerAPI({
                            phone: this.contactObj?.nationalNumber,
                            plate: this.licencePlate.toUpperCase(),
                            statusText: "Parker session not found in the system.",
                        });
                        this.confirmCreateSessionDialog = true;
                        this.addLicencePlateBtnLoading = false;
                        return;
                    }
                    this.errDialog = true;
                    this.addLicencePlateBtnLoading = false;
                    return;
                }
                await this.getBookingDetails(bid);
                let url = window.location.origin + "/g/" + bid;
                this.addLicencePlateBtnLoading = false;
                this.reEnterPlate
                    ? this.postToLoggerAPI({
                        phone: this.contactObj?.nationalNumber,
                        refId: bid,
                        icon: "login",
                        plate: this.licencePlate.toUpperCase(),
                        statusText:
                            "Parker plate/contact number not found in the system. Parker created a new session using generic payment QR",
                    })
                    : this.postToLoggerAPI({
                        phone: this.contactObj?.nationalNumber,
                        refId: bid,
                        icon: "login",
                        plate: this.licencePlate.toUpperCase(),
                        statusText:
                            "Parker session found. Parker opened his/her session using generic payment QR",
                    });

                window.location.replace(url);
            } catch (error) {
                this.addLicencePlateBtnLoading = false;
                console.log(error);
            }
        },
        /**
         * @method getBookingDetails fetch the booking details and commit SET_BOOKING_DETAILS mutation.
         */
        async getBookingDetails(bookingId) {
            try {
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
        closeConfirmCreateSessionDialog() {
            this.confirmCreateSessionDialog = false;
            this.addLicencePlateBtnLoading = false;
        },
    },
};
</script>
<style scoped>
.date-text {
    font-size: 15px !important;
    font-weight: 700 !important;
}
</style>