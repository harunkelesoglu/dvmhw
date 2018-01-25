const Request = require('./request').req; //common constructor function for post request
const csv = require('fast-csv');
const moment = require('moment-timezone');
const fs = require('fs');
const writableStream = fs.createWriteStream('powerplants.csv');
const csvStream = csv.createWriteStream({headers: true});
const options = require('./request').options;
const url = "https://power.ivyiot.com/Thingworx/Things/GamaNetworkServices/Services/GetNetworkData";

const req = new Request(url,null,options); //create new instance of Request and store to the csv file
        req.promise()
            .then((res)=>{
                const obj = res.data;
                csvStream.pipe(writableStream);

                obj.rows.map((row)=>{
                    for(var key in row){
                        if(key.match(/DateTime/g)){
                            row[key] = moment(row[key]).format();
                        }
                    }

                row.location = Object.values(row.location).join();
                csvStream.write(row);
                });

                csvStream.end();
        })
        .catch((err)=>{
            console.log(err);
        })
//press to console when writing is finished
    writableStream.on("finish", () => {
            console.log("DONE!"); 
       }); 