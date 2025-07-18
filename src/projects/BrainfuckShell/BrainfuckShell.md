---
date: "2021-05-10"
title: "Brainf*ck Shell"
description: "Brainf*ck Shell: Interpret your commands as brainf*ck because you most definitely want that"
tags: ["Software", "Brainf*ck"]
---
<script lang="ts">
    import MarkdownLink from "$md/MarkdownLink.svelte";
</script>

### Brainf*ck Shell: Interpret your commands as brainfuck because you most definitely want that.

[![Get it from the Snap Store:small](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/brainfuck-shell)
<MarkdownLink href="https://github.com/Fallstop/brainfuck-shell">Fallstop/brainfuck-shell</MarkdownLink>


A new type of shell based off [nu-shell](https://github.com/nushell/nushell) that takes your commands in brainf*ck.

## Example:

```
> """
+++++ ++++[ ->+++ +++++ +<]>+ +++++ +++++ +++++ ++.<+ ++[-> +++<] >+++.
+++++ +++.- ---.< ++++[ ->--- -<]>- -.<++ ++[-> ++++< ]>+++ +++++ .<+++
+++++ +[->- ----- ---<] >---- ----. <++++ +++++ [->++ +++++ ++<]> +++++
+.<++ +[->- --<]> ----- -.<++ ++[-> ++++< ]>+.< """

Executing: cowsay why
 _____ 
< why >
 ----- 
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\\/
                ||----w |
                ||     ||
```

## Learning more

Other than the brainf*ck part, the rest of this is just forked from [nu-shell](https://github.com/nushell/nushell), so send love over there and find more about configuration commands for the shell.

## About the interpreter

The interpreter is a bit unusual, as it is 128bit, but overwise it is pretty standard.

## Installation

### Snap

The easiest way is to install via snap on linux distributions:

```bash
snap install brainfuck-shell
```

### From Source

Snap does not support allot of platforms, so you can install from source as well pretty easily:

You need make sure you have installed [rustup](https://rustup.rs/) and the latest stable compiler via `rustup install stable`):

To build Brainf*ck-Shell, you will need to use the **latest stable (1.47 or later)** version of the compiler.

Required dependencies:

-   pkg-config and libssl (only needed on Linux)
    -   On Debian/Ubuntu: `apt install pkg-config libssl-dev`

Optional dependencies:

-   To use Brainf*ck-Shell with all possible optional features enabled, you'll also need the following:
    -   On Linux (on Debian/Ubuntu): `apt install libxcb-composite0-dev libx11-dev`

And clone the repository,


```
git clone https://github.com/Fallstop/brainfuck-shell.git
cd brainfuck-shell
```
Then compile and install using cargo:

```bash
cargo install --path .
```
