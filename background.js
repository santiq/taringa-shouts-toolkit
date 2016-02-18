var contexts = ['selection','image','link'];
contexts.forEach(context=> {
	chrome.contextMenus.create({
		title:`Compartir ${context==='image'?'imagen':context==='selection'?'texto':context} en shout...`,
		contexts:[context],
		onclick:clickHandler,
		id:context
	})	
})

function clickHandler(data){
	chrome.tabs.create({ url: 'http://www.taringa.net/mi', selected:true },
	 function(tab) {
	    
	    var onready = function() {
	    	
	        onready = function() {}; // Run once.
	        chrome.tabs.onUpdated.removeListener(listener);

	        chrome.tabs.sendMessage(tab.id, {shout: data.menuItemId, linkUrl:data.linkUrl, srcUrl:data.srcUrl, text:data.selectionText});
	        
	    };

	    // Detect update
	    chrome.tabs.onUpdated.addListener(listener);

	    // Detect create (until crbug.com/411225 is fixed).
	    chrome.tabs.get(tab.id, function(tab) {
	        if (tab.status === 'complete') {
	            onready();
	        }
	    });

	    function listener(tabId, changeInfo) {
	        if (tabId === tab.id && changeInfo.status == 'complete') {
	            onready();
	        }
	    }
	});

}