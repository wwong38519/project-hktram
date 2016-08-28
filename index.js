var http = require('http');
var url = require('url');
var fs = require('fs');
var Q = require('q');
var xml2js = require('xml2js');
var mustache = require('mustache');

var port = process.env.PORT || 1337;
var apiKey = process.env.GOOGLE_API_KEY || 'GOOGLE_API_KEY';
var webroot = __dirname+'/src';

var server = http.createServer(function(request, response){
	try {
		route(request, response);
	} catch(err) {
		console.log(err);
	}
});
server.listen(port, function() {
	console.log('listening at port: ', port);
});

var route = function(request, response) {
	var req = url.parse(request.url, true);
	var params = req.query;
	var path = req.pathname;
	if (path == '/eta') {
		if (params.stop == undefined) return replyjson(response, '');
		var optionsEta = {
			host: 'www.hktramways.com',
			path: '/nextTram/geteat.php?stop_code='+params.stop
		};
		var promiseEta = httpcall(optionsEta, handleStopInfo);
		var optionsMsg = {
			host: 'www.hktramways.com',
			path: '/nextTram/getmessage.php?stop_code='+params.stop
		};
		var promiseMsg = httpcall(optionsMsg, handleStopInfo);
		Q.spread([promiseEta, promiseMsg], function(dataEta, dataMsg) {
			replyjson(response, merge(dataEta, dataMsg));
		});
	} else
	if (path == '/list') {
		var options = {
			host: 'www.hktramways.com',
			path: '/js/googleMap.js'
		};
		var promise = httpcall(options, handleStopList);
		Q.when(promise, function(data) {
			replyjson(response, data);
		});
	} else {
		fs.readFile(webroot+path, function(err, data) {
			if (err) return replyhtml(response, '');
			var json = {GOOGLE_API_KEY: apiKey};
			var page = mustache.render(data.toString(), json);
			replyhtml(response, page);
		});
	}
};

var httpcall = function(options, handler) {
	var q = Q.defer();
	http.request(options, function(res) {
		var buffer = '';
		res.on('data', function(chunk) {
			buffer += chunk;
		});
		res.on('end', function() {
			handler(q, buffer);
		});
	}).end();
	return q.promise;
};

var handleStopInfo = function(q, data) {
	xml2js.parseString(data, function(err, result) {
		q.resolve(result);
	});
};

var handleStopList = function(q, data) {
	var dummy = function(){};
	var window = {};
	var google = {maps:{InfoWindow:dummy,event:{addDomListener:dummy}}};
	eval(data);
	var result = {'EB' : stopsArrayEB, 'WB' : stopsArrayWB};
	q.resolve(result);
};

var replyjson = function(response, data) {
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(JSON.stringify(data));
};

var replyhtml = function(response, data) {
	response.writeHead(200);
	response.end(data);
};

var merge = function() {
	var destination = {}, sources = [].slice.call( arguments, 0 );
	sources.forEach(function( source ) {
		var prop;
		for ( prop in source ) {
			if ( prop in destination && Array.isArray( destination[ prop ] ) ) {
				destination[ prop ] = destination[ prop ].concat( source[ prop ] );
			} else if ( prop in destination && typeof destination[ prop ] === "object" ) {
				destination[ prop ] = merge( destination[ prop ], source[ prop ] );
			} else {
				destination[ prop ] = source[ prop ];
			}
		}
	});
	return destination;
};
