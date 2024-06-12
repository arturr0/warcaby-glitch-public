$(document).ready(function () {
    // Check if "check" is stored in localStorage
    let check = parseInt(localStorage.getItem('counter')) || 0;
    updateCounterDisplay(check);
  
    // Function to update the counter value and display it
    function updateCounterDisplay(value) {
      check = value;
      $("#counter-display").text(check);
    }
  
    // Click event handler for the "Home" link
    $("#home").click(function () {
      check++; // Increment the counter
      updateCounterDisplay(check);
      localStorage.setItem('counter', check); // Store the updated value in localStorage
    });
  
    // Click event handler for the "Service" link
    $(".service").click(function () {
      check++; // Increment the counter
      updateCounterDisplay(check);
      localStorage.setItem('counter', check); // Store the updated value in localStorage
    });
  
    // Clear the "check" counter when the page is refreshed
    $(window).on("unload", function () {
      // Check if the user is online
      if (navigator.onLine) {
        localStorage.setItem('counter', 0);
      }
    });
  });
  