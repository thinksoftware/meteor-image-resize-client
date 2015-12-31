Package.describe({
  name: 'thinksoftware:image-resize-client',
  version: '1.0.0',
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
  api.use(["underscore", "jquery", 'check']);

  api.use('marvin:javascript-load-image@2.1.0', 'client');

  api.addFiles('image-resize-client.js', 'client');
  if (api.export) { api.export('Resizer', 'client'); }
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'tinytest',
    // 'underscore'
  ]);

  api.use([
    'thinksoftware:image-resize-client',
  ]);

  api.addFiles([
    'image-resize-client-tests.js',
  ], 'client')
})
