var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs'),
	pcap = require('pcap'),
	tcp_tracker = new pcap.TCP_tracker(),
	pcap_session = pcap.createSession("", "tcp");

app.listen(80);

tcp_tracker.on('start', function (session) {
	console.log("Start of TCP session between " + session.src_name + " and " + session.dst_name);
});

tcp_tracker.on('end', function (session) {
	console.log("End of TCP session between " + session.src_name + " and " + session.dst_name);
});

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

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
	socket.emit('news', { hello: 'world' });
	socket.emit('news', { hello: 'world' });
});