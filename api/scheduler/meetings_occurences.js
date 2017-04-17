var db = require('../database');
var express = require("express");
var router = express.Router();



// ---------Meetings Occurences CRUD Functions-----------

var MeetingOccurence = {

  // meeting_occurence_id, meeting_id, occurence_date

  getAllMeetingsOccurences:function(callback){
    return db.query("Select * from meetings_occurences LEFT JOIN meetings ON meetings_occurences.meeting_id=meetings.meeting_id",callback);
  },
  getMeetingOccurenceById:function(id,callback){
    return db.query("select * from meetings_occurences LEFT JOIN meetings ON meetings_occurences.meeting_id=meetings.meeting_id where meeting_occurence_id=?",[id],callback);
  },
  getMeetingOccurenceInMonth:function(month,year,callback){
    return db.query("select * from meetings_occurences LEFT JOIN meetings ON meetings_occurences.meeting_id=meetings.meeting_id where MONTH(occurence_date)=? AND YEAR(occurence_date)=? ",[month,year],callback);
  },
  addMeetingOccurence:function(MeetingOccurence,callback){
    return db.query('INSERT INTO meetings_occurences SET ?', MeetingOccurence,callback);
  },
  deleteMeetingOccurence:function(id,callback){
    return db.query("delete from meetings_occurences where meeting_occurence_id=?",[id],callback);
  },
  updateMeetingOccurence:function(id,MeetingOccurence,callback){
    MeetingOccurence.meeting_occurence_id = parseInt(id);
    return db.query("UPDATE meetings_occurences SET meeting_id=?,occurence_date=? WHERE meeting_occurence_id= ?",[MeetingOccurence.meeting_id,MeetingOccurence.occurence_date,MeetingOccurence.meeting_occurence_id],callback);
  },
  initTable:function(){
    var init = db.query(`CREATE TABLE IF NOT EXISTS meetings_occurences
    (meeting_occurence_id MEDIUMINT NOT NULL AUTO_INCREMENT, meeting_id MEDIUMINT NOT NULL, occurence_date DATE NOT NULL, PRIMARY KEY (meeting_occurence_id))
     ENGINE=InnoDB DEFAULT CHARSET=latin1;` , function (error, results, fields) {
      if (error) {
        console.log(error);
      }
    });
  }

};

// ----------Meetings Occurencs ROUTES----------

// Get a meeting by id - Get all meetings if id not specified
router.get('/:id?',function(req,res,next){

  if(req.params.id){
    MeetingOccurence.getMeetingOccurenceById(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else{
    MeetingOccurence.getAllMeetingsOccurences(function(err,rows){
      if(err){
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

router.get('/:month/:year',function(req,res,next){

    MeetingOccurence.getMeetingOccurenceInMonth(req.params.month,req.params.year,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
});

// Insert Meeting
router.post('/',function(req,res,next){

        MeetingOccurence.addMeetingOccurence(req.body.MeetingOccurence,function(err,result){
            if(err) {
                console.log(err);
              res.json(err);
            } else{
                res.status(201);
                res.json(result);
            }
        });

 });

// Delete Meeting
router.delete('/:id',function(req,res,next){
 MeetingOccurence.deleteMeetingOccurence(req.params.id,function(err,result){
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

      MeetingOccurence.updateMeetingOccurence(req.params.id,req.body.MeetingOccurence,function(err,result){
        if(err) {
          console.log(err);
          res.json(err);
        } else{
          res.json(result);
        }
      });

 });



module.exports=MeetingOccurence;
module.exports.router = router;
