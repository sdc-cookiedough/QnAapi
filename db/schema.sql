psql postgres --username=postgres
CREATE DATABASE qa;
\c qa;

CREATE TABLE IF NOT EXISTS questions (
     question_id serial,
    product_id int not null ,
    question_body text,
    question_date bigint,
    asker_name varchar(50),
    asker_email varchar(255),
    reported boolean,
    question_helpfulness int,
    primary key (question_id)
)



\copy questions from '/Users/shanshanliu/HR2022/SDC/System-Design-Capstone/database/csv/questions.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE questions ALTER COLUMN question_date TYPE timestamp without time zone using to_timestamp(question_date/1000)At time zone 'UTC' ;
alter sequence questions_question_id_seq restart with 3518964;

 CREATE TABLE IF NOT EXISTS answers(
    id serial,
    question int not null,
    body text,
    date bigint,
    answerer_name varchar(50),
    answerer_email varchar(255),
    reported boolean,
    helpfulness int,
    primary key(id),
    foreign key (question) references questions (question_id)
)

\copy answers from '/Users/shanshanliu/HR2022/SDC/System-Design-Capstone/database/csv/answers.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE answers ALTER COLUMN date TYPE timestamp without time zone using to_timestamp(date/1000)At time zone 'UTC' ;
alter sequence answers_id_seq restart with 6879307;

CREATE TABLE IF NOT EXISTS answers_photo(
    id serial,
    answer_id int not null,
    url text, 
    primary key(id),
    foreign key(answer_id) references answers(id)
)

\copy answers_photo from '/Users/shanshanliu/HR2022/SDC/System-Design-Capstone/database/csv/answers_photos.csv' DELIMITER ',' CSV HEADER;
alter sequence answers_photo_id_seq restart with 2063760;

CREATE INDEX questions_index ON questions (product_id);

CREATE INDEX anwers_index ON answers (question);

CREATE INDEX photos_index ON answers_photo(answer_id);

