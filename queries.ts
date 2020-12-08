import pageResults from 'graph-results-pager';

const graphAPIEndpoints = {
	bar: 'https://api.thegraph.com/subgraphs/name/sushiswap/sushi-bar',
	blocklytics: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
};

export default {
	users(block_number: number) {
		return pageResults({
			api: graphAPIEndpoints.bar,
			query: {
				entity: 'users',
				selection: {
					block: {number: block_number}
				},
				properties: [
					'id',
					'xSushi',
				]
			}
		})
			.then(results =>
				results.map(({ id, xSushi }) => ({
					address: String(id),
					xSushi: Number(xSushi)
				})),

			)
			.catch(err => console.log(err));
	},
}