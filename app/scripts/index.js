var $ = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');

// Etsy data point
// var keywords = 'yarn';
var url = 'https://api.etsy.com/v2/listings/active.js?api_key=cdwxq4soa7q4zuavbtynj8wx&keywords=yarn&includes=Images,Shop';

$('#search-query').on('submit', function(e){
  e.preventDefault();
  var searchTerm = $('#search-term').val().replace(' ', '+');
  var newUrl = 'https://api.etsy.com/v2/listings/active.js?api_key=cdwxq4soa7q4zuavbtynj8wx&keywords=';
      newUrl += searchTerm;
      newUrl += '&includes=Images,Shop';

  fetchJSONP(newUrl, function(data) {
    run(data, searchTerm);
  });

});

function displayTaxonomyPath(products) {
  var source = $('#taxonomies').html(),
      $target = $('#taxonomy_paths'),
      template = Handlebars.compile(source);

  if($target.html()) {
    $target.html('');
  }

  var taxonomies = products.map(function(product){
    return product.taxonomy_path;
  });
  var uniques = _.union(_.flatten(taxonomies));

  uniques.forEach(function(item){
    var context = { "taxonomy_path" : item };
    $target.append(template(context));
    // console.log(context);
  });
}


function displayProducts(products, searchTerm){
  // get html targets, set up template source and compile
  var $target = $('#products-container'),
      $productImgs = $('.product-img'),
      $searchResult = $('#search-result-info'),
      $source = $('#product-card-template').html(),
      template = Handlebars.compile($source),
      context;

  if($target.html()){
    $target.html('');
  }

  // loop through products array, do stuff on each product
  products.forEach(function(product){
    var productHTML = $(template(product));
    // providing context to the named variables in the template
     context = {
        'itemImageUrl': product.Images[0].url_570xN,
        'itemTitle': product.title,
        'productSeller': product.Shop.shop_name,
        'productCost': product.price,
        'currencyCode' : currencySymbol(product.currency_code),
        'url' : product.url
      };
    $searchResult.text('Search results for ' + searchTerm);
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

function run(data, searchTerm){
  var products = data.results;
  displayProducts(products, searchTerm);
  displayTaxonomyPath(products);
}


fetchJSONP(url, function(data) {
  var searchTerm = 'yarn'; // initial search term
  run(data, searchTerm);
});


// ##############################
// DEMO CODE FROM CLASS

// var source = $('#photo-album').html();
// var template = Handlebars.compile(source);
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
