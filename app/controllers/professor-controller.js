var async           = require('async');
var culpaScraper    = require('../scrapers/culpa-scraper');
var bulletinScraper = require('../scrapers/bulletin-scraper');

module.exports.getProfessorCoursesByTermAndDepartment = function(term, dept, callback) {
  var professors = [];
  culpaScraper.getBestProfessorsByDepartment(dept, function(bestProfs) {

    // return empty array if no professors in department
    if (bestProfs.length === 0)
      callback(bestProfs);

    // use the async forEach implementation, which fixes previous inconsistencies
    // in the requests
    async.each(bestProfs, function(prof, callback) {
      bulletinScraper.getSearchResults(term, prof.name, function(courses) {
        prof.courses = courses;
        professors.push(prof);
        callback();
      });
    }, function(err) {
      if (err)
        console.log(err);
      else
        callback(professors);
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



