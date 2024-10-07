# Card Game



## - How to run the client
1. clone this project
``` git clone git@github.com:CST-ClientServer/cs-assignment1a.git ```

2. Enter to the card-game-client folder

3. Run npm install
``` npm i ```

4. Running the project in dev
```npm run dev```

## - How to run the web-server in your local

1. pull latest docker image
``` docker pull devjasper0906/card-game-tomcat:1.2.1```

2. check image id
``` docker images```

3. Run as tomcat
``` docker run -d -i -t --name tomcat -p 8081:8080 [image id]```

4. Make sure the container up
``` docker ps ```

5. Should Accessible to
``` http://localhost:8081 ```
