var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// culpa gold nuggets
var culpaGoldUrl = 'http://culpa.info/gold_nuggets';

// culpa silver nuggets
var culpaSilverUrl = 'http://culpa.info/professors/silver_nuggets?page=';

/**
 * Calls callback with a list of gold and silver nugget professors off CULPA.
 * If called with force parameter equal to "true," this method will get the data from the actual CULPA website.
 * If called with force paramteer equal to "false," this method will use a cached copy in ./bestProfs.json.
 */
module.exports.getBestProfessors = function(force, callback) {
  var filename = __dirname + '/bestProfs.json';
  var bestProfessors = []
  var _this = this;
  
  fs.readFile(filename, 'utf8', function(err, data) {
    if (!err && !force) {
      console.log('reading from ' + filename);
      bestProfessors = JSON.parse(data);
      // add professor first_name and last_name fields
      bestProfessors.forEach(function(prof) {
        prof.first_name = prof.name.split(' ')[1]
        prof.last_name = prof.name.split(' ')[0].substring(0, prof.name.split(' ')[0].length - 1);
      });
      callback(bestProfessors);
      return;
    } else {
      console.log('reading from culpa');

      // scrape culpa
      _this.getGoldProfessors(function(goldProfs) {
        _this.getSilverProfessors(function(silverProfs) {
          for (var i = 0; i < goldProfs.length; i++)
            bestProfessors.push(goldProfs[i]);   
          for (var i = 0; i < silverProfs.length; i++)
            bestProfessors.push(silverProfs[i]);
          // add professor first_name and last_name fields
          bestProfessors.forEach(function(prof) {
            prof.first_name = prof.name.split(' ')[1]
            prof.last_name = prof.name.split(' ')[0].substring(0, prof.name.split(' ')[0].length - 1);
          });
          callback(bestProfessors);
        });
      });
    }
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
    
/**
 * Return a list of professors filtered by department.
 */ 
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
  _this.getBestProfessors(false, function(bestProfs) {
    callback(_this.filterByDepartment(bestProfs, dept));
  });
};

        

