var http = require('http');
var fs = require('fs');

var options = {
  hostname: 'isaacs.iriscouch.com',
  port: 80,
  path: '/registry/_all_docs'
};

var req = http.request(options, function(res) {
  var body = '';

  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    body += chunk.toString();
  });

  res.on('end', function() {
    var json = JSON.parse(body);
    var packageJson = {
      name: "whole-npm",
      version: "1.0.0",
      scripts: {
        make: 'make.js'
      },
      description: "Just whole npm",
      author: "Evgeny Shpilevsky",
      license: "MIT",
      dependencies: {}
    };

    json.rows.forEach(function(package){
      // Ok, really not whole npm
      if (package.id !== 'whole-npm') {
        packageJson.dependencies[package.id] = '*';
      }
    });

    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
  });
});

req.end();