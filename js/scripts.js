'use strict'
// javascripts go in here

// init clippy
new Clipboard('.btn');

// adding two colons, we should validate ipv4 strings first no?
var convertIpv4ToIpv6 = function(ipv4str) {
  return "::" + ipv4str.trim()
}

// shift each octet, and mask 255
var convertIpintToIpv4 = function (int) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

// split into parts, and multply by 256 and concat
var convertIpv4ToIpInt = function(ipv4) {
    var d = ipv4.split('.');
    return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
}

var isValidIpAddress = function(ipaddress) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return (true)
  }
  return (false)
}

// formats json appends to body
function output(inp) {
    // document.body.appendChild(document.createElement('pre')).innerHTML = inp;
    document.getElementById('ipInfo').innerHTML = inp;
}

// form watchers
$('#ipv4').on('input', function() {
  var ipv4 = $(this).val();
  $('#ipint').val(convertIpv4ToIpInt(ipv4))
})

$('#ipint').on('input', function() {
  var ipint = $(this).val()
  $('#ipv4').val(convertIpintToIpv4(ipint))
})

$('#ipgeo').on('input', function() {
  var ipgeo = $(this).val()
  fetchIpData(ipgeo)
})

function fetchIpData(ip) {
  if (isValidIpAddress(ip)) {
    $.get('http://freegeoip.net/json/' + ip, function(data) {
      var jsonRes = JSON.stringify(data, undefined, 4)
      output(jsonRes);
    })
  }
}

// todo make free form free ip requests

// on load initially populate the users data.
$(document).ready(function() {
  $.getJSON('http://freegeoip.net/json/?callback=?', function(data) {
    var jsonRes = JSON.stringify(data, undefined, 4)
    var userIp = data.ip

    // set users ip
    // make a document listener to update accordingly
    $('#ipv4').val(userIp)

    // trigger ip int
    $('#ipint').val(convertIpv4ToIpInt(userIp))
    // trigger ipv6?
    output(jsonRes);
  });
})
