import { EVMRequest } from '@unruggable/evmgateway';
import { setup } from '../helpers/utils.js';
import { toUtf8String } from 'ethers';

async function main() {

    const ORDERED_NESTED_KEYS = [
        "a",
        "b",
    ];
    
    const { foundry, prover } = await setup();
    const C = await foundry.deploy({
        sol: `
            contract C {
                struct Node {
                    uint256 num;
                    string str;
                    mapping(bytes => Node) map;
                }
                Node root; // Slots 0-2

                constructor() {
                    root.num = 1;
                    root.str = "raffy";
                    root.map["a"].num = 2;
                    root.map["a"].str = "chonk";
                    root.map["a"].map["b"].num = 3;
                    root.map["a"].map["b"].str = "eth";
                }
            }
    `,
  });
  
    const P = await prover();

    const request = new EVMRequest(1)
        .setTarget(C.target)
        .setSlot(0);
        
    for (let i = 0; i < ORDERED_NESTED_KEYS.length; i++) {
        request
            .offset(2) //Goes to the map slot of the struct
            .pushStr(ORDERED_NESTED_KEYS[i])
            .follow();
    }

    request
        .offset(1)
        .readBytes()
        .setOutput(0);

    const { needs, outputs, vOutputs } = await P.prove(
        request
    );    

    console.log("Proven outputs: ", vOutputs);

    console.log("String: ", toUtf8String(vOutputs[0]));
}

main().then(() => console.log('Example ran successfully!'));