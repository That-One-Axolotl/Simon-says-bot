const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("node:fs");

async function fetch_html() {
    //let response = await fetch("https://nitter.cf/Simon_Hypixel/with_replies");
    let html = await response.text();
    console.log(html);
    return html;
}

async function writeHtmlToFileDebug() {
    let html = await fetch_html();
    fs.writeFile("test_html.html", html, err =>{if(err){console.log(err)}});
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
        tweets.push([text, link]);
    }
    return tweets;
}

function findNewTweets(tweets, prevTweets) {
    newTweets = [];
    tweets.forEach(tweet => {
        if(!tweet in prevTweets){
            newTweets.push(tweet);
        }
    });
    return newTweets.reverse();
}

function writeTweetsToJson(tweets) {
    fs.writeFile("prevTweets.json", JSON.stringify(tweets), err =>{if(err){console.log(err)}});
}





console.log("test");