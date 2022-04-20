
var dns = require('dns');
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send("Hello World");
})

app.get('/resolve/host', (req, res) => {
  var hostname = req.query.hostname;
  var w3 = dns.resolve(hostname, function (err, addresses, family) {
    res.send(addresses);
    console.log(err);
  });
})

app.get('/resolve/soa', (req, res) => {
  var soa = req.query.soa;
  var w3 = dns.resolveSoa(soa, function (err, address) {
    res.send(address);
    console.log(err);
  });
})

app.get('/resolve/ip', (req, res) => {
  var ip = req.query.ip;
  var w3 = dns.reverse(ip, function (err, hostnames) {
    res.send(hostnames);
    console.log(err);
  });
})

app.get('/lookup/service', (req, res) => {
  var hostname = req.query.hostname;
  var port = req.query.port;
  var w3 = dns.lookupService(hostname, parseInt(port), function (err, hostname, service) {
    res.send(hostname, service);
    console.log(err);
  });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
