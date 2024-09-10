import { EthProver, GatewayRequest } from '@unruggable/gateways';
import { Foundry } from '@adraffy/blocksmith';
import { Contract, JsonRpcProvider, hexlify, randomBytes } from 'ethers';
import * as dotenv from 'dotenv'
dotenv.config()

//Setup for initalizing Foundry, deploying our basic verifier contract (to test against), and creating a prover function to interface with the verifier
export const setup = async () => {

  const foundry = await Foundry.launch({
    infoLog: false,
  });

  const abi = [
    "function verify((bytes,bytes[]),bytes32,bytes[],bytes) view returns (bytes[] outputs,uint8 exitCode)"
  ];

  //Verify against a real verifier contract deployed to mainnet
  const VERIFIER_ADDRESS = "0xf2f22404ad245e909173189bd3b35e5f153548ff";

  if (!process.env.MAINNET_PROVIDER_URL) {
    throw new Error("MAINNET_PROVIDER_URL is not set in .env file");
  }

  const p = new JsonRpcProvider(process.env.MAINNET_PROVIDER_URL);
  const verifier = new Contract(VERIFIER_ADDRESS, abi, p);

  return {
    foundry,
    verifier,
    async prover() {
      // create an snapshot to prove against
      // can be invoked multiple times to observe changes
      const prover = await EthProver.latest(foundry.provider);
      const stateRoot = await prover.fetchStateRoot();
      return {
        prover,
        stateRoot,
        async prove(req: GatewayRequest) {
          const vm = await this.prover.evalRequest(req);

          const { needs } = vm;
          const outputs = await vm.resolveOutputs();

          //console.log("needs", needs);

          const { proofs, order } = await this.prover.prove(needs);

          // console.log('ops', req.ops);
          // console.log('inputs', req.inputs);
          // console.log('outputs', values);

          const verificationResponse = await verifier.verify(
            [Uint8Array.from(req.ops), req.inputs],
            stateRoot,
            proofs,
            order
          );

          const vOutputs = verificationResponse.outputs.toArray();

          //console.log("vOutputs", vOutputs);
          
          return { needs, outputs, vOutputs, ...vm };
        },
      };
    },
  };
}

export const randomL = (length) => {
  return hexlify(randomBytes(length));
} 