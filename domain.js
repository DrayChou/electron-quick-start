// We need this to build our post string
var querystring = require('querystring');
var http = require('https');
var fs = require('fs');

exports.checkDomains = function(codestring, post_function) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'd': codestring,
        'r': 'ALL',
        'freedom': 0,
        'onlydom': 0,
        'option': 0
    });

    // An object of options to indicate where to post to
    var post_options = {
        host: 'www.inwx.de',
        port: '443',
        path: '/en/domain/check2ajax',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data),
            'Cookie': 'ixsess=a69s2gj6npu2f1c9n09qa95ce0; _ga=GA1.2.1101962664.1446735707; _gat=1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'
        }
    };

    console.log(post_data);
    console.log(post_options);

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);

            if (post_function) {
                post_function(chunk);
            }
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
}
