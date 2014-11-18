var fs           = require('fs');
var culpaScraper = require('./scrapers/culpa-scraper');
var filename     = './bestProfs.json';

culpaScraper.getBestProfessors(true, function(bestProfs) {
  fs.writeFile(filename, JSON.stringify(bestProfs, null, 4), function(err) {
    if (err)
      console.log(err);
    else
      console.log('JSON saved to ' + filename);
  });
});


