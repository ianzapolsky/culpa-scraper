var culpaScraper    = require('../scrapers/culpa-scraper');
var bulletinScraper = require('../scrapers/bulletin-scraper');

module.exports.getProfessorCoursesByTermAndDepartment = function(term, dept, callback) {
  var professors = [];
  culpaScraper.getBestProfessorsByDepartment(dept, function(bestProfs) {

    // return empty array if no professors in department
    if (bestProfs.length === 0)
      callback(bestProfs);
  
    // otherwise, search for courses taught by professors
    bestProfs.forEach(function(prof, index, array) {
      bulletinScraper.getSearchResults(term, prof.name, function(courses) {
        prof.courses = courses;
        professors.push(prof);
        if (index === array.length - 1)
          callback(professors);
      });
    });
  });
};

module.exports.getProfessorCoursesByTermAndProfessor = function(term, prof, callback) {
  var professors = [];
  var professor = {
    "name": prof
  };

  // search for courses taught by professor
  bulletinScraper.getSearchResults(term, professor.name, function(courses) {
    professor.courses = courses;
    professors.push(professor);
    callback(professors);
  });
};



