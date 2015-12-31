[![Meteor Icon](http://icon.meteor.com/package/thinksoftware:image-resize-client)](https://atmospherejs.com/thinksoftware/image-resize-client)

Client Side Image Resize
------------------------

After trialling lots of different S3 and file uploading tools for images, I found that the one thing missing was
image resizing and cropping square on the client side before uploading the large file.

This package solves that issue by allowing you to set a width, height and wether the image is cropped to a square.

## Getting started

`meteor add thinksoftware:image-resize-client`

This package allows you to set the size you want to upload to the service, saving space and bandwidth from the client. The package gives you the following options:

* **maxWidth**: Defines the maximum width of the img/canvas element.
* **maxHeight**: Defines the maximum height of the img/canvas element.
* **minWidth**: Defines the minimum width of the img/canvas element.
* **minHeight**: Defines the minimum height of the img/canvas element.
* **sourceWidth**: The width of the sub-rectangle of the source image to draw
into the destination canvas.  
Defaults to the source image width and requires *canvas: true*.
* **sourceHeight**: The height of the sub-rectangle of the source image to draw
into the destination canvas.  
Defaults to the source image height and requires *canvas: true*.
* **top**: The top margin of the sub-rectangle of the source image.  
Defaults to *0* and requires *canvas: true*.
* **right**: The right margin of the sub-rectangle of the source image.  
Defaults to *0* and requires *canvas: true*.
* **bottom**: The bottom margin of the sub-rectangle of the source image.  
Defaults to *0* and requires *canvas: true*.
* **left**: The left margin of the sub-rectangle of the source image.  
Defaults to *0* and requires *canvas: true*.
* **contain**: Scales the image up/down to contain it in the max dimensions if
set to *true*.  
This emulates the CSS feature
[background-image: contain](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Scaling_background_images#contain).
* **cover**: Scales the image up/down to cover the max dimensions with the image dimensions if set to *true*.  
This emulates the CSS feature
[background-image: cover](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Scaling_background_images#cover).
* **aspectRatio**: Crops the image to the given aspect ratio (e.g. `16/9`).  
This feature assumes *crop: true*.
* **crop**: Crops the image to the maxWidth/maxHeight constraints if set to
*true*.  
This feature assumes *canvas: true*.
* **orientation**: Allows to transform the canvas coordinates according to the
EXIF orientation specification.  
This feature assumes *canvas: true*.
* **crossOrigin**: Sets the crossOrigin property on the img element for loading
[CORS enabled images](https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image).
* **noRevoke**: By default, the
[created object URL](https://developer.mozilla.org/en/DOM/window.URL.createObjectURL)
is revoked after the image has been loaded, except when this option is set to
*true*.

The package returns a Blob file extended with the file name, size and type intact as you can see in a copy of a console log of a resized image from a file upload input:

```
Blob {type: "image/jpeg", size: 38898, name: "test.jpg", slice: function}
  name: "test.jpg"
  size: 38898
  type: "image/jpeg"
  __proto__: Blob
```

A bug with Safari on iOS 8, FileReader doesn't have permission to access the file input data it seems since v8.
There is no way around it AFAIK, so this package will not work on iOS8 Safari, Chrome works fine however on the device.

### Usage Example

An example of this package with `edgee:slingshot` package for direct S3 uploads:

#### Server Side

```
Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
  bucket: "###",
  region: "###",
  AWSAccessKeyId: "###",
  AWSSecretAccessKey: "###",

  acl: "public-read",

  authorize: function () {
    //Deny uploads if user is not logged in.
    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    return new Date().getTime() + "_" + file.name;
  }
});
```

### Both Sides

```
Slingshot.fileRestrictions("myFileUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});
```

### Client Side

Template layout
```
<template name="hello">
  <input type="file" />
</template>
```

Template event code
```
Template.hello.events({
  'change input[type=file]': function(e, t) {
    var files = e.currentTarget.files;

    Resizer.resize(files[0], {width: 300, height: 300, cropSquare: true}, function(err, file) {

      var uploader = new Slingshot.Upload("myFileUploads");

      uploader.send(file, function (err, downloadUrl) {
        if (err)
          console.log(err);

        console.log(downloadUrl);

      });

    });

  }
});
```
