---
tags:
  - midi
  - music
  - reference
link: https://www.youtube.com/watch?v=2BccxWkUgaU
---

https://www.youtube.com/watch?v=y5Sah0bJYkg


Status bytes:
```
1 x x x n n n n 
```
Always stars with 1. x x x is message. n n n n is the channel number.


### Message types:
- note off
- note on 
- polyphonic aftertouch
- control change
- program change
- channel aftertouch
- pitch bend change
- system message

### note off
```
1000nnnn - status (channel)
0kkkkkkk - key
0vvvvvvv - velocity
```
Why velocity?
- How fast you release a key is part of the message.

### note on 
```
1001nnnn - status (channel)
0kkkkkkk - key
0vvvvvvv - velocity
```

### polyphonic aftertouch
Key pressure after initial velocity. Useful for wind and string instruments.
Pressure for _all_ keys pressed.
```
1010nnnn - status (channel)
0kkkkkkk - key
0vvvvvvv - velocity
```

### control change
```
1011nnnn - status (channel)
0ccccccc - controller number [knobs]
0vvvvvvv - value
```
This allows continuous control with knobs.

### program change
```
1100nnnn - status (channel)
0ppppppp - program
```
patch changes. These allow different instruments / patches.


### channel aftertouch
Similar to polyphonic aftertouch, but sends pressure info from the key with the highest pressure.
This is an optimization (2 bytes, vs potentially 6 for every key)
```
1101nnnn - status (channel)
0vvvvvvv - velocity
```


### pitch bend change
Not with the continuous controllers. This is because its higher resolution.
```
1110nnnn - status (channel)
0lllllll - least significant bytes
0mmmmmmm - most significant bytes
```


## system message (new video)
Affect _all_ channels. The final 4 bits are for the kind of system message. There are 16 system messages, but not all system messages are defined.
```
1111xxxx 
```

They can divided into the kinds of messages. The 5th byte determines the kind of system message it is.
- System exclusive is 0 
- System common is 0
- System real-time is 1

```
11110000 - begin system exclusive
11110001 - time code quarter frame
11110010 - song position pointer
11110011 - song select
11110100 - undefined
11110101 - undefined
11110110 - tune request
11110111 - end system exclusive

11111000 - timing clock
11111001 - undefined
11111010 - start
11111011 - continue
11111100 - stop
11111101 - undefined
11111110 - active sensing
11111111 - reset
```
### System Exclusive Messages
	AKA SysEx
They are different for every midi device.
No set number of data bytes. They have a start and end status byte.

The bit after the begin status byte is the manufacturer. This might be a single data byte, or several. All 0's in the first one, means the manufacturer byte is the next 2 bytes. 

They can do many different things. Usually in the device manual.

```
11110000 - begin system exclusive
11110111 - end system exclusive
```


### System Common Messages
- Messages to the entire midi system. 

Status codes:
```
11110001 - time code quarter frame
11110010 - song position pointer
11110011 - song select
11110100 - undefined
11110101 - undefined
11110110 - tune request
```

#### Song Select
Plays a sequence back with a number.
```
11110011 0sssssss - song number
```

#### Song Position
The number of midi beats since the song has started. Midi beat = 6 midi clocks (a 16th note)
Sets every device to the same starting point in the sequence.

```
11110010 0llllllll 0mmmmmmmm - 14 bits of precision 
```

l and m are combined into a single number. 1024 measures in 4/4 time.


#### Time Code Quarter Frame
##### MTC and SMPTE time codes
These are higher resolution time codes. `HH:MM:SS:ff` (f is frame)
MTC can be converted into the SMPTE time code. It's absolute time, not relative time.

##### TCQF message
This message is sent 4 times pre frame of video. 
```
11110001 0nnndddd - n = message type, d = values. 
```

There need to be 8 data bytes communicated for the entire code. 
```
11110001 0000ffff - frames
11110001 0001000f - frames
11110001 0010ssss - seconds
11110001 001100ss - seconds
11110001 0100mmmm - minutes
11110001 010100mm - minutes
11110001 0110hhhh - hours
11110001 01110rrh - hours (r is reserved for the frame rate.)
```

The complete SMPTE is updated every 2 frames.

### Tune Request
No data bytes. Some synths have auto tune. This asks them to initiates it. Pretty uncommon.

```
11110110
```


### System Real-Time Messages
These are for real-time control of systems. Any of these can be inserted into the middle of another message without affecting that original message. None of them require data bytes.

```
11111000 - timing clock
11111001 - undefined
11111010 - start
11111011 - continue
11111100 - stop
11111101 - undefined
11111110 - active sensing
11111111 - reset
```
###### Active Sensing
 - Repeatedly confirm if a device is still active.
 - If not received, the receiver will assume the connection is broken.

##### Reset
- Resets to power up state. Resets songs, position, etc.

##### Timing Clock
Sends a click across all devices in the system. 24 times per quarter note.

##### Start, Continue, Stop
Transport Controls for midi sequences and songs.

Start always starts from the beginning. Continue will continue from where stop left off.


