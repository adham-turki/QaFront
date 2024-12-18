// // Create Popup With The Image
// let ourGallery = document.querySelectorAll(".gallery1 img");

// ourGallery.forEach(img => {

//   img.addEventListener('click', (e) => {

//     // Create Overlay Element
//     let overlay = document.createElement("div");

//     // Add Class To Overlay
//     overlay.className = 'popup-overlay';

//     // Append Overlay To The Body
//     document.body.appendChild(overlay);

//     // Create The Popup Box
//     let popupBox = document.createElement("div");

//     // Add Class To The Popup Box
//     popupBox.className = 'popup-box';

    
//     // Create The Image
//     let popupImage = document.createElement("img");

//     // Set Image Source
//     popupImage.src = img.src;

//     // Add Image To Popup Box
//     popupBox.appendChild(popupImage);

//     // Append The Popup Box To Body
//     document.body.appendChild(popupBox);

//     // Create The Close Span
//     let closeButton = document.createElement("span");

//     // Create The Close Button Text
//     let closeButtonText = document.createTextNode("X");

//     // Append Text To Close Button
//     closeButton.appendChild(closeButtonText);

//     // Add Class To Close Button
//     closeButton.className = 'close-button';

//     // Add Close Button To The Popup Box
//     popupBox.appendChild(closeButton);

//   });

// });


// // Close Popup
// document.addEventListener("click", function (e) {

//   if (e.target.className == 'close-button') {

//     // Remove The Current Popup
//     e.target.parentNode.remove();

//     // Remove Overlay
//     document.querySelector(".popup-overlay").remove();

//   }

// });

// // Toggle Menu 
// let toggleBtn = document.querySelector(".toggle-menu");
// let tLinks = document.querySelector(".links");

// toggleBtn.onclick = function (e) {

//   // Stop Propagation
//   e.stopPropagation();

//   // Toggle Class "menu-active" On Button
//   this.classList.toggle("menu-active");

//   // Toggle Class "open" On Links
//   tLinks.classList.toggle("open");

// };
