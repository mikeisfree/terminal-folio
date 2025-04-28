# Google Trends Agent

This agent retrieves top trending keywords from **Google Trends** across categories for 15 Countries and finds related article links for each keyword.

A robust web scraping tool to extract trending searches and related article links from Google Trends.

### Features

- Scrapes trending searches from multiple categories:

  - Business and Finance

  - Politics

  - Newspapers

  - Sports News

- Extracts related articles for each trending topic

- Supports multiple output formats (Markdown and JSON)

- Implements fallback mechanisms for reliable data collection

- Handles dynamic content loading with Selenium WebDriver

  

### Stack

- Python

- Required packages: requests, beautifulsoup4

- ChromeDriver (matching your Chrome version)


### Command Line Interface  
For more options, use the CLI:

```bash

python run_agent.py --region US --category business --output results.json

```  
Options:
- `--region`: Region code (default: US)
- `--category`: Category (default: business)
- `--output`: Output file path (optional)
- `--verbose`: Enable verbose output
- `--use-fallback`: Use fallback data instead of web scraping


## Output Format

The agent returns data in the following JSON format:

```json

{

  "timestamp": "2025-03-03 04:45:12",

  "region": "US",

  "category": "Business & Finance",

  "keywords": [

    {

      "keyword": "xrp price",

      "search_volume": "200K+",

      "articles": [

        "https://edition.cnn.com/2025/03/02/business/trump-cryptocurrency-market-spike/index.html",

        "https://finance.yahoo.com/video/crypto-prices-jump-trump-sets-025315985.html",

        "https://www.cnbc.com/2025/03/02/trump-announces-strategic-crypto-reserve-including-bitcoin-solana-xrp-and-more.html"

      ]

    },

    {

      "keyword": "nasa moon landing blue ghost",

      "search_volume": "100K+",

      "articles": [

        "https://www.nasa.gov/missions/artemis/blue-ghost-moon-landing/",

        "https://www.space.com/blue-ghost-moon-lander-launch-date",

        "https://www.scientificamerican.com/article/nasa-blue-ghost-moon-mission/"

      ]

    },

    {

      "keyword": "anne wojcicki",

      "search_volume": "20K+",

      "articles": [

        "https://www.forbes.com/profile/anne-wojcicki/",

        "https://www.businessinsider.com/23andme-ceo-anne-wojcicki-profile",

        "https://www.cnbc.com/2025/03/01/23andme-ceo-anne-wojcicki-announces-new-health-initiative.html"

      ]

    }

  ]

}
```