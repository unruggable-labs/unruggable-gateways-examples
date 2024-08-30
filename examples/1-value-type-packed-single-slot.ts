import { EVMRequest } from '@unruggable/evmgateway';
import { setup, randomL } from '../helpers/utils.js';

async function main() {

    const VALUE1 = randomL(16);
    const VALUE2 = randomL(16);
    
    const { foundry, prover } = await setup();
  const C = await foundry.deploy({
    sol: `
      contract C {
        uint128 slot0a = ${VALUE1};
        uint128 slot0b = ${VALUE2};
      }
    `,
  });
  
  const P = await prover();
  const { needs, outputs, vOutputs } = await P.prove(
    new EVMRequest(2)
        .setTarget(C.target)
        .setSlot(0)
        .read()
        .slice(16, 16) //Note that VALUE1 is stored in the last 16 bytes of the slot - lower order alignment
        .setOutput(0)
        .read()
        .slice(0, 16)
        .setOutput(1)
  );    

    //console.log("VALUE1: ", VALUE1);
    //console.log("VALUE2: ", VALUE2);

    //console.log("needs: ", needs);
    /*
    needs:  [
        [ '0x3ede3eca2a72b3aecc820e955b36f38437d01395', false ],
        [ '0x3ede3eca2a72b3aecc820e955b36f38437d01395', 0n ],
        [ '0x3ede3eca2a72b3aecc820e955b36f38437d01395', 0n ]
    ]
    
    Slot 0 is needed twice, once for each uint128 value but the prover deduplicates requests to eth_getProof
    */

    console.log("Proven outputs: ", vOutputs);

    foundry.shutdown();
}

main().then(() => console.log('Example ran successfully!'));