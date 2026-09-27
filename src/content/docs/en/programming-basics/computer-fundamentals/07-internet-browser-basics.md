---
title: "The internet, browser, and address"
description: "Open a website, distinguish its address from searching for it, and recognize that a local file is not a published website."
sidebar:
  order: 12
prev: {"link":"/en/programming-basics/computer-fundamentals/06-operating-systems/","label":"The operating system, programs, and files"}
next: false
---

Open a website, distinguish its address from searching for it, and recognize that a local file is not a published website.

## A short journey for the first step

Enter an address; the browser finds the site, requests its page, receives data, and displays it. A **request** asks for a resource; a **response** returns data or a reason it could not be provided. A **server** is a program answering requests.

Focus on entering the address and observing the result. Address lookup and transport mechanisms are studied in networking; memorizing their names is unnecessary for this experiment.

## Everyday terms

A network connects devices to exchange data. The internet connects many networks. Wi-Fi is a wireless connection to a nearby network; being connected to Wi-Fi does not guarantee internet access. A router connects your network with other networks according to the connection setup.

A browser such as Edge or Firefox displays pages. A website contains pages and resources. A search engine helps find websites; it is not the browser, even if shown on the browser’s opening page. The web is one internet service; email and other services also use the internet.

## Enter a known address

Open the browser, click the address bar, type `https://example.com`, and press Enter. This is a URL (Uniform Resource Locator, an address identifying a resource and how to access it) identifying a resource: `example.com` is the site name and `https` indicates encrypted communication. This example site requires no sign-in.

The browser acts as a client requesting a resource, while a server receives the request and responds with data. You do not yet need detailed DNS (Domain Name System, a distributed system answering queries about domain names), TCP (Transmission Control Protocol, ordered byte transport with loss recovery; connections can still fail), or certificate knowledge; understand the request/response idea and that the browser displays the result.

Typing words instead of an address may run a search. Check the resulting address before downloading or signing in. Encryption does not guarantee an honest website owner. Do not bypass a certificate warning to finish an exercise; stop and check the address, time, and connection.

## Local file versus internet site

Soon you will open `hello.html` from your folder. Its address may start with `file:///`: it is on your device, not automatically published to others. Opening a file and uploading it to an internet-accessible server are different actions. Saved introductory examples run locally without a PHP (a programming language commonly used for server-side web processing) server.

**Worked exercise:** Wi-Fi shows connected but one site does not open. Is the whole computer broken? No. Try another known site and check the address; the problem may be that site or external connectivity. Do not randomly change router settings.
