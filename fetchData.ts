import { program } from 'commander';

import bar from './queries';

const fs = require('fs');

type BarList = {address: string, xSushi: number}[];
type DistributionList = {address: string, amount: string}[];

program
    .requiredOption('-b, --block <number>')
    .requiredOption('-d, --distribute <number>')
    .option('-l, --limit <number>')

program.parse(process.argv);

const block: number = Number(program.block);
const toDistribute: number = Number(program.distribute)
const amountToIgnore: number = program.limit ? Number(program.limit) : 0;

async function main() {
    const barList: BarList = await bar.users(block)

    const distributionList: DistributionList = getDistribution(barList, toDistribute);

    console.log(distributionList.length)

    let filename = './distribution/' + block + '.json';
    fs.writeFileSync(filename, JSON.stringify(distributionList, null, 2));

    let disperseOutput = "";
    distributionList.forEach(entry => {
        disperseOutput += entry.address + "=" + entry.amount + "\n";
    })

    filename = './distribution/' + block + '.txt';
    fs.writeFileSync(filename, disperseOutput);

    process.exit();
}

function getDistribution(barList: BarList, toDistribute: number) {
    let totalxSushiStaked: number = 0;
    barList.forEach(entry => {
        totalxSushiStaked += entry.xSushi;
    })

    const fraction: number = toDistribute / totalxSushiStaked!;
    let output: DistributionList = barList.map(entry => {
        let amount = entry.xSushi * fraction;
        if(amount < amountToIgnore) { amount = 0; }
        return {
            address: entry.address,
            amount: String(amount.toFixed(5)),    
        }
    })

    return output.filter(entry => { return entry.amount === "0.00000" ? false : true })
}

main();