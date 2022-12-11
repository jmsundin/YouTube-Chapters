require("dotenv").config();

// API: https://www.assemblyai.com/docs/audio-intelligence#auto-chapters
const assemblyAIEndpoint = "https://api.assemblyai.com/v2/transcript";

// Listen for messages containing the active tab URL
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("content-script.js received request: ", request.url);
  console.log("process.env.ASSEMBLYAI_API_KEY: ", process.env.ASSEMBLYAI_API_KEY);

  if (request.url) {
    // Make a request to the AssemblyAI API using the active tab URL
    const params = {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: request.url,
        auto_chapters: true,
      }),
      method: "POST",
    };
    fetch(assemblyAIEndpoint, params)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Send the response back to the popup
        console.log("data returned to popup: ", JSON.stringify(data));
        sendResponse(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
