/**
 * Note: clowes.eth 15/08/24
 * I was writing this example and it wasn't working.
 * Fortunately the Typescript VM has debugging functionality (thanks Raffy !)
 * So now this example also demonstrates how to debug your requests.
 */

import { GatewayRequest } from '@unruggable/gateways';
import { setup } from '../helpers/utils.js';
import { toUtf8String } from 'ethers';

async function main() {

    const WE_ARE = "Unruggable"; //0x556e7275676761626c65
    const A_NUMBER = 262; //0x106
    const ANSWER = "Woo !";

  const { foundry, prover } = await setup();
  const C = await foundry.deploy({
    sol: `
      contract C {
            string weAre = "${WE_ARE}"; //Slot 0
            uint128 aNumber = ${A_NUMBER}; //Slot 1
            uint256 theKey; // Slot 2
        	mapping(uint256=>string) mappedData; // Slot 3

            constructor() {
                theKey = uint256(keccak256(abi.encodePacked(weAre, aNumber)));
                mappedData[theKey] = "${ANSWER}";
            }
      }
    `,
  });
  
    const P = await prover();
    const request = new GatewayRequest(4)
        .setTarget(C.target)
        .setSlot(0)
        .readBytes() // Read ${WE_ARE}
        .setSlot(1)
        .read() // Read ${A_NUMBER}
        .slice(16, 16)

        // Due to ordering of definitions in the contract the uint128 takes up the right most 16 bytes of the slot.

        //.debug() // To discern this, I used the debug() function to see the vm state

        // Previously I was concat() ing to get 0x556e7275676761626c650000000000000000000000000000000000000000000000000000000000000106 rather than the packed 0x556e7275676761626c6500000000000000000000000000000106
        
        .concat()
        .setOutput(0) // Set the concatenated value as output 0
        .pushOutput(0) // Push it back onto the stack to use
        .keccak() // Keccak hash it 
        .setOutput(1) //Set the keccak hash as output 1 (for debugging)
        .setSlot(2) //Move to the mapping slot. We could also use offset(1) here
        .read()
        .setOutput(2)

    /*
    // I discerned that the below keccak hash was the one being used as the key by storing theKey in the constructor and saving it as an output (above)
    // To debug we can add the keccak key directly as an input
    // And push it onto the stack to be followed

    const inputId = request.addInput("0x9f55ce0184cd022a6727e8085f68ef730dc7ad02a1f387117c98eb1093be5f94");

    //console.log("Input ID: ", inputId);
    */


    request
        .pushOutput(2) // Push the keccak hash output back onto the stack
        //.pushInput(inputId) //Alternative - use input directly.See comment block above
        .setSlot(3)
        .follow()
        .readBytes()
        .setOutput(3);

    const { vOutputs } = await P.prove(
        request
    );    

    console.log("Proven outputs: ", vOutputs);

    console.log("String: ", toUtf8String(vOutputs[3]));

    foundry.shutdown();
}

main().then(() => console.log('Example ran successfully!'));