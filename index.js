var request = require('request')
var turf = require('turf')
var fs = require('fs')

var vehicles = {}
var currentFile = ''

setInterval(function(){
  request('http://www.wsdot.com/ferries/vesselwatch/Vessels.ashx', function(err, res, body){
    try{
      var time = new Date()
      var file = __dirname + '/out/'+time.getFullYear()+'-'+time.getMonth()+'-'+time.getDay()+'-'+time.getHours()+'.geojson'

      if(file !== currentFile) {
        vehicles = {}
        currentFile = file
      }

      var data = JSON.parse(body).vessellist

      data.forEach(function(ferry){
        if(!vehicles[ferry.vesselID]) {
          vehicles[ferry.vesselID] = turf.linestring([], {id: ferry.vesselID, times: []})
        }
        var lastCoord = vehicles[ferry.vesselID].geometry.coordinates[vehicles[ferry.vesselID].geometry.coordinates.length - 1]
        if(vehicles[ferry.vesselID].geometry.coordinates.length === 0 || !(lastCoord[0] === ferry.lon && lastCoord[1] === ferry.lat)){
          vehicles[ferry.vesselID].geometry.coordinates.push([
              ferry.lon,
              ferry.lat
            ])
          vehicles[ferry.vesselID].properties.times.push(time.getMinutes()+':'+time.getSeconds())
        }
      })

      fs.writeFileSync(file, JSON.stringify(getTraces(vehicles)))
    } catch(e){
      console.log(e)
    }
  })
}, 10000)

function getTraces (vehicles) {
  return turf.featurecollection(Object.keys(vehicles).map(function(route){
    return vehicles[route]
  }).filter(function(route){
    if(route.geometry.coordinates.length > 1) return true
  }))
}