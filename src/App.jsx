import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import React, { useState, useEffect } from "react";
import Button from "./components/Button";
import "./App.css";

const App = () => {
  const assemblyAIEndpoint = "https://api.assemblyai.com/v2/transcript";

  const [chapters, setChapters] = useState([]);
  const [activeTabUrl, setActiveTabUrl] = useState("");
  const [activeTabID, setActiveTabID] = useState(0);

  function getVideoChapters() {
    // Get the active tab url
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // The URL of the active tab is stored in the first element of the `tabs` array
      //   console.log("Active tab URL: ", tabs[0].url);
      setActiveTabUrl(tabs[0].url);
      setActiveTabID(tabs[0].id);

      // Send a message containing the active tab URL to the content script
      //   sendMessageToContentScript();

      let params = {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          audio_url: activeTabUrl,
          auto_chapters: true,
        }),
        method: "POST",
      };

      fetch(assemblyAIEndpoint, params)
        .then((response) => response.json())
        .then((data) => {
          // Send the response back to the popup
          console.log("data returned to popup: ", JSON.stringify(data));
          setChapters(data.chapters);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  // Send a message to the content script to get the active tab URL
  function sendMessageToContentScript() {
    chrome.tabs.sendMessage(
      (tabId = activeTabID),
      (message = { url: activeTabUrl }),
      (response) => {
        console.log("Response: ", response);
        if (response !== undefined && Object.keys(response).length > 0) {
          // The content script was able to make a request to the AssemblyAI API and process the response
          // The response object contains the chapters
          setChapters(response.chapters);
        }
      }
    );
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
        <Button type="button" onClick={getVideoChapters()} disabled={false}>
          Get Chapters for this Video
        </Button>
      </div>
      <div className="active-tab-url">{activeTabUrl}</div>
      <div className="chapters">{chapters && addChapters(chapters)}</div>
    </>
  );
};

export default App;
