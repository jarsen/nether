var pcap = require('pcap'),
    tcp_tracker = new pcap.TCP_tracker(),
    pcap_session = pcap.createSession("", "tcp");

tcp_tracker.on('start', function (session) {
    console.log("Start of TCP session between " + session.src_name + " and " + session.dst_name);
});

tcp_tracker.on('end', function (session) {
    console.log("End of TCP session between " + session.src_name + " and " + session.dst_name);
});

pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    tcp_tracker.track_packet(packet);
});