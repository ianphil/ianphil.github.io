---
layout: post
title:  "Azure Container Registry and Service Principles"
date:   2019-08-05 07:23:10 -0500
categories: azure acr keyvault
---
![boats-cargo-container-container-167676](https://user-images.githubusercontent.com/17349002/62460635-86e60900-b750-11e9-9872-1ba99d408d81.jpg)

So you don't want to enable admin access to your Azure Container Registry?

I understand. I recently had a customer with a similar ask. We initially wanted to use [Managed Identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview), but soon found this wasn't going to work. Did you know there is a pretty standard workaround for this? I didn't either, but our team spoke with the Product Team and they pointed us at: [https://github.com/Azure/app-service-linux-docs/blob/master/service_principal_auth_acr.md](https://github.com/Azure/app-service-linux-docs/blob/master/service_principal_auth_acr.md). 

This workaround basically has you create a Service Principle, grant it ACRPull access to the ACR, then set it up as the user/pass in App Settings for the App Service. We didn't feel this went far enough so we stored the user/pass in Key Vault. We then configured a Managed Identity for the App Service to access the Key Vault. Then used some sweet KV syntax in App Settings to reference the user/pass:

```
@Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret;SecretVersion=ec96f02080254f109c51a1f14cdb1931)
```
ref: [https://docs.microsoft.com/en-us/azure/app-service/app-service-key-vault-references#reference-syntax](https://docs.microsoft.com/en-us/azure/app-service/app-service-key-vault-references#reference-syntax)