var API_KEY = "AIzaSyBGrYE1-miPMNJnbI6-kmlQwrh18HoMufg";
setTimeout(console.log("hi"), 50000);//done for testing purpose
var post_text = document.getElementsByClassName("userContent");//gets text but some arrays are empty so i had to run checking done below 
var many_links = document.getElementsByTagName("a");//gets all links with a tag

function feed_text_react(post_text, react_links) {
  var work = 0;
  for (var i = 0; i < post_text.length; i++) {//checks the text of post of null reacts with just like
    if (post_text[i].offsetLeft != 0 || post_text[i].offsetTop != 0) {
      if (post_text[i].textContent == "") {
        clickon(0, work, react_links);
        work = work + 6;
      } else {
        postTextToGoogle(post_text[i].textContent, work, react_links);
        work = work + 6;//gives post text to google sentiment api and gets response and then reacts to it
      }
    }
  }
}

function mouse_over(like_links) {//places the cursor over the like links to show hidden links for reacting
  for (var k = 0; k < like_links.length; k++) {
    like_links[k].dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  }
}
function mouse_out(like_links) {//at end removes cursor from like links
  for (var k = 0; k < like_links.length; k++) {
    like_links[k].dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
  }
}

function analyze_react(googleResponse, sScore, work, react_links) {//it gets data from api and depending on that reacts towards it
  if (sScore == 0) {
    clickon(0, work, react_links);
  }
  if (sScore < 0.7 && sScore >= 0.5) {
    clickon(1, work, react_links);
  }
  if (sScore >= 0.7) {
    clickon(2, work, react_links);
  }
  if (sScore > 0 && sScore <= 0.4) {
    clickon(3, work, react_links);
  }
  if (sScore > -0.6 && sScore < 0.0) {
    clickon(4, work, react_links);
  }
  if (sScore <= -0.6 && sScore >= -1.0) {
    clickon(5, work, react_links);
  }
}

function clickon(x, work, react_links) {//clicks on the desired button based on analysis
  console.log(work + x);
  y = work + x;
  console.log(y);
  console.log(react_links);
  react_links[y].click();
}

function postTextToGoogle(text, work, react_links) {//sends text and gets sentiment analysed through XMLHTTP requests we can use any api just we need to convert curl to http request format
  let data =
    '{\n "document": {\n  "type": "PLAIN_TEXT",\n  "content": ' +
    '" ' +
    text +
    'not sad"\n },\n "encodingType": "UTF8"\n}';
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  // Update API KEY below.
  xhr.open(
    "POST",
    "https://language.googleapis.com/v1/documents:analyzeSentiment?fields=documentSentiment&key=" +
      API_KEY
  );
  xhr.setRequestHeader(
    "Authorization",
    "Basic am9uYXRoYW4ubHVuZG1hcmtAbmV0bGlnaHQuY29tOlN0cmlkZXIwMTY1"
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Cache-Control", "no-cache");
  xhr.setRequestHeader("Postman-Token", "fbb90407-987e-47f3-afae-10575c402392");
  xhr.send(data);
  xhr.onload = function() {
    handle_click(this.responseText, work, react_links);
  };
}

function handle_click(googleResponse, work, react_links) {//parses the json file to javascript object
  let json = JSON.parse(googleResponse);
  let sScore = json.documentSentiment.score;
  // Optional Usage --> let sMagnitude = json.documentSentiment.magnitude;
  analyze_react(json, sScore, work, react_links);
}

function get_react_links(reaction_links) {//gets reaction links for reacting to texts
  req_links = [];
  for (var l = 0; l < reaction_links.length; l++) {
    if (reaction_links[l].offsetLeft != 0 || reaction_links[l].offsetTop != 0) {
      req_links.push(reaction_links[l]);
    }
  }
  return req_links;
}

function runit(many_links) { //Main functioning starts from here
  like_links = [];
  for (var j = 0; j < many_links.length; j++) {//collecting like links and keeping in mind not to select links from comments like links
      if (many_links[j].innerText == "Like" || many_links[j].innerText == "Wow" || many_links[j].innerText == "Haha" || many_links[j].innerText == "Love" || many_links[j].innerText == "Sad" || many_links[j].innerText == "Angry")
     {
        if (many_links[j].clientHeight != 0 || many_links[j].clientWidth != 0) {
            like_links.push(many_links[j]);
        }
    }
  }
  console.log(like_links)//test purpose
  mouse_over(like_links);//function for opening hidden links of angry or love reacts etc
  setTimeout(console.log("hi"), 50000);//test purpose
  react_links = [];
  req_links = document.getElementsByClassName("_iuw");//now accesing hidden links of different reacts
  for (var l = 0; l < req_links.length; l++) {
    if (req_links[l].offsetParent != null) {
        react_links.push(req_links[l]);
    }
  }
  console.log(react_links);//test purpose
  console.log(post_text);//test purpose
  feed_text_react(post_text, react_links);//checking links corresponding to text and reacting
  mouse_out(like_links);//removing mouse cursor from hidden links
}
runit(many_links); //Starts the process but remember that the page should be loaded nicely and just tested on home page
