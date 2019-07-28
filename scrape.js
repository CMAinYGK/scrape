require("events").EventEmitter.defaultMaxListeners = 100;

const puppeteer = require("puppeteer");
const fs = require('fs');
const links = ['http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/6474/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/233/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/163525/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/5114/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/650/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/1404/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/176643/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/708/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/4151/en', 'http://www.infogo.gov.on.ca/infogo/home.html#orgProfile/146614/en', ];

for (let i = 0; i < links.length; i++) {
  let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = links[i]
    await page.goto(`${url}`);
    await page.waitFor(1000);


    const result = await page.evaluate(() => {
      let data = [];
      let elements = document.querySelectorAll("div.small-12.column.show-for-medium-up > span");
      let ministry = document.querySelector("h5");
      for (var element of elements) {
        let contact = element.innerText;
        data.push({
          contact,
          ministry
        })
      }
      return data;
    })

    browser.close();
    return result
  }


  scrape().then((value) => {
    let data = "";
    for (let i = 0; i < value.length; i++) {
      data = data + value[i].contact + '\n';
    }
    fs.appendFile('QPList4.xls', data, (err) => {
      if (err) throw err;
      console.log("Entry Added!")
    })
  })
}