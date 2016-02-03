Resizer = {
  resize: function(file, options, callback) {

    check(options, Match.ObjectIncluding({
      width: Number,
      height: Number,
      cropSquare: Boolean
    }));

    // Convert to LoadImage style options.
    options.maxWidth = options.width;
    options.maxHeight = options.height;
    options.crop = options.cropSquare;
    options.canvas = true;

    var fileData = {
      name: file.name,
      size: file.size,
      type: file.type
    };

    // Get image metadata.
    LoadImage.parseMetaData(file, function(data) {
      var orientation = 1;
      if (data.exif) {
        orientation = data.exif.get('Orientation');
        if (orientation) {
          options.orientation = orientation;
        }
      }

      // Resize image with orientation metadata.
      LoadImage(file, function(canvas) {
        var resize_dataUrl = canvas.toDataURL(fileData.type);

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

    }, { maxMetaDataSize: 262144, disableImageHead: false });
  }
}
