const {Resolver} = require('dns');
let dns = require('dns');
const express = require('express');
const cors = require('cors');
var MongoClient  = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/DNSolver";
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');

mongoose.connect(url, function(err){
	if(err) throw err;
	console.log("Mongoose connection established");
});

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	surname: String,
	username: String,
	password: String,
	preferences: Object,
	history: Array,
},
{
	collection: 'users',
	versionKey: false
});

const user = mongoose.model('users', userSchema);

const app = express()
const port = 5000
const userResolvers = {};

app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
	var username = req.body.username;
    var password = req.body.password;
	var query = { username: username, password: password };

	user.find(query, function(err, result){
		if(err){
            res.status(500).send("Internal Server Error");
        }else if (result.length == 0 && !err){
            res.status(404).send("Not Found");
        }else if(result.length > 0 && !err) {
            res.status(200).send({
				name: result[0].name,
				surname: result[0].surname,
				username: result[0].username,
			});
        }
	});
})

app.get('/:username/history', (req, res) => {

    var username = req.params.username;
	var query = { username: username };
	user.find(query, function(err, result){
		if(err){
            res.status(500).send("Internal Server Error");
        }else if (result.length == 0 && !err){
            res.status(404).send("Not Found");
        }else if(result.length > 0 && !err) {
            res.status(200).send({
				history: result[0].history,
			});
        }
	});
})

app.put('/:username/history', (req, res) => {
	var newEntry = req.body.entry;
	var username = req.params.username;
	user.updateOne(
		{username: username},
		{$addToSet: { history: newEntry }},
		function(err,raw){
			if(!err){
				var query = { username: username };
				user.find(query, function(err2, result){
					if(!err2) res.status(200).send(result[0].history);
					else res.status(500).send("Internal server error");
				});
			}
		}
	);
});

// da hostname a indirizzo IpV4
app.get('/:username/resolve/a/:hostname', (req, res) => {
  var username = req.params.username;
  var resolver = new Resolver();
  var hostname = req.params.hostname;

  resolver.resolve4(hostname, function (err, addresses, family) {
	var entries = [];

  	for(var i = 0; i < addresses.length; i++){
  		entries.push({IP: addresses[i]})
  	}

    res.status(200).send(entries);
    console.log(err);
  });
});

// da hostname a indirizzo IpV6
app.get('/:username/resolve/aaaa/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolve6(hostname, function (err, addresses, family) {
	var entries = [];

	for(var i = 0; i < addresses.length; i++){
		entries.push({IP: addresses[i]})
	}

    res.status(200).send(entries);
    console.log(err);
  });
})

// qua ci va resolve any

app.get('/:username/resolve/soa/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveSoa(domain, function (err, entry) {
    res.status(200).send([entry]);
    console.log(err);
  });
})

// da IpV4 o IpV6 ad hostname
app.get('/:username/resolve/ip/:ip', (req, res) => {
  var ip = req.params.ip;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.reverse(ip, function (err, hostnames) {
	var entries = [];

	for(var i = 0; i < hostnames.length; i++){
	  entries.push({Hostname: hostnames[i]})
	}
    res.status(200).send(entries);
    console.log(err);
  });
})

// ritorna CA per un record dns
app.get('/:username/resolve/caa/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveCaa(domain, function (err, caas) {
    res.status(200).send(caas);
    console.log(err);
  });
})

// Risolve indirizzo IP e porta in un hostname e in un servizio attivo su una porta
app.get('/:username/lookup/service/:ip/:port', (req, res) => {
  var ip = req.params.ip;
  var port = req.params.port;

  dns.lookupService(ip, parseInt(port), function (err, hostname, service) {
	  console.log(err);
      res.status(200).send([{Host: hostname, Port: port, Service: service}]);
  });
})

app.get('/:username/resolve/cname/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveCname(hostname, function (err, addresses) {
	var entries = [];

	for(var i = 0; i < addresses.length; i++){
	entries.push({Hostname: addresses[i]})
	}

    res.status(200).send(entries);
    console.log(err);
  });
})

// Torna i record mx per un certo dominio
app.get('/:username/resolve/mx/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveMx(domain, function (err, names) {
    res.status(200).send(names);
    console.log(err);
  });
})

// name server disponibili per un hostname
app.get('/:username/resolve/ns/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveNs(domain, function (err, addresses) {
	var entries = [];

  	for(var i = 0; i < addresses.length; i++){
  		entries.push({NameServer: addresses[i]})
  	}

    res.status(200).send(entries);
    console.log(err);
  });
})

// name server disponibili per un hostname
app.get('/:username/resolve/srv/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveSrv(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

app.get('/:username/resolve/ptr/:ip', (req, res) => {
  var ip = req.params.ip;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolvePtr(ip, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// Torna alcune informazioni
app.get('/:username/resolve/txt/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveTxt(hostname, function (err, txts) {
	var entries = [];

	for(var i = 0; i < txts.length; i++){
	  entries.push({Value: txts[i]})
	}

    res.status(200).send(entries);
    console.log(err);
  });
})

// Ritorna i server impostati per il resolver
app.get('/:username/config/servers', (req, res) => {
  var username = req.params.username;
  var resolver = new Resolver();

  var servers = userResolvers[username].getServers();
  res.send(servers);
})

// Setta un name server per la risoluzione
app.post('/:username/config/servers', (req, res) => {
  var username = req.params.username;
  var resolver = new Resolver();
  userResolvers[username].setServers(
    [
      '8.8.8.8',
    ]
  );
  res.status(200).send("Ok");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
