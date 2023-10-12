const cloudName = "dr1ykbljn"; 
const uploadPreset = "merupu"; 


//   https://cloudinary.com/documentation/upload_widget_reference

const myWidget = cloudinary.createUploadWidget(
  {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
    // cropping: true, //add a cropping step
    // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
       multiple: false,  //restrict upload to a single file
       folder: "articles_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
       clientAllowedFormats: ["images","jpg","png"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      //console.log("Done! Here is the image info: ", result.info);
      const thumbnail = result.info.thumbnail_url;
      const thumbnail_img = document.getElementById("thumbnail_img");
      thumbnail_img.src = thumbnail;
      thumbnail_img.style = "display: inline-block"

      document.querySelector(".thmb_holder1").style = "display: flex; margin-top:5px; justify-content: center;"
      
      const descriptionTextArea = document.getElementById("url");
      const newDescription = result.info.secure_url;
      descriptionTextArea.value = newDescription;
        //console.log(descriptionTextArea.value);
      document.getElementById('article-url').value = "";
    }
  }
);

document.getElementById("upload_widget").addEventListener(
  "click",
  function (e) {
    e.preventDefault();
    myWidget.open();
  },
  false
);



//video upload
const myWidget2 = cloudinary.createUploadWidget(
  {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
    // cropping: true, //add a cropping step
    // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
       multiple: false,  //restrict upload to a single file
      folder: "articles_videos", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
       clientAllowedFormats: ["mp4","mov","wmv","flv","avi","WebM","mkv"], //restrict uploading to video files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      //console.log("Done! Here is the image info: ", result.info);
      const thumbnail = result.info.thumbnail_url;
      const thumbnail_img = document.getElementById("thumbnail_vid");
      thumbnail_img.src = thumbnail;
      thumbnail_img.style = "display: inline-block"

      document.querySelector(".thmb_holder2").style = "display: flex; margin-top:5px; justify-content: center;"
      
      const descriptionTextArea = document.getElementById("videoUrl");
      const newDescription = result.info.secure_url;
      descriptionTextArea.value = newDescription;

      document.getElementById('article-url').value = "";
    }
  }
);

document.getElementById("upload_widget2").addEventListener(
  "click",
  function (e) {
    e.preventDefault();
    myWidget2.open();
  },
  false
);

//making two functions for filling the hidden input field of image url or video url and also showing thumbnail in select resource from gallery section
 const imageInputFiller = function (url) {
      //const thumbnail = result.info.thumbnail_url;
      //console.log("reached......");
      // const thumbnail_img = document.getElementById("thumbnail_gallery");
      // thumbnail_img.src = url;
      // thumbnail_img.style = "display: inline-block  width:10px; height: 20px;"
      // document.querySelector(".thmb_holder0").style = "display: flex; margin-top:5px; justify-content: center;"
      
      const descriptionTextArea = document.getElementById("url");
      
      const newDescription = url;
      descriptionTextArea.value = newDescription;
      //console.log(descriptionTextArea.value);
 }

 const videoInputFiller = function(url) {
  // const thumbnail_img = document.getElementById("thumbnail_gallery");
  // thumbnail_img.src = url;
  // thumbnail_img.style = "display: inline-block"
  // document.querySelector(".thmb_holder0").style = "display: flex; margin-top:5px; justify-content: center;"

  const descriptionTextArea = document.getElementById("videoUrl");
  
  const newDescription = url;
  descriptionTextArea.value = newDescription;

 }
  //this js code is to open gallery popup and get resouse url of a particular resource
   
    document.getElementById('select-from-gallery').addEventListener('click', function () {
        // Open the popup window with predefined gallery URL
        var galleryPopup = window.open('/admin/galleryPopup', 'Gallery', 'width=800,height=600');
        
        // Handle communication between popup and parent window
        window.addEventListener('message', function (event) {
            if (event.data && event.data.imageUrl) {
              //console.log(event.data.imageUrl);
              if(event.data.type === 'image') {
                imageInputFiller(event.data.imageUrl);
              }

              if(event.data.type === 'video') {
                videoInputFiller(event.data.imageUrl);
              }

              //removing clodinary upload button thumbnail when image from gallery is selected
              const thumbnail_vid = document.getElementById("thumbnail_vid");
              thumbnail_vid.src = "";
              thumbnail_vid.style = "display: none"


              const thumbnail_img = document.getElementById("thumbnail_img");
              thumbnail_img.src = "";
              thumbnail_img.style = "display: none"

              //-------------------------------------------------
                // Update the URL input field with the selected image URL
                document.getElementById('article-url').value = event.data.imageUrl;
            }
        });
    });


//-------------------------------------------------



    
    
