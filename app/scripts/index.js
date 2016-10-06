var $ = require('jquery');
var _ = require('underscore');
var handlebars = require('handlebars');

// Etsy data point
var url = "https://api.etsy.com/v2/listings/active.js?api_key=cdwxq4soa7q4zuavbtynj8wx&keywords=yarn&includes=Images,Shop";


function displayProducts(products){
  var $target = $('#products-container'),
      $productImgs = $('.product-img'),
      $source = $('#product-card-template').html(),
      template = handlebars.compile($source),
      context;

  products.forEach(function(product){
    var productHTML = $(template(product));
     context = {
        'itemImageUrl': product.Images[0].url_570xN,
        'itemTitle': product.title,
        'productSeller': product.Shop.shop_name,
        'productCost': product.price,
        'currencyCode' : currencySymbol(product.currency_code)
      };

    $target.append(template(context));

  });
}

function currencySymbol(code){
  switch(code){
    case 'EUR':
      return '\u20ac'; // Euro
    case 'GBP':
      return '\u00a3'; // Pound
    default:
      return '\u0024'; // Dollar
  }
}

function run(data){
  var products = data.results;
  displayProducts(products);
}


fetchJSONP(url, function(data) {
  run(data);
});


// ##############################
// DEMO CODE FROM CLASS

// var source = $('#photo-album').html();
// var template = handlebars.compile(source);
//
// console.log(template);
//
// var context = {
//   title: 'Cat Album',
//   'albumNumber' : '11'
// };
//
// $('#album-container').html(template(context));
// $('#album-container').append(template(context));



// ####################################
// fetchJSONP() from assignment notes
// ####################################

/*
  (url: String, callback: Function) -> undefined

  Execute a callback function with the JSON results from the url specified.

  Examples
      var url = "https://api.etsy.com/v2/listings/active.js?api_key=cdwxq4soa7q4zuavbtynj8wx&keywords=yarn&includes=Images,Shop";

      fetchJSONP(url, function(data) {
        // do something with data
      });

      // OR

      function logData(data) {
        console.log(data);
      }

      fetchJSONP(url, logData);
*/
function fetchJSONP(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    var script = document.createElement('script');

    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}
