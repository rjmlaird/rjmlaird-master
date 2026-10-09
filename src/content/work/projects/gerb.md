---
id: 41
slug: gerb
title: Calibration of Geostationary Earth Radiation Budget (GERB) FPA
type: featured
status: completed
description: Comprehensive analysis of calibration data from the Geostationary Earth Radiation Budget (GERB) Focal Plane Assembly (FPA) using IDL to derive relative spectral response curves.
startDate: 2008-07-01
tools_tech:
  - IDL
  - Spectral Analysis
  - Data Processing
tags:
  - MSG
  - EUMETSAT
  - NCEO
  - Earth Observation
links:
  web: https://www.nceo.ac.uk/our-research/missions/gerb/
impact:
  summary: Developed specialized IDL software routines and automated data pipelines to process, sort, and analyze calibration measurements for GERB's 256-element detector array.
client: National Centre for Earth Observation / University of Leicester
heroImage: /images/projects/gerb.jpg
heroAlt: "GERB aboard MSG"
imageCredit: NCEO
relatedExperience: ["exp-uol-gerb"]
---

## Overview

The **Geostationary Earth Radiation Budget (GERB)** instrument provides dedicated, high-resolution measurements of the Earth's Radiation Budget (ERB) from geostationary orbit. Developed with funding from ESA and NERC, and supported by EUMETSAT, GERB measures the balance between incoming solar shortwave (SW) radiation ($\text{< 4 }\mu\text{m}$) and outgoing longwave (LW) radiation ($\text{>= 4 }\mu\text{m}$).

This project focused on analyzing calibration data from the GERB **Focal Plane Assembly (FPA)** at the Leicester Spectral Calibration Facility (LSCF). The primary objective was to establish reliable relative spectral response curves across all 256 pixels of the detector array spanning a wavelength range of $0.33\text{ }\mu\text{m}$ to $20.0\text{ }\mu\text{m}$.

---

## Instrument & Calibration Setup

* **Focal Plane Assembly (FPA):** Features a 256-element thermoelectric linear array operating at approximately $300\text{ K}$, supported by four Application-Specific Integrated Circuits (ASICs). Each pixel ($55 \times 45\text{ }\mu\text{m}$) is coated with gold-black to optimize spectral response.
* **Radiation Sources:** Utilized Quartz Tungsten Halogen (QTH) filament lamps for shortwave measurements ($0.3\text{ to }4\text{ }\mu\text{m}$) and heated ceramic sources for infrared measurements ($4\text{ to }20\text{ }\mu\text{m}$).
* **Reference Detectors:** Calibrated against National Physical Laboratory (NPL) standards using silicon photodiodes for visible wavelengths and platinum-black coated pyroelectric crystals for infrared wavelengths.
* **Vacuum Chamber Environment:** The detector was housed in a vacuum chamber ($\text{< }10^{-4}\text{ mbar}$) with $\text{CaF}_2$ and $\text{ZnSe}$ windows to facilitate precise beam illumination.

---

## Software & Data Processing

To handle complex multi-file calibration datasets, a custom software suite was developed in **Interactive Data Language (IDL)**:

* **Main Program:** Automatically parses data file headers and directory structures to extract vital metadata, including wavelength, window type, and reference detector configurations.
* **Beam Mapping & Ratio Analysis:** Implemented algorithms to map beam profiles using multi-pixel arrays, calculating scaling ratios between reference detectors and GERB $I_1$ and $I_2$ output values.
* **Statistical Filtering:** Processed chopped frame data (ranging from 50 to 200+ frames per cycle) to compute robust means and standard deviations, ensuring high signal-to-noise ratios despite source variability at shorter wavelengths.