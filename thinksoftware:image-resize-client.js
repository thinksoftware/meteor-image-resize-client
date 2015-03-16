Resizer = {
  resize: function(file, options, callback) {

    check(options, {
      width: Number,
      height: Number,
      cropSquare: Boolean
    });

    var reader = new FileReader;
    var fileData = {
        name: file.name,
        size: file.size,
        type: file.type
    };

    if (!file.type.match(/image.*/) && !options.width) {
      callback("error: Cannot resize a non-image file");
    } else {
      reader.onerror = function(e) {
        callback("error: [" + e.target.error.code + "] iPhone iOS8 Permissions Error.");
      };

      reader.onload = function(e) {

          //crop
          var cropCanvas = document.createElement('canvas');
          var crop_img = document.createElement("img");
          crop_img.src = e.target.result;

          crop_img.onload = function(e) {

              var crop_dataUrl = crop_img.src;

              if (options.cropSquare) {
                  var cropCoords = {
                      x: 0,
                      y: 0
                  };

                  if (crop_img.height > crop_img.width) {
                      cropCanvas.width = crop_img.width;
                      cropCanvas.height = crop_img.width;
                  } else {
                      cropCanvas.width = crop_img.height;
                      cropCanvas.height = crop_img.height;
                  }

                  if (crop_img.width > cropCanvas.width)
                      cropCoords.x = (crop_img.width - cropCanvas.width) / 2.0;
                  if (crop_img.height > cropCanvas.height)
                      cropCoords.y = (crop_img.height - cropCanvas.height) / 2.0;

                  var crop_ctx = cropCanvas.getContext("2d");
                  crop_ctx.drawImage(
                      crop_img,
                      cropCoords.x,
                      cropCoords.y,
                      cropCanvas.width,
                      cropCanvas.height,
                      0,
                      0,
                      cropCanvas.width,
                      cropCanvas.height);

                  crop_dataUrl = cropCanvas.toDataURL(fileData.type);
              }

              //resize
              var resizeCanvas = document.createElement('canvas');
              var resize_img = document.createElement("img");
              resize_img.src = crop_dataUrl;
              resize_img.onload = function(e) {

                  var FORCE_WIDTH = options.width;
                  var FORCE_HEIGHT = options.height;
                  var width = resize_img.width;
                  var height = resize_img.height;

                  if (width > height) {
                      height *= FORCE_WIDTH / width;
                      width = FORCE_WIDTH;
                  } else {
                      width *= FORCE_HEIGHT / height;
                      height = FORCE_HEIGHT;
                  }
                  resizeCanvas.width = width;
                  resizeCanvas.height = height;

                  var resize_ctx = resizeCanvas.getContext("2d");
                  resize_ctx.drawImage(resize_img, 0, 0, width, height);
                  var resize_dataUrl = resizeCanvas.toDataURL(fileData.type);

                  var binaryImg = atob(resize_dataUrl.slice(resize_dataUrl.indexOf('base64') + 7, resize_dataUrl.length));
                  var length = binaryImg.length;
                  var ab = new ArrayBuffer(length);
                  var ua = new Uint8Array(ab);
                  for (var i = 0; i < length; i++) {
                      ua[i] = binaryImg.charCodeAt(i);
                  }

                  fileData.data = new Blob([ua], {type: fileData.type, name: fileData.name});
                  fileData.data.type = fileData.type;

                  fileData.size = ua.length;

                  callback(null, _.extend(fileData.data, {name: fileData.name}));
              }
          }
      };
      reader.readAsDataURL(file);
    }
  }
}
