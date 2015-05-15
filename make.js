var https = require('https');
var fs = require('fs');

var options = {
  hostname: 'skimdb.npmjs.com',
  port: 443,
  path: '/registry/_all_docs'
};

var req = https.request(options, function(res) {
  var body = '';

  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    body += chunk.toString();
  });

  res.on('end', function() {
    var packageJson = require("./package.json");
    var currentDependencies = packageJson.dependencies;
    var json = JSON.parse(body);

    packageJson.dependencies = {};

    var foundNewDeps = 0;
    json.rows.forEach(function(package){
      // Ok, really not whole npm
      if (package.id !== 'whole-npm') {
        if (!currentDependencies[package.id]) {
          foundNewDeps++;
        }

        packageJson.dependencies[package.id] = '*';
      }
    });

    console.log('Found', foundNewDeps, 'new deps');

    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
  });
});

req.end();