---
id: 43
slug: galaxy-facebook
title: "Galaxy Facebook: X-ray source population analysis of the Galactic Centre"
type: research
status: completed
description: >
  Undergraduate research project analysing XMM-Newton observations of two
  Galactic Ridge fields to investigate intermediate-luminosity X-ray sources,
  compare spectral behaviour across energy bands, and identify candidate
  variable or transient sources.
startDate: 2008-01-01
endDate: 2008-04-16
tags:
  - x-ray-astronomy
  - galactic-centre
  - galactic-ridge
  - xmm-newton
  - high-energy-astrophysics
  - observational-astronomy
  - data-reduction
  - x-ray-sources
  - x-ray-transients
category:
  - research
  - astrophysics
tools_tech:
  - XMM-Newton
  - European Photon Imaging Camera
  - EPIC MOS1
  - EPIC MOS2
  - EPIC pn
  - FITS data analysis
  - Q data-analysis software
  - Fortran 77
  - LEDAS Arnie services
  - 2XMM catalogue
  - HEASARC archive
links: {}
impact:
  summary: >
    Analysed a sample of approximately 30 intermediate-luminosity X-ray sources
    in two Galactic Ridge fields, comparing source populations, absorption
    effects and multi-epoch variability to identify candidate transient and
    high-variability objects.
  outcomes:
    - Reduced and examined multi-instrument XMM-Newton EPIC datasets
    - Compared source behaviour across five X-ray energy bands
    - Identified candidate variable and transient X-ray sources
    - Cross-referenced measured sources with the 2XMM catalogue
    - Completed an undergraduate research report supervised by Professor Bob Warwick
institution: University of Leicester
organisation: Department of Physics and Astronomy
client: University of Leicester
relatedEducation:
  - edu-leicester-physics-astrophysics
relatedExperience:
  - exp-leicester-undergraduate-research
heroImage: /images/projects/galaxy-facebook.png
heroAlt: >
  XMM-Newton X-ray observation showing point sources and diffuse high-energy
  emission in a Galactic Ridge field.
imageCredit: XMM-Newton Survey Science Centre / ESA / University of Leicester
---

## Overview

The Galactic Centre and Galactic Ridge contain a dense and complex population
of high-energy sources. X-ray observations reveal emission from compact
binaries, accreting white dwarfs, active stars, supernova remnants, diffuse hot
plasma and more distant background objects seen through the Milky Way.

This undergraduate research project analysed archival observations from ESA's
**XMM-Newton** X-ray observatory. The work focused on discrete sources of
intermediate luminosity in two fields near the Galactic plane: one centred
close to the plane and a second positioned approximately two degrees away from
it.

The project examined source detection, count rates, energy-band behaviour and
variability across multiple observation epochs. It also compared results with
the **2XMM** serendipitous-source catalogue to identify candidate variable or
transient X-ray sources.

## Research question

What are the spectral and temporal properties of intermediate-luminosity X-ray
sources in Galactic Ridge fields, and how do source populations and observed
fluxes differ between a field on the Galactic plane and an off-plane field?

The work considered several related questions:

- Which sources showed substantial changes in flux between observations?
- Which energy bands contributed most strongly to individual sources?
- How did count rates differ between the on-plane and off-plane fields?
- What role might interstellar absorption play in the observed source
  populations?
- Could multi-epoch comparisons identify candidate X-ray transients?

## Scientific context

X-ray astronomy is essential for studying compact and energetic objects that
cannot be understood from visible-light observations alone.

The Galactic plane contains large quantities of gas and dust. This material
absorbs lower-energy X-rays particularly strongly, so observations along the
plane tend to favour harder X-ray sources or nearby objects. Comparing a
plane field with an off-plane field can therefore help distinguish changes in
source density from the effects of interstellar absorption.

Intermediate-luminosity sources are also important because they can include
cataclysmic variables, X-ray binaries, coronally active stars and other
populations that collectively contribute to the Galactic Ridge X-ray emission.

## Observations

The project used archival XMM-Newton observations of two fields in the Galactic
Ridge region.

### Galactic Ridge 1

Galactic Ridge 1 was centred close to the Galactic plane at approximately:

```text
Galactic longitude: 33 degrees 06 minutes
Galactic latitude: 0 degrees
```

The analysed observations were:

| Observation ID | Approximate net exposure |
| --- | ---: |
| `0017740401` | 21 ks |
| `0017740501` | 25 ks |

This field was expected to be affected by substantial line-of-sight absorption
and to contain a comparatively high density of Galactic X-ray sources.

### Galactic Ridge 2

Galactic Ridge 2 was positioned off the plane at approximately:

```text
Galactic longitude: 33 degrees
Galactic latitude: 2 degrees
```

The analysed observations were:

| Observation ID | Approximate net exposure |
| --- | ---: |
| `0017740201` | 15–20 ks |
| `0017740601` | 15–20 ks |
| `0017740701` | 15–20 ks |

Moving away from the plane changes both the absorbing column and the mixture of
objects visible in the field, making the comparison useful for interpreting
population differences.

### EPIC instruments

All observations used XMM-Newton's European Photon Imaging Camera (**EPIC**):

- **MOS1**, a Metal Oxide Semiconductor camera.
- **MOS2**, a second Metal Oxide Semiconductor camera.
- **pn**, a higher-throughput CCD camera.

The observations used the medium optical blocking filter. Combining the three
instruments improved source detection and enabled instrument-by-instrument
comparison of count rates.

## Method

The analysis used Leicester-developed data-analysis tools operating through
command-line Q scripts, including `viewer2.qin` and `sources2.qin`.

### Data reduction

Raw and processed XMM-Newton data products were handled as FITS and HDS/FITS
structures. The reduction process involved preparing data from each EPIC
instrument, inspecting images, selecting source regions and extracting
instrument-specific count rates.

### Multi-band imaging

The source population was examined in five standard XMM-Newton energy bands:

| Band | Energy range |
| --- | --- |
| Band 1 | 0.2–0.5 keV |
| Band 2 | 0.5–2.0 keV |
| Band 3 | 2.0–4.5 keV |
| Band 4 | 4.5–7.5 keV |
| Band 5 | 7.5–12.0 keV |

Comparing these bands made it possible to assess whether a source was
predominantly soft or hard, and to investigate the effects of absorption and
spectral variation.

### Source detection

Candidate point sources were identified using automated extraction procedures.
The analysis considered parameters describing source extent and the fraction
of counts concentrated within the detection cell to distinguish likely
point-like sources from extended structure, noise and diffuse emission.

Source extraction and count-rate measurement used routines including `Jill`
and `Jack`.

### Catalogue comparison

Measured source positions and count rates were compared with archival source
information from:

- The **2XMM** XMM-Newton Serendipitous Source Catalogue.
- The **LEDAS Arnie** service.
- The **HEASARC** archive.

This comparison provided external flux estimates, source designations and
reference values for evaluating differences between epochs.

### Variability analysis

For sources detected in more than one observation, count rates and derived
fluxes were compared across epochs.

Sources with changes substantially larger than their formal measurement
uncertainties were flagged as possible high-variability objects or candidate
X-ray transients. These candidates would require deeper or follow-up
observations for definitive classification.

## Findings

### Candidate variable and transient sources

Several sources showed flux changes that exceeded their formal uncertainties
between observing epochs.

One example was source `168323`, associated with 2XMM J185139.1+001635. This
source showed pronounced variability in the Galactic Ridge 1 data, with strong
emission in the 2.0–4.5 keV band. Its behaviour made it a candidate for further
investigation as a variable or transient X-ray source.

The project identified variability candidates rather than claiming definitive
transient classifications. The available observations provided a limited number
of epochs and were not designed as a continuous monitoring campaign.

### Bright sources and energy dependence

The brightest source identified in Galactic Ridge 1 was source `168300`,
associated with 2XMM J185114.3-000004.

Its EPIC flux was estimated at approximately:

```text
6.1 × 10^-13 erg s^-1 cm^-2
```

The source showed strong emission at higher energies, particularly in Band 5
(7.5–12.0 keV). Hard-band behaviour can indicate intrinsically energetic
sources, substantial foreground absorption, or a combination of both.

### On-plane and off-plane comparison

The Galactic Ridge 1 field generally showed higher active count rates than
Galactic Ridge 2.

This difference was consistent with the expectation that observations close to
the Galactic plane sample a denser population of Galactic X-ray sources while
also experiencing stronger absorption. Soft X-ray emission is preferentially
suppressed by intervening gas and dust, meaning that the observed population
along the plane is weighted towards harder or less absorbed sources.

### Approximate luminosity scale

Using a simple assumed distance of approximately 8 kiloparsecs, comparable to
the distance to the Galactic Centre, the observed intermediate-luminosity
sources corresponded broadly to X-ray luminosities around:

```text
10^32 erg s^-1
```

These values were indicative rather than definitive because source distances
and absorbing columns were not independently determined for every object.
Detailed spectral fitting and absorption corrections would be required to
derive robust intrinsic luminosities.

## Contribution

I completed this research as an undergraduate physics student at the University
of Leicester, working with Leon Hicks under the supervision of **Professor Bob
Warwick**.

The project provided practical experience in:

- Processing space-telescope datasets.
- Working with FITS-based astronomy data products.
- Comparing observations from multiple CCD instruments.
- Assessing X-ray source variability.
- Using archival catalogues and astronomical data services.
- Interpreting high-energy observations in the context of Galactic source
  populations and interstellar absorption.

## Related output

### X-ray source population of the nearby Galactic Centre

**Ryan John McCall Laird**

Undergraduate research report, Department of Physics and Astronomy, University
of Leicester, 16 April 2008.

Supervised by Professor Bob Warwick.

The report documented the XMM-Newton EPIC data-reduction process, source
detection workflow, energy-band comparisons, catalogue cross-matching and
source flux tabulations for Galactic Ridge 1 and Galactic Ridge 2.

## Scientific significance

The Galactic Ridge X-ray emission is produced by a mixture of diffuse
processes and large populations of faint or unresolved point sources.
Understanding the properties of intermediate-luminosity sources helps constrain
the contribution made by Galactic binaries, accreting white dwarfs, active
stars and other compact populations.

This project provided a small-scale observational investigation of that wider
problem. Comparing fields close to and away from the Galactic plane illustrated
how source populations, energy-dependent absorption and observational selection
affect the high-energy view of the Milky Way.

## Limitations

The observations had net exposures of approximately 15–25 kiloseconds per
field. They were therefore substantially shallower than dedicated deep surveys,
limiting sensitivity to faint sources and reducing the ability to classify
short-duration variability.

Other limitations included:

- Detector-edge effects for sources near camera boundaries.
- Differences in effective area and response between MOS and pn instruments.
- Dependence on catalogue cross-calibration when converting count rates to
  physical fluxes.
- Uncertain distances to individual sources.
- Absorption corrections not modelled in detail for every source.
- Limited temporal sampling, which prevents firm classification of transient
  candidates without follow-up data.

The analysis should consequently be interpreted as an exploratory source
population study and as evidence for candidate variability, rather than a
complete census or definitive classification programme.

## Keywords

Galactic Centre; Galactic Ridge; XMM-Newton; EPIC; MOS1; MOS2; pn; X-ray
sources; X-ray transients; high-energy astrophysics; FITS; data reduction;
2XMM; interstellar absorption.