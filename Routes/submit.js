const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// import Models
const SubmissionModel = require('../Models/Submission');

// [POST]submitQuizAns (user answer submission)
router.post('/', (req, res) => {
  const newSubmission = new SubmissionModel({
    StudentName: req.body['studentName'],
    answers: req.body['answers'],
    QuizCode: req.body['QuizCode'],
    ViewSubmissionCode: req.body['ViewSubmissionCode'],
    TotalScore: 0,
  });

  newSubmission
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).send('Submission Received | OK');
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
});

module.exports = router;
