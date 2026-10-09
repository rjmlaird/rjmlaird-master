---
id: 44
slug: accretion-disc-outflows
title: Models of Time-dependent Accretion Discs with Outflows
type: research
status: completed
description: >
  Numerical investigation of time-dependent accretion-disc evolution with mass
  feedback and outflows. The project developed and validated a Fortran model
  based on Shakura-Sunyaev disc solutions and wind-infall formulations to
  examine disc dynamics, angular-momentum transport and wind energy deposition.
startDate: 2009-02-01
endDate: 2009-02-27
updatedDate: 2009-02-27
tags:
  - accretion-discs
  - high-energy-astrophysics
  - numerical-modelling
  - black-holes
  - active-galactic-nuclei
  - agn
  - stellar-evolution
  - fluid-dynamics
  - outflows
  - fortran
category:
  - research
  - astrophysics
tools_tech:
  - Fortran 77
  - IDL
  - Shakura-Sunyaev alpha-disc models
  - Time-dependent viscous diffusion modelling
  - Falcke and Melia wind-infall formulations
  - Svensson and Zdziarski validation solutions
  - Numerical mass-conservation tests
  - Gaussian-ring diffusion tests
links: {}
impact:
  summary: >
    Developed and tested a numerical model for time-dependent accretion discs
    supplied by wind-fed material. The simulations indicated that large-scale
    wind deposition can dominate disc evolution across extreme angular-momentum
    assumptions, while small-scale deposition produces more distinct
    mass-retention and depletion behaviour.
  outcomes:
    - Validated steady-state alpha-disc solutions against gas- and radiation-pressure regimes
    - Implemented time-dependent surface-density diffusion and mass-conservation calculations
    - Verified viscous spreading using Gaussian-ring test conditions
    - Simulated large-scale and small-scale wind-feedback regimes
    - Compared extreme angular-momentum cases for supplied material
    - Completed final-year undergraduate research under Dr Sergei Nayakshin
institution: University of Leicester
organisation: Department of Physics and Astronomy
client: University of Leicester
relatedEducation:
  - edu-leicester-physics-astrophysics
relatedExperience:
  - exp-leicester-undergraduate-research
heroImage: /images/projects/accretion-discs-outflows.png
heroAlt: >
  Numerical plot of temperature, pressure and radial properties in steady-state
  and time-dependent accretion-disc models with wind feedback.
imageCredit: R. J. M. Laird / University of Leicester
---

## Overview

Accretion discs are rotating structures of gas that form when material falls
towards a compact object while retaining angular momentum. They are found around
young stars, white dwarfs, neutron stars and black holes, including the
supermassive black holes that power active galactic nuclei (AGN).

For gas to move inward and accrete, angular momentum must be transported
outwards through the disc. The widely used Shakura-Sunyaev alpha-disc model
represents this transport through an effective viscosity parameter, alpha. The
model provides a useful framework for describing thin, radiatively efficient
accretion discs. [web:190][web:194]

This final-year undergraduate research project developed a numerical model of
an accretion disc evolving over time while receiving matter and energy from
stellar winds or other external mass inflow. The work investigated how the
spatial scale and angular momentum of supplied material influence disc
structure, mass loss and black-hole feeding.

## Research question

How do mass outflows, wind feedback and the angular momentum of supplied
material affect the long-term evolution of a time-dependent accretion disc?

The project addressed several connected questions:

- Can a numerical steady-state disc model reproduce established analytical
  solutions?
- Can the resulting code accurately evolve surface density through viscous
  diffusion while conserving total mass?
- Does a wind deposited over a large radial scale alter disc evolution
  differently from a wind concentrated near the central object?
- How sensitive are disc depletion and accretion behaviour to the angular
  momentum carried by injected material?
- What insight can idealised wind-fed discs provide for low-luminosity galactic
  nuclei such as Sagittarius A*?

## Theoretical context

### Accretion and angular momentum

Gas with substantial angular momentum typically settles into a disc rather than
falling directly towards a compact object. It can only move inward if angular
momentum is redistributed, generally through viscous or turbulent stresses.

In the standard alpha-disc prescription, kinematic viscosity is represented by:

\[
\nu = \alpha c_{\mathrm{s}} H
\]

where \(\nu\) is the kinematic viscosity, \(\alpha\) is a dimensionless
efficiency parameter, \(c_{\mathrm{s}}\) is the sound speed and \(H\) is the
disc scale height. [web:194][web:197]

### Shakura-Sunyaev discs

The project used Shakura-Sunyaev thin-disc solutions as the initial and
validation framework. In this approach, disc properties depend on the central
mass, mass-accretion rate, viscosity parameter and radial distance from the
accretor. The model includes regimes in which gas pressure or radiation pressure
dominates the disc structure. [web:195][web:196]

### Wind-fed accretion

The model then extended the steady-state framework to consider time-dependent
mass injection and wind feedback. External material can alter a disc's surface
density, angular-momentum balance and accretion rate, particularly when the
incoming material has a different angular momentum from gas already orbiting in
the disc.

The project used modified conservation equations based on wind-infall
formulations associated with Falcke, Melia and collaborators. These models
provide a simplified way to explore the interaction between wind-fed material,
disc evolution and accretion onto a central black hole. [web:191]

## Numerical model

The numerical model was implemented in **Fortran 77**, with output analysis and
visualisation performed in **IDL**.

The simulation considered a central black hole with an assumed mass of:

```text
10^8 solar masses
```

The baseline calculations used:

```text
Accretion rate: 0.1 times the Eddington accretion rate
Viscosity parameter: alpha = 0.1
```

The Eddington limit provides a reference scale at which radiation pressure from
accretion luminosity can oppose further spherical inflow. In realistic disc
systems, the relationship between supplied mass, radiation, outflows and
accretion can be more complex than this idealised reference value.

## Method

### Steady-state validation

The initial stage of the project implemented a steady-state disc solver.

Disc profiles were calculated over a range of radii and compared with
analytical solutions associated with Svensson and Zdziarski. The validation
tested the expected transition between gas-pressure-dominated and
radiation-pressure-dominated regimes.

This stage established that the numerical implementation reproduced the
qualitative behaviour expected of standard thin-disc models before
time-dependent terms were introduced.

### Time-dependent diffusion

The model was then extended to evolve the surface-density distribution,
\(\Sigma(r,t)\), over time.

The numerical solution treated viscous evolution as a radial diffusion process.
At each time step, the program updated the mass distribution across the disc
while tracking total system mass.

Mass-conservation testing showed that the implementation maintained a stable
total mass of approximately:

```text
100,729.7 solar masses
```

within the numerical precision and boundary assumptions of the model.

### Gaussian-ring tests

A Gaussian ring of material was used as a controlled test case for the
time-dependent solver.

Under viscous evolution, an initially narrow ring should spread radially:
some material moves inwards and can accrete, while some transports angular
momentum outwards. The numerical code reproduced this expected spreading
behaviour and approached stationary constant-accretion-rate solutions under
the relevant boundary conditions.

### Wind-feedback implementation

The final stage introduced source terms representing wind-fed mass and energy
deposition.

The calculations compared two idealised regimes:

- **Large-scale wind deposition**, in which material was supplied over an
  extended radial region, with a collection area reaching approximately
  0.1 parsecs.
- **Small-scale wind deposition**, in which supplied material was concentrated
  more closely around the disc.

The simulations also tested extreme angular-momentum conditions for the
incoming material:

- \(\xi = 1\), representing supplied matter with high or maximum assumed
  angular momentum.
- \(\xi = 0\), representing supplied matter with negligible assumed angular
  momentum.

These cases were not intended as complete physical models of all wind-fed
systems. They were controlled experiments for identifying which assumptions
had the strongest influence on the disc's evolution.

## Findings

### Large-scale wind deposition

In the large-scale wind models, wind supply dominated the evolution of the
disc.

The simulations showed little difference between the extreme angular-momentum
cases, \(\xi = 1\) and \(\xi = 0\). Once material was deposited over a broad
enough radial region, the large-scale mass and energy input determined the
overall disc evolution more strongly than the angular momentum parameter of
the injected material.

This result suggested that, in this idealised regime, the spatial distribution
of wind deposition is more important than the angular-momentum contrast between
the two tested cases.

### Small-scale wind deposition

Small-scale wind models displayed more distinct depletion behaviour.

The disc mass declined more gradually at first than in the large-scale cases,
then underwent a sharper reduction after approximately one million years in
the low-angular-momentum condition.

The models also indicated lower final black-hole mass growth than the
large-scale cases, by roughly 10 percent under the assumptions used in the
simulation.

### Super-Eddington phases

Across the tested parameter space, the calculated accretion rates remained
above the reference Eddington rate for extended periods, broadly from
\(10^5\) to \(10^6\) years, before declining as the available disc material was
depleted.

These phases should be interpreted within the model's idealised assumptions.
A complete treatment of super-Eddington accretion would require more detailed
radiative transfer, geometry, outflow launching and magnetohydrodynamics than
were included here.

### Relevance to galactic nuclei

The calculations provided a simplified framework for considering wind-fed
accretion near supermassive black holes, including environments such as the
Galactic Centre.

Such systems can receive substantial mass input from nearby stars while
remaining relatively faint in radiative output. The project illustrated how
the location, angular momentum and feedback associated with supplied wind
material can affect the rate at which gas reaches the central black hole.

## Contribution

I completed this project independently as a final-year undergraduate physics
student at the University of Leicester under the supervision of **Dr Sergei
Nayakshin**.

My work included:

- Implementing core steady-state disc calculations in Fortran 77.
- Building a time-dependent surface-density diffusion solver.
- Testing mass conservation and numerical stability.
- Performing Gaussian-ring validation experiments.
- Adding parameterised wind-feedback and mass-injection terms.
- Producing IDL routines for diagnostic plots and model comparison.
- Writing the final project dissertation.

## Related output

### Models of Time-dependent Accretion Discs with Outflows

**R. J. M. Laird**

Undergraduate Final Year Project Report, Department of Physics and Astronomy,
University of Leicester, 27 February 2009.

Supervised by Dr Sergei Nayakshin.

The dissertation documented the theoretical framework, numerical algorithms,
Fortran implementation, stability and conservation tests, and comparative
evolution plots for wind-fed accretion-disc models.

## Scientific significance

Accretion discs connect small-scale gas physics with some of the most luminous
phenomena in the Universe. Their behaviour affects black-hole growth, stellar
evolution, jet production, AGN activity and the feedback between compact
objects and their surroundings.

This project examined a focused aspect of that problem: how external wind
supply changes a disc over time. It showed, within the model assumptions, that
the radial scale of wind deposition can dominate the outcome, while the
angular-momentum state of incoming material becomes more influential when
deposition is confined to a smaller region.

## Limitations

This was an idealised one-dimensional numerical model, with several important
limitations:

- It used a parameterised alpha-viscosity prescription rather than resolving
  magnetohydrodynamic turbulence.
- It did not model three-dimensional disc structure, warping or non-axisymmetric
  instabilities.
- Wind mass, energy and angular momentum were introduced through simplified
  source terms rather than self-consistent wind-launching calculations.
- Radiative transfer and radiation-pressure feedback were treated through
  simplified disc assumptions.
- Magnetic fields, jet launching and detailed outflow geometry were not included.
- Results depended on the adopted central mass, viscosity, initial conditions,
  deposition profile and boundary conditions.

The results therefore provide insight into the behaviour of the model rather
than a complete prediction for any specific accreting black-hole system.

## Keywords

Accretion discs; time-dependent accretion; black holes; active galactic nuclei;
wind feedback; outflows; angular momentum; alpha-disc; Shakura-Sunyaev;
numerical modelling; Fortran; Sagittarius A*.