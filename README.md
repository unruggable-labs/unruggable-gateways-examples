<p align="center">
    <img src="./unruggable-logo-black.png" style = "width:300px;" alt = "Unruggable Gateways" />
</p>

# Gateway examples

This repository contains a number of examples that utilise our [@unruggable/evmgateway](https://www.npmjs.com/package/@unruggable/evmgateway) package to demonstrate the functionality of our gateway codebase.

We recommend interested users take a look through our extensive [Gateway documentation](https://gateway-docs.unruggable.com) to supplement the code within this repo.

## Prerequisites

Before running the examples you must clone the repo:

`git clone https://github.com/unruggable-labs/gateway-examples.git` 

and install the dependencies using:

 `bun install`.

## Running the examples

You can run an example using the following syntax:

`bun tsx examples/EXAMPLE_FILENAME.ts`

For example:

`bun tsx examples/6-keccak-of-concat-as-key-with-debug.ts`

## Troubleshooting

These examples use a verifier deployed on Ethereum Mainnet. We utilse a public RPC defined in `.env`.

If there are RPC issues you can set up a free account at a service like [Alchemy](https://www.alchemy.com/), [Ankr](https://www.ankr.com/), or [Infura](https://www.infura.io/) and set the `MAINNET_PROVIDER_URL` variable in `.env`.