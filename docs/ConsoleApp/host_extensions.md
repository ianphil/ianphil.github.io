---
layout: default
title: Host Extensions
permalink: /consoleapp/host-extensions
parent: Console App
---

# Host Builder Extensions

- [How To Integrate Elasticsearch In ASP.NET Core](https://www.c-sharpcorner.com/article/how-to-integrate-elasticsearch-in-asp-net-core/)

```csharp
public static class ElasticSearchExtension {
    public static void AddElasticSearch(this IServiceCollection services, IConfiguration configuration) {
        var baseUrl = configuration["ElasticSettings:baseUrl"];
        var index = configuration["ElasticSettings:defaultIndex"];
        var settings = new ConnectionSettings(new Uri(baseUrl ?? "")).PrettyJson().CertificateFingerprint("6b6a8c2ad2bc7b291a7363f7bb96a120b8de326914980c868c1c0bc6b3dc41fd").BasicAuthentication("elastic", "JbNb_unwrJy3W0OaZ07n").DefaultIndex(index);
        settings.EnableApiVersioningHeader();
        AddDefaultMappings(settings);
        var client = new ElasticClient(settings);
        services.AddSingleton < IElasticClient > (client);
        CreateIndex(client, index);
    }
    private static void AddDefaultMappings(ConnectionSettings settings) {
        settings.DefaultMappingFor < ArticleModel > (m => m.Ignore(p => p.Link).Ignore(p => p.AuthorLink));
    }
    private static void CreateIndex(IElasticClient client, string indexName) {
        var createIndexResponse = client.Indices.Create(indexName, index => index.Map < ArticleModel > (x => x.AutoMap()));
    }
}
```

Few things of note off the top of my head about this. It's a class extension so denoted by `static class` and `public static void` method. Also the parameters contain `this` as the first param so that we no this is an extension for Service Collection. You'll notice that you have a reference to services collection and you add the `IElasticClient` as a Singleton. 

To use this:

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddElasticSearch(builder.Configuration);
```