//Harshita first extension
(function(ext) {

  //cache all queried restaurants into a dictionary structure
  var cachedRestaurants = {};

  //get top restaurant name using criteria
  function getRestaurantData(restaurantData) {
    var val = restaurantData.businesses;
    return(val[0].name);
  }

  //call Yelp API and pull restaurant data
  function fetchRestaurantData(cuisine, location, callback) {

    // Make an AJAX call to the Yelp API
    $.ajax({
      method: "GET",
      //note: this may not work because I was not yet able to get the access key for the API
      url: 'https://api.yelp.com/v3/businesses/search',
      data: {term: cuisine, location: location}, //seach using location and cuisine keywords
      dataType: 'json', //get resutls in the form of a JSON

      success: function(restaurantData) {
        //Received the restaurant data. Cache and return the data.
        //save top 20 restaurants (default)
        for(var i = 0; i < total; i++) {
          //store name, rating, and phone #
          cachedRestaurants[location][cuisine][i] = {name: restaurantData.buisnesses[i].name, rating: restaurantData.buisnesses[i].rating, phone: restaurantData.buisnesses[i].phone};
        }
        callback(restaurantData);
      }
    });
  }

  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };

  //function associated with block to pull top restaurant
  ext.getRestaurant = function(cuisine, location, callback) {
    fetchRestaurantData(cuisine, location, function(data) {
      var val = getRestaurantData(data);
      callback(val);
    });
  };

  //function to determine whether a certain restaurant is >, ==, or < defined star rating
  ext.checkRating = function(cuisine, location, op, val) {

    //if query not searched before
    if (!cachedRestaurants[location][cuisine]) {
      //Restaurant data not cached
      //Fetch it and return false for now
      fetchRestaurantData(cuisine, location, function(){});
      return false;
    }

    //pull data if query searched before
    fetchRestaurantData(cuisine, location, function(){});

    //Restaurant data is cached, no risk of blocking
    var rating = cachedRestaurants[location][cuisine][0].rating;

    //return boolean for whether top restaurant meets this criteria
    switch (op) {
      case '<':
        return (rating < val);
      case '=':
        return (rating == val);
      case '>':
        return (rating > val);
    }
  };

  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      ['R', 'a(n) %m.cuisines restauraint in %s', 'getRestaurant', 'Indian', 'Boston, MA'],
      ['r', 'is review is %m.ops %n stars?', 'checkRating', '>', 4],
    ],
    //menus for different quisines and operations
    menus: {
      cuisines: ['Indian', 'Chinese', 'Thai', 'Italian', 'Mexican'],
      ops: ['>','=', '<'],
    }
  };

  // Register the extension
  ScratchExtensions.register('Yelp Restaurant extension', descriptor, ext);

})({});
