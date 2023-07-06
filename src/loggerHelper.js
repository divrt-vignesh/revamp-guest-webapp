import axios from 'axios';
const loggerAPI = axios.create({
  baseURL: process.env.VUE_APP_LOGGER_URL,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});



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
    return loggerAPI.get(url, data);
  } catch (error) {
    return error
  }
};

const apiPostRequest = async (url, data) => {
  try {
    return loggerAPI.post(url, data)
  } catch (error) {
    return error
  }
};

const apiDeleteRequest = async (url, data) => {
  try {
    return loggerAPI.delete(url, data)
  } catch (error) {
    return error
  }
};

const apiPutRequest = async (url, data) => {
  try {
    return loggerAPI.put(url, data)
  } catch (error) {
    return error
  }
};

export default processRequest;