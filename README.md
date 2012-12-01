```
eeeee eeeee eeeee eeeee e     eeeee eeeee eeeee 
8   8 8  88 8   8   8   8     8   8 8   8 8   8 
8eee8 8   8 8eee8e  8e  8e    8eee8 8e  8 8e  8 
88    8   8 88   8  88  88    88  8 88  8 88  8 
88    8eee8 88   8  88  88eee 88  8 88  8 88ee8
```
100% locally grown ports.

## Why
It can be a pain to manually assign port numbers to network services. They might deploy to multifarious environments or run concurrently at multiple versions in a single environment, making configuration tedious. Portland provides a registry to help automate this process.

## How
Portland has two parts: a client and a server. The server contains the registry itself, so each host should run exactly one. Local services can then use the portland client (via command line tool or embeddable library) to register themselves, or lookup other services they depend on.

## Install
```npm install portland -g```

## Usage
Not stable... an experiment for now.

## Inspiration
[seaport](https://github.com/substack/seaport.git)

## License
MIT