Hacker News Scraper using Playwright  

Project Overview

This project is a web scraping tool built using Playwright, a powerful browser automation library, and chrono-node, a library for parsing dates from natural language strings. The goal of the script is to scrape the first 100 articles from the "newest" section of Hacker News, sort them based on the time they were posted, and verify that they are displayed from newest to oldest.

Features

Scrape 100 articles from the "newest" section of Hacker News.
Handle pagination: Since only 30 articles are shown per page, the script automatically clicks the "More" link to load additional pages until 100 articles are scraped.
Timestamps extraction: The script extracts the timestamp of each article (e.g., "5 minutes ago") and converts it into an absolute time for comparison.
Sorting validation: After scraping the articles, the script checks whether the articles are sorted from newest to oldest based on the timestamp.
Project Structure

perl
Copy code
.
├── index.js          # The main script file for scraping Hacker News
├── package.json      # Contains project dependencies and scripts
├── package-lock.json # Dependency lock file (auto-generated)
└── .gitignore        # Specifies files to be ignored by git (e.g., node_modules/)
How It Works
The logic used to create this script is as follows:

Set Up Browser Automation:

The script uses Playwright to launch a Chromium browser in non-headless mode. It opens a new tab and navigates to the "newest" section of Hacker News.
Scraping the Articles:

The script looks for elements with the class .athing, which corresponds to individual articles on Hacker News.
For each article, it extracts:
Title: Retrieved from the .titlelink class within the article element.
Timestamp: Retrieved from the .age a element, which contains a relative time (e.g., "2 hours ago").
Handling Pagination:

Since Hacker News only displays 30 articles per page, the script uses the "More" link (.morelink) at the bottom of the page to navigate to the next set of articles.
This process repeats until 100 articles are collected.
Convert Timestamps:

The extracted relative timestamps (e.g., "5 minutes ago") are converted into absolute JavaScript Date objects using chrono-node. This allows us to compare the actual times when the articles were posted.
Sorting Validation:

Once all 100 articles are collected, the script verifies whether they are correctly sorted from newest to oldest. It does this by comparing the Date objects of each article, ensuring that the timestamp of each article is less than or equal to the previous one.
Console Output:

The script logs the timestamps of all 100 articles to the console for reference. It also outputs whether the articles are sorted correctly or not.
How to Run the Project
Prerequisites
Node.js installed.
Clone this repository or download the project files.
Run npm install to install the necessary dependencies.
Commands
Install dependencies:

bash
Copy code
npm install
Run the scraper:

bash
Copy code
node index.js
Output
Timestamps: The script will print the timestamps of all 100 articles in the console.
Sorting Check: The script will indicate whether the articles are sorted from newest to oldest.
Dependencies
Playwright: Used for browser automation and scraping the web page.
Chrono-node: Used to parse human-readable timestamps (like "5 minutes ago") into Date objects.
Node.js: The runtime environment for running the script.
Future Improvements
Error Handling: Add more robust error handling for cases where the page fails to load or if elements are missing.
Advanced Sorting: Improve sorting validation to handle edge cases where articles may have the exact same timestamp.