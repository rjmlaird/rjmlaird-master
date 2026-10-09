---
id: 42
slug: plume
title: PLUME Student CubeSat Micrometeoroid Experiment
type: featured
status: completed
description: A University of Leicester student CubeSat mission designed to investigate the near-Earth dust environment using an active nanometeoroid detector.
startDate: 2007-01-01
tools_tech:
  - CubeSat
  - Microchannel Plates
  - Nanometeoroid Detection
  - Spacecraft Telemetry
  - Satellite Communications
  - Attitude Determination and Control
  - High-Voltage Electronics
  - Spacecraft Systems Engineering
tags:
  - space
  - cubesat
  - university-of-leicester
  - plume
  - micrometeoroids
  - space-dust
  - student-satellite
  - satellite-engineering
  - astronomy
links:
  web: https://www.le.ac.uk/
  source: https://www.astronomy.com/space-exploration/students-prepare-for-dust-up/
  archive: https://sites.google.com/view/andythomasorg/home
impact: {}
heroImage: /images/projects/plume.png
heroAlt: >
  PLUME logo
imageCredit: University of Leicester
relatedEducation: ["edu-leicester-mphys"]
relatedVolunteering: ["vol-plume-comms-officer"]
---

# PLUME

**PLUME — the Detector Picosatellite of Leicester University Micrometeoroid Experiment —** was a student-led CubeSat project at the University of Leicester designed to investigate the near-Earth space-dust environment.

The project began in **January 2007** and brought together undergraduate students, academic researchers and industry partners to design, build and prepare a small satellite for launch.

The mission aimed to demonstrate that students could take responsibility for a complete space mission, from initial concept and spacecraft design through to communications, payload development and launch.

## Mission Overview

PLUME was developed by undergraduate students in the University of Leicester's **Department of Physics and Astronomy**, with support from the University's **Space Research Centre** and engineering company **Magna Parva Ltd**.

The mission was intended to place an active nanometeoroid detector into orbit by **mid-2009**.

At the time, the project was expected to potentially become the **first English CubeSat in orbit**.

The spacecraft was being developed to the **CubeSat standard**, originally developed by California Polytechnic State University and Stanford University.

More than simply an educational exercise, PLUME was intended to produce useful scientific measurements of the near-Earth dust environment.

## Student-Led Space Engineering

Around **20 University of Leicester undergraduate students** were involved in the mission.

The project gave students the opportunity to work across the complete spacecraft lifecycle, including:

- Mission conception
- Spacecraft systems engineering
- Payload development
- Mechanical design
- Electronics
- Attitude determination and control
- Communications
- Telemetry
- Software
- Testing
- Launch preparation

The project was notable for giving undergraduate students direct responsibility for developing hardware intended for a real space mission.

As Philip Peterson, a second-year undergraduate working on the Attitude Determination and Control System (ADCS), described it:

> "I'm an undergraduate, and I'm building a satellite. It's just incredible."

The project therefore served both a scientific purpose and an important educational role, providing students with practical experience of spacecraft development and the professional environment of the space industry.

## Industry Collaboration

PLUME was supported by **Magna Parva Ltd**, an engineering company based in Loughborough.

Magna Parva donated the main body of the spacecraft and worked with the student team throughout the project.

Andrew Bowyer, Director of Magna Parva, described the company's involvement as extending beyond financial support, with the intention of working with the students through to launch.

This industry–university model was intended to give students practical experience alongside their academic education.

The project also had the support of the **University of Leicester Space Research Centre**, with the **East Midlands Space Academy** considered as a potential source of financial support.

## The Science Case

Space dust is found throughout the Solar System and is an important component of the near-Earth environment.

Dust contributes to phenomena including the **zodiacal light**, with thermal emission from space dust particularly prominent at infrared wavelengths.

The PLUME science case distinguished between naturally occurring **space dust** and human-generated **orbital debris**.

### Space Dust

Space dust is naturally occurring material originating from sources such as:

- Comets
- Asteroids
- Collisions between Solar System bodies
- Interplanetary dust populations

### Orbital Debris

Orbital debris, by contrast, is predominantly human-made material associated with spacecraft and launch systems.

Although their origins differ, both dust and debris can interact with spacecraft at extremely high velocities.

Impact velocities can exceed:

**20 km/s**

At these velocities, even extremely small particles can produce significant effects.

## Why Measure Near-Earth Dust?

Understanding the near-Earth dust population has implications for both fundamental science and spacecraft engineering.

Better measurements can contribute to:

- Understanding the distribution of interplanetary dust
- Modelling the near-Earth environment
- Spacecraft risk assessment
- Understanding micrometeoroid impacts
- Designing future spacecraft and instruments
- Investigating dusty plasma environments

The PLUME team aimed to improve the characterisation of very small particles beyond the capabilities of previous active detectors.

The proposed detector was intended to provide measurements of particles down to approximately **20 nm** in diameter.

## Dusty Plasmas

Charged dust grains can interact strongly with surrounding plasma.

Dusty plasma environments are relevant to a number of astrophysical and planetary systems, including the terrestrial magnetosphere and planetary ring systems.

The PLUME science case highlighted research into the role of dusty plasmas in:

- Magnetosphere dynamics
- Plasma interactions
- Planetary rings
- Space environments containing charged particulate matter

The interaction between dust and plasma therefore provides an additional scientific motivation for understanding the population of small particles in space.

## Spacecraft Risk

Micrometeoroids are also an important consideration for spacecraft and scientific instruments.

The PLUME science case highlighted damage observed on the **XMM-Newton** and **Swift** missions, where micrometeoroid impacts affected CCD detectors.

Open-optics instruments can be particularly vulnerable to dust impacts because particles can reach sensitive optical and detector surfaces.

A better understanding of the near-Earth dust population can therefore contribute to spacecraft and instrument risk assessment.

## The PLUME Detector

The central scientific instrument was an active nanometeoroid detector based on **microchannel plates (MCPs)**.

The detector used **two microchannel plates covered with an aluminium nanofilm**.

Similar detector technology had previously been flown on the **International Space Station**, where returned MCPs were examined for impact features.

The thin aluminium film was highly sensitive to very small particle impacts.

The proposed PLUME detector had a minimum detectable particle diameter of approximately:

**~20 nm**

## Microchannel Plate Detection

The detector used the physical effects produced when a hypervelocity dust particle strikes the thin aluminium-coated MCP surface.

An impact capable of producing a detectable hole or impact feature can generate a plasma.

When a high voltage is applied across the MCP, this plasma can initiate an electron cascade.

The resulting electron multiplication provides a measurable electrical signal corresponding to the particle impact.

The basic detection chain was:

**Particle impact → plasma generation → electron cascade → electrical pulse → signal processing → spacecraft computer**

## Signal Processing

The detector electronics were designed to convert the very small impact event into a measurable voltage signal.

A typical impact was expected to produce approximately:

**~50,000 electrons**

The pre-amplifier converted this signal into an approximately:

**~16 mV exponentially decaying voltage pulse**

The signal was then processed by a shaping amplifier.

A peak-sample-and-hold circuit stored the signal amplitude and generated an interrupt for the spacecraft computer.

The computer then:

1. Collected the event data.
2. Recorded the signal information.
3. Cleared the buffer.
4. Prepared the detector electronics for the next event.

A **commercial off-the-shelf (COTS) ultra-light high-voltage power supply** was used to generate the voltage required by the MCP detector.

## Detector Specifications

The proposed detector had the following characteristics:

| Parameter | Specification |
| --- | ---: |
| Detector body diameter | 33 mm |
| Active detector diameter | 25 mm |
| MCP diameter | 33 mm |
| MCP aluminium film | 40 nm |
| MCP pore size | 12.5 µm |
| Detector body mass | ~15 g |
| Detector mass budget | 211 g |
| Detector volume | 90 cm³ |
| Average power | 966 mW |
| Detectability limit | ~20 nm |

The extremely small detection threshold was one of the key scientific advantages proposed for PLUME.

## MCP Technology

The detector's MCPs were coated with an aluminium film.

The technology drew on earlier work demonstrating that very thin films can reveal the effects of extremely small particle impacts.

Previous MCP experiments had shown impact features in aluminium films only tens of nanometres thick.

For PLUME, the detector concept used:

- **33 mm diameter MCPs**
- **40 nm aluminium coating**
- **12.5 µm pore size**
- High-voltage electron multiplication
- Electronic pulse detection

This provided a lightweight detector architecture suitable for a CubeSat-scale spacecraft.

## Communications and Telemetry

The mission also provided an opportunity for students to work on spacecraft communications and telemetry.

Professor George Fraser invited **Andy Thomas** to act as a mentor for the PLUME up-link and down-link systems.

Thomas brought previous experience in satellite telemetry analysis, including work involving:

- LUSAT
- STARSHINE 3
- QUAKESAT

His archive documents experiments with decoding satellite telemetry and analysing spacecraft housekeeping data.

The PLUME communications work therefore built on established amateur and research satellite telemetry techniques.

The project also involved **John Heath (G7HIA)** as a fellow communications mentor.

## Student Engineering Experience

One of the defining characteristics of PLUME was its emphasis on genuine student ownership.

Rather than treating the spacecraft as a purely theoretical academic exercise, students were involved in developing hardware and systems intended for a real space mission.

This provided experience across disciplines including:

- Physics
- Astronomy
- Electronics
- Computing
- Mechanical engineering
- Spacecraft systems
- Communications
- Instrumentation
- Project management

The project demonstrated how CubeSats could provide universities with a relatively accessible route into practical spacecraft development.

## A CubeSat for Leicester

The PLUME project emerged during an important period in the development of university CubeSat missions.

Small satellites offered universities the opportunity to develop and test space hardware without the scale and cost associated with conventional spacecraft programmes.

For Leicester students, PLUME represented an opportunity to move from studying space science to actually building a spacecraft.

The mission combined:

**Student education + scientific research + spacecraft engineering + industry collaboration**

## Project Timeline

### January 2007

The University of Leicester CubeSat project began.

### 2007–2008

Students developed the spacecraft and payload, supported by academics and industry partners.

### June 2008

The University of Leicester announced that the student team had taken delivery of the spacecraft's main body, donated by Magna Parva.

At this stage, the mission was targeting an orbital launch in 2009.

### January 2009

The PLUME detector and science case were presented at the **2nd European CubeSat Workshop at ESTEC**.

The presentation described the scientific motivation, MCP detector technology, electronics and spacecraft budgets.

### Mid-2009

The original mission plan targeted deployment of the CubeSat into orbit.

## Legacy

PLUME represents an early example of the growing role of **student-built CubeSats in UK space education and research**.

The project combined a scientifically interesting payload with a practical educational model in which students participated in the development of an actual spacecraft.

Its emphasis on very small particle detection also illustrates how CubeSats can provide platforms for focused scientific experiments that would otherwise require much larger missions.

The project brought together:

- University research
- Undergraduate education
- Space instrumentation
- Industry expertise
- Amateur satellite communications
- CubeSat engineering

## Sources

- [Astronomy — Students prepare for dust up](https://www.astronomy.com/space-exploration/students-prepare-for-dust-up/)
- [University of Leicester](https://le.ac.uk/)
- [Andy Thomas — Leicester CubeSat Project: PLUME](https://sites.google.com/view/andythomasorg/home)
- 2nd European CubeSat Workshop, ESTEC — *The PLUME Detector Picosatellite of Leicester University Micrometeoroid Experiment*, Laura L. Evans, Daniel Brandt, Phillipa M. Molyneux, Philip J. D. Peterson, Matthew Denmark and George W. Fraser, January 2009