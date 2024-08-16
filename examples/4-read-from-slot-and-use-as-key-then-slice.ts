import { EVMRequest } from '@unruggable/evmgateway';
import { setup } from '../helpers/utils.js';

async function main() {

    const INTEGER_KEY = 262;
    const IDENTIFIER = "clowes";
    const FULL_NAME = "Thomas Clowes";
    
    const { foundry, prover } = await setup();
    const C = await foundry.deploy({
        sol: `
            contract C {
                uint256 latest = ${INTEGER_KEY}; 		// Slot 0
		        mapping(uint256=>string) mappingData;  	// Slot 1
		        mapping(string=>string) realNames;      // Slot 2

		        constructor() {

			        mappingData[${INTEGER_KEY}] = "${IDENTIFIER}";
			        realNames["${IDENTIFIER}"] = "${FULL_NAME}";
		        }
            }
    `,
  });
  
    const P = await prover();

    const { needs, outputs, vOutputs } = await P.prove(
        new EVMRequest(2)
            .setTarget(C.target)
            .setSlot(0)
            .read()
            .setOutput(0) // Get the INTEGER_KEY as a value
            .pushOutput(0) //Put it back in the stack to use as a key
            .setSlot(1)
            .follow()	//Follows the read() value => INTEGER_KEY
            .readBytes()
            .setSlot(2)
            .follow()	//Follows the readBytes() value => IDENTIFIER
            .readBytes()
            .slice(0, 3)
            .setOutput(1)
    );    

    console.log("Proven outputs: ", vOutputs);
}

main().then(() => console.log('Example ran successfully!'));