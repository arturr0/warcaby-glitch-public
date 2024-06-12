
    const pageviewsCount = document.getElementById('pageviews-count');
    const visitsCount = document.getElementById('visits-count');
    let currURL = window.location.href;
    function updateCounts() {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://cloudy-iced-explanation.glitch.me/api?type=visit-pageview', false); // Make the request synchronous
      xhr.send(null);
      
      
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        pageviewsCount.textContent = data.pageviews;
        visitsCount.textContent = data.visits;
      } else {
        console.error('Error fetching counts:', xhr.status, xhr.statusText);
      }
    
    }

    if (currURL == 'https://cloudy-iced-explanation.glitch.me/') updateCounts(); // Call the function to update counts on page load
