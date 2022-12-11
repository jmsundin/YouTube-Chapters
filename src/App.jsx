import React, { useState } from "react";
import Button from "./components/Button";
import "./App.css";

const App = () => {
  const [chapters, setChapters] = useState([]);
  const [activeTabUrl, setActiveTabUrl] = useState("");
  const [activeTabID, setActiveTabID] = useState(0);

  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Listen for messages containing the active tab URL
    if (request.url) {
      // Make a request to the AssemblyAI API using the active tab URL

      // Process the response from the AssemblyAI API

      // Send a response back to the background script to indicate that the request was successful
      sendResponse({ success: true });
    }
  });

  function getVideoChapters() {
    // Get the active tab url
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // The URL of the active tab is stored in the first element of the `tabs` array
      //   console.log("Active tab URL: ", tabs[0].url);
      setActiveTabUrl(tabs[0].url);
      setActiveTabID(tabs[0].id);

      // Send a message containing the active tab URL to the content script
      sendMessageToContentScript();
    });
  }

  // Send a message to the content script to get the active tab URL
  function sendMessageToContentScript() {
    chrome.tabs.sendMessage(activeTabID, { url: activeTabUrl }, (response) => {
      console.log("Response: ", response);
      if (response !== undefined && Object.keys(response).length > 0) {
        // The content script was able to make a request to the AssemblyAI API and process the response
        // The response object contains the chapters
        setChapters(response.chapters);
      } else {
        // There was an error making the request to the AssemblyAI API
        // The response object contains the error message
        const { error } = response;
        console.error(error);
      }
    });
  }

  function addChapters(chapters) {
    return (
      <div className="chapters">
        {chapters.map((chapter, index) => (
          <div className="chapter" key={index}>
            <h2>Gist: {chapter.gist}</h2>
            <h3>Headline: {chapter.headline}</h3>
            <p>Start: {chapter.start}</p>
            <p>End: {chapter.end}</p>
            <p>Summary: {chapter.summary}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h1>YouTube Chapters</h1>
        <Button
          type="submit"
          onClick={() => getVideoChapters()}
          disabled={false}
        >
          Get Outline of Video
        </Button>
      </div>
      <div className="chapters">
        {chapters.length > 0 ? addChapters(chapters) : null}
      </div>
    </>
  );
};

export default App;
