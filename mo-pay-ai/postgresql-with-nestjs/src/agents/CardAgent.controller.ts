import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';

@Controller('assistant')
export class CardAgentController {
  @Post('chat')
  async handleChat(@Body() body: { prompt: string }) {
    const { prompt } = body;
    console.log(prompt);

    if (!prompt) {
      throw new HttpException('Prompt is required', HttpStatus.BAD_REQUEST);
    }

    const ASSISTANT_ID = 'asst_Pm7wW4YTnGXRHLp9HZREWJvA';

    try {
      // 1. Create a thread
      const threadRes = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });
      const thread = await threadRes.json();

      // 2. Add a message to the thread
      await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          role: 'user',
          content: prompt,
        }),
      });

      // 3. Run the assistant on the thread
      const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID,
        }),
      });
      const run = await runRes.json();
      console.log('Initial run response:', run);

      // 4. Poll for run completion
      let runStatus = run.status;
      let runId = run.id;
      const MAX_WAIT_TIME_MS = 15000; // 15 seconds
      const POLL_INTERVAL_MS = 1500;
      let waited = 0;

      while (runStatus !== 'completed' && runStatus !== 'failed' && runStatus !== 'cancelled') {
        console.log(`Run status: ${runStatus}`);

        if (waited >= MAX_WAIT_TIME_MS) {
          throw new Error('Assistant run timed out');
        }

        await new Promise(res => setTimeout(res, POLL_INTERVAL_MS));
        waited += POLL_INTERVAL_MS;

        const statusRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${runId}`, {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        });
        const statusData = await statusRes.json();
        console.log('Polling response:', statusData);

        if (statusData.error) {
          throw new Error(`Polling failed: ${statusData.error.message}`);
        }

        runStatus = statusData.status;
      }

      // 5. Get the latest message from the thread
      const messagesRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });
      const messagesData = await messagesRes.json();
      const lastMessage = messagesData.data
        .reverse()
        .find(msg => msg.role === 'assistant');

      if (!lastMessage) {
        throw new Error('No reply from assistant');
      }

      return { reply: lastMessage.content[0].text.value };
    } catch (err) {
      console.error(err);
      throw new HttpException('Failed to contact AI assistant', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
