### project-hktram

#### Description

* The purpose of this project is to retrieve tram information, including 
  * list of tram stops, and
  * estimated arrival time of the next trams
* NodeJS is used to for the backend. It makes HTTP call to http://www.hktramways.com, parses the result from Javascript/XML and returns the result in JSON format.
* Two single web pages making use of the backend to demostrate the API call results in the form of plain text or via Google Map.

##### Backend API

1. List of Tram Stops
* `/list`
* Response
  * "EB" represents East Bounds
  * "WB" represents West Bounds
```json
{
  "EB": [
    [
      "SKT",
      "Shau Kei Wan Terminus",
      "筲箕灣總站",
      "筲箕湾总站",
      22.277781,
      114.230257
    ],
    [
      "101E",
      "Chai Wan Road",
      "柴灣道",
      "柴湾道",
      22.276734,
      114.229391
    ]
  ],
  "WB": [
    [
      "SKT",
      "Shau Kei Wan Terminus",
      "筲箕灣總站",
      "筲箕湾总站",
      22.277781,
      114.230257
    ],
    [
      "02W",
      "Chai Wan Road",
      "柴灣道",
      "柴湾道",
      22.27674,
      114.22921
    ]
  ]
}
```
2. Estimated Arrival Time
* `/eta?stop=<code>`
* Response
```json
{
  "root": {
    "metadata": [
      {
        "$": {
          "arrive_in_minute": "1",
          "arrive_in_second": "-8",
          "is_arrived": "1",
          "stop_code": "76W",
          "seq": "2",
          "tram_id": "4",
          "eat": "Jul 26 2016  9:30AM",
          "dest_stop_code": "KTT",
          "tram_dest_tc": "堅尼地城總站",
          "tram_dest_en": "Kennedy Town Terminus",
          "is_last_tram": "0"
        }
      },
      {
        "$": {
          "arrive_in_minute": "2",
          "arrive_in_second": "82",
          "is_arrived": "0",
          "stop_code": "76W",
          "seq": "3",
          "tram_id": "19",
          "eat": "Jul 26 2016  9:31AM",
          "dest_stop_code": "WST",
          "tram_dest_tc": "石塘咀總站",
          "tram_dest_en": "Shek Tong Tsui Terminus",
          "is_last_tram": "0"
        }
      }
    ]
  }
}
```

##### Frontend

* Two simple html pages were created making use of the API for demostration.
  * `text.html` Text version, ETA shown when stop name is pressed.
  * `map.html` Tram stops shown on Google map. ETA shown when marker is pressed.


#### Heroku

This project is deployed on Heroku.
* To setup, the following environment variable(s) need to be set
  * `GOOGLE_API_KEY=<Your Google Map API Key>`

##### Backend API
1. List of Tram Stops
http://hktram.herokuapp.com/list
2. Estimated Arrival Time
http://hktram.herokuapp.com/eta?stop=[code]

##### Frontend
1. Text Version
http://hktram.herokuapp.com/text.html
2. Map Version
http://hktram.herokuapp.com/map.html
