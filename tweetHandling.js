const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("node:fs");
const token = process.env.TOKEN;

module.exports = { fetch_replies, parseTweets, findNewTweets, writeTweetsToJson, fetch_posts, mergeTweets };

async function fetch_replies() {
    let response = await fetch("https://nitter.cf/Simon_Hypixel/with_replies");
    let html = await response.text();
    return html;
}

async function fetch_posts() {
    let response = await fetch("https://nitter.cf/Simon_Hypixel/");
    let html = await response.text();
    return html;
}

async function writeHtmlToFileDebug() {
    let html = await fetch_replies();
    fs.writeFile("test_html.html", html, err =>{if(err){console.log(err)}});
}

function mergeTweets(a, b) {
    const byUrl = new Map();
    for (const tweet of [...a, ...b]) {
        if (!byUrl.has(tweet[1])) byUrl.set(tweet[1], tweet);
    }

    const getTime = t => new Date(t[2].replace(" · ", " ")).getTime();

    return [...byUrl.values()].sort((x, y) => getTime(y) - getTime(x));
}

function parseTweets(raw) {
    let tweets = [];
    let dom = new JSDOM(raw);
    let document = dom.window.document;
    let items = document.getElementsByClassName("timeline-item");
    for (let index = 0; index < items.length; index++) {
        const tweet = items[index];
        let text = tweet.querySelector(".tweet-content").textContent;
        let link = tweet.querySelector(".tweet-link").href;
        let time = tweet.querySelector(".tweet-date a").title;
        tweets.push([text, link, time]);
    }
    console.log(tweets);
    return tweets;
}

function findNewTweets(tweets, prevTweets) {
    const seen = new Set(prevTweets.map(t => t[1]));
    const newTweets = tweets.filter(t => !seen.has(t[1]));
    return newTweets.reverse();
}

function writeTweetsToJson(tweets) {
    fs.writeFile("prevTweets.json", JSON.stringify(tweets), err =>{if(err){console.log(err)}});
}




console.log("test");