Resizer = {
  resize: function(file, options, callback) {

    check(options, Match.ObjectIncluding({
      maxWidth: Match.Optional(Number),
      maxHeight: Match.Optional(Number),
      minWidth: Match.Optional(Number),
      minHeight: Match.Optional(Number),
      sourceWidth: Match.Optional(Number),
      sourceHeight: Match.Optional(Number),
      top: Match.Optional(Number),
      right: Match.Optional(Number),
      bottom: Match.Optional(Number),
      left: Match.Optional(Number),
      contain: Match.Optional(Boolean),
      cover: Match.Optional(Boolean),
      aspectRatio: Match.Optional(Number),
      crop: Match.Optional(Boolean),
      orientation: Match.Optional(Boolean),
      canvas: Match.Optional(Boolean),
      crossOrigin: Match.Optional(Boolean),
      noRevoke: Match.Optional(Boolean)
    }));

    var fileData = {
      name: file.name,
      type: file.type
    };

    // Get image metadata.
    loadImage.parseMetaData(file, function(data) {
      var orientation = 1;
      if (data.exif) {
        orientation = data.exif.get('Orientation');
        if (orientation) {
          options.orientation = orientation;
        }
      }

      // Resize image with orientation metadata.
      loadImage(file, function(canvas) {

        canvas.toBlob(function(blob) {
          fileData.data = blob
          fileData.data.type = file.type;

          callback(null, _.extend(fileData.data, {name: fileData.name}, data.exif ? data.exif.getAll() : {}));
        })
      }, options);

    },
    {
      maxMetaDataSize: 262144,
      disableImageHead: false
    });
  }
}
