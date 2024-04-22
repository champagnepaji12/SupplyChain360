var express = require('express');
var router = express.Router();
const gpsdata = require("../models/gpsdata");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IoT project' });
});

router.post("/addgpsdata",(req,res) =>{
  const {assetnumber, latitude, longitude} = req.body;
  let errors = [];

  if(!assetnumber || !latitude || !longitude){
    errors.push({msg : "Parameters are missing"});
  }
  if(errors.length>0){
    res.json({Message : errors})
  }else{
    const newgpsdata = new gpsdata({
      assetnumber,
      latitude,
      longitude
    });

    newgpsdata
    .save()
    .then(newgpsdata => {
      res.json({ Message: "Data Inserted"});
    })
    .catch(err => console.log(err));
  }
});
module.exports = router;

router.get("/getdata/:assetnumber", (req, res) => {
  var assetnumber = req.params.assetnumber;
  console.log("Asset Number:", assetnumber);

  gpsdata.find({ assetnumber: assetnumber }).exec()
    .then(notenumber => {
      if (!notenumber || notenumber.length === 0) {
        console.log("No data found for asset number:", assetnumber);
        return res.status(404).json({ message: "No data found for the specified asset number" });
      }

      // Map the retrieved data to the desired format
      const formattedData = notenumber.map(data => ({
        updatedate: data.updatedate,
        assetnumber: data.assetnumber,
        latitude: data.latitude,
        longitude: data.longitude
      }));

      console.log("Data retrieved successfully:", formattedData);
      res.json(formattedData);
    })
    .catch(err => {
      console.error("Error retrieving data:", err);
      res.status(500).json({ error: "An error occurred while retrieving data" });
    });
});



/*
{
  "assetnumber" : "1234324",
  "latitude" : "1231313",
  "longitude" : "123145646"
}

*/