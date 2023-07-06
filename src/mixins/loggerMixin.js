import loggerHelper from "../loggerHelper";
export default {
  methods:{
    postToLoggerAPI(data){
      const loggerRequestData = {
        "prjId": 1,
        "srcId": 8
      }
      let postObj = Object.assign({},data, loggerRequestData, {status:"Web App event"})
      try {
        loggerHelper("POST", "",postObj);
      } catch (error) {
        console.log(error);
      }
    }
  }
};