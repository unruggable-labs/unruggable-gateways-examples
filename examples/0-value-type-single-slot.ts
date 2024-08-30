import { EVMRequest } from '@unruggable/evmgateway';
import { setup, randomL } from '../helpers/utils.js';

async function main() {

  const VALUE = randomL(32);
  const { foundry, prover } = await setup();
  const C = await foundry.deploy({
    sol: `
      contract C {
        uint256 slot0 = ${VALUE};
      }
    `,
  });
  
  const P = await prover();
  const { vOutputs } = await P.prove(
    new EVMRequest(1)
      .setTarget(C.target)
      .setSlot(0)
      .read()
      .setOutput(0)
  );    

  console.log("Proven outputs: ", vOutputs);

  foundry.shutdown();
}

main().then(() => console.log('Example ran successfully!'));