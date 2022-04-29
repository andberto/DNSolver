const {Resolver} = require('dns');
let dns = require('dns');
const express = require('express')
const cors = require('cors')
var MongoClient  = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/nlpUser";
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

mongoose.connect(url, function(err)
{
	if(err)
		throw err;
	console.log("Mongoose connection established");
});

const app = express()
const port = 5000
const userResolvers = {};

app.use(cors())

userResolvers['pippo'] = new Resolver();
userResolvers['pluto'] = new Resolver();

app.get('/', (req, res) => {
  res.send("Hello World");
})

// da hostname a indirizzo IpV4
app.get('/resolve/a/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  userResolvers['pippo'].resolve4(hostname, function (err, addresses, family) {
    res.status(200).send(addresses);

    console.log(err);
  });
})

// da hostname a indirizzo IpV6
app.get('/resolve/aaaa/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  userResolvers['pippo'].resolve6(hostname, function (err, addresses, family) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// qua ci va resolve any

app.get('/resolve/soa/:domain', (req, res) => {
  var domain = req.params.domain;
  userResolvers['pippo'].resolveSoa(domain, function (err, address) {
    res.status(200).send(address);
    console.log(err);
  });
})

// da IpV4 o IpV6 ad hostname
app.get('/resolve/ip/:ip', (req, res) => {
  var ip = req.params.ip;
  userResolvers['pippo'].reverse(ip, function (err, hostnames) {
    res.status(200).send(hostnames);
    console.log(err);
  });
})

// ritorna CA per un record dns
app.get('/resolve/caa/:domain', (req, res) => {
  var domain = req.params.domain;
  userResolvers['pippo'].resolveCaa(domain, function (err, caas) {
    res.status(200).send(caas);
    console.log(err);
  });
})

// Risolve indirizzo IP e porta in un hostname e in un servizio attivo su una porta
app.get('/lookup/service/:ip/:port', (req, res) => {
  var ip = req.params.ip;
  var port = req.params.port;
  dns.lookupService(ip, parseInt(port), function (err, hostname, service) {
      res.status(200).send(hostname + " " + service);
  });
})

app.get('/resolve/cname/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  userResolvers['pippo'].resolveCname(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// Torna i record mx per un certo dominio
app.get('/resolve/mx/:domain', (req, res) => {
  var domain = req.params.domain;
  userResolvers['pippo'].resolveMx(domain, function (err, names) {
    res.status(200).send(names);
    console.log(err);
  });
})

// name server disponibili per un hostname
app.get('/resolve/ns/:domain', (req, res) => {
  var domain = req.params.domain;
  userResolvers['pippo'].resolveNs(domain, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// name server disponibili per un hostname
app.get('/resolve/srv/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  userResolvers['pippo'].resolveSrv(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

app.get('/resolve/ptr/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  userResolvers['pippo'].resolvePtr(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// Torna alcune informazioni
app.get('/resolve/txt/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  userResolvers['pippo'].resolveTxt(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// Ritorna i server impostati per il resolver
app.get('/config/servers/:username', (req, res) => {
    var username = req.params.username;
    var servers = userResolvers[username].getServers();
    res.send(servers);
})

// Setta un name server per la risoluzione
app.post('/config/servers/:username', (req, res) => {
  var username = req.body.username;
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
