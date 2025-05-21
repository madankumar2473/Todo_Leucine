import Todo from '../models/Todo.js';
import generateSummary from '../llmservice/llmservice.js';
import sendToSlack from '../llmservice/slackservice.js';

export const summarizeAndSend = async (req, res) => {
  try {
    const todos = await Todo.getAll();
    const summary = await generateSummary(todos);
    await sendToSlack(summary);

    res.json({
      success: true,
      summary,
      message: 'Summary generated and sent to Slack successfully',
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
