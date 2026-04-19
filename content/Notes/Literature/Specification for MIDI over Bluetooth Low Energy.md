---
tags:
  - midi
  - music
  - reference
  - tech
links: https://docs.silabs.com/bluetooth/2.13/bluetooth-code-examples-applications/midi-over-ble
---

https://midi.org/midi-transports
https://midi.org/midi-over-bluetooth-low-energy-ble-midi
https://drive.google.com/file/d/15jF6H78kMS0jEBQ7JpH0W6MHf_yxoE5r/view


# Specification


There is a max. transmission frequency and a lower bound on latency.
- MS resolution timestamps allow for jitter to be similar to USB midi.

### Connection interval:
- A device must request a connection interval of 15ms or less.
- Lower is better.
- Choose lowest based on the Central and Peripheral.


### Initial Connection
- Attempts to read the peripheral after establishing a connection.
- The accessory shall respond to the MIDI characteristic read with a packed that has no payload.

### MTU negotiation
Must support the MTU exchange command

### Packed encoding
Packets must be buffered and transmitted. The connection interval is negotiated by the sender and receiver. The proto uses 13-bit ms timestamps to render time/space events.

MIDI data is encoded into packets of MTU-3 in size (usually 20 or larger). 

The first byte is a header, followed by timestamp bytes and the midi status and data messages.

The header and timestamp bytes:
```
10hhhhhh - header. h is the timestamp high bits (most significant)
1lllllll - timestamp. l is the timestamp least significant bits. 
```

Running status messages:
- Status messages may be omitted if the following criteria are met:
	- The original message is 2 bytes of greater, and is not a system common or system real time message
	- The omitted status byte is the same as the most recent midi message status byte in the same BLE packet.
- A running status message is only allowed if at least one full midi message is in that packet. IE, retransmit the status in a new packet.
- Each status must be preceded by a timestamp byte.  Running messaged do not need to be preceded by a timestamp byte byte (but they may be). If it does not exist, the most recent timestamp byte is used.
- System command and system realtime messages do not cancel the running status. However, a timestamp is required before the next running status messages.
- System real-time messages must not be sent interleved with midi data. In normal midi they can interrupt data commands, but in BLE they must not.

### sysex messages
- Only sysex messages can span multiple packets.
- SysEx start is preceded by a timestamp.
- If continuing, a SysEx continuation packet is sent. It begins with a header, but not a timestamp. The lack of timestamp indicated its a sysex continuation.
- There can be zero or more continuation packets.
- System Real Time Messages may appear at any point in a sysex message. They must be preceded by a timestamp.
- SysEx continuations for unterminated SysEx messages must follow either the packet’s header byte or a real-time byte
- Precede the sysex end byte with a timestamp.

### Timestamps
- 13 bit values, in milliseconds
- max value is 8191
- Issued by sender in monotonically increasing fashion
- Since high/low are split up, if low overflows/wraps in the same packet, the high byte is not resent. Its assumed that the receiver will track it by incrementing the high value by one. A max of one overflow may be sent per packet.
- Timestamps are in the sender's clock domain, and not to be scheduled in the future.
- Correlation between the sender and receivers clock must be performed to ensure the rendering of midi messages is accurate.