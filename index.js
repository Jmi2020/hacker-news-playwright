const { chromium } = require("playwright");
const chrono = require("chrono-node");

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News "newest" section
  await page.goto("https://news.ycombinator.com/newest");

  let articles = [];
  let pageNumber = 1;

  while (articles.length < 100) {
    console.log(`Scraping page ${pageNumber}...`);
    
    // Extract articles from the current page
    const newArticles = await page.$$eval('.athing', rows => {
      return rows.map(row => {
        const titleElement = row.querySelector('.titlelink');
        const timeElement = row.nextElementSibling.querySelector('.age a');
        
        const title = titleElement ? titleElement.innerText : 'No title';
        const timeAgo = timeElement ? timeElement.innerText : 'No timestamp';
        
        return { title, timeAgo };
      });
    });

    // Add new articles to the existing list
    articles = articles.concat(newArticles);

    // If less than 100 articles, go to the next page
    if (articles.length < 100) {
      // Check for the "More" link to navigate to the next page
      const moreLink = await page.$('a.morelink');
      if (moreLink) {
        console.log("Clicking the 'More' link to load more articles...");
        
        // Click the "More" link and wait for the next page to load
        await Promise.all([
          moreLink.click(),
          page.waitForNavigation({ waitUntil: 'networkidle' }) // Wait for the new page to load fully
        ]);
        
        pageNumber++;
      } else {
        console.log("No more pages to load.");
        break;
      }
    }
  }

  // Only keep the first 100 articles
  articles = articles.slice(0, 100);

  // Log all the timestamps
  console.log("Timestamps of all scraped articles:");
  articles.forEach((article, index) => {
    console.log(`${index + 1}: ${article.timeAgo}`);
  });

  // Convert relative times into comparable absolute times using chrono-node
  const now = new Date();
  const articlesWithDates = articles.map(article => {
    const absoluteTime = chrono.parseDate(article.timeAgo, now);
    return { ...article, absoluteTime };
  });

  // Check if the articles are sorted from newest to oldest
  let isSorted = true;
  for (let i = 1; i < articlesWithDates.length; i++) {
    if (articlesWithDates[i].absoluteTime > articlesWithDates[i - 1].absoluteTime) {
      isSorted = false;
      break;
    }
  }

  if (isSorted) {
    console.log("The first 100 articles are sorted from newest to oldest as requested.");
  } else {
    console.log("The articles are not sorted in the right order.");
  }

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
