import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFormatTool = {
  name: "format_response_as_json",
  description: "Format the letter count response as JSON",
  input_schema: {
    type: "object",
    properties: {
      word: { 
        type: "string",
        description: "The input word"
      },
      letter: { 
        type: "string",
        description: "The input letter"
      },
      count: { 
        type: "integer",
        description: "The number of times the input letter appears in the input word"
      },
    },
    required: ["word", "letter", "count"]
  }
};

const wordsFilePath = path.join(__dirname, 'words.txt');

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

try {
  const data = fs.readFileSync(wordsFilePath, 'utf8');
  const words = data.split('\n').filter(word => word.trim() !== '');
  console.log(words);
} catch (error) {
  console.error('Error reading words.txt:', error.message);
}

const msg = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  system: "You are tasked with counting the number of times a given letter appears in a given word. Provide your response using the JSON formatting tool.",
  max_tokens: 2048,
  temperature: 0,
//   thinking: {
//     type: "enabled",
//     budget_tokens: 1024
//   },
  tools: [jsonFormatTool],
  tool_choice: { type: "tool", name: "format_response_as_json" },
  messages: [{ role: "user", content: "Word: \"yeufydbdvcghyfdgsydf\"\nLetter: \"y\"" }],
});

// console.log(msg.content[msg.content.length - 1].input);
console.log(msg.content)
const lastMessage = msg.content[msg.content.length - 1];
if (lastMessage.type === 'tool_use') {
    console.log(lastMessage.input);
}
// { word: 'yeufydbdvcfdgsydf', letter: 'y', count: 3 }