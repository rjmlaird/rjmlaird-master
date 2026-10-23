---
title: "Colour Contrast Checker"
summary: "WCAG contrast ratios for foreground and background colours, with AA and AAA results and fix suggestions."
tagline: "Check WCAG contrast and fix failures."

type: "tool"
status: "active"
subject: "Web & Development"

platforms:
  - "web"

draft: false
featured: false

audience:
  - "Web developers"
  - "Designers"
  - "Content and accessibility teams"

problem: "Colour pairs often fail WCAG contrast without it being obvious."

features:
  - "Calculate WCAG contrast ratios for foreground and background colours"
  - "Show AA and AAA results"
  - "Suggest fixes"

useCases:
  - title: "Check a pair"
    description: "Test text and background colours."
  - title: "Fix a failure"
    description: "Use suggestions to reach AA or AAA."

limitations:
  - "Results depend on the inputs and assumptions used; read them alongside the output."

toolsTech:
  - "TypeScript"
  - "Hono"
  - "Cloudflare Workers"

tags:
  - "accessibility"
  - "colour"
  - "contrast"
  - "wcag"

relatedBuilds: []
relatedInsights: []
relatedProjects: []
relatedCaseStudies: []
---

<!-- DRAFT: written from the index description. Confirm features, formulas and limitations before publishing. -->

## What it does

Colour Contrast Checker — wCAG contrast ratios for foreground and background colours, with AA and AAA results and fix suggestions.

## Features

- Calculate WCAG contrast ratios for foreground and background colours.
- Show AA and AAA results.
- Suggest fixes.

## Who it is for

- Web developers.
- Designers.
- Content and accessibility teams.

## Limitations

- Results depend on the inputs and assumptions used; read them alongside the output.
