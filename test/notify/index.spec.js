const sinon = require('sinon');
const IncomingWebhook = require('@slack/client').IncomingWebhook
const notify = require(`${SRC}/notify`)

describe('notify', () => {
	beforeEach(() => {
		sinon.stub(IncomingWebhook.prototype, 'send')
	})

	afterEach(() => {
		IncomingWebhook.prototype.send.restore()
	})

  it('should notify via slack', (done) => {
  	IncomingWebhook.prototype.send.yields();
  	notify.slack({newSlots: ['new-slot'], withdrawnSlots: ['withdrawn-slot']})
  	.then(() => {
  		IncomingWebhook.prototype.send.calledWith({attachments: [
  			{ fallback: 'new squads have been added',
    			color: '#1A7645',
    			title: 'New squads',
    			text: '<!here> new-slot'
    		},{
    			fallback: 'spot in full squad available',
    			color: '#DBD329',
    			title: 'withdrawn from full Squad',
    			text: '<!here> spot in withdrawn-slot is available'
    		}
    	]}, sinon.match.any).should.eql(true);
  		done();
  	})
  })
})