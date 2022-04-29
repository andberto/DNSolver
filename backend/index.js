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

app.get('/', (req, res) => {
  res.send("Hello World");
})

// da hostname a indirizzo IpV4
app.get(':username/resolve/a/:hostname', (req, res) => {
  var username = req.params.username;
  var resolver = new Resolver();
  var hostname = req.params.hostname;

  resolver.resolve4(hostname, function (err, addresses, family) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// da hostname a indirizzo IpV6
app.get(':username/resolve/aaaa/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolve6(hostname, function (err, addresses, family) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// qua ci va resolve any

app.get(':username/resolve/soa/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveSoa(domain, function (err, address) {
    res.status(200).send(address);
    console.log(err);
  });
})

// da IpV4 o IpV6 ad hostname
app.get(':username/resolve/ip/:ip', (req, res) => {
  var ip = req.params.ip;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.reverse(ip, function (err, hostnames) {
    res.status(200).send(hostnames);
    console.log(err);
  });
})

// ritorna CA per un record dns
app.get(':username/resolve/caa/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveCaa(domain, function (err, caas) {
    res.status(200).send(caas);
    console.log(err);
  });
})

// Risolve indirizzo IP e porta in un hostname e in un servizio attivo su una porta
app.get(':username/lookup/service/:ip/:port', (req, res) => {
  var ip = req.params.ip;
  var port = req.params.port;

  dns.lookupService(ip, parseInt(port), function (err, hostname, service) {
      res.status(200).send(hostname + " " + service);
  });
})

app.get(':username/resolve/cname/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveCname(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// Torna i record mx per un certo dominio
app.get(':username/resolve/mx/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveMx(domain, function (err, names) {
    res.status(200).send(names);
    console.log(err);
  });
})

// name server disponibili per un hostname
app.get(':username/resolve/ns/:domain', (req, res) => {
  var domain = req.params.domain;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveNs(domain, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// name server disponibili per un hostname
app.get(':username/resolve/srv/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  resolver.resolveSrv(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

app.get(':username/resolve/ptr/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  username.resolvePtr(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// Torna alcune informazioni
app.get(':username/resolve/txt/:hostname', (req, res) => {
  var hostname = req.params.hostname;
  var username = req.params.username;
  var resolver = new Resolver();

  username.resolveTxt(hostname, function (err, addresses) {
    res.status(200).send(addresses);
    console.log(err);
  });
})

// Ritorna i server impostati per il resolver
app.get(':username/config/servers', (req, res) => {
  var username = req.params.username;
  var resolver = new Resolver();

  var servers = userResolvers[username].getServers();
  res.send(servers);
})

// Setta un name server per la risoluzione
app.post(':username/config/servers', (req, res) => {
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
