---
layout: post
title:  "Create a GIF of your terminal using Asciinema"
date:   2019-05-22 09:23:10 -0500
categories: shell gif
---
Want a gif of your terminal? Run these commands

``` bash
asciinema rec filename.cast
# Do your thing
exit
docker run --rm -v $PWD:/data asciinema/asciicast2gif filename.cast filename.gif
```

[asciinema Getting Started](https://asciinema.org/docs/getting-started)

[asciicast2gif](https://github.com/asciinema/asciicast2gif)
