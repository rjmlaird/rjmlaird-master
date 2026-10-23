---
title: "Satellite Pass Predictor"
summary: "Next visible passes of a satellite for a given location, calculated from current orbital elements."
tagline: "Know when a satellite passes overhead."

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

problem: "Finding a satellite pass means combining orbital elements with your location and time."

features:
  - "List the next visible passes for a location"
  - "Calculate passes from current orbital elements"

useCases:
  - title: "Spot a satellite"
    description: "Find the next pass from your location."
  - title: "Plan photography"
    description: "Choose a time to observe a pass."

limitations:
  - "Results depend on the inputs and assumptions used; read them alongside the output."

toolsTech:
  - "TypeScript"
  - "Hono"
  - "Cloudflare Workers"
  - "SGP4"

tags:
  - "satellites"
  - "passes"
  - "sgp4"
  - "observing"

relatedBuilds: []
relatedInsights: []
relatedProjects: []
relatedCaseStudies: []
---

<!-- DRAFT: written from the index description. Confirm features, formulas and limitations before publishing. -->

## What it does

Satellite Pass Predictor — next visible passes of a satellite for a given location, calculated from current orbital elements.

## Features

- List the next visible passes for a location.
- Calculate passes from current orbital elements.

## Who it is for

- Amateur astronomers.
- Astronomy and physics students.
- Educators.

## Limitations

- Results depend on the inputs and assumptions used; read them alongside the output.

## Status

This is planned and not yet available.
