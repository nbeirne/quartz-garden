---
tags:
  - music
  - midi
  - reference
link: https://www.youtube.com/watch?v=49Oqa4D3Afk
---


DIN5
- TX
- RX
- 2 wires, and a shield.

## Hardware

Transmit - Clockwise:
- 1 - disconnected
- 4 - 5V output
- 2 - disconnected
- 5 - UART TX - transmission
- 3 - disconnected

Receive - Clockwise:
- 1 - disconnected
- 4 - Connected to pin5 over a photoresistor
- 2 - disconnected
- 5 - Connected to pin 4 over a photoresistor
- 3 - disconnected

RX is received on the photoresistor.

- 8 bit UART at 31250 buad
- signal is voltage independant.

## Protocol

Status
```
1 t t t n n n n - status
0 x x x x x x x - data 1
0 x x x x x x x - data 2
```

T is the message type.
N is the channel. 

Exceptions:
- Midi running status. 
	- If status has not changed, we can keep sending data.
- Not all packages have 2 data bytes
- MIDI system messages.

### System Messages
```
1 1 1 1 x x x x - status. X is what the message is.
```



## Tools
Midisnoop
