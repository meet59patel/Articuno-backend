const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// import Models
const SubmissionModel = require('../Models/Submission');
const QuizModel = require('../Models/Quiz');

const flaskServer = process.env.BRAIN_URL || ''; // Flask Server URL

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
      return result;
    })
    .then((savedSubmission) => {
      // Evaluate answers as soon as submitted
      /* let studentAns = 'someAns';
      let teacherAns = 'correctAns';
      const reqBody = {
        one: studentAns,
        two: teacherAns,
      };
      fetch(flaskServer, {
        method: 'post',
        body: JSON.stringify(reqBody),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((score) => console.log('***Scores are: ***', score)); */
      studAnsList = req.body['answers'];
      studAnsList.forEach((ans) => {
        QuizModel.find({ QuizCode: parseInt(req.body['QuizCode']) })
          .then((questions) => {
            // console.log('Going through these Qs: ', questions[0]['questions']);
            let correspondingQuestion = questions[0]['questions'].find(
              (element) => element.id == ans.id
            );
            // console.log('Corr Q is: ', correspondingQuestion);

            let teacherAnswer = correspondingQuestion['answer'];
            let studentAnswer = ans.answer;
            // console.log('teacherans:', teacherAnswer);
            // console.log('studentans:', ans.answer);
            const reqBody = {
              one: studentAnswer,
              two: teacherAnswer,
            };

            // Evaluate score form Flask Server and update score
            fetch(flaskServer, {
              method: 'post',
              body: JSON.stringify(reqBody),
              headers: { 'Content-Type': 'application/json' },
            })
              .then((res1) => res1.json())
              .then((score) => {
                console.log('***Scores are: ***', score);
                ans['CalculatedScore'] = score;
                console.log('logagain: ', ans);
                console.log(studAnsList);
                return studAnsList;
              })
              .then((studAnsList) => {
                // update calculated score here
                let submissionMongoID = savedSubmission['_id'];
                console.log('Saving to _id: ', submissionMongoID);
                SubmissionModel.findOneAndUpdate(
                  { _id: submissionMongoID },
                  { answers: studAnsList },
                  { useFindAndModify: false, upsert: true, new: true }
                )
                  .exec()
                  .then(console.log)
                  .catch(console.log);
              })
              .catch(console.log);
          })
          .then(() => {
            console.log('final log:', ans);
          })
          .catch(console.log);
      });
    })
    .catch((err) => {
      // res.status(500).json({ error: err });
      console.log(err);
    });
});

router.get('/', (req, res) => {
  let studAnsList = req.body['answers'];
  let quizCode = 15416683;

  studAnsList
    .forEach((ans) => {
      QuizModel.find({ QuizCode: quizCode })
        .then((questions) => {
          // console.log('Going through these Qs: ', questions[0]['questions']);
          let correspondingQuestion = questions[0]['questions'].find(
            (element) => element.id == ans.id
          );
          // console.log('Corr Q is: ', correspondingQuestion);

          let teacherAnswer = correspondingQuestion['answer'];
          let studentAnswer = ans.answer;
          // console.log('teacherans:', teacherAnswer);
          // console.log('studentans:', ans.answer);
          const reqBody = {
            one: studentAnswer,
            two: teacherAnswer,
          };

          // Evaluate score form Flask Server and update score
          fetch(flaskServer, {
            method: 'post',
            body: JSON.stringify(reqBody),
            headers: { 'Content-Type': 'application/json' },
          })
            .then((res1) => res1.json())
            .then((score) => {
              console.log('***Scores are: ***', score);
              ans['CalculatedScore'] = score;
              console.log('logagain: ', ans);
              console.log(studAnsList);
              return studAnsList;
            })
            .then((studAnsList) => {
              // update calculated score here
              let submissionMongoID = savedSubmission['_id'];
              console.log('Saving to _id: ', submissionMongoID);
              SubmissionModel.findOneAndUpdate(
                { _id: submissionMongoID },
                { answers: studAnsList },
                { useFindAndModify: false, upsert: true, new: true }
              )
                .exec()
                .then(console.log)
                .catch(console.log);
            })
            .catch(console.log);
        })
        .then(() => {
          console.log('final log:', ans);
        })
        .catch(console.log);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
});

/* let quizCode = '44765484';
  let studAnsList = [
    {
      id: 934197617,
      answer: 'someone is lol',
    },
    {
      id: 784207710,
      answer: 'someone is the..:P',
    },
    {
      id: 625246945,
      answer: 'okay then :)',
    },
  ];

  studAnsList.forEach((ans) => {
    QuizModel.find({ QuizCode: quizCode })
      .then((questions) => {
        // console.log('Going through these Qs: ', questions[0]['questions']);
        let correspondingQuestion = questions[0]['questions'].find(
          (element) => element.id == ans.id
        );
        // console.log('Corr Q is: ', correspondingQuestion);

        let teacherAnswer = correspondingQuestion['answer'];
        let studentAnswer = ans.answer;
        console.log('studentans:', ans.answer);
        console.log('teacherans:', teacherAnswer);
        const reqBody = {
          one: studentAnswer,
          two: teacherAnswer,
        };

        // evaluate score from Flask server
        fetch(flaskServer, {
          method: 'post',
          body: JSON.stringify(reqBody),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .then((score) => {
            console.log('***Scores are: ***', score);
            ans['CalculatedScore'] = score;
            console.log('logagain: ', ans);
            console.log(studAnsList);
            return studAnsList;
          })
          .then((studAnsList) => {
            // update calculated score here
            SubmissionModel.findOneAndUpdate(
              { _id: submissionMongoID },
              { answers: studAnsList },
              { useFindAndModify: false, upsert: true, new: true }
            );
          });
        // .then((json) => res.send(json));
      })
      .then(() => {
        console.log('final log:', ans);
      });
  });
  res.send('OK'); 
});*/

module.exports = router;
