---
title: "Astronomy software guide"
description: "How to choose astronomy software by task: sky maps, observation planning, satellite tracking, telescope control, image processing, data exploration and citizen science."
category: astronomy
tags: [software, planetarium, astrophotography, data, citizen-science]
pubDate: 2026-09-29
readingTime: 14
featured: false
visual: "Task-to-tool flow diagram: identify, plan, track, control, process, analyse, contribute"
relatedContent: ["/resources/stargazing/beginners-guide/", "/resources/binoculars/", "/citizen-science/", "/astrophotography/", "/night-sky/"]
sources:
  - "[source: official documentation for each named tool; verify current platform, licence, cost and features]"
  - "[source: ASCOM Initiative]"
  - "[source: INDI Library]"
  - "[source: IAU / FITS standard documentation]"
  - "[source: CelesTrak, for orbital element data]"
  - "[source: AAVSO, Zooniverse and other project sites for citizen science]"
needsVerification: true
---
<!-- Route: /resources/software/ (add a matching route or move to /journal/ until then) -->

Astronomy software can help you identify objects, plan observations, control equipment, process images and explore scientific data. The best tool depends on whether you are standing outside with a phone, planning a telescope session or analysing astrophotography.

This guide is organised by **task**, not by product. Start with what you want to do tonight, pick one tool that does it well, and add others only when a real need appears. Most people need far less software than the internet suggests.

> **Note on names, licences and costs.** Astronomy software changes quickly: versions, prices, licences and supported platforms move. Every tool named below should be checked against its official site before you rely on this page. No affiliate links are used. [placeholder: lastReviewed]

## Choose by task

| I want to... | Start with | Consider next |
|---|---|---|
| Identify what I can see | A sky map (mobile app, browser or desktop planetarium) | A planisphere for use without a screen |
| Plan an observing session | A desktop planetarium plus a weather forecast | A dedicated planning tool or observing-list export |
| Track satellites and the ISS | A satellite-pass website or app | A desktop planetarium with orbital element updates |
| Control a telescope | The software your mount already supports | ASCOM or INDI-based tools |
| Process astrophotography | A free stacking tool | A more advanced processing package |
| Explore scientific data | An online archive or sky viewer | Python tools and specialist viewers |
| Contribute to research | A citizen-science platform | Tools for specific projects |

## Sky maps and planetariums

A sky map answers the question "what am I looking at, and what else is up there?" For most beginners it is the only software they need.

- **Desktop planetarium software.** Programs such as Stellarium, KStars and Cartes du Ciel simulate the sky for any place and time. Stellarium is the most beginner-friendly of the three, while KStars and Cartes du Ciel add features useful to telescope users. Desktop tools are best for planning and for learning how the sky moves. [source: check each project's site for platforms and licences]
- **Mobile sky maps.** Phone apps use your device's sensors to show the sky where you point it. They are convenient outdoors, but sensors can be inaccurate (especially compass readings), and screens ruin dark adaptation unless there is a night mode. Look for a red-light setting and lower the brightness.
- **Browser-based planetariums.** A web version needs no installation and works on almost any device, which suits classrooms and quick checks. It usually needs an internet connection and offers fewer features than the desktop version.
- **Location and time settings.** The most common mistake is a wrong location or time. Check both, and check the time zone and daylight-saving setting, before deciding that something is missing.
- **Offline access.** If you observe from a dark site with poor mobile signal, choose software that works offline, and download what you need in advance, including catalogues and any orbital data for satellites.

## Observation planning

Planning turns "I hope to see something" into a productive evening.

- **Object visibility.** Check whether an object will be above the horizon, in a dark enough sky and clear of the Moon during your observing window.
- **Altitude and azimuth.** Altitude is how high an object is above the horizon, and azimuth is its compass direction. Objects low down are dimmer and blurrier because you look through more atmosphere. As a rough guide, aim to observe targets well above the horizon.
- **Rise and set times.** These tell you when to start and stop. Remember that times depend on your location and that the horizon may be blocked by buildings or trees.
- **Moon illumination.** The Moon's phase and position affect how well you see faint objects. A bright Moon near the target is the biggest single enemy of deep-sky observing.
- **Dark-sky planning.** Combine a light-pollution map, a cloud and transparency forecast, and the Moon's schedule. A service that forecasts cloud, such as Clear Outside, is a useful companion for this step. [source: verify current service]
- **Exporting observing lists.** Many planetariums let you build a list of targets and export it, so you can print it, load it onto a phone or send it to a telescope-control program. Keep lists short: six well-chosen targets beat thirty rushed ones.

## Satellite tracking

Watching a satellite cross the sky is one of the easiest and most rewarding beginner activities.

- **ISS passes.** The International Space Station is often the brightest moving object in the sky. Websites and apps such as NASA's Spot the Station and Heavens-Above list passes for your location. [source: verify current services]
- **Bright satellite predictions.** Some satellites brighten briefly at particular angles, and prediction tools list these for your location.
- **TLE data.** Predictions rely on orbital element sets, often called two-line elements (TLEs), published by organisations such as CelesTrak. Software converts these into predicted positions. Make sure the data is recent. [source: CelesTrak]
- **Limitations of long-range predictions.** Satellites are pushed off course by atmospheric drag and by deliberate manoeuvres, such as reboosts of the ISS. Predictions made days ahead can shift, and predictions made weeks ahead are unreliable. Check again on the day.
- **Why satellite visibility can change.** For a satellite to be visible, it needs to be lit by the Sun while you are in darkness. That is why passes cluster after dusk and before dawn. Weather, horizon obstructions and the satellite's changing orientation also change what you see. Newly launched groups of satellites can appear as a "train" and then spread out and fade as they raise their orbits.

## Telescope control

If you have a computerised telescope, software can find and track objects for you.

- **Go-to mounts.** A go-to mount points at a chosen object after you have aligned it. Many can be controlled from a computer or handset.
- **ASCOM or INDI compatibility.** ASCOM is a widely used standard for astronomy hardware on Windows. INDI is an open protocol used on Linux, macOS and other systems. Software that supports the standard your equipment uses will save you trouble. Programs that commonly support these standards include KStars with its Ekos suite, Cartes du Ciel and N.I.N.A. [source: verify each tool's supported platforms and standards]
- **Alignment.** Even the best software depends on a good alignment. Follow your mount's procedure carefully, and make sure the date, time and location are correct.
- **Remote observing.** You can control equipment from indoors or from another location. Remote setups add cables, power, network reliability and safety considerations, so start with a simple local system first.
- **Hardware compatibility.** Check that your mount, camera and focuser have drivers that work with the software and your operating system before you buy either. Compatibility problems are a more common cause of frustration than software features.

## Astrophotography processing

Processing turns a set of faint, noisy exposures into a finished image. The steps are similar across tools.

- **Calibration frames.** Dark, flat and bias frames record the camera's noise, dust shadows and vignetting so they can be removed. Taking them properly matters more than any later trick.
- **Stacking.** Combining many exposures increases signal relative to noise. Free tools such as Siril and DeepSkyStacker are popular choices; other packages are paid. For planets and the Moon, tools such as AutoStakkert! are commonly used to stack video frames. [source: verify current tools and licences]
- **Stretching.** Raw astronomical data looks dark because most signal lies in a narrow range of brightness. A non-linear stretch reveals faint detail. Over-stretching brightens noise, so work gradually.
- **Noise reduction.** Reduce noise carefully. Aggressive settings can smear real detail and produce a plastic look.
- **Colour and gradient correction.** Light pollution and the Moon create colour casts and brightness gradients across a frame. Gradient-removal tools help. Colour calibration should aim for realistic star colours unless you are deliberately using false colour.
- **Responsible image presentation.** Say how an image was made. Note whether it is a single exposure or a stack, whether colours are natural or false-colour (as in narrowband palettes), and whether tools that generate or sharpen detail were used. Do not add detail that the data does not contain, and do not present composites as single photographs. Honest captions make your work more credible, not less.

## Astronomical data

Professional astronomy shares its data openly, and much of it is available to anyone.

- **Image archives.** Archives from major observatories and missions host images and observations. The ESA and NASA archives, and the Mikulski Archive for Space Telescopes (MAST), include data from missions such as Hubble and the James Webb Space Telescope. [source: verify current archives and access]
- **Catalogue browsers.** Tools such as SIMBAD, VizieR and Aladin (from the CDS in Strasbourg) let you look up objects, overlay catalogues on sky images and compare data. [source: CDS]
- **FITS files.** FITS (Flexible Image Transport System) is the standard file format for astronomical images and tables. It stores the data plus a header describing how the data was taken and where it points. Viewers such as SAOImageDS9 and Python libraries such as Astropy can open them. [source: verify tools]
- **Planetary data.** NASA's JPL Horizons system provides positions for planets, moons, asteroids and comets. Mission archives hold images and measurements from spacecraft. [source: verify]
- **Earth-observation data.** Copernicus Sentinel data can be browsed through platforms such as the Copernicus Data Space Ecosystem and explored with tools like ESA's SNAP toolbox or QGIS. This links directly to our [Earth observation section](/earth-observation/). [source: verify]
- **Coordinate systems.** Right ascension and declination locate objects on the celestial sphere in the same way longitude and latitude do on Earth. Altitude and azimuth describe where something is from your location at a particular time. Galactic coordinates are used for objects in the Milky Way. Always check which system and reference frame (for example, J2000 or ICRS) a tool uses.

## Citizen science

Citizen science lets you contribute to real research, sometimes with nothing more than a web browser.

- **Galaxy classification.** Projects on the Zooniverse platform, such as Galaxy Zoo, ask volunteers to classify galaxy shapes. [source: verify current project status]
- **Variable stars.** The American Association of Variable Star Observers (AAVSO) collects brightness estimates from amateurs worldwide and provides guidance and tools. [source: AAVSO]
- **Exoplanet transit analysis.** Some projects analyse the small dips in a star's brightness caused by a planet passing in front of it. NASA's Exoplanet Watch is one example. [source: verify current status]
- **Solar observation.** Some projects involve counting sunspots or classifying solar images. Use only safe methods, such as online images or properly filtered equipment, and never look at the Sun directly through unfiltered optics.
- **Asteroid search.** Volunteers help find and confirm moving objects in survey images. Look for projects that provide their own image sets and instructions. [source: verify specific project]

Project availability changes. Check that a project is active before investing time in it. See our [citizen science section](/citizen-science/) for more.

## How to evaluate software

Ask these questions before you commit time, money or data to any tool:

- **Cost.** Is it free, a one-off purchase, or a subscription? Is the free version enough for your needs?
- **Licence.** "Free" can mean free to use, open source, or free with limits. Check what you may do with your images and data.
- **Platform.** Does it run on your operating system and device?
- **Open-source status.** Open-source software can be inspected, adapted and often outlives commercial products. It is not automatically better, but it is often more transparent.
- **Offline capability.** Will it work at a dark site without a signal?
- **Privacy.** What location, device or account data does it collect? Does it need an account? Read the permissions before granting them.
- **Update frequency.** Is it actively maintained? A tool that has not been updated for years may not work with current operating systems or hardware.
- **Documentation.** Good documentation and an active user community save hours.
- **Hardware compatibility.** Confirm that it supports your specific mount, camera and other devices before buying either.

## Suggested software directory entries

Use these as a starting list for the site's software collection. Each entry needs its official URL, current cost model and platforms checked before publication. [placeholder: officialUrl, lastReviewed]

| Name | Category | Typically used for |
|---|---|---|
| Stellarium | Planetarium software | Sky maps, planning, teaching |
| KStars / Ekos | Planetarium, telescope control | Planning and INDI-based equipment control |
| Cartes du Ciel | Planetarium, telescope control | Charts and ASCOM-based control |
| N.I.N.A. | Imaging and telescope control | Capture automation with ASCOM equipment |
| Siril | Image stacking and processing | Astrophotography |
| DeepSkyStacker | Image stacking | Astrophotography stacking |
| AutoStakkert! | Planetary stacking | Moon and planet imaging |
| SAOImageDS9 | Astronomy data | Viewing FITS files |
| Aladin | Astronomy data | Sky images and catalogues |
| Astropy | Astronomy data | Python analysis of astronomical data |
| Heavens-Above / Spot the Station | Satellite tracking | ISS and satellite passes |
| Zooniverse | Citizen science | Classification projects |

## Where to go next

If you are just starting, install one sky map, learn to set the right location and time, and go outside with our [beginner's guide to stargazing](/resources/stargazing/beginners-guide/). If you want to see more without a telescope, read [choosing binoculars for astronomy](/resources/binoculars/). If you are curious about imaging, explore [astrophotography](/astrophotography/).

---

*Draft note: tool names, platforms, licences, costs and project statuses change and must be verified against official sources before publication. No URLs, prices or reviews are included. Add an affiliate disclosure if commercial links are added later.*
