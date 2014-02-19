var Hapi = require('hapi');
var Tabletop = require('tabletop');

var sheetData = [],
	texts = [],
    team = [],
    speakers = [],
    covers = [],
    faq = [],
    partners = [];

var port = 1414;

var tabletop,
	KEY = '0AhSAZYKyt0p7dGc0eHdMTVlNSko4amNhb2E2QmlWekE';

var options = {
    views: {
        path: 'templates',
        engines: {
            html: 'handlebars'
        },
        partialsPath: 'partials'
    }
}; 

function getData(reply) {
	tabletop = Tabletop.init({
	    key: KEY,
	    callback: function(data, tabletop) { 
	        sheetData = data;
	        if(sheetData) {
                if(sheetData.Texts){
                    texts = sheetData.Texts.elements;
                    console.log("TEXTS", texts);
                }
                if(sheetData.Team){
                    team = sheetData.Team.elements;
                    console.log("TEAM", team);
                }
                if(sheetData.Faq){
                    faq = sheetData.Faq.elements;
                    console.log("FAQ", faq);
                }
                if(sheetData.Partners){
                    partners = sheetData.Partners.elements;
                    console.log("PARTNERS", partners);
                }
                if(sheetData.Speakers){
                    speakers = sheetData.Speakers.elements;
                    console.log("SPEAKERS", speakers);
                }
                if(sheetData.Covers){
                    covers = sheetData.Covers.elements;
                    console.log("COVERS", covers);
                }
            }
	    },
	    simpleSheet: false 
	});

    if(reply) reply("HELLLO!");
}

getData();

// Create a server with a host, port, and options
var server = Hapi.createServer('0.0.0.0', port, options);

var routes = [
    { method: 'GET', path: '/', config: { handler: homeHandler } },
    { method: 'GET', path: '/update', config: { handler: updateHandler } },
    { method: 'GET', path: '/{path*}', handler: {
        directory: { path: './public', listing: true, index: true }
    } }
];

server.route(routes);

function homeHandler (request, reply) {
    // Render the view with the custom greeting
    reply.view('index.html', { 
        covers: covers,
        texts: texts,
        team: toGrid(team),
        faq: faq,
        partners: toGrid(partners),
        speakers: toGrid(speakers)
    });
};

function updateHandler (request, reply) {
    getData(reply);
};

// Start the server
server.start(function () {
    uri = server.info.uri;
    console.log('Server started at: ' + server.info.uri);
});

function toGrid(data){
    var rows=[],
        step=4,
        i=0,
        L=data.length;
    
    for(; i<L ; i+=step){
        rows.push({cells:data.slice(i,i+step)});
    };

    return rows;
}