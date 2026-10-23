---
id: 6
slug: gerb
title: Calibration of Geostationary Earth Radiation Budget (GERB) FPA
type: featured
status: completed
draft: false
description: >
  Comprehensive analysis of calibration data from the Geostationary Earth
  Radiation Budget (GERB) Focal Plane Assembly (FPA) using IDL to derive
  relative spectral response curves.
startDate: 2008-07-01
client: National Centre for Earth Observation / University of Leicester
category:
  - research
  - earth-observation
tags:
  - msg
  - eumetsat
  - nceo
  - earth-observation
tools_tech:
  - IDL
  - Spectral Analysis
  - Data Processing
links:
  web: https://www.nceo.ac.uk/our-research/missions/gerb/
impact:
  summary: >
    Developed specialised IDL software routines and automated data pipelines
    to process, sort, and analyze calibration measurements for GERB's
    256-element detector array.
heroImage: /images/projects/gerb.jpg
heroAlt: GERB aboard MSG
imageCredit: NCEO
relatedExperience:
  - exp-uol-gerb
---

## Overview

The **Geostationary Earth Radiation Budget (GERB)** instrument provides dedicated, high-resolution measurements of the Earth's Radiation Budget (ERB) from geostationary orbit. Developed with funding from ESA and NERC, and supported by EUMETSAT, GERB measures the balance between incoming solar shortwave (SW) radiation (< 4 µm) and outgoing longwave (LW) radiation (≥ 4 µm).

This project focused on analysing calibration data from the GERB **Focal Plane Assembly (FPA)** at the Leicester Spectral Calibration Facility (LSCF). The primary objective was to establish reliable relative spectral response curves across all 256 pixels of the detector array spanning a wavelength range of 0.33 µm to 20.0 µm.

---

## Instrument and calibration setup

- **Focal Plane Assembly (FPA):** Features a 256-element thermoelectric linear array operating at approximately 300 K, supported by four Application-Specific Integrated Circuits (ASICs). Each pixel (55 × 45 µm) is coated with gold-black to optimise spectral response.
- **Radiation Sources:** Used Quartz Tungsten Halogen (QTH) filament lamps for shortwave measurements (0.3 to 4 µm) and heated ceramic sources for infrared measurements (4 to 20 µm).
- **Reference Detectors:** Calibrated against National Physical Laboratory (NPL) standards using silicon photodiodes for visible wavelengths and platinum-black coated pyroelectric crystals for infrared wavelengths.
- **Vacuum Chamber Environment:** The detector was housed in a vacuum chamber (< 10⁻⁴ mbar) with CaF₂ and ZnSe windows to facilitate precise beam illumination.

---

## Software and data processing

To handle complex multi-file calibration datasets, a custom software suite was developed in **Interactive Data Language (IDL)**:

- **Main Program:** Automatically parses data file headers and directory structures to extract vital metadata, including wavelength, window type, and reference detector configurations.
- **Beam Mapping & Ratio Analysis:** Implemented algorithms to map beam profiles using multi-pixel arrays, calculating scaling ratios between reference detectors and GERB I₁ and I₂ output values.
- **Statistical Filtering:** Processed chopped frame data (ranging from 50 to 200+ frames per cycle) to compute robust means and standard deviations, ensuring high signal-to-noise ratios despite source variability at shorter wavelengths.

## My role

I developed the IDL software used to process, sort and analyse the calibration measurements, and used it to derive the relative spectral response curves.

## Outcomes

- Automated data pipelines for a multi-file calibration dataset.
- Relative spectral response curves for the detector's 256 pixels.

## Related work

See also the [GERB mission page at the National Centre for Earth Observation](https://www.nceo.ac.uk/our-research/missions/gerb/).
