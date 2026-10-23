---
title: "Astronomy Calculator"
summary: "Observing and optics calculations for amateur astronomy, including magnification, field of view, exit pupil, limiting magnitude and resolution."
tagline: "Explore what your telescope and eyepiece can show you."

type: "tool"
status: "active"
subject: "Space & Astronomy"

platforms:
  - "web"
  - "api"

draft: false
featured: false

audience:
  - "Amateur astronomers"
  - "Visual observers"
  - "Astronomy educators"
  - "People comparing telescope and eyepiece combinations"

problem: "Understanding a telescope and eyepiece combination involves several related calculations. This tool brings them together in one place."

features:
  - "Calculate telescope magnification and exit pupil"
  - "Estimate true field of view from eyepiece apparent field of view"
  - "Calculate telescope focal ratio"
  - "Estimate limiting magnitude and light grasp relative to the eye"
  - "Show a suggested magnification range"
  - "Calculate Dawes and Rayleigh resolution limits"
  - "Start from a common telescope preset or enter your own specifications"
  - "Read the formulas and assumptions behind the results"
  - "Access the calculations through an API"

useCases:
  - title: "Compare eyepiece combinations"
    description: "Explore how eyepiece focal length and apparent field of view affect magnification, exit pupil and true field of view."
  - title: "Explore telescope capabilities"
    description: "Review focal ratio, estimated limiting magnitude, light grasp and theoretical resolution for a given aperture and focal length."
  - title: "Support observing preparation"
    description: "Check the calculated properties of a telescope and eyepiece combination before an observing session."
  - title: "Explain observing optics"
    description: "Use a worked example and the accompanying formulas to connect telescope specifications with observing quantities."

limitations:
  - "Read the formulas and assumptions alongside the calculated results."

toolsTech:
  - "TypeScript"
  - "Hono"
  - "Cloudflare Workers"

tags:
  - "astronomy"
  - "amateur-astronomy"
  - "observing"
  - "telescopes"
  - "eyepieces"
  - "optics"
  - "calculator"

relatedBuilds: []
relatedInsights: []
relatedProjects: []
relatedCaseStudies: []
---

## What it does

Astronomy Calculator brings common telescope and eyepiece calculations
into a single interface.

Enter your telescope’s aperture and focal length, then optionally add
an eyepiece focal length and apparent field of view. You can also start
from a common telescope preset.

The calculator returns magnification, exit pupil, true field of view,
focal ratio, estimated limiting magnitude, light grasp, a magnification
range and theoretical resolution limits.

## Telescope and eyepiece inputs

The calculator accepts:

- Telescope aperture in millimetres.
- Telescope focal length in millimetres.
- Eyepiece focal length in millimetres, where applicable.
- Eyepiece apparent field of view in degrees, where applicable.
- Naked-eye limiting magnitude for the observing conditions.

## Example calculation

For a telescope with a 200 mm aperture and a 1,200 mm focal length,
paired with a 25 mm eyepiece with a 52° apparent field of view, the
calculator displays the following results when the naked-eye limiting
magnitude is set to 6:

| Quantity | Calculated result |
| --- | --- |
| Magnification | 48× |
| Exit pupil | 4.17 mm |
| True field of view | 1.083° (65′) |
| Focal ratio | f/6 |
| Estimated limiting magnitude | 13.3 |
| Light grasp relative to the eye | 816× |
| Magnification range | 29× to 400× |
| Dawes limit | 0.58″ |
| Rayleigh limit | 0.69″ |

For this combination, the calculator describes the magnification as
a general-purpose range suitable for most deep-sky and planetary views.

## Formulas and assumptions

The tool includes a dedicated section explaining its formulas and
assumptions, so you can review the basis of the results alongside
your chosen inputs.

## API access

The calculator also includes a “Use this as an API” section for
accessing its calculations programmatically.
