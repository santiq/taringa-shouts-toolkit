chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse)=> {
  	if(request.shout){
  		getKet((err,obj)=>{
  			switch(request.shout){

  				case 'selection':
  					shout(obj.key, request.text);
  				break;

  				case 'image':
  					shoutImage(obj.key, request.srcUrl);
  				break;

  				case 'link':
  					shoutLink(obj.key, request.linkUrl)
  				break;
  			}
  			
  		});

		return true;
  	}  
});



function getKet(callback){
	$.get('http://www.taringa.net',(body)=>{

			var pattern = /var global_data = { user: \'(.*)\', user_key: \'(.*)\', postid/;
	    	var match = pattern.exec(body);
	    	if ( match && match.length === 3 && match[1] !== '' && match[2] !== '') {
	      		var userId = match[1];
	      		var key = match[2];
	      		callback(null,{userId:userId, key:key});	      		
	  		}else{
				callback('not-found');		    	
	  		}
  		
	})
}


function shout(key, msg, type, attachment) {
	attachment = attachment || ' ';
	type = type || 0;
	msg = msg || ' ';
	$.ajax({
        type: 'POST',
        url:'http://www.taringa.net/ajax/shout/add',
        data:{
	            key: key,
	            attachment: attachment,
	            attachment_type: type,
	            privacy:0,
	            body: msg.substring(0,254)
	        
		},
   
        success: function(data) {
            /* HERE DISPLAY A TOASTER OR SOMETHING */
        }
	}); 
};

function shoutLink(key,url){

  var isVideo = ytVidId(url) ? 1 : 0 ;
  var type =  isVideo ?  2 : 3;

	$.post('http://www.taringa.net/ajax/shout/attach', {
        key: key,
        url: url,
        isVideo:isVideo
    },function(object){		
      var attachment = isVideo ? object.data.url : object.data.id;
    	shout(key, object.data.title, type, attachment );
    });
};

function shoutImage(key,url){
	$.post('http://www.taringa.net/ajax/shout/attach', {
        key: key,
        url: url,
        isImage:1
    },function(object){
    	shout(key,'',1, object.data.url);
    });
}

/**
 * JavaScript function to match (and return) the video Id 
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 */
function ytVidId(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}