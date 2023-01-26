---
layout: default
title: Console App
permalink: /opentelemetry/console-app
parent: OpenTelemetry
---

# Console App 
I'm adding meters and such to a console app

## Instrumentation

- [dotnet Metrics](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/metrics)
- [GitHub OpenTelemetry Examples](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/examples/Console/TestMetrics.cs)
- [Tracing Blog](https://code-maze.com/tracing-dotnet-applications-opentelemetry/)

I started with just using the metrics for a counter in a simple console app working through the dotnet docs.

```csharp
using System.Diagnostics.Metrics;

Meter s_meter = new Meter("HatCo.HatStore", "0.1.0");
Counter<int> s_hatsSold = s_meter.CreateCounter<int>("hats-sold");

Console.WriteLine("Press any key to exit");
while (!Console.KeyAvailable)
{
    Thread.Sleep(1000);
    s_hatsSold.Add(4);
}
```

And used the commands, to watch the information...  
  
`dotnet run` to start the process.

`dotnet counters ps` to find the process ID

`dotnet counters monitor --process-id 33172 HatCo.HatStore` to monitor the counter
> NOTE: The HatCo.HatStore references the meter I wanted to monitor. 

## Collection with Promethus 

- [View metrics in Grafana with OpenTelemetry and Prometheus](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/metrics-collection#view-metrics-in-grafana-with-opentelemetry-and-prometheus)

## Collection with 

- [OpenTelemetry with Jaeger in .NET Core](https://medium.com/@niteshsinghal85/opentelemetry-with-jaeger-in-net-core-9b1e009a73dc)