import { GatewayRequest } from '@unruggable/gateways';
import { setup } from '../helpers/utils.js';
import { toUtf8String } from 'ethers';


async function main() {

  const { foundry, prover } = await setup();
  const LONG_STRING_TO_USE = "Hello World. We hope this example is helpful. Love from the Unruggable Team.";
  const STRING_KEY_TO_USE = LONG_STRING_TO_USE;

  const C = await foundry.deploy({
    sol: `
      contract C {
        mapping(string=>string) mappedData;
        constructor() {
            mappedData["${STRING_KEY_TO_USE}"] = "${LONG_STRING_TO_USE}";
        }
    }
    `,
  });
  
  const P = await prover();
  const { vOutputs } = await P.prove(
    new GatewayRequest(1)
      .setTarget(C.target)
      .setSlot(0)
      .pushStr(STRING_KEY_TO_USE)
      .follow()
      .readBytes() //If you used read() here, you would get the string length, not the value - the main slot of bytes/string stores ((length * 2) + 1) right aligned.
      .setOutput(0)
  );    

  //The string bytes are left aligned in the slot
  console.log("Proven outputs: ", vOutputs);

  console.log("String: ", toUtf8String(vOutputs[0]));

  foundry.shutdown();
}

main().then(() => console.log('Example ran successfully!'));