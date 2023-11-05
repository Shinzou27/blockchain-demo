import { Blockchain } from "./blockchain";

const diff = Number(process.argv[2]) || 4;
const blockchain = new Blockchain(diff);

const blockNumbers = Number(process.argv[3]) || 10
let chain = blockchain.chain;
let begin = +new Date();
for(let i = 1; i <= blockNumbers; i++) {
  const block = blockchain.createBlock(`Bloco ${i}`);
  const mineInfo = blockchain.mineBlock(block);
  chain = blockchain.sendBlock(mineInfo.minedBlock);

}
let end = +new Date();
console.log('BLOCKCHAIN');
console.log(chain);
console.log(`${blockNumbers} blocos minerados em ${(end - begin)/1000} segundos.`);

