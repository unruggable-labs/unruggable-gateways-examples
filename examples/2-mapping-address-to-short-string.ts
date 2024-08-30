import { EVMRequest } from '@unruggable/evmgateway';
import { setup } from '../helpers/utils.js';

async function main() {

  const { foundry, prover } = await setup();
  const ADDRESS_TO_USE = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
  const C = await foundry.deploy({
    sol: `
      contract C {
        mapping(address=>string) mappedData;
        constructor() {
            address addr = ${ADDRESS_TO_USE};
            mappedData[addr] = "Hello";
        }
    }
    `,
  });
  
  const P = await prover();
  const { vOutputs } = await P.prove(
    new EVMRequest(1)
      .setTarget(C.target)
      .setSlot(0)
      .push(ADDRESS_TO_USE)
      .follow()
      .read()
      .setOutput(0)
  );    

  //The string bytes are left aligned in the slot
  console.log("Proven outputs: ", vOutputs);

  /*
  Proven outputs:  [
    '0x48656c6c6f00000000000000000000000000000000000000000000000000000a'
  ]
  
  As this is a short string, the last byte is (the length of the string * 2), the rest is the string itself stored in the higher-order bytes (left aligned)

  0x0a = 10 = length of "Hello" * 2
  */

  foundry.shutdown();
}

main().then(() => console.log('Example ran successfully!'));