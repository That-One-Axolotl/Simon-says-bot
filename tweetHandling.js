const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("node:fs");
const token = process.env.TOKEN;

module.exports = { parseTweets, findNewTweets, writeTweetsToJson, fetch_posts, fetch_replied_post };

async function fetch_posts(user) {
    let response = await fetch(`https://nitter.cf/${user}/with_replies`);
    let html = await response.text();
    return html;
}

async function writeHtmlToFileDebug() {
    let html = await fetch_replies();
    fs.writeFile("test_html.html", html, err =>{if(err){console.log(err)}});
}

async function fetch_replied_post(reply) {
    let res = await fetch(`https://nitter.cf/${reply}`);
    let html = await res.text();
    let dom = new JSDOM(html);
    let document = dom.window.document;
    let replyTweets = document.querySelectorAll(".before-tweet .timeline-item .tweet-link");
    let mainTweetLink = replyTweets[replyTweets.length - 1].href;
    return mainTweetLink;
}

async function parseTweets(raw, oldTweets) {
    let tweets = [];
    let dom = new JSDOM(raw);
    let document = dom.window.document;
    let items = document.getElementsByClassName("timeline-item");
    for (let index = 0; index < items.length; index++) {
        const tweet = items[index];
        let text = tweet.querySelector(".tweet-content").textContent;
        let link = tweet.querySelector(".tweet-link").href;
        let time = tweet.querySelector(".tweet-date a").title;
        let referenceLink = "";

        if(!oldTweets.some(index => index[1] === link)){
            let isReply = tweet.querySelector(".replying-to");


            if(isReply != null){
                referenceLink = await fetch_replied_post(link);
            }
        }

        tweets.push([text, link, time, referenceLink]);
    }
    //console.log(tweets);
    return tweets;
}

function findNewTweets(tweets, prevTweets) {
    const seen = new Set(prevTweets.map(t => t[1]));
    const newTweets = tweets.filter(t => !seen.has(t[1]));
    return newTweets.reverse();
}

function writeTweetsToJson(tweets, user) {
    fs.writeFile(`prevTweets${user}.json`, JSON.stringify(tweets), err =>{if(err){console.log(err)}});
}