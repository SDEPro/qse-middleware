//Route processing
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

//URL processing
const https = require('https');
const url = require('url');


//*********QuickSight

//Used for QS dashboard embed URL (used by /qs-embed) 
const qs = require('amazon-quicksight-embedding-sdk');
const AWS = require('aws-sdk');


//console.log("AKI: "+process.env.AKI);
//console.log("SAK: "+process.env.SAK);
AWS.config.update({
    accessKeyId: process.env.AKI,
    secretAccessKey: process.env.SAK,
    region:'us-east-1'
});


//Retrieve a QuickSight embed URL
app.get('/qs-embed', (req, res) => {

    //choose a different dash by setting the DashboardId in env vars on the server
    let params = {
	AwsAccountId: process.env.AWSAccountId,
	DashboardId: process.env.DashboardId,
	IdentityType: 'IAM'
    };

    let quicksight = new AWS.QuickSight();
    quicksight.getDashboardEmbedUrl(params, function(err, data) {
     	if (err) {
	    console.log(err, err.stack);
	    res.status(500)
		.send(err)
		.end();
	}
    	else {
	    res.set('Content-Type', 'text/html')
		.status(200)
		.send(data.EmbedUrl)
		.end();
	}
    });

});



//********** Google News 

//Prevents CORS issues when processing response from /news
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


//Calls google news RSS
//Fix: find an alternative. see
//https://stackoverflow.com/questions/7806200/what-to-use-now-google-news-api-is-deprecated

//Note: query parameters are passed without modification
//Resulting URL: https://news.google.com/rss/search/?<PASSED QUERY>
app.get('/news', (req, res) => {

const requestUrl = url.parse(url.format({
    protocol: 'https',
    hostname: 'news.google.com',
    pathname: '/rss/search',
    query: req.query
}));
    
    let options = {
	hostname: requestUrl.hostname,
	path: requestUrl.path
    };

    https.request(options,
		 (response) => {
		     let str = '';
		     response.on('data', function (chunk) {
			 str += chunk;
		     });
		     response.on('end', function () {
			 res.set('Content-Type', 'application/xml');
			 res.send(str);
			 res.end();
		     });
		     response.on('error', function (e) {
			 console.log("error: "+e);
		     }); 
		 }).end();
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});
