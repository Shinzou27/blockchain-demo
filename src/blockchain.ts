import { createHash } from 'crypto'
import { authHash, hash } from './helpers'
export interface Block {
    header: {
        nonce: number,
        blockHash: string
    }
    payload: {
        sequence: number,
        timestamp: number,
        data: any,
        prevHash: string
    }
}

export class Blockchain {
    #chain: Block[] = [];
    private powPrefix = '0';

    constructor(private readonly diff: number = 4) {
        this.#chain.push(this.createGenesisBlock());
    }
    private createGenesisBlock(): Block {
        const payload = {
            sequence: 0,
            timestamp: +new Date(),
            data: 'Bloco inicial',
            prevHash: ''
        }
        return {
            header: {
                nonce: 0,
                blockHash: hash(JSON.stringify(payload))
            },
            payload
        }
    }
    get chain(): any {
        return this.#chain;
    }
    private get lastBlock(): Block {
        return this.#chain.at(-1) as Block
    }
    private lastBlockHash(): string {
        return this.lastBlock.header.blockHash;
    }
    createBlock(data: any): Block['payload'] {
        const newBlock: Block['payload'] = {
            sequence: this.lastBlock.payload.sequence + 1,
            timestamp: +new Date(),
            data: data,
            prevHash: this.lastBlockHash()
        }
        console.log(`Bloco #${newBlock.sequence} criado: ${JSON.stringify(newBlock)}`);
        return newBlock
    }
    mineBlock(block: Block['payload']) {
        let nonce = 0;
        let begin = +new Date();
        while (true) {
            const blockHash: string = hash(JSON.stringify(block));
            const powHash: string = hash(blockHash + nonce);
            if (authHash({ hash: powHash, diff: this.diff, prefix: this.powPrefix })) {
                const end = +new Date();
                const redHash = blockHash.slice(0, 12);
                const mineTime = (end - begin) / 1000;

                console.log(`Bloco #${block.sequence} minerado em ${mineTime} segundos.
            Hash ${redHash} (${nonce} tentativas).`);

                return {
                    minedBlock: {
                        header: {
                            nonce,
                            blockHash
                        },
                        payload: { ...block }
                    }
                }
            }
            nonce++;
        }
    }
    authBlock(block: Block): boolean {
        if(block.payload.prevHash !== this.lastBlockHash()) {
            console.error(`Bloco #${block.payload.sequence} inválido: o hash anterior é ${this.lastBlockHash().slice(0, 12)}, e não ${block.payload.prevHash.slice(0, 12)}`);
            return false;
        }
        const testHash = hash(hash(JSON.stringify(block.payload)) + block.header.nonce);
        if(!authHash({hash: testHash, diff: this.diff, prefix: this.powPrefix})) {
            console.error(`Bloco #${block.payload.sequence} inválido: o nonce ${block.header.nonce} é inválido e não pode ser verificado.`);
            return false;
        }
        return true;
    }
    sendBlock(block: Block): Block[] {
        if(this.authBlock(block)) {
            this.#chain.push(block);
            console.log(`Bloco #${block.payload.sequence} foi adicionado à blockchain: ${JSON.stringify(block, null, 2)}`);
        }
        return this.#chain;
    }
}