// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TurnState, MemoryStorage, TurnContext, AgentApplication, AttachmentDownloader } from '@microsoft/agents-hosting'
import { version } from '@microsoft/agents-hosting/package.json'
import { ActivityTypes } from '@microsoft/agents-activity'
import os from 'os'
interface ConversationState {
  count: number
}
type ApplicationTurnState = TurnState<ConversationState>

const downloader = new AttachmentDownloader()

const storage = new MemoryStorage()
export const agentApp = new AgentApplication<ApplicationTurnState>({
  storage,
  fileDownloaders: [downloader]
})

agentApp.conversationUpdate('membersAdded', async (context: TurnContext, state: ApplicationTurnState) => {
  await context.sendActivity(`🚀 Empty Agent running on Agents SDK for JS version: ${version}. \n /help avaialable`)
})

agentApp.message('/help', async (context: TurnContext, state: ApplicationTurnState) => {
  await context.sendActivity(
    'I am an empty agent. I can respond to the following commands:\n' +
    '- **/help** Show this help message\n' +
    '- **/reset** Reset the conversation state\n' +
    '- **/count**: Show the current count\n' +
    '- **/diag**: Show the current activity in JSON format\n' +
    '- **/state**: Show the current state in JSON format\n' +
    '- **/runtime**: Show the current runtime information\n')
})

agentApp.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
  state.deleteConversationState()
  await context.sendActivity('Ok I\'ve deleted the current conversation state.')
})

agentApp.message('/count', async (context: TurnContext, state: ApplicationTurnState) => {
  const count = state.conversation.count ?? 0
  await context.sendActivity(`The count is ${count}`)
})

const md = (s: string) => '```json\n' + s + '\n```'

agentApp.message('/diag', async (context: TurnContext, state: ApplicationTurnState) => {
  await context.sendActivity(md(JSON.stringify(context.activity, null, 2)))
})

agentApp.message('/state', async (context: TurnContext, state: ApplicationTurnState) => {
  await context.sendActivity(md(JSON.stringify(state, null, 2)))
})

agentApp.message('/runtime', async (context: TurnContext, state: ApplicationTurnState) => {
  const runtime = {
    osversion: `${os.platform} ${os.arch} ${os.release}`,
    nodeversion: process.version,
    sdkversion: version
  }
  await context.sendActivity(md(JSON.stringify(runtime, null, 2)))
})

// Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS
agentApp.activity(ActivityTypes.Message, async (context: TurnContext, state: ApplicationTurnState) => {
  // Increment count state
  let count = state.conversation.count ?? 0
  state.conversation.count = ++count

  // Echo back users request
  await context.sendActivity(`[${count}] you said: ${context.activity.text}`)
})

agentApp.activity(/^message/, async (context: TurnContext, state: ApplicationTurnState) => {
  await context.sendActivity(`Matched with regex: ${context.activity.type}`)
})

agentApp.activity(
  async (context: TurnContext) => Promise.resolve(context.activity.type === 'message'),
  async (context, state) => {
    await context.sendActivity(`Matched function: ${context.activity.type}`)
  }
)
