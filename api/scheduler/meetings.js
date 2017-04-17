var db = require('../database');
var express = require("express");
var router = express.Router();



// ---------Meetings CRUD Functions-----------

var Meeting = {

  // meeting_id, title, starting_time, ending_time

  getAllMeetings:function(callback){
    return db.query("Select * from meetings",callback);
  },
  getMeetingById:function(id,callback){
    return db.query("select * from meetings where meeting_id=?",[id],callback);
  },
  addMeeting:function(Meeting,callback){
    return db.query('INSERT INTO meetings SET ?', Meeting,callback);
  },
  deleteMeeting:function(id,callback){
    return db.query("delete from meetings where meeting_id=?",[id],callback);
  },
  updateMeeting:function(id,Meeting,callback){
    Meeting.meeting_id = parseInt(id);
    console.log(Meeting);
    return db.query("UPDATE meetings SET title=?,starting_time=?,ending_time=? WHERE meeting_id= ?",[Meeting.title,Meeting.starting_time,Meeting.ending_time,Meeting.meeting_id],callback);
  },
  initTable:function(){
    var init = db.query(`CREATE TABLE IF NOT EXISTS meetings
    (meeting_id MEDIUMINT NOT NULL AUTO_INCREMENT, title varchar(500) NOT NULL, starting_time TIME, ending_time TIME, created_at TIMESTAMP, PRIMARY KEY (meeting_id))
     ENGINE=InnoDB DEFAULT CHARSET=latin1;` , function (error, results, fields) {
      if (error) {
        console.log(error);
      }
    });
  }

};

// ----------Meetings ROUTES----------

// Get a meeting by id - Get all meetings if id not specified
router.get('/:id?',function(req,res,next){

  if(req.params.id){
    Meeting.getMeetingById(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else{
    Meeting.getAllMeetings(function(err,rows){
      if(err){
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

// Insert Meeting
router.post('/',function(req,res,next){
    //Make sure starting time is before ending time
    var starting_date = '01/01/2017 '+req.body.Meeting.starting_time;
    var ending_date = '01/01/2017  '+req.body.Meeting.ending_time;

    if (Date.parse(starting_date) >= Date.parse(ending_date)){
        res.status(400);
        res.json({"err":"Starting time must be before ending time."});
    } else {
        Meeting.addMeeting(req.body.Meeting,function(err,result){
            if(err) {
              res.json(err);
            } else{
                res.status(201);
                res.json(result);
            }
        });
    }
 });

// Delete Meeting
router.delete('/:id',function(req,res,next){
 Meeting.deleteMeeting(req.params.id,function(err,result){
   if(err) {
     console.log(err);
     res.json(err);
   } else{
     res.json(result);
   }
 });
});

// Update Meeting
router.put('/:id',function(req,res,next){
    //Make sure starting time is before ending time
    var starting_date = '01/01/2017 '+req.body.Meeting.starting_time;
    var ending_date = '01/01/2017  '+req.body.Meeting.ending_time;

    if (Date.parse(starting_date) >= Date.parse(ending_date)){
        res.status(400);
        res.json({"err":"Starting time must be before ending time."});
    } else {
      Meeting.updateMeeting(req.params.id,req.body.Meeting,function(err,result){
        if(err) {
          console.log(err);
          res.json(err);
        } else{
          res.json(result);
        }
      });
    }
 });



module.exports=Meeting;
module.exports.router = router;
