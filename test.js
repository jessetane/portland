/*
 *
 *


service1 connects to server and registers for a port
service1 queries server for service2 and waits
service2 connects to server and registers for a port
service2 adds port info to environment and launches
service1 recieves query response with port for service2
service1 adds port info to environment and launches

service2 shuts down
service2 restarts and goes through port re-registration sequence
service1 now has incorrect port info for service2
service1 detecting connection errors restarts, re-registering


service2 shuts down
service2 restarts and mon repasses environment infos

registrants register their hosts in /etc/hosts if they aren't already
services that rely on other local services don't have to know anything special since they 
registrants use form: host@version
registrants may not double register - must at least differ in version



mastermon | mm

  - pdx
  |-[ 1 ]- ps
  |-[ 2 ]- 
  |


 */