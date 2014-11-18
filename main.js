var culpaScraper    = require('./scrapers/culpa-scraper');
var bulletinScraper = require('./scrapers/bulletin-scraper');

var term = 'Spring 2015';
var dept = 'econ';

// return all the courses being taught in "term" by silver and gold nugget professors in "dept"
culpaScraper.getBestProfessorsByDepartment(dept, function(bestProfs) {
  bestProfs.forEach(function(prof) {
    bulletinScraper.getSearchResults(term, prof.name, function(courses) {
      console.log('Courses taught by ' + prof.name + ' in ' + term + ':');
      console.log(courses);
      console.log('\n');
    });
  });
});

