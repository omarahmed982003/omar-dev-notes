---
title: "Connect to Wi-Fi and diagnose problems"
description: "Distinguish local connection from internet access and understand network names, access points, signal, security, and diagnosis."
sidebar:
  order: 4
prev: {"link":"/en/programming-basics/28-lan-segmentation/","label":"Segment networks and prevent frame loops"}
next: {"link":"/en/programming-basics/15-addressing-dhcp-nat-routing-ipv6/","label":"Device addresses and connection settings"}
---

A phone shows Wi-Fi, yet a website will not open. Is the failure in the phone, the home network, or its internet connection? Separate the stages before changing settings. First read about the [local network](/en/programming-basics/14-network-layers-lan-ethernet-arp/), the nearby devices communicating within a place such as a home.

## Roles inside the home

**Wi-Fi** provides a wireless local-network connection using radio waves; it is not a technical acronym you need to expand. An **access point** is the component a wireless device joins to enter the local network. A **router** forwards data between your network and other networks. One box may perform both roles.

A **modem** connects to a provider's particular access line, such as telephone or cable, converting the relevant signals. Fiber connections may use an **ONT, Optical Network Terminal**. Homes do not all use identical equipment or role boundaries; one device can combine several functions.

```text
Phone --Wi-Fi--> Access point --local network--> Router --> Provider --> Internet
```

Each arrow is part of the path. A strong first connection does not establish that the rest work. Local file sharing can work while the internet link is down. Likewise, a wired **Ethernet** connection alone does not guarantee internet access.

## Network name and connection

The **SSID, Service Set Identifier**, is the network name shown in the Wi-Fi list, such as `Home-Learning`. A name does not prove ownership: different networks can advertise the same one. Use an authorized network and obtain its name and password from its owner.

On Windows, open the network list from the taskbar or network settings, choose the name, connect, and enter the password. Labels vary by release. Do not include passwords in diagnostic reports or screenshots.

Hotel and airport networks may use a **captive portal**, a page requiring acceptance or sign-in before providing internet access. Joining Wi-Fi does not complete that step. Use the system's network sign-in notification if shown, and verify that you joined the venue's actual network.

## Signal strength and speed differ


Wi-Fi uses frequency bands including 2.4, 5, and 6 **GHz**, gigahertz; one gigahertz is one billion cycles per second. This describes the radio wave, not a file-download rate, and 5 GHz is not the same thing as cellular 5G.

The 2.4 GHz band often reaches farther through obstacles. With suitable equipment and conditions, 5 and 6 GHz may offer more capacity nearby. Walls, placement, interference, and device capabilities affect the result; the frequency number alone does not decide performance.

A **channel** is a portion of a frequency band used by a network. Nearby networks and other devices can share airtime or interfere, increasing waiting and retries. Signal bars estimate reception strength; they do not independently measure congestion or your internet subscription's speed.

A range extender relays the connection. If its link to the main access point is weak, standing close to the extender does not repair that weak segment. Compare placements before changing or buying equipment.

## Protecting the connection

**WPA, Wi-Fi Protected Access**, names a family of wireless security mechanisms. WPA2 and WPA3 are versions. Use a modern mode supported by your devices, such as WPA3-Personal or WPA2/WPA3 compatibility when needed. Do not treat an unprotected open network as suitable protection for sensitive data.

The Wi-Fi password controls network admission; the router's administration password permits configuration changes. They serve different purposes. Change default administration credentials and follow manufacturer updates. A **guest network** may isolate visitors from your devices depending on its settings; verify isolation rather than assuming the name establishes it.

Wi-Fi protection concerns the local wireless link. **HTTPS** protects the web connection between browser and site; a later lesson explains it. Neither replaces the other or guarantees that a site's owner is honest.

## Diagnose by comparison

| Observation | Next check and reason |
|---|---|
| Network name is missing | Check Wi-Fi, airplane mode, distance, and device band support |
| Name is visible but password is rejected | Verify the selected network, password, and letter case |
| Works nearby but fails farther away | Compare the same device and test near the access point to investigate coverage |
| All devices join Wi-Fi but cannot reach the internet | Check the provider link; this is not limited to one client |
| Only one device fails in the same location | Investigate that device; comparison narrows possibilities without proving a cause |
| One site fails while others work | Investigate the site or its name resolution; general connectivity may be healthy |

**Worked experiment:** open the same page on the same phone near the router and then in a distant room. If only the distant case fails, investigate coverage first. If two nearby devices cannot reach any site, investigate the internet path. Do not begin with a factory reset: it erases configuration and may require provider credentials to restore service.

The [next addressing lesson](/en/programming-basics/15-addressing-dhcp-nat-routing-ipv6/) explains addresses and gateways, followed by tools for distinguishing connection stages. The goal here is to choose the next test and avoid confusing a Wi-Fi icon with working end-to-end internet access.

References: [Windows Wi-Fi diagnosis](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-wi-fi-connection-issues-in-windows), [Router and access-point settings](https://support.apple.com/en-us/102766).

## Record a comparison

Use the same page at similar times and change one factor at a time. These are blank observations, not invented results:

| Trial | Device | Position | Network name | Shown signal | New page load | Notes |
|---|---|---|---|---|---|---|
|1|First|Near|…|…|Success/failure and duration|…|
|2|First|Far|…|…|…|…|
|3|Second|Near|…|…|…|…|

Near success/far failure on one device suggests investigating coverage/interference. Both failing nearby with strong signals suggests checking beyond the access point. Repeat before treating one observation as proof.
