// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Microsoft.Agents.Builder;
using Microsoft.Agents.Builder.App;
using Microsoft.Agents.Hosting.AspNetCore;
using Microsoft.Agents.Samples;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using Microsoft.Agents.Core.Models;
using Microsoft.Agents.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();

builder.Logging.AddConsole();
builder.Logging.AddDebug();

// OpenTelemetry
builder.AddServiceDefaults();
builder.Services.AddProblemDetails();

// Register IStorage for the Agent.  For development, MemoryStorage is suitable.
// For production Agents, persisted storage should be used so
// that state survives Agent restarts, and operate correctly
// in a cluster of Agent instances.
builder.Services.AddSingleton<IStorage, MemoryStorage>();

// Add AgentApplicationOptions from config.
builder.AddAgentApplicationOptions();

// Add the Agent
builder.AddAgent(sp =>
{
    var app = new AgentApplication(sp.GetRequiredService<AgentApplicationOptions>());

    app.OnConversationUpdate(ConversationUpdateEvents.MembersAdded, async (turnContext, turnState, cancellationToken) =>
    {
        foreach (ChannelAccount member in turnContext.Activity.MembersAdded)
        {
            if (member.Id != turnContext.Activity.Recipient.Id)
            {
                await turnContext.SendActivityAsync(MessageFactory.Text("Hello and Welcome!"), cancellationToken);
            }
        }
    });

    app.OnActivity(ActivityTypes.Message, async(turnContext, turnState, cancellationToken) =>
    {
        await turnContext.SendActivityAsync($"You said: {turnContext.Activity.Text}", cancellationToken: cancellationToken);
    });

    return app;
});

// Configure the HTTP request pipeline.

// Add AspNet token validation
builder.Services.AddAgentAspNetAuthentication(builder.Configuration);

var app = builder.Build();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

var route = app.MapPost(
    "/api/messages",
    async (HttpRequest request, HttpResponse response, IAgentHttpAdapter adapter, IAgent agent, CancellationToken cancellationToken) =>
    {
        await adapter.ProcessAsync(request, response, agent, cancellationToken);
    })
    .RequireAuthorization(new AuthorizeAttribute("AllowedCallers"));


// Setup port and listening address.

if (app.Environment.IsDevelopment())
{
    route.AllowAnonymous();
    var port = args.Length > 0 ? args[0] : "3978";
    app.Urls.Add($"http://localhost:{port}");
}

// Start listening. 
await app.RunAsync();
