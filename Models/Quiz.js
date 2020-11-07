const mongoose = require('mongoose');

const Quiz = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  questions: [
    {
      id: Number,
      question: String,
      answer: String,
      score: Number,
    },
  ],
  ViewSubmissionCode: String,
  QuizCode: String,
});

module.exports = mongoose.model('Quiz', Quiz, 'quizzes');
