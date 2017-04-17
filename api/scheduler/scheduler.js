var db = require('../database');
var express = require("express");
var router = express.Router();


// ---------Scheduler CRUD Functions-----------

var Scheduler = {

    //

};

// ----------Scheduler ROUTES----------

// Get all meetings in a month with specialities
router.get('/:month/:year?',function(req,res,next){
    console.log('hey')
    var callback = function(rows) {
        console.log("\n\nend "+JSON.stringify(rows));
        res.json(rows);
    }

    db.query("select * from meetings_occurences LEFT JOIN meetings ON meetings_occurences.meeting_id=meetings.meeting_id where MONTH(occurence_date)=? AND YEAR(occurence_date)=? ",[req.params.month,req.params.year],function(err,rows,fields){
      if(err) {
        res.json(err);
      } else {
            var pending = rows.length;
            if (pending==0 || rows == []){
                callback([]);
            }

            var clearSpecialities = function (specialities){
                for (var speciality of specialities){
                    delete speciality["meeting_id"];
                    delete speciality["speciality_assigment_id"];
                }
                return specialities;
            }


            var getSpecialities = function(row) {

                  console.log("\n \n before- "+JSON.stringify(row));

                  db.query("select * from specialities_assigments LEFT JOIN specialities ON specialities.speciality_id=specialities_assigments.speciality_id where meeting_id=?",row.meeting_id,function(err,results,fields){
                      if(err) {
                        res.json(err);
                      } else {
                          results = clearSpecialities(results);
                          row.specialities = results;

                          if (0 === --pending) {
                                callback(rows);
                          }
                          console.log("\n \ndone- "+JSON.stringify(row));
                      }
                  });
            }

            rows.map(getSpecialities);
      }
    });

});



module.exports=Scheduler;
module.exports.router = router;
