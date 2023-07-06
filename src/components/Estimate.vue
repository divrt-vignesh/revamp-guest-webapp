<template>
    <v-container fluid pa-0>
        <v-container pa-0 fluid v-if="singleQuotes">
            <v-row no-gutters v-if="estimate != null && Object.keys(estimate).length != 0
                ">
                <v-col cols="12" class=" text-center" style="font-size: 12px">
                    <v-row no-gutters >
                        <v-col cols="6" class="text-left">
                            <p style="font-size: small;color:#3D4C56" >
                                Parking
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="6" class="text-left">
                            <p style="font-size: small;color:#3D4C56" class=" text-right">
                                {{
                                    estimate.hasOwnProperty("totalPrice")
                                    ? "$ " + estimate.totalPrice.toFixed(2)
                                    : "-"
                                }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-0 ">
                        <v-col cols="6" class="text-left">
                            <v-row no-gutters>
                                <v-col cols="11">
                                    <p style="font-size: small;color:#3D4C56" >
                                        Service Fee
                                    </p>
                                </v-col>
                                <v-col cols="1">
                                    <v-tooltip bottom v-model="show">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="material-icons-outlined" dark x-small color="primary"
                                                v-bind="attrs" @click="show = !show" v-on="on">info</v-icon>
                                        </template>
                                        <span>This fee helps cover the use of the technology that provides a better parking
                                            experience.</span>
                                    </v-tooltip>
                                </v-col>

                            </v-row>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="6" class="text-left">
                            <p style="font-size: small;color:#3D4C56" class=" text-right">
                                {{
                                    estimate.hasOwnProperty("totalFee")
                                    ? "$ " + estimate.totalFee.toFixed(2)
                                    : "-"
                                }}
                            </p>
                        </v-col>
                    </v-row>
                    <hr />
                    <v-row no-gutters class="mt-2 ">
                        <v-col cols="6" class="text-left">
                            <p style="
                                                                            font-weight: bold;
                                                                            color: #333D44;
                                                                            font-size: 15px;
                                                                          ">
                                Purchase Total <sup>*</sup>
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="4" class="text-left">
                            <p style="
                                                                            font-size: small;
                                                                            font-weight: bold;
                                                                            color: #333D44;
                                                                          " class="text-right">
                                {{
                                    estimate.hasOwnProperty("grandTotal")
                                    ? "$ " + estimate.grandTotal.toFixed(2)
                                    : "-"
                                }}
                            </p>
                        </v-col>
                        <p>
                            *Includes state and local taxes of
                            {{
                                estimate.hasOwnProperty("totalTax")
                                ? "$ " + estimate.totalTax.toFixed(2)
                                : "-"
                            }}
                        </p>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
        <v-container pa-0 fluid v-if="doubleQuotes">
            <v-row no-gutters v-if="estimate != null && Object.keys(estimate).length != 0 && beforeEstimate != null && Object.keys(beforeEstimate).length != 0
                ">
                <v-col cols=12 class="text-center  mt-3">
                    <p style="color: black; font-weight: 500; font-size: 17px;">Amount you'll be charged if
                        you exit:
                    </p>
                </v-col>
                <v-col cols="6" class=" pr-3 text-center" style="font-size: 12px">
                    <v-row no-gutters class="pt-2">
                        <v-col cols="12">
                            <p style="font-size: 11.5px;color: #1976d2; font-weight: bold;">BEFORE {{
                                formattedEntryDisplayTime }}</p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">
                            <p style="font-size:large;font-weight: bold;" class="black--text">{{
                                beforeEstimate.hasOwnProperty("grandTotal")
                                ? "$ " + beforeEstimate.grandTotal.toFixed(2)
                                : "-"
                            }}</p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="pa-0">
                        <v-col class="text-left pl-2">
                            <p style="font-size:small;font-weight: bold; color:#3D4C56">Price <sup>*</sup>
                            </p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="6" class="text-left pl-2">
                            <p style="font-size: small" class="black--text">
                                Parking
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="6" class="text-left pl-2">
                            <p style="font-size: small" class="black--text text-right">
                                {{
                                    beforeEstimate.hasOwnProperty("totalPrice")
                                    ? "$ " + beforeEstimate.totalPrice.toFixed(2)
                                    : "-"
                                }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-0 ">
                        <v-col cols="7" class="text-left pl-2">
                            <v-row no-gutters>
                                <v-col cols="11">
                                    <p style="font-size: small" class="black--text">
                                        Service Fee
                                    </p>
                                </v-col>
                                <v-col cols="1">
                                    <v-tooltip bottom v-model="show">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="material-icons-outlined" dark x-small color="primary"
                                                v-bind="attrs" @click="show = !show" v-on="on">info</v-icon>
                                        </template>
                                        <span>This fee helps cover the use of the technology that provides a better parking
                                            experience.</span>
                                    </v-tooltip>
                                </v-col>

                            </v-row>

                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="5" class="text-left">
                            <p style="font-size: small" class="black--text text-right">
                                {{
                                    beforeEstimate.hasOwnProperty("totalFee")
                                    ? "$ " + beforeEstimate.totalFee.toFixed(2)
                                    : "-"
                                }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-2 ">
                        <p>
                            *Includes state and local taxes of
                            {{
                                beforeEstimate.hasOwnProperty("totalTax")
                                ? "$ " + beforeEstimate.totalTax.toFixed(2)
                                : "-"
                            }}
                        </p>
                    </v-row>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="6" class="pl-1 text-center" style="font-size: 12px">
                    <v-row no-gutters class="pt-2">
                        <v-col cols="12">
                            <p style="font-size: 11.5px;color: #1976d2; font-weight: bold;">AFTER
                                {{ formattedEntryDisplayTime }}</p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-center">
                            <p style="font-size:large;font-weight: bold;" class="black--text">{{
                                estimate.hasOwnProperty("grandTotal")
                                ? "$ " + estimate.grandTotal.toFixed(2)
                                : "-"
                            }}</p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col class="text-left pl-4">
                            <p style="font-size:small;font-weight: bold; color: #f2555c;">Price <sup>*</sup>
                            </p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="6" class="text-left pl-4">
                            <p style="font-size: small" class="black--text">
                                Parking
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="6" class="text-left pl-4">
                            <p style="font-size: small" class="black--text text-right">
                                {{
                                    estimate.hasOwnProperty("totalPrice")
                                    ? "$ " + estimate.totalPrice.toFixed(2)
                                    : "-"
                                }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-0 ">
                        <v-col cols="7" class="text-left pl-4">
                            <v-row no-gutters>
                                <v-col cols="11">
                                    <p style="font-size: small" class="black--text">
                                        Service Fee
                                    </p>
                                </v-col>
                                <v-col cols="1">
                                    <v-tooltip bottom v-model="show">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="material-icons-outlined" dark x-small color="primary"
                                                v-bind="attrs" @click="show = !show" v-on="on">info</v-icon>
                                        </template>
                                        <span>This fee helps cover the use of the technology that provides a better parking
                                            experience.</span>
                                    </v-tooltip>
                                </v-col>

                            </v-row>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="5" class="text-left pl-4">
                            <p style="font-size: small" class="black--text text-right">
                                {{
                                    estimate.hasOwnProperty("totalFee")
                                    ? "$ " + estimate.totalFee.toFixed(2)
                                    : "-"
                                }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="mt-2 ">
                        <p>
                            *Includes state and local taxes of
                            {{
                                estimate.hasOwnProperty("totalTax")
                                ? "$ " + estimate.totalTax.toFixed(2)
                                : "-"
                            }}
                        </p>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>
<script>
export default {
    data: () => ({
        show: false,
    }),
    props: {
        state: {
            type: String,
            default: '18px'
        },
        singleQuotes: {
            type: Boolean,
            default: false,
        },
        doubleQuotes: {
            type: Boolean,
            default: false,
        },
        estimate: {
            type: Object,
            default: () => {
                return {};
            }
        },
        formattedEntryDisplayTime: {
            type: String,
            default: ""
        },
        beforeEstimate: {
            type: Object,
            default: () => {
                return {};
            }
        }
    }

}
</script>