FROM tomcat:10-jdk17-temurin-noble

WORKDIR /usr/local/tomcat/webapps

COPY ./target/api tomcat:/usr/local/tomcat/webapps

EXPOSE 8081:8080

CMD ["catalina.sh", "run"]