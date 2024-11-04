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

## CI/CD pipe line
![CICDDiagram](https://private-user-images.githubusercontent.com/63331153/382622945-42022039-9379-4839-bb30-608d52448cf6.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzA2ODU3NzYsIm5iZiI6MTczMDY4NTQ3NiwicGF0aCI6Ii82MzMzMTE1My8zODI2MjI5NDUtNDIwMjIwMzktOTM3OS00ODM5LWJiMzAtNjA4ZDUyNDQ4Y2Y2LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDExMDQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMTA0VDAxNTc1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTUxMmFiMzIyNWU0NTYwZGU4ZTI2Njg2MmRjZThjN2Q0ODNkYzBlZTZhMmI2MDhlYjc1NGI2MjAwYzkxMDVkZmUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.uNJ4EBhNmvXKXvPuHKlopXNLu5JlqhDmclWdL6r5svo)