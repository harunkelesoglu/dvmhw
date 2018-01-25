const csv = require('fast-csv');
const moment = require('moment-timezone');
const Request = require('./request').req;
const Handle = require('./request').handle;
const fs = require('fs');
const readableStream = fs.createReadStream("powerplants.csv");
const writableStream = fs.createWriteStream('harun_kelesoglu_minutereadings.csv');
const csvStream = csv.createWriteStream({headers: true});  
const options = require("./request").options;
const url = "https://power.ivyiot.com/Thingworx/Things/GamaNetworkServices/Services/GetHistoricDataByMinute";



const meters = []; 
const promises = []; 

//get meterID from powerplants file and push it to meters array
csv.fromStream(readableStream,{headers:true})
    .on('data',(data)=>{
        meters.push(data['meter'])
    })
    .on('end',()=>{
        console.log('meterIDs are received from file and push it to meters array');
        getEnergyAndStore(); //
    });

    //press to console when writing is finished
    writableStream.on("finish", () => {
        console.log("energy generations from all plants were stored in the csv file"); 
    });

 //  receives energy generations from all powerplants and stores them
const getEnergyAndStore = () => {
        //creates a new request and pushes it to promises array
        for(var i in meters){
            const params = {
                startDateTime: "2018-01-25T10:40:31Z",
                endDateTime: "2018-01-25T10:47:31Z",
                meter: meters[i]
            };
            const req = new Request(url,params,options);
            promises.push(req.promise());
        }

    //handle promise in promises array and response of them is store to csv file
        Handle(promises,function(responses){
            csvStream.pipe(writableStream);
            for(var i in responses){
                responses[i].data.rows.map( row => {
                    row['receivedTime'] = moment(row['receivedAt']).toString();
                    csvStream.write(row)
                })
            }

            csvStream.end();
        })
}
            
        
    
    

