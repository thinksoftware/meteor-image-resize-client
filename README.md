Client Side Image Resize
------------------------

After trialling lots of different S3 and file uploading tools for images, I found that the one thing missing was
image resizing and cropping square on the client side before uploading the large file.

This package solves that issue by allowing you to set a width, height and wether the image is cropped to a square.

To install the package simply type `meteor add thinksoftware:image-resize-client`

This package allows you to set the size you want to upload to the service, saving space and bandwidth from the client. The package gives you the following options:

```
var options = {
  width: 300,
  height: 300,
  cropSquare: true
};
```

The package returns a Blob file extended with the file name, size and type intact as you can see in a copy of a console log of a resized image from a file upload input:

```
Blob {type: "image/jpeg", size: 38898, name: "test.jpg", slice: function}
  name: "test.jpg"
  size: 38898
  type: "image/jpeg"
  __proto__: Blob
```

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

    Resizer.resize(files[0], {width: 300, height: 300, cropSquare: true}, function(file) {

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
