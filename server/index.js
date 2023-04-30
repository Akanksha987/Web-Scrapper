const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.get("/annual-reports", async (req, res) => {
  const year = req.query.year;
  if (!year) {
    return res.status(400).send("Please provide a year parameter");
  }

  const url =
    "https://ir.aboutamazon.com/annual-reports-proxies-and-shareholder-letters/default.aspx";
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const annualReports = $("a").filter((i, link) => {
      const href = $(link).attr("href");
      return href && href.toLowerCase().includes("annual-report");
    });

    const reportsForYear = [];
    annualReports.each((i, report) => {
      const title = "Annual reports";
      const result = parseInt(year, 10) + 1;

      if (year) {
        const link = `https://s2.q4cdn.com/299287126/files/doc_financials/${result}/ar/Amazon-${year}-Annual-Report.pdf`;
        reportsForYear.push({ title, link });
      }
    });

    if (year.length > 0) {
      res.send(reportsForYear);
      console.log(reportsForYear);
    } else {
      res.send(`No annual reports found for year ${year}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving annual reports");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
