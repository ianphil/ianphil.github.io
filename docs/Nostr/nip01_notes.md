---
layout: default
title: NIP01 Notes
permalink: /nostr/nip01-notes
parent: Nostr
---

# NIP-01 Notes

## I'm not smart, but I do read

I'm persistent so let's see if I can pull all this off. It's a lot to put together and make something that is actually enterprise ready... YOu could run as a service. Well that's time, persistence, and learning. Let's see where it goes. 

## Thoughts 01

I've been messing around with a lot of tech choices for NIP-01. Reading a lot of different thinking about how to implement everything from web sockets, to how to generate signatures. It's been pretty fun digging into stuff I've not messed with in years, and stuff I've never heard about like Schnorr Signatures, or Proof of Work. At this point I've gone through all of the NIPs. I've skimmed over the GitHub issues and PRs. I've looked at a lot of the work that has been done in the community. I've joined the telegram community, I hop on the reddit channel. I'm not a huge fan of reddit, but some of the conversation happens there.

As for the work I've done... I've started like 10 different projects messing around with different elements of NIPS-01. It's funny that they say you can build this in a weekend. While I don't think they are wrong... there are a lot of choices that need to be made for architecture and design patterns. Yes, I also over think most things... I typically make them harder than they need to be and I'm a stickler around writing clean maintainable code. So I've spent the last month thinking about Nostr, the way it should work and I still don't think I'm right. I've probably been an engineering manager too long.

## Schema Validation

I wanted to validate that the schema is validated. This doesn't mean I've verified the signatures or keys have been computed correctly. That is for my unit tests.

## Validating Computation of Signatures, Encoding, and Signatures

## Verifying Sigs using other code

I want to insure that my events work with other relays. So... I'll steal code from others as my tests. This is contract based development making sure that what I write works with my upstream and/or downstream partners.

## Websockets, and a decent pattern

## Orleans and chat apps

Some cool work has already been done here. Let's see if I can make it better and make a Nostr relay that walks all over what is out there.

## UI... I don't really care

There needs to be a compelling UI. In this sense I care, making fancy web pages... Nope. Can I sure. Have I yes... Will I? NOPE. But a command line client. This sounds interesting. Making a CommandLine UI is next level. I've used Pine, VI, VIM, blah blah blah. I've writtin code in cobra/viper in Go... I've been exploring `System.Commandline`. Welp This is the route I'm going. I think we can do some cool work here.

