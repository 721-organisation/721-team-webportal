var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
var userDetails = JSON.parse(fs.readFileSync('loginDetails.json', 'utf8'));
var request = require("request");
var emails = JSON.parse(fs.readFileSync('emails.json', 'utf8')).emails;

app.get('/emails.txt', function (req, res) {
    res.sendFile(__dirname + '/emails.txt');
})
app.get('/', function(req, res){
    console.log("RESPONDING");
    res.sendFile(__dirname + '/index.html');
});
var accessToken = "";

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('requestData', function (email) {

        for(var i = 0; i < emails.length;i++){
            if(email == emails[i]){
                var options = {
                    method: 'POST',
                    url: 'https://temp-243314.appspot.com/api/Users/login',
                    headers:
                        {
                            'cache-control': 'no-cache',
                            Connection: 'keep-alive',
                            'accept-encoding': 'gzip, deflate',
                            Accept: '*/*',
                            'Content-Type': 'application/json'
                        },
                    body: {email: userDetails.email, password: userDetails.password},
                    json: true
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    accessToken = body.id;
                    var request = require("request");

                    var options = { method: 'GET',
                        url: 'https://temp-243314.appspot.com/api/requestedEvents',
                        qs: { access_token: accessToken },
                        headers:
                            { 'cache-control': 'no-cache',
                                Connection: 'keep-alive',
                                'accept-encoding': 'gzip, deflate',
                                Host: 'temp-243314.appspot.com',
                                'Cache-Control': 'no-cache',
                                Accept: '*/*',
                                'Content-Type': 'application/json' },
                        gzip: true
                    };

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);

                        io.emit("newEventRequests", JSON.parse(body));
                        var options = { method: 'GET',
                            url: 'https://temp-243314.appspot.com/api/requestedHiddenGems',
                            qs: { access_token: accessToken },
                            headers:
                                { 'cache-control': 'no-cache',
                                    Connection: 'keep-alive',
                                    'accept-encoding': 'gzip, deflate',
                                    Host: 'temp-243314.appspot.com',
                                    'Cache-Control': 'no-cache',
                                    Accept: '*/*',
                                    'Content-Type': 'application/json' },
                            gzip: true
                        };

                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);

                            io.emit("newHiddenGemRequests", JSON.parse(body));
                        });
                    });
                });
            }
        }
    });


    socket.on('approve', function (event) {
        var request = require("request");

        var options = { method: 'DELETE',
            url: 'https://temp-243314.appspot.com/api/requestedEvents/'+event.id,
            qs: { access_token: accessToken },
            headers:
                { 'cache-control': 'no-cache',
                    Connection: 'keep-alive',
                    'accept-encoding': 'gzip, deflate',
                    Host: 'temp-243314.appspot.com',
                    'Cache-Control': 'no-cache',
                    Accept: '*/*',
                    'Content-Type': 'application/json' } };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            event.id = null;
            var settings = { method: 'POST',
                url: 'https://temp-243314.appspot.com/api/events',
                qs: { access_token: accessToken },
                headers:
                    { 'cache-control': 'no-cache',
                        Connection: 'keep-alive',
                        'accept-encoding': 'gzip, deflate',
                        Accept: '*/*',
                        'Content-Type': 'application/json' },
                body: event,
                json: true };

            request(settings, function (error, response, b)  {
                if (error) throw new Error(error);
                io.emit("success");

            });
        });

    });
    socket.on('reject', function (event) {
        var request = require("request");

        var options = { method: 'DELETE',
            url: 'https://temp-243314.appspot.com/api/requestedEvents/'+event.id,
            qs: { access_token: accessToken },
            headers:
                { 'cache-control': 'no-cache',
                    Connection: 'keep-alive',
                    'accept-encoding': 'gzip, deflate',
                    Host: 'temp-243314.appspot.com',
                    'Cache-Control': 'no-cache',
                    Accept: '*/*',
                    'Content-Type': 'application/json' } };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            io.emit("success");

        });
    });



    socket.on('approveHG', function (event) {
        var request = require("request");

        var options = { method: 'DELETE',
            url: 'https://temp-243314.appspot.com/api/requestedHiddenGems/'+event.id,
            qs: { access_token: accessToken },
            headers:
                { 'cache-control': 'no-cache',
                    Connection: 'keep-alive',
                    'accept-encoding': 'gzip, deflate',
                    Host: 'temp-243314.appspot.com',
                    'Cache-Control': 'no-cache',
                    Accept: '*/*',
                    'Content-Type': 'application/json' } };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            event.id = null;
            var settings = { method: 'POST',
                url: 'https://temp-243314.appspot.com/api/hiddenGems',
                qs: { access_token: accessToken },
                headers:
                    { 'cache-control': 'no-cache',
                        Connection: 'keep-alive',
                        'accept-encoding': 'gzip, deflate',
                        Accept: '*/*',
                        'Content-Type': 'application/json' },
                body: event,
                json: true };

            request(settings, function (error, response, b)  {
                if (error) throw new Error(error);
                io.emit("success");

            });
        });

    });
    socket.on('rejectHG', function (event) {
        var request = require("request");

        var options = { method: 'DELETE',
            url: 'https://temp-243314.appspot.com/api/requestedHiddenGems/'+event.id,
            qs: { access_token: accessToken },
            headers:
                { 'cache-control': 'no-cache',
                    Connection: 'keep-alive',
                    'accept-encoding': 'gzip, deflate',
                    Host: 'temp-243314.appspot.com',
                    'Cache-Control': 'no-cache',
                    Accept: '*/*',
                    'Content-Type': 'application/json' } };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            io.emit("success");

        });
    });

});
const PORT = process.env.PORT || 8080;

http.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});
// Start the server