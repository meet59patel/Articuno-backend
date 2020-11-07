const mongoose = require('mongoose');

const Submission = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  StudentName: String,
  answers: [
    {
      id: Number,
      answer: String,
      CalculatedScore: Number,
    },
  ],
  ViewSubmissionCode: String,
  QuizCode: String,
  TotalScore: Number,
});

module.exports = mongoose.model('Submission', Submission, 'submissions');
