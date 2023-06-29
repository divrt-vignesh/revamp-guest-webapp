import { format, subDays, getDaysInMonth } from "date-fns";
export const ISO_FORMAT = "yyyy-MM-dd";
export const CHICAGO_DATE_FORMAT = "MM-dd-yyyy";
export const US_DATE_FORMAT = "MM-dd-yy";
export const US_DATE_TIME_FORMAT = "MM-dd-yy HH:mm:ss";
export const DEFAULT_DATE = format(new Date(), ISO_FORMAT);
export const DEFAULT_ACTION_LABELS = {
  apply: "Apply",
  cancel: "Cancel",
  reset: "Reset",
};
export const presets = [
  {
    label: "Today",
    range: [format(new Date(), ISO_FORMAT), format(new Date(), ISO_FORMAT)],
  },
  {
    label: "Yesterday",
    range: [
      format(subDays(new Date(), 1), ISO_FORMAT),
      format(subDays(new Date(), 1), ISO_FORMAT),
    ],
  },
  {
    label: "Last 7 Days",
    range: [
      format(subDays(new Date(), 6), ISO_FORMAT),
      format(subDays(new Date(), 0), ISO_FORMAT),
    ],
  },
  {
    label: "Last 30 Days",
    range: [
      format(subDays(new Date(), 29), ISO_FORMAT),
      format(subDays(new Date(), 0), ISO_FORMAT),
    ],
  },
  {
    label: "This Month",
    range: [
      format(
        subDays(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          0
        ),
        ISO_FORMAT
      ),
      format(subDays(new Date(), 0), ISO_FORMAT),
    ],
  },
  {
    label: "Last Month",
    range: [
      format(
        subDays(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          getDaysInMonth(
            new Date(new Date().getFullYear(), new Date().getMonth() - 1)
          )
        ),
        ISO_FORMAT
      ),
      format(
        subDays(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          1
        ),
        ISO_FORMAT
      ),
    ],
  },
];
export const months = [
  {
    label: "Jan",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 0, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            0,
            new Date(new Date().getFullYear(), 1, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Feb",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 1, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            1,
            new Date(new Date().getFullYear(), 2, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Mar",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 2, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            2,
            new Date(new Date().getFullYear(), 3, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Apr",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 3, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            3,
            new Date(new Date().getFullYear(), 4, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "May",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 4, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            4,
            new Date(new Date().getFullYear(), 5, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Jun",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 5, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            5,
            new Date(new Date().getFullYear(), 6, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Jul",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 6, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            6,
            new Date(new Date().getFullYear(), 7, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Aug",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 7, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            7,
            new Date(new Date().getFullYear(), 8, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Sep",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 8, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            8,
            new Date(new Date().getFullYear(), 9, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Oct",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 9, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            9,
            new Date(new Date().getFullYear(), 10, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Nov",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 10, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            10,
            new Date(new Date().getFullYear(), 11, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
  {
    label: "Dec",
    range: [
      format(subDays(new Date(new Date().getFullYear(), 11, 1), 0), ISO_FORMAT),
      format(
        subDays(
          new Date(
            new Date().getFullYear(),
            11,
            new Date(new Date().getFullYear(), 12, 0).getDate()
          ),
          0
        ),
        ISO_FORMAT
      ),
    ],
  },
];
export const days = [
  { text: "Sunday", value: "sunday" },
  { text: "Monday", value: "monday" },
  { text: "Tuesday", value: "tuesday" },
  { text: "Wednesday", value: "wednesday" },
  { text: "Thursday", value: "thursday" },
  { text: "Friday", value: "friday" },
  { text: "Saturday", value: "saturday" },
];

export const daysRange = [
  { text: "Last 7 days", value: 7 },
  { text: "Last 2 weeks", value: 14 },
  { text: "Last 3 weeks", value: 21 },
  { text: "Last one month", value: 31 },
];

export const year = [
  { label: String(new Date().getFullYear()) },
  { label: String(new Date().getFullYear() - 1) },
];
