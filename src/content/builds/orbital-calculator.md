---
title: "Orbital Calculator"
summary: "Two-body orbit calculator. Enter a semi-major axis and eccentricity to get the period, periapsis and apoapsis radii and the speeds at each, using the vis-viva equation. Defaults to Earth's gravitational parameter."
tagline: "Period, radii and speeds from two numbers."

type: "tool"
status: "active"
subject: "Space & Astronomy"

platforms:
  - "web"

draft: false
featured: false

audience:
  - "Amateur astronomers"
  - "Astronomy and physics students"
  - "Educators"

problem: "Basic two-body orbit properties follow from a few inputs but take care to calculate."

features:
  - "Enter a semi-major axis and eccentricity"
  - "Get the period, periapsis and apoapsis radii"
  - "Get the speeds at periapsis and apoapsis using the vis-viva equation"
  - "Default to Earth's gravitational parameter"

useCases:
  - title: "Check an orbit"
    description: "Find period and extreme radii quickly."
  - title: "Teach the vis-viva equation"
    description: "Show how speed varies around an orbit."

limitations:
  - "A two-body model; it ignores perturbations."

toolsTech:
  - "TypeScript"
  - "Hono"
  - "Cloudflare Workers"

tags:
  - "orbits"
  - "two-body"
  - "vis-viva"
  - "orbital-mechanics"

relatedBuilds: []
relatedInsights: []
relatedProjects: []
relatedCaseStudies: []
---

<!-- DRAFT: written from the index description. Confirm features, formulas and limitations before publishing. -->

## What it does

Orbital Calculator — two-body orbit calculator. Enter a semi-major axis and eccentricity to get the period, periapsis and apoapsis radii and the speeds at each, using the vis-viva equation. Defaults to Earth's gravitational parameter.

## Features

- Enter a semi-major axis and eccentricity.
- Get the period, periapsis and apoapsis radii.
- Get the speeds at periapsis and apoapsis using the vis-viva equation.
- Default to Earth's gravitational parameter.

## Who it is for

- Amateur astronomers.
- Astronomy and physics students.
- Educators.

## Limitations

- A two-body model; it ignores perturbations.
