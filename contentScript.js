// contentScript.js
(function() {
    // Function to extract job title and description from LinkedIn
    function extractJobData() {
      let jobTitle = '';
      let jobDescription = '';
  
      // Updated LinkedIn selectors for job title and description
      const titleSelector = 'div.job-details-jobs-unified-top-card__job-title h1';
      const descriptionSelector = 'div.jobs-box__html-content';
  
      const titleElement = document.querySelector(titleSelector);
      const descriptionElement = document.querySelector(descriptionSelector);
  
      if (titleElement) {
        jobTitle = titleElement.innerText.trim();
      }
  
      if (descriptionElement) {
        // Clone the descriptionElement to avoid modifying the DOM
        const clone = descriptionElement.cloneNode(true);
  
        // Remove any h2 elements (like "About the job") to exclude headers
        const headings = clone.querySelectorAll('h2');
        headings.forEach((heading) => heading.remove());
  
        // Optionally, remove any other unwanted elements (e.g., scripts, styles)
        const unwantedElements = clone.querySelectorAll('script, style');
        unwantedElements.forEach((el) => el.remove());
  
        jobDescription = clone.innerText.trim();
      }
  
      if (jobTitle && jobDescription) {
        // Send data to the background script
        chrome.runtime.sendMessage({
          type: 'JOB_DATA',
          jobTitle,
          jobDescription,
        });
      }
    }
  
    // Function to observe changes in the job details section
    function observeJobChanges() {
      // The container that holds the job details
      const targetNode = document.querySelector('div.jobs-search__right-rail');
  
      if (!targetNode) {
        // If the target node is not yet available, retry after some time
        setTimeout(observeJobChanges, 1000);
        return;
      }
  
      // Options for the observer (which mutations to observe)
      const config = { childList: true, subtree: true };
  
      // Callback function to execute when mutations are observed
      const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            // Re-extract job data when changes are detected
            extractJobData();
            break; // Break after the first relevant mutation
          }
        }
      };
  
      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);
  
      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);
  
      // Optional: disconnect the observer when the page is unloaded
      window.addEventListener('beforeunload', () => {
        observer.disconnect();
      });
    }
  
    // Initial data extraction
    extractJobData();
  
    // Start observing for changes
    observeJobChanges();
  })();
  