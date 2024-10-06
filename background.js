// background.js
let jobData = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'JOB_DATA') {
    jobData = {
      title: message.jobTitle,
      description: message.jobDescription
    };
    // Optionally, you can send a response or update the popup if needed
  } else if (message.action === 'getJobData') {
    sendResponse(jobData);
  }
});
