
<h1 align="center">
  <br>
   StackOverflow Browser Plugin
</h1>

# Description
<h4>A Chrome Extension that adds tags to Stack Overflow threads</h4>

## Features
<ul> 
  <li> Adds tags onto Stack Overflow thread answers based off the context of the answer </li>
  <li> Highlights important key phrases and words in the answer</li>
  <li> Filter answers by tag </li>
</ul>

## Downloading the Extension
Currently, to install the extension, download all files in the github repo, and save them as a file. Go to chrome://extensions/, and click the “Load Unpacked” button at the top left of the screen. The extension is now applied to the Chrome browser. 

In the future, the extension will be added to the Google Marketplace, and will be installable from there.

Tags should automatically show up on SO pages if applicable.

## Retrieving The CSV
The extension relies on a CSV to get the information about the SO answers. There are two ways to get this CSV: locally, or via an API that can access the CSV hosted on a web server (for now…)

The dropdown menu can be found here:

<img src="extension-src/documentation/options.png" width="40%" height="40%" alt = "where"> 

### Locally
Clicking the “extension options” button on chrome://extensions will show a pop-up asking where to get the extension from. Choosing “Local” means that the CSV is retrieved from the extension itself: since inside the extension folder is a copy of the CSV. Whether or not the copy is a previous, outdated version depends on when the extension folder was downloaded. 

Pros: doesn’t require any additional libraries/knowledge of how to use them, don’t have to run server.js every time you plan on using the extension
Cons: CSV on computer may become outdated if a newer version is released


### API
Choosing “API” means that the CSV will be retrieved from a web server, and will thus return the latest version of the CSV. However, the user will have to have Node.JS, and will have to run the server.js file on their computer in order to get the CSV from a local host (for now…)

Pros: CSV always up to date
Cons: requires Node.js

#### Installation Instructions (if you choose API)
<ul>
  <li>Go to the RESTapi-src folder and run npm install to install all dependencies</li>
<li>Run node so-tags.js file in the RESTapi-src folder</li> 
</ul>

## Dependencies
<ul> 
  <li> node.js</li>
</ul>

## Description of Files
<table>
  <tr>
    <th>File</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Dataset_Sample.csv</td>
    <td>Contains the data about Stack Overflow threads, including what keywords are in the threads, and the respective tags.
    The information in this csv file is formatted as: ThreadId, AnswerID, Key Phrases/Sentences, Tags</td>
  </tr>

  <tr>
    <td>pageSource.js</td>
    <td>The content script of the extension. Reads the HTML of the Stack Overflow page, and then highlights and injects the right tags into it. It gets the tags from...</td>
  </tr>
    <tr>
    <td>background.js</td>
    <td>Reads Dataset_Sample.csv, and tells pageSource.js the right tags to inject and what to highlight.</td>
  </tr>
   <tr>
    <td>excludingAnswers.js</td>
    <td>When the user clicks on one of the tags at the top of the page, all answers that do not contain that tag will be hidden, so the user can find what they're looking for faster!</td>
  </tr>
  <tr>
    <td>manifest.json</td>
    <td>Tells Chrome the properties of the extension, including what scripts to run, and which pages to run on.</td>
  </tr>
</table>

## How It Works

Before: 
<img src="extension-src/documentation/Before.png" width="40%" height="40%" alt = "Before..."> 
After:
<img src="extension-src/documentation/After.png" width="40%" height="40%" alt="...and After">

Try it yourself <a href = "https://stackoverflow.com/questions/104850/test-if-string-is-a-guid-without-throwing-exceptions">here</a>!

## Next Steps
The current next steps (as of August 2020…) will be:
<ul>
### Finding more answers to put tags on:
  <li>This will start in September of 2020, and is the main “research” part of this project</li>
</ul>
<ul>
### Installing the extension directly on the Chrome Marketplace:
<li>There is an “Issue” on Github with all the relevant information pertaining to putting the extension on the Chrome marketplace. </li>
</ul>
