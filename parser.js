var http = require('http'),
fs = require('fs'),
cheerio = require('C:/Program Files/nodejs/node_modules/npm/node_modules/cheerio'),
express = require('C:/Program Files/nodejs/node_modules/npm/node_modules/express'),
request = require('C:/Program Files/nodejs/node_modules/npm/node_modules/request'),
hotline_url = "http://hotline.ua/mobile-mobilnye-telefony-i-smartfony/apple-iphone-7-32gb-black/";
var path = "C:/Users/afair/Downloads/Programmirovanie/result.txt";
var goods = [], goods_json = []; 

var parser = function(url) {
	request(url, function (error, response, body) {
    if (!error) {
    	var date = new Date(),
		t = date.getTime(),
		millis = Math.round(t * 1000);
		var csrf;
        var $ = cheerio.load(body);
        url = url + '/?tab=2&_=' + millis
        csrf = $('meta[name="csrf-token"]').prop('content');
        request({headers: {'X-Requested-With' : 'XMLHttpRequest', 'X-CSRF-Token': csrf}, url:url}, function (error, response, body) {
	    	if (!error) {
	    		$ = cheerio.load(body);
	    		$('div[class="box-line flex-block flex-stretch cell"]').each(function(i, elem) {
	    			goods[i] = [];
  					goods[i].store = $(elem).find('div[class="cell shop-title text-ellipsis"]').text().trim();
  					goods[i].price = $(elem).find('a[id="gotoshop-price"]').text().trim();
  					goods[i].delivery = 'Доставка: ' + $(elem).find('span[class="bl-view-delivery rel"]').text().trim();
  					goods[i].discount = $(elem).find('span[class="non-bl-320"]').text().trim();
  					goods[i].avaliability = $(elem).find('div[class="price txt-right cell5 cell-768 m_b-10-768"]').find('div[class="p_b-5"]').text().trim();
				});
				
	    		fs.writeFile(path, '');
	    		for (var i = 0; i < goods.length; ++i) 
	    		{
	    			goods_json[i] = 
	    			{
	    				stores: goods[i].store,
	    				price: goods[i].price,
	    				delivery: goods[i].delivery,
	    				discount: goods[i].discount,
	    				avaliability: goods[i].avaliability
	    			}
	    			console.log(goods_json[i]);
	    			fs.appendFile(path, JSON.stringify(goods_json[i]), function (err) {});
	    		}
		    } else {
		        console.log("Произошла ошибка: " + error);
		    }
		});
    } else {
        console.log("Произошла ошибка: " + error);
    }

});
}

parser(hotline_url);




