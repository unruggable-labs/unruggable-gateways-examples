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
    "function verify((bytes ops) req, bytes32 stateRoot, bytes[] proofs, bytes order) view returns (bytes[] outputs, uint8 exitCode)"
  ];

  //Verify against a real verifier contract deployed to Sepolia
  //https://sepolia.etherscan.io/address/0xBAb69B0B5241c0be99282d531b9c53d7c966864F#code
  const VERIFIER_ADDRESS = "0xBAb69B0B5241c0be99282d531b9c53d7c966864F";

  if (!process.env.SEPOLIA_PROVIDER_URL) {
    throw new Error("SEPOLIA_PROVIDER_URL is not set in .env file");
  }

  const p = new JsonRpcProvider(process.env.SEPOLIA_PROVIDER_URL);
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
          const vm = await prover.evalRequest(req);

          const proofSeq = await prover.prove(vm.needs);
          const outputs = await vm.resolveOutputs();

          const verificationResponse = await verifier.verify(
            req.toTuple(),
            stateRoot,
            proofSeq.proofs,
            proofSeq.order
          );

          const vOutputs = verificationResponse.outputs.toArray();
          
          return { outputs, vOutputs, ...vm };
        },
      };
    },
  };
}

export const randomL = (length) => {
  return hexlify(randomBytes(length));
} 