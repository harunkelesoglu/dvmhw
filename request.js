const axios = require('axios');

function Request(url,params,options){
    this.url = url;
    this.params = params;
    this.options = options;  
};
Request.prototype.promise = function promise() {
    return axios.post(this.url,this.params,this.options)
}

function Handle(promises,callback){
    axios.all(promises)
            .then(callback);
}
module.exports = {
    req:Request,
    handle:Handle,
    options:{
        headers: {
            Accept: "application/json",
            appKey: "9a3ab6d8-9ffe-49a5-8194-bc7d61123f4a" 
        }
    }
}