// Han first extension
(function(ext) {
  var isPositive = false; // This becomes true after the alarm goes off

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

	unirest.get("https://jamiembrown-tweet-sentiment-analysis.p.mashape.com/api/?text=I+love	+Mashape!")
	.header("X-Mashape-Key", "<required>")
	.header("Accept", "application/json")
	.end(function (result) {
	  console.log(result.status, result.headers, result.body);
	});

	ext.get_sentiment = function(text, callback) {
		$.ajax({
	    	url: 'https://community-sentiment.p.mashape.com/'+text+'/', // The URL to the API. You can get this in the API page of the API you intend to consume
	    	dataType: 'jsonp',
	    	success: function(data) {
				sentiment = data['main']['sentiment'];
				callback(sentiment);
			},
	    	//error: function(err) { alert(err); }
		});
	};

	ext.set_possitive = function() {
	       isPositive = true;
	    };

	 ext.when_positive = function() {
	     // Reset alarm_went_off if it is true, and return true
	     // otherwise, return false.
	     if (isPositive === true) {
           isPositive = false;
		   return true;
	     }

	       return false;
	 };
      //
	    // // Block and block menu descriptions
	    var descriptor = {
	        blocks: [
				['R', 'sentiment of %s', 'get_sentiment', 'Positive']
	            //['', 'make positive', 'set_positve'],
	            //['h', 'when positive sentiment', 'when_positive'],
	        ]
	    };

	    // Register the extension
	ScratchExtensions.register('Alarm extension', descriptor, ext);
	})({});
