FROM tomcat:10-jdk17-temurin-noble

WORKDIR /usr/local/tomcat/webapps

COPY ./target/api.war ./

EXPOSE 8081

CMD ["catalina.sh", "run"]