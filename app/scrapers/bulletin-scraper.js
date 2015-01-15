var request = require('request');
var cheerio = require('cheerio');

// this shit is subject to change
var searchPreQ = 'http://search.columbia.edu/search?client=DoC&site=Directory_of_Classes&output=xml_no_dtd&proxystylesheet=DoC&ie=UTF-8&oe=UTF-8&filter=0&as_q='
var searchPostQ = '&num=20&as_epq=&as_oq=&as_eq=&lr=&as_ft=i&as_filetype=&as_occt=any&as_dt=i&as_sitesearch=&sort=&btnG=Search';

// call callback with a list of gold nugget professors and their departments
module.exports.getSearchResults = function(termPredicate, query, callback) {
  var courses = [];
  var searchUrl = searchPreQ + query + searchPostQ;

  // scrape columbia bulletin 
  request(searchUrl, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      $('dt').filter(function() {
        var data = $(this);
        var title = data.find('a').first().text();
        var term = title.substring(0, termPredicate.length);
        if (term === termPredicate) {
          var description = data.next().text();
          var course = {
            "title": title,
            "description": description,
            "course_name": description.substring(0, description.indexOf(';')),
            "bulletin_link": description.split(' ')[description.split(' ').length - 3]
          };
          courses.push(course);
        }
      });
      callback(courses);
    }
  });
};

