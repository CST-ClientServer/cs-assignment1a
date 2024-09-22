# Card Game



## - How to run the client


## - How to run the web-server in your local

1. pull latest docker image
``` docker pull devjasper0906/card-game-tomcat:1.1.2```

2. check image id
``` docker images```

3. Run as tomcat
``` docker run -d -i -t --name tomcat -p 8081:8080 [image id]```

4. Make sure the container up
``` docker ps ```

5. Should Accessible to
``` http://localhost:8081 ```
