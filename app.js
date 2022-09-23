const express = require("express");
const http = require("http");
const https = require('https');
const body_parser = require("body-parser");
const axios = require('axios');
const { PassThrough } = require("stream");



const app = express();

app.set("view engine", "ejs");
app.use(body_parser.urlencoded({extended:true}));
app.use(express.static('public'));

var image_url = '';
var bus_stop_info_list = []
const bus_stop_code = 123

app.get('/',function(req,res){

    res.sendFile(__dirname + "./public/index.html")
    

});


app.post('/',function(req,res_to_user){

    bus_stop_info_list = []

    //pass search result into One Map Search API
    console.log(req.body.searchbar)
    if (req.body.searchbar == 0){
        console.log('no input from user')
    }

    const url = "https://developers.onemap.sg/commonapi/search?searchVal="+req.body.searchbar+"&returnGeom=Y&getAddrDetails=N"
    https.get(url,function(response){
        response.on("data",function(data){
            const search_results = JSON.parse(data);
            console.log(search_results);

            if(search_results.error){
                console.log(search_results.error);
                res_to_user.send('failed');
            }

            else if (search_results.found == 0){
                console.log('no result');
                res_to_user.send('<h1> No such location :( </h1>')
            }

            else{
                //Take the first string returned from onemap as our search result
                const search_result = search_results.results[0];
                const lat = search_result.LATITUDE;
                const lon = search_result.LONGTITUDE;



                //use the lat and lon of bus stop obtained to search on onemap the nearby busstops
                nearby_url = "https://www.onemap.gov.sg/nearby-api/getNearestBusStops?lat="+lat+"&lon="+lon;
                https.get(nearby_url,function(response){
                    response.on("data",function(data){
                        const bus_stops = JSON.parse(data);

                        //find the distance of the bus stops from mrt
                        const distance_list = []
                        for (let i = 0; i < bus_stops.length; i++) {
                            const distance = ( (lon - bus_stops[i].lon)**2 + (lat - bus_stops[i].lat)**2 )**0.5
                            distance_list.push( [i,distance] )
                        }

                        function sort_distance(a,b){
                            return a[1] - b[1]
                        }
                        // console.log("distance list print ", distance_list)
                        // console.log("distance list print sorted ", distance_list.sort(sort_distance))

                        //loop through the distances obtained and find the three nearest bus stops


                        //________get static image with pointers of 3 nearest bus stops_____________
                        const point1 = JSON.stringify([bus_stops[0].lat,bus_stops[0].lon,"255,255,178","1"])
                        const point2 = JSON.stringify([bus_stops[1].lat,bus_stops[1].lon,"255,255,178","2"])
                        const point3 = JSON.stringify([bus_stops[2].lat,bus_stops[2].lon,"255,255,178","3"])
                        const points = point1 + '|' + point2 + '|' + point3
                        image_url =  "https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=original&lat=" + lat + "&lng=" + lon + "&zoom=17&width=400&height=240&points=" + points;





                //______________Make multiple requests with axios___________________
                        const axios_options = {
                            headers : {AccountKey: 'KXvOyR5/Rz26mQ4fjEvUyw=='}
                                
                        }

                        //function to make get request for a single bus stop
                        function axios_get_bus_stop(code){
                            return axios.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode='+code ,axios_options);
                        }

                        //functions to create an array of bus stop request
                        function create_promise_array(){
                            const promise_array =[];
                            bus_stops.forEach((bus_stop,index)=> {
                                if (index < 3){
                                    promise_array.push(axios_get_bus_stop(bus_stop.id)) ;
                                }
                                else{
                                    null;
                                }
                            });
                            return promise_array;
                        }

                        //use axios to make multiple get request in parallel (prevents broken response and quicker)
                        axios.all(create_promise_array()).then(function(response){
                            response.map(ele=>ele.data).forEach(element => {
                                bus_stop_info_list.push(element)
                            });
                            //render the page again
                            function correct_format(bus_time){
                                return bus_time.slice(11,16)
                            }

                            res_to_user.render("index",{map_url:image_url, list_of_bus_stops:bus_stop_info_list ,bus_stop_code:bus_stop_code, correct_format:correct_format});

                        }).catch(
                            error=>{
                                console.log(error);
                            }
                        )
                    })
                })
            }
        })
    })
})

app.listen(process.env.PORT || 3000,function(){
    console.log('app is running on 3000');

})


