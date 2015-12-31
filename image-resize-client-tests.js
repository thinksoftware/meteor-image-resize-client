Tinytest.addAsync('Image - Resize', function(test, done) {
  var originalImg, resizedImg, originalBlob
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", 'https://scontent-dfw1-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12346343_871489722946736_5400293110848611387_n.jpg?oh=420c4ce953952c93b6d282898dd1061d&oe=56DBA4F4', true); // true for asynchronous
  xmlHttp.responseType = 'blob';
  xmlHttp.onload = originalImgRetrieved
  xmlHttp.send();

  function originalImgRetrieved(error) {
    if (this.status == 200) {
      originalBlob = new Blob([this.response], {type: 'image/jpg'})
      originalBlob.name = 'blob.jpg'

      originalImg = document.createElement('img');
      originalImg.style = 'display: none;'
      originalImg.src = window.URL.createObjectURL(originalBlob);
      originalImg.onload = onOriginalImgLoaded

      document.body.appendChild(originalImg)
    }
  }

  function onOriginalImgLoaded() {
    Resizer.resize(originalBlob, {maxWidth: 300, maxHeight: 100, crop: true}, function(err, file) {
      resizedImg = document.createElement('img');
      resizedImg.style = 'display: none;'
      resizedImg.src = window.URL.createObjectURL(file);
      resizedImg.onload = onResizedImgLoaded

      document.body.appendChild(resizedImg)
    })
  }

  function onResizedImgLoaded() {
    test.isTrue(originalImg.height > resizedImg.height, "Original height not greater than resized")
    test.equal(resizedImg.height, 100, "Resized height incorrect")
    test.equal(resizedImg.width, 300, "Resized height incorrect")

    done()
  }
})
