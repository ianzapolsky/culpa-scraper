var express = require('express');
var app     = express();
var router  = express.Router();

var professorController = require('./controllers/professor-controller');

router.route('/courses/:term/department/:dept')
  .get(function(req, res) {
    professorController.getProfessorCoursesByTermAndDepartment(req.params.term, req.params.dept, function(profs) {
      res.json(profs);
    });
  });

router.route('/courses/:term/professor/:prof')
  .get(function(req, res) {
    professorController.getProfessorCoursesByTermAndProfessor(req.params.term, req.params.prof, function(profs) {
      res.json(profs);
    });
  });

app.use('/api', router);
app.use(express.static(__dirname + '/public'));

app.listen(8080);
console.log('scraper app running on port 8080');
    
