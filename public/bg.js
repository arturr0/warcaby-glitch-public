//var obraz = new Image(); 
//obraz.src = "public/images/bg1.jpg";
//console.log("image");
//obraz.onload = function () {
    // Set the source of the image in the Pug file
//    document.getElementsByClassName("code").src = obraz.src;
//  };


$(document).ready(function () {
  $('#aboutMe').hover(
  function(){
    $('.submenu').css('background-color', '#555');
  }, 
  function(){
    $('.submenu').css('background-color', ''); // Revert to original background color
  }
);

});