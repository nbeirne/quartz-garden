---
tags:
  - music
---
The [Serge modular](https://en.wikipedia.org/wiki/Serge_synthesizer) synthesizer was an early system meant to be affordable. There are modern versions of it, mostly using banana cables and 4u heights. I collect Random\*Source Eurorack modules. 

## Approach

Patch programming is at the core of the Serge system. You compose several modules together to build a bigger idea. You can make a full ADSR envelope out of the DUSG, or you can make a random source out of the SSG. Modules are meant to be self-patched with feedback, and assembled together in a complex web of modulation.

Instead of labeling things according to their musical purpose, the Serge system will label things according to their electrical properties. Jacks are coloured with the kind of voltage they output (red for gates, black for bipolar voltage, and white for unipolar voltage). Knobs are labeled as "rise" and "fall", instead of "attack" and "decay". 

### Core Modules

The **Dual Universal Slope Generator** or **DUSG** is the most well known serge module. Its a pair of attack/decay envelope generators, which can be patched in many different ways. It can be an envelope, an oscillator, a slew limiter, a filter, a clock, and more. There are a lot of Eurorack modules which riff on the core idea - Maths, Falistri, and Rampage are all examples

**Smoothed and Stepped Generator** or **SSG**. This is a confusing one which has not hit mainstream consciousness. Its composed of two sides - a smooth side and a stepped side. The smooth side is an LFO which can be 'paused'. The stepped side is an LFO feeding into a sample and hold, making a chaotic voltage source. The smooth side is actually a slew limiter, which can loop itself. You can patch any voltage in and "smooth" it out. The stepped side can also 'step' any input voltage - from random to oscillators to the built-in slew limiter. The module is very flexible, but very hard to get your head around.

Other important modules:
- **NTO** (New Timbral Oscillator)
- **SEQ8** 
- **Resonant EQ**
- **Triple Wave Multiplier**
- **Triple Waveshaper**

