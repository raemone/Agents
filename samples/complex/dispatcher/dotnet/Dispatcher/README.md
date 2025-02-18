# Dispatcher Demo Agent Setup and configuration
This is a demonstration of a dispatcher or Reasoning agent utilizing the Microsoft 365 Agent SDK,Azure Bot Service, Azure Semantic Kernel, Azure OpenAI and Microsoft Copilot Studio.

> [!IMPORTANT]
> **This demonstrator is not a "simple sample"**, it is a working bot that is setup to support a semi complex configuration. While this readme is longer then most, **it is VERY IMPORTANT to fully read it and understand the steps to setup the supporting components before attempting to use this demonstration code**.  Failure to do so will result in your code not working as expected.


This agent is intended as a technical demonstration of an how to create an agent that utilizes Semantic Kernel backed by Azure OpenAI to act as both an information source and a sub agent orchestrator, orchestrating Azure OpenAI and several Microsoft Copilot Studio Agents.

This agent is known to work with the following clients at the time of this writing:

- WebChat control hosted in a custom website.
- WebChat Test control hosted in Azure Bot Services
- Microsoft Teams client

It is likely other clients will work properly with it, as long as OAuth is setup and configured for that client.

## Prerequisite

**To run the demonstration on a development workstation (local development), the following tools and SDK's are required:**

- [.NET SDK](https://dotnet.microsoft.com/download) version 8.0
- Visual Studio 2022+ with the .net workload installed.
- Access to an Azure Subscription with access to preform the following tasks:
  - Create and configure Entra ID Application Identities for use with both user access tokens and application identities. 
  - Create and configure an [Azure Bot Service](https://aka.ms/AgentsSDK-CreateBot) for your bot
  - Create and configure an [Azure App Service](https://learn.microsoft.com/azure/app-service/) to deploy your bot on to.
  - A tunneling tool to allow for local development and debugging should you wish to do local development whilst connected to a external client such as Microsoft Teams.

**Deploying this as a container or app service on Azure is not covered in this document, however it is identical to deploying any other Agent SDK Agent.**

## Instructions - Required Setup to use this library

### Clone Sample and confirm builds locally

To begin, clone this repository. all necessary assets are found in the /Samples folder. This project is setup to use paths and packages referenced in the various prop files in the root of the samples directory.

- Once you have cloned the project open the visual studio solution using Visual Studio 2022+ in the directory samples/complex/dispatcher/dotnet.
- Build the project in Visual Studio.  this will restore all missing dependencies and verify that the project is ready to be used.
- - if needed, resolve any missing dependencies or build complaints before proceeding.

### Identities

#### Azure Bot Service Bot identity

This demonstrator is setup to use two identities for the Azure Bot Service(ABS) registration.

- ABS to Agent identity. This identity is used to connect between ABS and your Agent. You have a few options here, however we will cover only 2 for the purposes of this demonstrator.
- - Local workstation runtime.

To support running the Agent on your desktop, you will need to create a Application Identity in Azure with a Client secret or Client certificate.  This identity should be in the same tenant that your going to configure the ABS Service in.

- ABS OAuth Identity. This identity is used to create a token for a user. This user access token can then be accessed by the Agent SDK for use to exchange for a downstream service.

- 
- OnBehalf of Identity for communicating to Microsoft Copilot Studio 

### Azure OpenAI

- Setup a model and create a genreal use AI agent

### Microsoft Copilot Studio (MCS)

- Create MCS Agents and collect relevent informaiton. 

### Azure Bot Service

- Create an Azure bot Service and configure it 

### Configure Dispatcher Agent settings

### Setup Tunneling

### Testing default behavior. 
