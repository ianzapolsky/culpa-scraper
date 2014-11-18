var request = require('request');
var cheerio = require('cheerio');

// culpa gold nuggets
var culpaGoldUrl = 'http://culpa.info/gold_nuggets';

// culpa silver nuggets
var culpaSilverUrl = 'http://culpa.info/professors/silver_nuggets?page=';

// call callback with a list of gold and silver nugget professors and their departments
module.exports.getBestProfessors = function(callback) {
  var bestProfessors = [];
  var _this = this;

  // scrape culpa
  _this.getGoldProfessors(function(goldProfs) {
    _this.getSilverProfessors(function(silverProfs) {
      for (var i = 0; i < goldProfs.length; i++)
        bestProfessors.push(goldProfs[i]);   
      for (var i = 0; i < silverProfs.length; i++)
        bestProfessors.push(silverProfs[i]);
      callback(bestProfessors);
    });
  });
};

// call callback with a list of gold nugget professors and their departments
module.exports.getGoldProfessors = function(callback) {
  var goldProfessors = []; 

  // scrape culpa
  request(culpaGoldUrl, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      $('tbody').find('tr').filter(function() {
        var data = $(this);
        var prof = {};
        prof.name = data.find('a').first().text();
        prof.dept = data.find('a').last().text();
        prof.nugget = 'gold';
        goldProfessors.push(prof);
      });
      callback(goldProfessors);
    }
  });
};

var appendSilverProfessorsPage = function(page, seenProfessors, callback) {
  var silverProfessors = seenProfessors; 
  request(culpaSilverUrl + page, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      $('tbody').find('tr').filter(function() {
        var data = $(this);
        var prof = {};
        prof.name = data.find('a').first().text();
        prof.dept = data.find('a').last().text();
        prof.nugget = 'silver';
        silverProfessors.push(prof);
      });
    }
    callback(silverProfessors);
  });
};
        
// call callback with a list of silver nugget professors and their departments
module.exports.getSilverProfessors = function(callback) {
  var silverProfs0 = []; 
  appendSilverProfessorsPage('1', silverProfs0, function(silverProfs1) {
    appendSilverProfessorsPage('2', silverProfs1, function(silverProfs2) {
      appendSilverProfessorsPage('3', silverProfs2, function(silverProfs3) {
        appendSilverProfessorsPage('4', silverProfs3, function(silverProfs4) {
          appendSilverProfessorsPage('5', silverProfs4, function(silverProfs5) {
            callback(silverProfs5);
          });
        });
      });
    });
  });
};
    
// return a list of professors filtered by department
module.exports.filterByDepartment = function(profList, dept) {
  var filteredProfs = profList.filter(function(prof) {
    return prof.dept.toUpperCase().indexOf(dept.toUpperCase()) !== -1; 
  });
  return filteredProfs;
};


/**
 * Get all the silver and gold nugget professors in a given department.
 */
module.exports.getBestProfessorsByDepartment = function(dept, callback) {
  var _this = this;
  _this.getBestProfessors(function(bestProfs) {
    callback(_this.filterByDepartment(bestProfs, dept));
  });
};

        

