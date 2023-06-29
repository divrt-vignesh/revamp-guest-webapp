import apiHelper from "./apiHelper";

/**
 * All declarations
 * @param {*} data is request data received from each API call.
 * @returns response
 */
const addCard = async (data, bid) => {
    return await apiHelper("POST", "/api/v1/payment/addCard/" + bid, data);
};

const getBookingState = async (bid) => {
    return await apiHelper("GET", "/api/v1/booking/config/" + bid)
};

const extendReservation = async (data) => {
    return await apiHelper("POST", "/api/v1/prepaid/extendReservation", data)
}

const getRate = async (data) => {
    return await apiHelper("POST", "/api/v2/getRate", data)
}
const getPedestrianAccess = async (bid, source) => {
    return await apiHelper("POST", "api/v1/open/" + bid,
        { source: source })
}
const qrCheckout = async (data, bid) => {
    return await APIHelper(
        "POST",
        "/api/v1/checkout/" + bid,
        data
    )
}
const validateBooking = async (data, bid) => { return await apiHelper("POST", "/api/v1/validate/" + bid, data) }

const getZoneDetails = async (searchParamKey, searchParamValue) => {
    return await APIHelper(
        "GET",
        "/api/v1/user/config" + searchParamKey + "=" + searchParamValue
    );
}

const createHostPass = async (data) => {
    return await APIHelper(
        "POST",
        "api/v2/merchant/createReservation",
        data
    )
}

const prepaidOpenTransaction = async (data) => {
    return await APIHelper("POST", "/api/v1/prepaid/openTransaction", data)

}

const getOnDemandZoneDetails = async (searchParamValue) => {
    return await APIHelper(
        "GET",
        "/api/v1/getOnDemand/" + searchParamValue
    )
}
const createSession = async (data) => {
    return await APIHelper("POST", "/api/v1/addBooking", data)
}
const findBooking = async (data) => {
    return await APIHelper(
        "POST",
        "/api/v1/findBooking",
        data
    )
}

const modifyLPR = async (data, bid) => {
    return await APIHelper(
        "PATCH",
        "/api/v1/modifyLPR/" + bid,
        data
    )
}

const disassociateCard = async (data) => {
    return await APIHelper("POST", "/api/v1/disassociateCard", data)
}

const reEnter = async (bid) => {
    return await APIHelper(
        "GET",
        "/api/v1/booking/config/" + bid + "?reEnter=1"
    )
}
/**
 * export declarations
 */
export {
    reEnter, disassociateCard, modifyLPR, findBooking, createSession, getOnDemandZoneDetails, prepaidOpenTransaction, createHostPass, getZoneDetails, validateBooking, qrCheckout, getPedestrianAccess, getRate, extendReservation, getBookingState, addCard

}