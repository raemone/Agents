/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Components } from 'botframework-webchat'
import { FluentThemeProvider } from 'botframework-webchat-fluent-theme'
import { useState, useEffect } from 'react'
import { ConnectionSettings, CopilotStudioClient, CopilotStudioWebChat} from '@microsoft/agents-copilotstudio-client'
import type { CopilotStudioWebChatConnection } from '@microsoft/agents-copilotstudio-client'
import { acquireToken } from './acquireToken'

const { BasicWebChat, Composer } = Components

function Chat() {
    let agentsSettings: ConnectionSettings

    try {
        agentsSettings = new ConnectionSettings({
            // App ID of the App Registration used to log in, this should be in the same tenant as the Copilot.
            appClientId: '',
            // Tenant ID of the App Registration used to log in, this should be in the same tenant as the Copilot.
            tenantId: '',
            // Environment ID of the environment with the Copilot Studio App.
            environmentId: '',
            // Schema Name of the Copilot to use.
            agentIdentifier: ''
        })
    } catch (error) {
        console.error(error + '\nsettings.js Not Found. Rename settings.EXAMPLE.js to settings.js and fill out necessary fields')
        agentsSettings = {
            appClientId: '',
            tenantId: '',
            environmentId: '',
            agentIdentifier: '',
            directConnectUrl: '',
        }
    }
    const [connection, setConnection] = useState<CopilotStudioWebChatConnection | null>(null)
    const webchatSettings = { showTyping: true }

    useEffect(() => {
        (async () => {
            const token = await acquireToken(agentsSettings)
            const client = new CopilotStudioClient(agentsSettings, token)
            setConnection(CopilotStudioWebChat.createConnection(client, webchatSettings))
        })()
    }, [])
    return connection
        ? (
            <FluentThemeProvider>
                <Composer directLine={connection}>
                    <BasicWebChat />
                </Composer>
            </FluentThemeProvider>
        )
        : null
}

export default Chat