// popup.js
document.addEventListener('DOMContentLoaded', () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Inject contentScript.js into the active tab
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['contentScript.js']
      }, () => {
        // After injecting the content script, request job data
        requestJobData();
      });
    });
  
    const generateBtn = document.getElementById('generateBtn');
    const loadingText = document.getElementById('loading');
    const jobTitleElement = document.getElementById('jobTitle');
  
    function requestJobData() {
      // Request job data from background script
      chrome.runtime.sendMessage({ action: 'getJobData' }, (response) => {
        if (response && response.title) {
          jobTitleElement.textContent = `Job Title: ${response.title}`;
          generateBtn.disabled = false;
        } else {
          jobTitleElement.textContent = 'No job data found. Please refresh the job page.';
          generateBtn.disabled = true;
        }
      });
    }
  
    generateBtn.addEventListener('click', () => {
      loadingText.style.display = 'block';
      generateBtn.disabled = true;
  
      // Request job data again to ensure it's up-to-date
      chrome.runtime.sendMessage({ action: 'getJobData' }, (response) => {
        if (response && response.title && response.description) {
          // Send data to Flask endpoint
          fetch('http://127.0.0.1:5000/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
          })
          .then((res) => res.blob())
          .then((blob) => {
            // Create a link to download the PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Tailored_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while generating the resume.');
          })
          .finally(() => {
            loadingText.style.display = 'none';
            generateBtn.disabled = false;
          });
        } else {
          alert('Job data is not available.');
          loadingText.style.display = 'none';
          generateBtn.disabled = false;
        }
      });
    });
  });
  