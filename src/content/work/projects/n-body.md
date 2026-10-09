---
id: 45
slug: n-body-simulation
title: Numerical N-body simulation in C++
type: research
status: completed
description: >
  Undergraduate computational-astrophysics project developing a C++ framework
  for simulating the Newtonian gravitational N-body problem. The project
  implemented data structures, pairwise force calculations, softened
  gravitational potentials, leapfrog time integration, diagnostic calculations
  and initial-condition generation.
startDate: 2007-10-01
endDate: 2008-01-31
updatedDate: 2008-01-31
tags:
  - computational-astrophysics
  - n-body-simulation
  - gravitational-dynamics
  - numerical-modelling
  - c-plus-plus
  - classical-mechanics
  - stellar-dynamics
  - galaxies
  - numerical-integration
category:
  - research
  - astrophysics
tools_tech:
  - C++
  - Newtonian gravity
  - Direct pairwise force summation
  - Leapfrog integration
  - Gravitational softening
  - Snapshot data structures
  - File input and output
  - Conservation-law diagnostics
links: {}
impact:
  summary: >
    Developed and tested a C++ computational framework for the direct
    gravitational N-body problem, including force and potential calculations,
    leapfrog integration, initial-condition generation and diagnostics based on
    energy and momentum conservation.
  outcomes:
    - Implemented body and snapshot data structures in C++
    - Calculated pairwise gravitational accelerations and potentials
    - Applied softening to manage close numerical encounters
    - Implemented leapfrog time integration
    - Generated and read initial-condition datasets
    - Calculated energy, linear momentum and angular-momentum diagnostics
    - Established a foundation for more complete star-cluster or galaxy simulations
institution: University of Leicester
organisation: Department of Physics and Astronomy
client: University of Leicester
relatedEducation:
  - edu-leicester-physics-astrophysics
relatedExperience:
  - exp-leicester-undergraduate-research
heroImage: /images/projects/n-body-simulation.png
heroAlt: >
  Numerical visualisation of multiple gravitating bodies evolving through an
  N-body simulation.
imageCredit: R. J. M. Laird / University of Leicester
---

## Overview

The gravitational **N-body problem** asks how a system of \\(N\\) bodies evolves
when their masses, positions and velocities are known.

The two-body problem has analytical solutions under Newtonian gravity. Once
three or more bodies interact, however, the system generally cannot be solved
in closed form. Numerical methods are required to calculate the changing
gravitational forces and advance the system through time.

This undergraduate computational-astrophysics project developed an N-body
simulation code from scratch in **C++**. The aim was to create the core
components needed to represent individual bodies, calculate their gravitational
interactions, integrate their motion numerically and test the results against
basic physical conservation laws.

The project was organised around the concept of a **snapshot**: a complete
representation of an N-body system at a particular time, containing the
properties of every body in the model.

## Research question

How can the Newtonian gravitational N-body problem be implemented in C++ as a
numerical simulation capable of evolving an arbitrary set of interacting bodies
while calculating and testing the relevant physical quantities?

The project addressed several connected questions:

- How should the masses, positions, velocities, accelerations and potentials of
  \\(N\\) bodies be represented and managed in C++?
- How can pairwise gravitational acceleration and potential be calculated
  consistently for all bodies?
- How can the equations of motion be advanced through time?
- How can numerical output be checked against energy and momentum conservation?
- How can physically motivated initial conditions be generated and stored?
- Does the resulting code compile, run and produce physically reasonable
  numerical output?

## Scientific context

N-body methods are fundamental to computational astrophysics because many
gravitating systems cannot be approximated as isolated two-body orbits.

The same underlying mathematical problem appears in:

- Star clusters.
- Planetary systems.
- Binary and multiple-star encounters.
- Galaxy dynamics.
- Galaxy mergers.
- Dark-matter halo evolution.
- Large-scale cosmic structure.

In a direct N-body implementation, every particle contributes to the force on
every other particle. The number of pairwise calculations therefore grows as
approximately \\(N^2\\) per timestep, which makes direct summation accurate but
increasingly expensive for large systems. [web:199][web:205]

## Mathematical formulation

Each body was treated as a point mass under Newtonian gravity. The approach
assumed that bodies were spherical and centrosymmetric, allowing their
gravitational influence to be represented by their mass and position.

The acceleration of body \\(i\\) due to all other bodies was calculated as:

\\[\\mathbf{a}\_i = -G \\sum\_{j \\ne i} m\_j \\frac{\\mathbf{r}\_i-\\mathbf{r}\_j} {\\left(|\\mathbf{r}\_i-\\mathbf{r}\_j|^2+\\varepsilon^2\\right)^{3/2}}\\]

where:

- \\(G\\) is the gravitational constant.
- \\(m\_j\\) is the mass of body \\(j\\).
- \\(\\mathbf{r}\_i\\) and \\(\\mathbf{r}\_j\\) are position vectors.
- \\(\\varepsilon\\) is the gravitational softening length.

The gravitational potential of body \\(i\\) was calculated as:

\\[\\Phi\_i = -G \\sum\_{j \\ne i} \\frac{m\_j} {\\sqrt{|\\mathbf{r}\_i-\\mathbf{r}\_j|^2+\\varepsilon^2}}\\]

As \\(\\varepsilon\\) approaches zero, the softened potential approaches the
usual Newtonian point-mass form.

## Gravitational softening

The force between ideal point masses diverges as their separation approaches
zero. This can create numerical instability during close encounters.

The model therefore used gravitational softening, replacing the singular
\\(1/r\\) behaviour with a finite interaction at very small separations. A
softening length reduces the influence of close encounters below the chosen
scale and makes the equations more stable to integrate numerically. [web:199][web:202][web:205]

Softening is a modelling choice. It improves numerical behaviour but also
changes the physical force law on scales comparable to \\(\\varepsilon\\). The
choice of softening length must therefore balance stability against physical
fidelity.

## Software design

The implementation used two primary C++ structures:

- `body`, representing an individual gravitating object.
- `snapshot`, representing the full N-body system at a specified time.

### Body structure

Each `body` stored:

- Mass.
- Three-dimensional position.
- Three-dimensional velocity.
- Three-dimensional acceleration.
- Gravitational potential.

### Snapshot class

The `snapshot` class stored:

- Simulation time.
- Number of bodies.
- Dynamically allocated body data.
- Methods for reading a snapshot from file.
- Methods for writing a snapshot to file.

The implementation used constructors, a copy constructor and destructors to
manage dynamically allocated memory associated with the body array.

This organisation separated the physical properties of individual particles
from the state of the system as a whole.

## Force calculation

The gravitational solver calculated accelerations and potentials for every
body.

Rather than calculating the interaction between body \\(i\\) and body \\(j\\), and
then separately recalculating the interaction between \\(j\\) and \\(i\\), the
implementation considered each pair once.

For each pair:

1. The separation vector was calculated.
2. The softened separation was evaluated.
3. The gravitational acceleration contribution was added to both bodies.
4. The gravitational potential contribution was accumulated.
5. Newton's equal-and-opposite force symmetry was used to avoid redundant work.

This pairwise approach was appropriate for a small educational simulation,
where correctness, transparency and physical interpretation were more important
than optimisation for extremely large \\(N\\).

## Time integration

The system was evolved using the **leapfrog integration method**.

For a timestep \\(\\tau\\), the procedure was:

1. Advance velocity by half a timestep:

   \\[\\mathbf{v}\_i    \\rightarrow    \\mathbf{v}\_i+\\frac{1}{2}\\tau\\mathbf{a}\_i\\]

2. Advance position by a full timestep:

   \\[\\mathbf{x}\_i    \\rightarrow    \\mathbf{x}\_i+\\tau\\mathbf{v}\_i\\]

3. Recalculate acceleration and gravitational potential from the updated
   positions.

4. Advance velocity by the remaining half timestep.

Leapfrog integration is well suited to gravitational problems because
acceleration depends on position rather than velocity. It is a second-order
method and has favourable long-term conservation behaviour compared with simple
forward-Euler integration. [web:201][web:203][web:208]

## Diagnostics

The project incorporated diagnostic calculations to test whether the numerical
model behaved consistently with the underlying physics.

### Kinetic energy

The total kinetic energy was calculated as:

\\[K = \\sum\_i \\frac{1}{2}m\_i v\_i^2\\]

### Potential energy

The gravitational potential energy was considered in two forms:

\\[W = -\\frac{1}{2} \\sum\_i \\sum\_{j \\ne i} \\frac{Gm\_i m\_j} {|\\mathbf{r}\_i-\\mathbf{r}\_j|}\\]

and:

\\[W = \\frac{1}{2} \\sum\_i m\_i\\mathbf{r}\_i\\cdot\\mathbf{a}\_i\\]

These expressions provide related ways to assess the gravitational state of the
system and to identify inconsistencies in the force implementation.

### Momentum

The code also considered:

- Total linear momentum.
- Total angular momentum.
- Total energy.

For an isolated system, departures from conservation can indicate numerical
error, inadequate timestep selection, errors in force calculations or issues
with data handling.

### Virial ratio

A more complete simulation could use the virial ratio:

\\[\\frac{2K}{|W|}\\]

to investigate dynamical state. A stable, virialised system tends towards a
value near unity. During collapse, merger or strong disturbance, the ratio can
change substantially before the system relaxes.

## Initial conditions

A separate program, `write.cc`, generated initial conditions for N-body runs.

The program assigned body masses and generated random positions and velocities
according to the distributions specified in the project. Position generation
used a radial distribution with random angular coordinates, while velocities
were generated from a corresponding distribution.

The resulting state was written to a text file for later use by the simulation.

A sample file, `data0.txt`, containing ten bodies was included as a test
dataset.

## Implementation

The final implementation consisted principally of three C++ components.

### `body.h`

`body.h` defined the `body` data structure and the `snapshot` class.

It provided the fundamental representation of individual objects and complete
system states, as well as the interfaces needed for file input and output.

### `read.cc`

`read.cc` handled reading N-body data from file and performed the principal
gravitational calculations.

It included routines for:

- Reading snapshot data.
- Calculating softened gravitational accelerations.
- Calculating gravitational potentials.
- Calculating diagnostic quantities.
- Printing numerical output for inspection.

### `write.cc`

`write.cc` generated initial conditions and wrote them to data files.

It provided the bridge between randomised or physically specified starting
conditions and the main N-body calculation.

## Results

The project successfully produced a C++ N-body code that compiled and ran.

The framework was able to:

- Represent an arbitrary number of bodies.
- Store masses, positions, velocities, accelerations and potentials.
- Read and write N-body data files.
- Calculate pairwise gravitational acceleration.
- Calculate gravitational potential.
- Apply gravitational softening.
- Generate initial conditions.
- Calculate diagnostic quantities.
- Test aspects of the simulation against conservation-related expectations.

The code produced numerical output that appeared physically reasonable for the
test cases used during development.

The full simulation and long-duration analysis stage was not completed within
the pro
