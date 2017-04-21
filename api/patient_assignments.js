var db = require('./database');
var express = require("express");
var router = express.Router();

// ---------Patient Assignment CRUD Functions-----------

var PatientAssignment = {

  // patient_assigment_id, ehrID, speciality_id, meeting_occurence_id

  getAllPatientAssignments:function(callback){
    return db.query("Select * from patient_assignments",callback);
  },
  getPatientAssignmentById:function(id,callback){
    return db.query("select * from patient_assignments WHERE patient_assigment_id=?",[id],callback);
  },
  getPatientAssignmentByMeetingOccurence:function(id,callback){
      return db.query("select * from patient_assignments WHERE meeting_occurence_id=?",[id],callback);
  },
  addPatientAssignment:function(PatientAssigment,callback){
    return db.query('INSERT INTO patient_assignments SET ?', PatientAssigment,callback);
  },
  deletePatientAssignment:function(id,callback){
    return db.query("delete from patient_assignments where patient_assigment_id=?",[id],callback);
  },
  updatePatientAssignment:function(id,PatientAssigment,callback){
    PatientAssigment.patient_assigment_id = parseInt(id);
    return db.query("UPDATE patient_assignments SET speciality_id=?, ehrID=?, meeting_occurence_id=? WHERE patient_assigment_id= ?",[PatientAssigment.speciality_id,PatientAssigment.ehrID,PatientAssigment.meeting_occurence_id,PatientAssigment.patient_assigment_id],callback);
  },
  initTable:function(){
    var init = db.query(`CREATE TABLE IF NOT EXISTS patient_assignments
    (patient_assigment_id MEDIUMINT NOT NULL AUTO_INCREMENT,
    speciality_id MEDIUMINT NOT NULL,
    meeting_occurence_id MEDIUMINT NOT NULL,
    ehrID varchar(500),
      assigned_date TIMESTAMP, PRIMARY KEY (referral_id))
     ENGINE=InnoDB DEFAULT CHARSET=latin1;` , function (error, results, fields) {
    });
  }

};

// ----------Patient assignments ROUTES----------

router.get('/meeting_occurence/:id',function(req,res,next){

    Referral.getPatientAssignmentByMeetingOccurence(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });

});

// Get a patient assigment by id - Get all patient assigment if id not specified
router.get('/:id?',function(req,res,next){
  if(req.params.id){
    Referral.getPatientAssignmentById(req.params.id,function(err,rows){
      if(err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else{
    Referral.getAllPatientAssignments(function(err,rows){
      if(err){
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  }
});

// Insert patient assigment
router.post('/',function(req,res,next){
  Referral.addPatientAssignment(req.body.PatientAssigment,function(err,result){
    if(err) {
      res.json(err);
    } else{
      res.status(201);
      res.json(result);
    }
  });
 });

// Delete patient assigment
router.delete('/:id',function(req,res,next){
 Referral.deletePatientAssignment(req.params.id,function(err,result){
   if(err) {
     res.json(err);
   } else{
     res.json(result);
   }
 });
});

// Update patient assigment
router.put('/:id',function(req,res,next){
  Referral.updatePatientAssignment(req.params.id,req.body.PatientAssigment,function(err,result){
    if(err) {
      res.json(err);
    } else{
      res.json(result);
    }
  });
 });
module.exports=PatientAssignment;
module.exports.router = router;
