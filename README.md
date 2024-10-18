<p align="center">
    <img src="./unruggable-logo-black.png" style = "width:300px;" alt = "Unruggable Gateways" />
</p>

# Gateway examples

![Gateway Examples](https://github.com/unruggable-labs/unruggable-gateways-examples/actions/workflows/examples.yml/badge.svg)

This repository contains a number of examples that utilise our [@unruggable/gateways](https://www.npmjs.com/package/@unruggable/gateways) package to demonstrate the functionality of our gateway codebase.

We recommend interested users take a look through our extensive [Gateway documentation](https://gateway-docs.unruggable.com) to supplement the code within this repo.

## Prerequisites

Before running the examples you must clone the repo:

```bash
git clone https://github.com/unruggable-labs/unruggable-gateways-examples.git
``` 

install the dependencies using:

 ```bash
 bun install
 ```

and set `SEPOLIA_PROVIDER_URL` in `.env`:

```bash
SEPOLIA_PROVIDER_URL=https://eth.public-rpc.com
```

## Running the examples

You can run an example using the following syntax:

```bash
bun run examples/EXAMPLE_FILENAME.ts
```

For example:

```bash
bun run examples/6-keccak-of-concat-as-key-with-debug.ts
```

## Troubleshooting

These examples use a verifier deployed on Ethereum Sepolia. We utilse a public RPC defined in `.env`.

If there are RPC issues you can set up a free account at a service like [Alchemy](https://www.alchemy.com/), [Ankr](https://www.ankr.com/), or [Infura](https://www.infura.io/) and set the `SEPOLIA_PROVIDER_URL` variable in `.env`.