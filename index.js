let tsv = require('node-tsv-json'),
	rimraf = require('rimraf');

tsv({ input: 'kb.tsv' }, (err, result) => {
	if(err) {
		console.log(err);
	} else {
		rimraf('./intents/', () => {
			for(let intentIndex = 0; result.length > 0; intentIndex++) {
				let matchedIndexes = [],
					userInputs = [],
					responseToSearchFor = result[0].Answer,
					intentName = 'intent' + intentIndex;
					intent = new Intent(intentName, responseToSearchFor);

				result.forEach((qnaPair, i) => {
					if(qnaPair.Answer === responseToSearchFor) {
						matchedIndexes.push(i);
						userInputs.push(new UserInput(qnaPair.Question));
					}
				});

				matchedIndexes.forEach( (indexOfItemToDelete, i) => result.splice(indexOfItemToDelete - i, 1) );

				fs.writeFile('./intents/' + intentName + '.json', JSON.stringify(intent), 'utf8');
				fs.writeFile('./intents/' + intentName + '_usersays_en.json', JSON.stringify(userInputs), 'utf8');
			}
		});
	}
});

class Intent {
	constructor(name, speech) {
		this.name = name;
		this.auto = true;
		this.contexts = [];
		this.responses = [
			{
				resetContexts: false,
				affectedContexts: [],
				parameters: [],
				messages: [
					{
						type: 0,
						lang: 'en',
						speech: speech
					}
				],
				defaultResponsePlatforms: {},
				speech: []
			}
		];
		this.priority = 500000;
		this.webhookUsed = false;
		this.webhookForSlotFilling = false;
		this.fallbackIntent = false;
		this.events = [];
	}
};

class UserInput {
	constructor(text) {
		this.data = [
			{
				text: text,
				userDefined: false
			}
		]
	}
};

