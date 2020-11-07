const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// import Models
const SubmissionModel = require('../Models/Submission');

//[GET] getResults (quiz-code results -- this is for all students)
router.get('/allStudents', (req, res) => {
  SubmissionModel.find({ QuizCode: req.body['QuizCode'] })
    .select('StudentName TotalScore')
    .sort('-TotalScore')
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
});

//[GET] getSubmission (from submission-id) for a particular student
router.get('/:SubmissionCode', (req, res) => {
  let ViewSubmissionCode = req.params['SubmissionCode'];
  SubmissionModel.find({ ViewSubmissionCode: ViewSubmissionCode })
    .select('StudentName answers TotalScore')
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
});

module.exports = router;
