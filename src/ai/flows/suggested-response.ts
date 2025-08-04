// src/ai/flows/suggested-response.ts
'use server';

/**
 * @fileOverview A flow to provide agents with suggested responses based on the customer's message.
 *
 * - getSuggestedResponse - A function that generates a suggested response for an agent.
 * - SuggestedResponseInput - The input type for the getSuggestedResponse function.
 * - SuggestedResponseOutput - The return type for the getSuggestedResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedResponseInputSchema = z.object({
  customerMessage: z.string().describe('The message from the customer.'),
});
export type SuggestedResponseInput = z.infer<typeof SuggestedResponseInputSchema>;

const SuggestedResponseOutputSchema = z.object({
  suggestedResponse: z.string().describe('The suggested response for the agent.'),
});
export type SuggestedResponseOutput = z.infer<typeof SuggestedResponseOutputSchema>;

export async function getSuggestedResponse(input: SuggestedResponseInput): Promise<SuggestedResponseOutput> {
  return suggestedResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestedResponsePrompt',
  input: {schema: SuggestedResponseInputSchema},
  output: {schema: SuggestedResponseOutputSchema},
  prompt: `You are an AI assistant helping agents respond to customer messages.
  Generate a suggested response based on the following customer message:

  Customer Message: {{{customerMessage}}}

  Suggested Response:`,
});

const suggestedResponseFlow = ai.defineFlow(
  {
    name: 'suggestedResponseFlow',
    inputSchema: SuggestedResponseInputSchema,
    outputSchema: SuggestedResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
