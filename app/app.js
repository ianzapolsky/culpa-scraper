var express = require('express');
var app     = express();
var router  = express.Router();

var professorController = require('./controllers/professors-controller');

router.route('/courses/:term/:dept')
  .get(function(req, res) {
    professorController.getProfessorCoursesByTermAndDepartment(req.params.term, req.params.dept, function(profs) {
      res.json(profs);
    });
  });

app.use('/api', router);
app.use(express.static(__dirname + '/public'));

app.listen(8000);
console.log('scraper app running on port 8000');
    
