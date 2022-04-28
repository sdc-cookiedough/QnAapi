const express = require('express');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 1337;
//const query = require('../db/queries');
const db= require('../db')

app.use('/', (req, res, next) => {
  console.log(`${req.method} at ${req.url}`);
  next();
});

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("working")
})
app.get('/questions',(req,res)=>{
 let product_id=req.query.product_id
    let response = {};
    db.query(
      `select
      coalesce(json_agg(json_build_object( 
      'question_id',questions.question_id,
      'question_body',questions.question_body,
      'date',questions.question_date,
      'asker_name',questions.asker_name,
      'reported',questions.reported,
      'question_helpfullness',questions.question_helpfulness,
    'answers',(select 
       coalesce(json_object_agg(
         answers.id,
         json_build_object(
           'id',answers.id,
           'question_id',answers.question,
           'body',answers.body,
           'date',answers.date,
           'answerer_name',answers.answerer_name,
           'reported',answers.reported,
           'helpfulness',answers.helpfulness,
           'photos',(select 
            coalesce(json_agg(
              answers_photo.url),'[]'::json)
            from
            answers_photo 
            where 
            answers_photo.answer_id=answers.id))),'{}'::json)
         from 
         answers 
         where 
         answers.question=questions.question_id))),'[]'::json)as results
    from questions where questions.product_id = ${product_id}`,
      (err, result) => {
        if (err) {
          res.status(500).send("wrong query");
        } else {
          result.rows[0].product_id = req.query.product_id;
          res.status(200).send(result.rows[0]);
        }
      }
    );
})

app.get('/answers',(req,res)=>{
  let question=req.query.question
    db.query(
        `select
        coalesce(json_agg(
            json_build_object(
                'answer_id',answers.id,
                'body',answers.body,
                'date',answers.date,
                'answerer_name',answers.answerer_name,
                'helpfulness',answers.helpfulness,
                'photos',(select 
                coalesce(json_agg(
                    json_build_object(
                        'id',answers_photo.id,
                        'url',answers_photo.url)),'[]'::json) from answers_photo where answers_photo.answer_id=answers.id))),'[]'::json)as results
                        from answers where answers.question=${question}`,
        (err, result) => {
          if (err) {
            res.status(500).send("wrong query");
          } else {
            let response = {};
            response.question=question;
            response.results = result.rows[0].results;
            // console.log("answers result.rows>>>>",response)
            res.status(200).send(response);
          }
        }
      );
})

app.post('/questions',(req,res)=>{
    db.query(
        `insert into 
        questions 
        (product_id,question_body,question_date,asker_name,asker_email,question_helpfulness,reported)
        values
        ('${req.body.product_id}','${req.body.body}',now(),'${req.body.name}','${req.body.email}',0,false)`,
        (err, result) => {
          if (err) {
            // console.log()
            res.status(500).send(err);
          } else {
            console.log(result);
            res.status(201).send("created");
          }
        }
      );
})



app.listen(port, () => {
    console.log(`listing to ${port}`);
  });