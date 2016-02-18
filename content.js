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
            /* HERE DISPLAY TOASTER OR SOMETHING */
        }
	}); 
};

function shoutLink(key,url){
	$.post('http://www.taringa.net/ajax/shout/attach', {
        key: key,
        url: url
    },function(object){		
    	shout(key, object.data.title, 3, object.data.id );
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