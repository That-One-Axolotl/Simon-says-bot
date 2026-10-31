tweet = ["hi", "/9643#m"];
link_end = tweet[1];
if(link_end.endsWith("#m")){link_end = tweet[1].slice(0,-2)}
let link = "https://vxtwitter.com" + link_end;
console.log(link);