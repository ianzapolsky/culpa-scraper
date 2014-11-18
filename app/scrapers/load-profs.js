var fs           = require('fs');
var culpaScraper = require('./culpa-scraper');
var filename     = __dirname + '/bestProfs.json';

culpaScraper.getBestProfessors(true, function(bestProfs) {
  fs.writeFile(filename, JSON.stringify(bestProfs, null, 4), function(err) {
    if (err)
      console.log(err);
    else
      console.log('JSON saved to ' + filename);
  });
});


