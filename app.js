var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs'),
	pcap = require('pcap'),
	tcp_tracker = new pcap.TCP_tracker(),
	pcap_session = pcap.createSession("", "tcp");

app.listen(80);

pcap_session.on('packet', function (raw_packet) {
	var packet = pcap.decode.packet(raw_packet);
	tcp_tracker.track_packet(packet);
	io.sockets.emit('packet', packet);
});

function handler (req, res) {
	fs.readFile(__dirname + '/index.html',
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}