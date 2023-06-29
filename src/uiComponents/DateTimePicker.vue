<template>
  <v-menu
    v-model="display"
    :close-on-content-click="false"
    v-bind="menuProps"
    :max-width="cardWidth"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :class="disabled ? '' : 'background-white'"
        :disabled="disabled"
        :value="formattedDatetime"
        hide-details
        v-on="on"
        readonly
      >
        <template v-slot:label>
          <span>{{ label }}</span>
          <span class="red--text" v-if="isMandatory"> *</span>
        </template>
      </v-text-field>
    </template>

    <v-card :width="cardWidth">
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab" color="#f2555c">
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon class="material-icons-outlined">event</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected" color="#f2555c">
            <slot name="timeIcon">
              <v-icon class="material-icons-outlined">access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              color="#f2555c"
              v-model="date"
              v-bind="datePickerProps"
              @input="showTimePicker"
              :max="
                maxPickerDate != '' && maxPickerDate != null
                  ? maxPickerDate
                  : pickerMaxDate || maxDate
              "
              full-width
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              color="#f2555c"
              ref="timer"
              class="v-time-picker-custom"
              v-model="time"
              v-bind="timePickerProps"
              :min="minTime"
              :max="maxTime"
              full-width
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="#f2555c"
          class="elevation-0 white--text"
          v-show="!hideTodayBtn"
          :disabled="disableTodayBtn"
          @click="setTodayHandler"
          >{{ todayText }}</v-btn
        >
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <!-- <v-btn text @click.native="clearHandler">{{ clearText }}</v-btn> -->
          <v-btn
            color="#f2555c"
            class="elevation-0 white--text"
            @click="okHandler"
            >{{ okText }}</v-btn
          >
        </slot>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { format, parse, getUnixTime } from "date-fns";

const DEFAULT_DATE = "";
const DEFAULT_TIME = "00:00:00";
const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
const DEFAULT_TIME_FORMAT = "HH:mm:ss";
const DEFAULT_CARD_WIDTH = 340;
const DEFAULT_CLEAR_TEXT = "CLEAR";
const DEFAULT_OK_TEXT = "APPLY";
const DEFAULT_TODAY_TEXT = "TODAY";

export default {
  name: "divrt-datetime-picker",
  model: {
    prop: "datetime",
    event: "input",
  },
  props: {
    // Max selectable date
    maxDate: {
      type: String,
      default: undefined,
    },
    //Set max date for end picker
    maxPickerDate: {
      type: String,
      default: () => {
        return "";
      },
    },
    isMandatory: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    datetime: {
      type: [Date, String],
      default: null,
    },
    menuProps: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    timezone: {
      type: String,
      default: () => {
        return "";
      },
    },
    hideTodayBtn: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    label: {
      type: String,
      default: "",
    },
    cardWidth: {
      type: Number,
      default: DEFAULT_CARD_WIDTH,
    },
    dateFormat: {
      type: String,
      default: "MM/dd/yyyy",
    },
    timeFormat: {
      type: String,
      default: "hh:mm a",
    },
    clearText: {
      type: String,
      default: DEFAULT_CLEAR_TEXT,
    },
    okText: {
      type: String,
      default: DEFAULT_OK_TEXT,
    },
    todayText: {
      type: String,
      default: DEFAULT_TODAY_TEXT,
    },
    textFieldProps: {
      type: Object,
    },
    datePickerProps: {
      type: Object,
    },
    timePickerProps: {
      type: Object,
    },
  },
  data() {
    return {
      display: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME,
      minTime: "",
      maxTime: "",
      pickerMaxDate: "",
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    dateTimeFormat() {
      return this.dateFormat + " " + this.timeFormat;
    },
    defaultDateTimeFormat() {
      return DEFAULT_DATE_FORMAT + " " + DEFAULT_TIME_FORMAT;
    },
    formattedDatetime() {
      return this.selectedDatetime
        ? format(this.selectedDatetime, this.dateTimeFormat)
        : "";
    },
    selectedDatetime() {
      if (this.date && this.time) {
        let datetimeString = this.date + " " + this.time;
        if (this.time.length === 5) {
          datetimeString += ":00";
        }
        return parse(datetimeString, this.defaultDateTimeFormat, new Date());
      } else {
        return null;
      }
    },
    dateSelected() {
      return !this.date;
    },
    disableTodayBtn() {
      if (this.datePickerProps?.max && this.timePickerProps?.maxTime) {
        return getUnixTime(
          new Date(
            this.datePickerProps.max + " " + this.timePickerProps.maxTime
          ) - getUnixTime(new Date())
        ) < 0
          ? true
          : false;
      }
      return false;
    },
  },
  methods: {
    init() {
      if (!this.datetime) {
        this.date = null;
        this.time = null;
        return;
      }

      let initDateTime;
      if (this.datetime instanceof Date) {
        initDateTime = this.datetime;
      } else if (
        typeof this.datetime === "string" ||
        this.datetime instanceof String
      ) {
        // see https://stackoverflow.com/a/9436948
        initDateTime = parse(this.datetime, this.dateTimeFormat, new Date());
      }

      this.date = format(initDateTime, DEFAULT_DATE_FORMAT);
      // this.pickerMaxDate = this.date;
      this.time = format(initDateTime, DEFAULT_TIME_FORMAT);
    },
    okHandler() {
      this.resetPicker();
      this.$emit("input", this.selectedDatetime);
    },
    setTodayHandler() {
      let currentDateTime =
        this.timezone != "" &&
        this.timezone != null &&
        this.timezone != undefined
          ? new Date(
              new Date().toLocaleString("en-US", { timeZone: this.timezone })
            )
          : new Date();
      if (this.currentDateTime instanceof Date) {
        currentDateTime = this.datetime;
      } else if (
        typeof this.datetime === "string" ||
        this.datetime instanceof String
      ) {
        currentDateTime = parse(this.datetime, this.dateTimeFormat, new Date());
      }
      this.date = format(currentDateTime, DEFAULT_DATE_FORMAT);
      this.time = format(currentDateTime, DEFAULT_TIME_FORMAT);
      this.$emit("input", this.selectedDatetime);
      this.display = false;
    },
    clearHandler() {
      this.resetPicker();
      this.date = DEFAULT_DATE;
      this.time = DEFAULT_TIME;
      this.$emit("input", null);
    },
    resetPicker() {
      this.display = false;
      this.activeTab = 0;
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true;
      }
    },
    showTimePicker() {
      this.activeTab = 1;
    },
  },
  watch: {
    date: function () {
      if (this.datePickerProps?.min && this.datePickerProps.min == this.date) {
        this.minTime = this.timePickerProps?.minTime
          ? this.timePickerProps.minTime
          : "";
      } else {
        this.minTime = "";
      }
      if (this.datePickerProps?.max && this.datePickerProps.max == this.date) {
        // this.minTime = this.timePickerProps?.minTime ? this.timePickerProps.minTime : "";
        this.maxTime = this.timePickerProps?.maxTime
          ? this.timePickerProps.maxTime
          : "";
      } else {
        // this.minTime = "";
        this.maxTime = "";
      }
    },
    datetime: function () {
      this.init();
    },
  },
};
</script>
