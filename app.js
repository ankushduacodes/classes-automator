"use strict"

import puppeteer from "puppeteer";
import schedule from 'node-schedule';

class Browser {
  browser;
  async launch() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--use-fake-ui-for-media-stream'],
      timeout: 60000,
    });
  }

  async close() {
    await this.browser.close();
  }

  async scrape() {
    const page = await this.browser.newPage();
    await page.goto('https://cuchd.blackboard.com/', {waitUntil: 'networkidle2'});
    await page.waitForSelector('#agree_button');
    await page.click('#agree_button');
    await page.waitForSelector('#user_id');
    await page.$eval('#user_id', el => el.value = '21BCS8106');
    await page.$eval('#password', el => el.value = 'Ankush#327');
    await page.click('#entry-login');
    await page.waitForTimeout(5000);
    await page.goto('https://cuchd.blackboard.com/ultra/courses/_54426_1/outline', {waitUntil: 'networkidle2'});
    let user_id = (await page.$('#user_id')) || "";
    console.log(user_id);
    await page.waitForTimeout(5000);
    await page.waitForSelector('#course-outline-roster-link > a > div.element-details > div.content')
    await page.click('#sessions-list-dropdown');
    await page.waitForSelector('#sessions-list > li');
    await page.click('#sessions-list > li');
    const pages = await this.browser.pages();
    const meetPage = pages[2];

    await meetPage.bringToFront();
    await meetPage.waitForSelector('#dialog-description-audio > div.techcheck-controls.equal-buttons.buttons-2-md > button');
    await meetPage.click('#dialog-description-audio > div.techcheck-controls.equal-buttons.buttons-2-md > button');
    await meetPage.waitForSelector('#techcheck-video-ok-button');
    await meetPage.click('#techcheck-video-ok-button');
    await meetPage.waitForSelector('#main-container > main > bb-panel-open-control > div');
    await meetPage.waitForSelector('#announcement-modal-page-wrap > div > div.announcement-later-tutorial.ng-scope');
    await meetPage.click('#announcement-modal-page-wrap > div > div.announcement-later-tutorial.ng-scope')
    await meetPage.screenshot({path: 'example.png'});
  }
}


let b1 = new Browser();
let b2 = new Browser();
let browserList = [];
// let b3 = new Browser();
// let b4 = new Browser();
// let b5 = new Browser();

function removeJob(job) {
  browserList = browserList.filter((b) => {
    return b.job !== job;
  })
}

const startTime1 = new Date(Date.now() + 1000);
const job1 = schedule.scheduleJob(startTime1, async function () {
  await b1.launch();
  browserList.push({
    id: Math.random(),
    browser: b1,
    job: job1
  });
  try {
    await b1.scrape();
  } catch (err) {
    await b1.close();
    job1.cancel();
    removeJob(job1);
  }
});
setTimeout(async () => {
  await b1.close();
  job1.cancel();
  removeJob(job1);
}, 70000);

const startTime2 = new Date(Date.now() + 6000);
const job2 = schedule.scheduleJob(startTime2, async function () {
  await b2.launch();
  browserList.push({
    id: Math.random(),
    browser: b2,
    job: job2
  });
  try {
    await b2.scrape();
  } catch (err) {
    await b2.close();
    job2.cancel();
    removeJob(job2);
  }
});
setTimeout(async () => {
  await b2.close();
  job2.cancel();
  removeJob(job2);
}, 60000);

setInterval(() => {
  console.log(browserList);
}, 15000);

//
// const startTime3 = new Date(Date.now() + 12000);
// const startTime4 = new Date(Date.now() + 18000);
// const startTime5 = new Date(Date.now() + 24000);
