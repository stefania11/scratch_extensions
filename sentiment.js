new (function() {
    var ext = this;

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Get a text from user, use Sentiment API to determine if it is positve, neutral, negative.
    ext.get_sentiment = function(text, callback) {
        var sentiment;

        // Make an AJAX call to the sentiment API through using Mashape key
        $.ajax({
            url: "https://community-sentiment.p.mashape.com/text/",
            method: 'post',
            headers: {
                'X-Mashape-Key': 'Q14WJgrx19mshS8fWT4B2cUFpC8Tp1EkM80jsnoiN4lmSP7CuH'
            },
            data: {
                txt: text
            },
            success: function(data) {
                console.log('success', data);
                sentiment = data['result']['sentiment'];
                callback(sentiment);
            },
            error: function(reason) {
                console.log('error', reason);
            }
        });
    };

    // Use the result from get_sentiment to determine whether the user is happy or not.
    ext.is_happy = function(sentiment){
        var is_happy;

        if(sentiment == 'Negative'){
            is_happy = false;
        }else{
            is_happy = true;
        }
        console.log("is_happy", is_happy);
        return is_happy;
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'get sentiment of text %s', 'get_sentiment'],
            ['b', 'is happy %s', 'is_happy']
        ]
    };

    // Register the extension
    ScratchExtensions.register('Text Sentiment extension', descriptor, ext);
})();
