import { AgentApplication, TurnContext, TurnState } from '@microsoft/agents-hosting'
import pjson from '@microsoft/agents-hosting/package.json'

export class SkillAgent extends AgentApplication<TurnState> {
  constructor () {
    super()
    this.conversationUpdate('membersAdded', async (context, state) => {
      await context.sendActivity(`Hello from the skill agent running on ${pjson.version}!`)
    })
    this.message(async (c: TurnContext) => Promise.resolve(true), async (context, state) => {
      await context.sendActivity(`You said: ${context.activity.text}`)
    })
  }
}
