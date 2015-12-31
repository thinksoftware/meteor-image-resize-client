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
      // canvas: Match.Optional(Boolean),
      crossOrigin: Match.Optional(Boolean),
      noRevoke: Match.Optional(Boolean)
    }));

    // Canvas must be true
    // if(options.canvas === undefined)
    options.canvas = true;

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
        var resize_dataUrl = canvas.toDataURL(file.type);

        var binaryImg = atob(resize_dataUrl.slice(resize_dataUrl.indexOf('base64') + 7, resize_dataUrl.length));
        var length = binaryImg.length;
        var ab = new ArrayBuffer(length);
        var ua = new Uint8Array(ab);
        for (var i = 0; i < length; i++) {
            ua[i] = binaryImg.charCodeAt(i);
        }

        fileData.data = new Blob([ua], {type: file.type, name: file.name});
        fileData.data.type = file.type;
        fileData.size = ua.length;

        callback(null, _.extend(fileData.data, {name: fileData.name}, data.exif ? data.exif.getAll() : {}));

      }, options);

    },
    {
      maxMetaDataSize: 262144,
      disableImageHead: false
    });
  }
}
