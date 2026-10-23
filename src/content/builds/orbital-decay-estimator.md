---
title: "Orbital Decay Estimator"
summary: "Estimate the approximate orbital lifetime of an Earth satellite from its orbital elements and selected physical assumptions. An educational estimate, not an operational re-entry prediction."
tagline: "A feel for how long a low orbit lasts."

type: "tool"
status: "planned"
subject: "Space & Astronomy"

platforms:
  - "web"

draft: false
featured: false

audience:
  - "Amateur astronomers"
  - "Astronomy and physics students"
  - "Educators"

problem: "Orbital lifetime depends on orbit and physical assumptions that are hard to reason about without a calculation."

features:
  - "Estimate approximate orbital lifetime from orbital elements"
  - "Let you choose physical assumptions"

useCases:
  - title: "Teach orbital decay"
    description: "Show how orbit and assumptions change lifetime."
  - title: "Sense-check a mission idea"
    description: "Get an order-of-magnitude lifetime."

limitations:
  - "This is an educational estimate, not an operational re-entry prediction."

toolsTech:
  - "TypeScript"
  - "Hono"
  - "Cloudflare Workers"
  - "SGP4"

tags:
  - "orbits"
  - "satellites"
  - "orbital-decay"
  - "space-sustainability"

relatedBuilds: []
relatedInsights: []
relatedProjects: []
relatedCaseStudies: []
---

<!-- DRAFT: written from the index description. Confirm features, formulas and limitations before publishing. -->

## What it does

Orbital Decay Estimator — estimate the approximate orbital lifetime of an Earth satellite from its orbital elements and selected physical assumptions. An educational estimate, not an operational re-entry prediction.

## Features

- Estimate approximate orbital lifetime from orbital elements.
- Let you choose physical assumptions.

## Who it is for

- Amateur astronomers.
- Astronomy and physics students.
- Educators.

## Limitations

- This is an educational estimate, not an operational re-entry prediction.

## Status

This is planned and not yet available.
