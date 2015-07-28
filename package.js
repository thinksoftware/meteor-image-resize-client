Package.describe({
  name: 'thinksoftware:image-resize-client',
  version: '0.0.6',
  // Brief, one-line summary of the package.
  summary: 'Client-side image resize and crop for file object',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/thinksoftware/meteor-image-resize-client',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');
  api.use(["underscore", "jquery"]);

  api.use('blueimp:javascript-load-image@1.13.1', 'client');

  api.addFiles('thinksoftware:image-resize-client.js', 'client');
  if (api.export) { api.export('Resizer', 'client'); }
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('thinksoftware:image-resize-client');
  api.addFiles('thinksoftware:image-resize-client-tests.js');
});
