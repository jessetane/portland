# portland
100% locally grown ports

## Why
Deploying and running multiple instances of service@semver on the same server can be a pain to configure with all the ports flying around. portland is a dynamic port registry server that can auto-assign ports to compatible services, significantly reducing their configuration requirements.

## How
The idea is to embed a portland server into your reverse proxy, and wrap portland clients around your services. They will know how to talk to each other. Servers are responsible for persisting changes to the registry to a json cache. In the event that a server crashes, it should be able to use the cache to recover gracefully. Conversely, clients

#
* 

## Usage

## Inspiration
Seaport, Fleet, mon
