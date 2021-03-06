// this is the background code...

//COntextMenu Code
// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Log a Play on BGG";
  var id = chrome.contextMenus.create({"title": title, "contexts":["page"],
                                         "id": "context" + context});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
  var sText = info.selectionText;
  var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);  
  window.open(url, '_blank');
};

//Toolbar Button Code

// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(function (tab) {

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	var currentURL = tabs[0].url;
	var temp1 = currentURL.split("/");
    var domain = temp1[2];
	
	if(domain =="www.yucata.de"){
		
	//goto bgg page because you are at yucata
		var temp2 = temp1[5];
		var temp3 = temp2.split(/(?=[A-Z])/).join(" ");
		var str1 = "https://www.boardgamegeek.com/xmlapi/search?search=";
		var str2 = temp3;
		var res = str1.concat(str2);

		//api fetch
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			var test2 = xhr.responseText;
			var testRE = test2.match("objectid=(.*)>");
			testRE = testRE[1].replace(/"/g, "");
			//this is the BGG object id
			GoToBGGPage(testRE);
			function myListener(tabId, info, tab) {
				if (info.status == "complete") {
					// This line runs the SPLU script within the BGG page
					chrome.tabs.executeScript(tab.id, { code: "window.onready;document.body.appendChild(document.createElement('script')).src='https://rawgit.com/wizardxbmcmods/Yucata-Play-Logger/master/splu.js'" }, null);
					// end of splu script
					/* Now, let's relieve ourselves from our listener duties */
					chrome.tabs.onUpdated.removeListener(myListener);
					return;
				}
			};
			chrome.tabs.onUpdated.addListener(myListener);
		  }
		}
		xhr.open('GET', res, true);
		xhr.send(null);

		$.get(res, function(responseText) {

		});
		  		  
		}
	else
alert("You must be on Yucata.de to use this tool.");

});

});

//Functions needed

function GoToBGGPage(gameid) {
	var newurl = "https://www.boardgamegeek.com/boardgame/" + gameid;
	window.open(newurl, "Log a Play", "height=460,width=1100");
	window.focus()
	//chrome.tabs.create({url:"https://www.boardgamegeek.com/boardgame/" + gameid});
}

