<template>
    <div>
        <!-- <div id="apple-pay-button" ></div> -->
        <!-- <div id="card-container"></div> -->
        <v-btn id="card-button" color="white" elevation="20" :width="width" :height="height" v-if="iosDevice" style="border: 1px solid black !important;"> <span
                class="black--text">Pay with </span> <v-icon color="black">mdi-apple</v-icon><span class="black--text"
                style="font-weight: 700;">
                Pay</span></v-btn>
        <!-- <button id="card-button" type="button">Pay $1.00</button> -->
        <!-- <div id="payment-status-container"></div> -->
        <v-dialog v-model="alertDialog" persistent max-width="290">
            <v-card class="pa-0">
                <v-card-title class="justify-center" style="position: relative">
                    <v-icon x-large color="green accent-2">{{ alertIcon }}</v-icon>
                </v-card-title>
                <v-card-text class="text-center mt-5">
                    <span style="font-size: 20px">{{ alertMsg }}</span>
                </v-card-text>
                <v-card-actions class="text-center pb-6">
                    <v-container pa-0 fluid>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-btn rounded block elevation="0" class="white--text exit_dialog_btn"
                                    @click="closeAlertDialog()">Close</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
  
<script>
import APIHelper from "../apiHelper";
// import loggerHelper from "../loggerHelper";
import { mapGetters } from "vuex";
export default {
    name: "ApplePay",
    data: () => ({
        appId: "sandbox-sq0idb-Jyr1fMe8q1HdUDQXK-DQNg",
        locationId: "L8R19FS9KH7FQ",
        payments: null,
        alertDialog: false,
        alertMsg: "",
        alertIcon: "mdi-check-circle"
    }),
    props: {
        width: {
            type: String,
            default: () => "100%",
        },
        height: {
            type: String,
            default: () => "50px",
        },
        iosDevice: {
            type: Boolean,
            default: () => {
                return false;
            }
        }
    },
    computed: {
        ...mapGetters({
            bookingId: "getterBookingId",
            bookingDetails: "getterBookingDetails",
        }),
    },
    async mounted() {
        // document.addEventListener('DOMContentLoaded', async function () {
        if (!window.Square) {
            throw new Error("Square.js failed to load properly");
        }

        // let payments;
        try {
            this.payments = window.Square.payments('sandbox-sq0idb-Jyr1fMe8q1HdUDQXK-DQNg', 'L8R19FS9KH7FQ');
        } catch {
            // const statusContainer = document.getElementById(
            //   "payment-status-container"
            // );
            // statusContainer.className = "missing-credentials";
            // statusContainer.style.visibility = "visible";
            return;
        }

        let card;
        try {
            card = await this.initializeCard(this.payments);
        } catch (e) {
            console.error("Initializing Card failed", e);
            return;
        }

        let applePay;
        try {
            applePay = await this.initializeApplePay(this.payments);
        } catch (e) {
            console.error("Initializing Apple Pay failed", e);
            // There are a number of reason why Apple Pay may not be supported
            // (e.g. Browser Support, Device Support, Account). Therefore you should handle
            // initialization failures, while still loading other applicable payment methods.
        }
        var self = this;
        // const cardButton = document.getElementById("card-button");
        // cardButton.addEventListener("click", async function (event) {
        //   console.log(event)
        console.log(card);
        //   await self.handlePaymentMethodSubmission(event, card);
        // });

        // Checkpoint 2.
        if (applePay) {
            const applePayButton = document.getElementById("card-button");
            applePayButton.addEventListener("click", async function (event) {
                console.log("Clicked");
                await self.handlePaymentMethodSubmission(event, applePay);
            });
            // await applePayButton.attach('#apple-pay-button',)
        }
        // });
    },
    methods: {
        async closeAlertDialog() {
            this.alertDialog = false;
            window.location.reload()
            await this.getBookingState();
        },
        async handlePaymentMethodSubmission(event, paymentMethod) {
            event.preventDefault();
            var self = this;
            // const cardButton = document.getElementById("card-button");
            try {
                // disable the submit button as we await tokenization and make a payment request.

                // cardButton.disabled = true;
                console.log("paymentMeth0d", paymentMethod);
                const tokenResult = await self.tokenize(paymentMethod);
                console.log("token", tokenResult);
                let verfiedToken = await self.verifyBuyer(this.payments, tokenResult);
                console.log("verfiedToken", verfiedToken);
                await self.addCard(tokenResult, verfiedToken);
                // const paymentResults = await self.createPayment(token);
                // console.log("paymentResults", paymentResults);
                // console.log(self)
                // self.displayPaymentResults("SUCCESS");

                // console.debug("Payment Success", paymentResults);
            } catch (e) {
                console.log(self);
                console.log("Error");
                // cardButton.disabled = false;
                self.displayPaymentResults("FAILURE");
                console.error(e.message);
            }
        },
        async addCard(tokenResult, verfiedToken) {
            let cardData = {
                userDevice: "2",
                orderType: "3",
                entry: [
                    {
                        locationCode: this.bookingDetails.zone.locationCode,
                        startAt: this.bookingDetails.booking.startAt,
                        quantity: "1",
                    },
                ],
                paymentType: "APPLE_PAY",
                billingDetails: tokenResult?.details?.billing,
                verification_token: verfiedToken,
                source_id: tokenResult.token,
                phoneNumber: "+" + this.bookingDetails?.user?.contact,
                email: tokenResult?.details?.shipping?.contact?.email || "",
            };

            try {
                var addCard = await APIHelper(
                    "POST",
                    "/api/v1/payment/addCard/" + this.bookingId,
                    cardData
                );
                console.log(addCard);
                if (addCard?.data?.status == false) {
                    this.alertMsg = addCard?.data?.message || "Error in authorizing the payment"
                    this.alertIcon = "mdi-alert-outline"
                    this.alertDialog = true;
                } else {
                    await this.getBookingState();
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getBookingState() {
            if (this.bookingId != null) {
                try {
                    var bDetails = await APIHelper(
                        "GET",
                        "/api/v1/booking/config/" + this.bookingId
                    );
                    this.$store.commit(
                        "SET_BOOKING_DETAILS",
                        bDetails.data?.data ? bDetails.data.data : null
                    );
                    let bookingState = bDetails.data?.data?.booking?.state
                        ? bDetails.data.data.booking.state
                        : null;

                    if (bookingState == 8 || bookingState == 10 || bookingState == 11) {
                        this.$router.replace({ path: "/checkout" });
                    } else if (bookingState == 2) {
                        this.$router.replace({ path: "/checkedin" });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        async verifyBuyer(payments, tokenResult) {
            const verificationDetails = {
                billingContact: tokenResult?.details?.billing,
                amount: "1",
                currencyCode: "USD",
                intent: "CHARGE",
            };
            const verificationResults = await payments.verifyBuyer(
                tokenResult?.token,
                verificationDetails
            );
            return verificationResults.token;
        },
        async initializeCard(payments) {
            const card = await payments.card();
            // await card.attach("#card-container");

            return card;
        },

        buildPaymentRequest(payments) {
            return payments.paymentRequest({
                countryCode: "US",
                currencyCode: "USD",
                requestBillingContact: true,
                requestShippingContact: true,
                total: {
                    amount: "1.00",
                    label: "Total",
                    pending: true,
                },
            });
        },

        async initializeApplePay(payments) {
            const paymentRequest = this.buildPaymentRequest(payments);
            const applePay = await payments.applePay(paymentRequest);
            // Note: You do not need to `attach` applePay.
            return applePay;
        },

        async createPayment(token) {
            let locationId = this.locationId;
            const body = JSON.stringify({
                locationId,
                sourceId: token,
            });

            const paymentResponse = await fetch("/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });

            if (paymentResponse.ok) {
                return paymentResponse.json();
            }

            const errorBody = await paymentResponse.text();
            throw new Error(errorBody);
        },

        // Change the parameter to 'paymentMethod'
        async tokenize(paymentMethod) {
            const tokenResult = await paymentMethod.tokenize();
            if (tokenResult.status === "OK") {
                return tokenResult;
            } else {
                let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
                if (tokenResult.errors) {
                    errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
                }

                throw new Error(errorMessage);
            }
        },

        // status is either SUCCESS or FAILURE;
        displayPaymentResults(status) {
            console.log("displayPaymentResults ==> status", status);
            // const statusContainer = document.getElementById(
            //   "payment-status-container"
            // );
            // if (status === "SUCCESS") {
            //   statusContainer.classList.remove("is-failure");
            //   statusContainer.classList.add("is-success");
            // } else {
            //   statusContainer.classList.remove("is-success");
            //   statusContainer.classList.add("is-failure");
            // }

            // statusContainer.style.visibility = "visible";
        },
    },
};
</script>
<style lang="less">
#card-button {
    font-size: 16px;
    font-weight: 400;
    text-transform: none;
    border-radius: 10px;
}

#apple-pay-button {
    height: 48px;
    width: 100%;
    display: inline-block;
    -webkit-appearance: -apple-pay-button;
    -apple-pay-button-type: plain;
    -apple-pay-button-style: black;
}

#payment-form {
    max-width: 550px;
    min-width: 300px;
    margin: 15px auto;
}

.buyer-inputs {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    border: none;
    margin: 0;
    padding: 0;
}

#card-container {
    margin-top: 45px;
    /* this height depends on the size of the container element */
    /* We transition from a single row to double row at 485px */
    /* Settting this min-height minimizes the impact of the card form loading */
    min-height: 90px;
}

#gift-card-container {
    margin-top: 45px;
    min-height: 90px;
}

@media screen and (max-width: 500px) {
    #card-container {
        min-height: 140px;
    }
}

#ach-button {
    margin-top: 20px;
}

#landing-page-layout {
    width: 80%;
    margin: 150px auto;
    max-width: 1000px;
}

#its-working {
    color: #737373;
}

#example-container {
    width: 100%;
    border: 1px solid #b3b3b3;
    padding: 48px;
    margin: 32px 0;
    border-radius: 12px;
}

#example-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

#customer-input {
    margin-bottom: 40px;
}

#card-input {
    margin-top: 0;
    margin-bottom: 40px;
}

// h3 {
//   margin: 0;
// }

// p {
//   line-height: 24px;
// }

// label {
//   font-size: 12px;
//   width: 100%;
// }

// input {
//   padding: 12px;
//   width: 100%;
//   border-radius: 5px;
//   border-width: 1px;
//   margin-top: 20px;
//   font-size: 16px;
//   border: 1px solid rgba(0, 0, 0, 0.15);
// }

// input:focus {
//   border: 1px solid #006aff;
// }

// button {
//   color: #ffffff;
//   background-color: #006aff;
//   border-radius: 5px;
//   cursor: pointer;
//   border-style: none;
//   user-select: none;
//   outline: none;
//   font-size: 16px;
//   font-weight: 500;
//   line-height: 24px;
//   padding: 12px;
//   width: 100%;
//   box-shadow: 1px;
// }

// button:active {
//   background-color: rgb(0, 85, 204);
// }

// button:disabled {
//   background-color: rgba(0, 0, 0, 0.05);
//   color: rgba(0, 0, 0, 0.3);
// }

#payment-status-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    border-radius: 50px;
    margin: 0 auto;
    width: 225px;
    height: 48px;
    visibility: hidden;
}

#payment-status-container.missing-credentials {
    width: 350px;
}

#payment-status-container.is-success:before {
    content: "";
    background-color: #00b23b;
    width: 16px;
    height: 16px;
    margin-right: 16px;
    -webkit-mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0968 6.31744 12.0978 5.68597 11.7093 5.29509C11.3208 4.90422 10.6894 4.90128 10.2973 5.28852L11 6C10.2973 5.28852 10.2973 5.28853 10.2973 5.28856L10.2971 5.28866L10.2967 5.28908L10.2951 5.29071L10.2886 5.29714L10.2632 5.32224L10.166 5.41826L9.81199 5.76861C9.51475 6.06294 9.10795 6.46627 8.66977 6.90213C8.11075 7.4582 7.49643 8.07141 6.99329 8.57908L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E");
    mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0968 6.31744 12.0978 5.68597 11.7093 5.29509C11.3208 4.90422 10.6894 4.90128 10.2973 5.28852L11 6C10.2973 5.28852 10.2973 5.28853 10.2973 5.28856L10.2971 5.28866L10.2967 5.28908L10.2951 5.29071L10.2886 5.29714L10.2632 5.32224L10.166 5.41826L9.81199 5.76861C9.51475 6.06294 9.10795 6.46627 8.66977 6.90213C8.11075 7.4582 7.49643 8.07141 6.99329 8.57908L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E");
}

#payment-status-container.is-success:after {
    content: "Payment successful";
    font-size: 14px;
    line-height: 16px;
}

#payment-status-container.is-failure:before {
    content: "";
    background-color: #cc0023;
    width: 16px;
    height: 16px;
    margin-right: 16px;
    -webkit-mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
    mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
}

#payment-status-container.is-failure:after {
    content: "Payment failed";
    font-size: 14px;
    line-height: 16px;
}

#payment-status-container.missing-credentials:before {
    content: "";
    background-color: #cc0023;
    width: 16px;
    height: 16px;
    margin-right: 16px;
    -webkit-mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
    mask: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L6.58579 8L4.29289 10.2929C3.90237 10.6834 3.90237 11.3166 4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071L8 9.41421L10.2929 11.7071C10.6834 12.0976 11.3166 12.0976 11.7071 11.7071C12.0976 11.3166 12.0976 10.6834 11.7071 10.2929L9.41421 8L11.7071 5.70711C12.0976 5.31658 12.0976 4.68342 11.7071 4.29289C11.3166 3.90237 10.6834 3.90237 10.2929 4.29289L8 6.58579L5.70711 4.29289Z' fill='black' fill-opacity='0.9'/%3E%3C/svg%3E%0A");
}

#payment-status-container.missing-credentials:after {
    content: "applicationId and/or locationId is incorrect";
    font-size: 14px;
    line-height: 16px;
}

#payment-status-container.is-success.store-card-message:after {
    content: "Store card successful";
}

#payment-status-container.is-failure.store-card-message:after {
    content: "Store card failed";
}

#afterpay-button {
    height: 40px;
}
</style>
  