const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// import Models
const QuizModel = require('../Models/Quiz');

// [POST] addQuiz (to submit questions)
router.post('/', (req, res) => {
  let RandViewSubmissionCode = Math.floor(Math.random() * 1000000000);
  let RandQuizCode = Math.floor(Math.random() * 1000000000);

  const newQuiz = new QuizModel({
    _id: new mongoose.Types.ObjectId(),
    questions: req.body,
    ViewSubmissionCode: RandViewSubmissionCode,
    QuizCode: RandQuizCode,
  });

  newQuiz
    .save()
    .then((result) => {
      console.log(result);
    })
    .then(() => {
      res.status(200).json({
        ViewSubmissionCode: RandViewSubmissionCode,
        QuizCode: RandQuizCode,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// [GET] getQuiz (fetch quiz questions using given QuizCode)
router.get('/:QuizCode', (req, res) => {
  let quizCode = req.params['QuizCode'];

  QuizModel.find({ QuizCode: quizCode })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
