import { IncomingWebhook } from '@slack/webhook';
import { config } from 'dotenv';


config();
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

const sendToSlack = async (summary) => {
    try {
        await webhook.send({
          text: `📋 *Todo Summary*\n\n${summary}`
        });
    
        return true;
      } catch (err) {
        console.error('Slack error:', err);
        throw new Error('Failed to send summary to Slack');
      }
};

export default sendToSlack;
