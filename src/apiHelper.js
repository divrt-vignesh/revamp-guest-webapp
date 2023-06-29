import axios from 'axios';

/**
 * @function showAlert show/hide the alert "Session Close" 
 * @param {*} msg is the message that needs to be shown
 */
function showAlert(msg){
  var alertDiv = document.createElement("div");
  alertDiv.innerHTML = '<p>'+ msg + '</p>';
  alertDiv.style.position = 'absolute';
  alertDiv.style.top = '5%';
  alertDiv.style.right = '50%';
  alertDiv.style.border='1px solid grey';
  alertDiv.style.padding="20px 40px";
  alertDiv.style.background="red";
  alertDiv.style.zIndex="99999";
  document.body.appendChild(alertDiv);   
  setTimeout(() => {
    alertDiv.remove();
 }, 5000);
}

/**
 * Create axios  instance
 */
const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL , //'https://meghak2.divrt.co/api/v1/',
  // baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
/** Axios interceptors:  request, response interceptors used to manage the flow of the request and response data. Added logic to handle response for session status. */
API.interceptors.request.use(
  request => {
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  response => {
    /** sesion check - cases */
    if (response?.data?.message && response.data.message == "Session expired" && !window.location.hash.includes('login') && !window.location.hash.includes('forgotpassword')) {
      if (!localStorage.getItem('divrtToken') == "") {
        // alert("Session Expired");  
        showAlert("Session Expired")
        localStorage.setItem('divrtToken', "");
        window.location.replace("/")
      }

    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

const processRequest = async (reqType, url, data) => {
  switch (reqType) {
    case 'GET':
      try {
        var apiGetResponse = await apiGetRequest(url, data);
        return apiGetResponse;
      } catch (error) {
        console.log(error);
      }
      break;
    case 'POST':
      try {
        var apiPostResponse = await apiPostRequest(url, data);
        return apiPostResponse;
      } catch (error) {
        console.log(error);
      }
      break;
    case 'PUT':
      try {
        var apiPutResponse = await apiPutRequest(url, data);
        return apiPutResponse;
      } catch (error) {
        console.log(error);
      }
      break;
    case 'DELETE':
      try {
        var apiDeleteResponse = await apiDeleteRequest(url, data);
        return apiDeleteResponse;
      } catch (error) {
        console.log(error);
      }
      break;
  }
};
const apiGetRequest = async (url, data) => {
  try {
    return API.get(url, {params:data})
  } catch (error) {
    return error
  }
};

const apiPostRequest = async (url, data) => {
  try {
    return API.post(url, data)
  } catch (error) {
    return error
  }
};

const apiDeleteRequest = async (url, data) => {
  try {
    console.log(data)
    return API.delete(url, {data:data})
  } catch (error) {
    return error
  }
};

const apiPutRequest = async (url, data) => {
  try {
    return API.put(url, data)
  } catch (error) {
    return error
  }
};

export default processRequest;