
$(document).ready(function () {
    // Retrieve the stored "check" value from sessionStorage
    let check = sessionStorage.getItem('counter') || 0;
    updateCounterDisplay(check);
    // Function to update the counter value and display it
    function updateCounterDisplay(value) {
    check = parseInt(value);
    $("#counter-display").text(check);
    }
    // Click event handler for the "Home" link
    $("#home").click(function () {
    check++; // Increment the counter
    updateCounterDisplay(check);
    sessionStorage.setItem('counter', check); // Store the updated value in sessionStorage
    });
    // Click event handler for the "Service" link
    $(".service").click(function () {
    check++; // Increment the counter
    updateCounterDisplay(check);
    sessionStorage.setItem('counter', check); // Store the updated value in sessionStorage
    })
    
    // Clear session storage when the user navigates away from the page or refreshes
    $(window).on("beforeunload", function () {
    sessionStorage.clear();
    
    });
});
    console.log(check);