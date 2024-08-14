systemctl start docker
kill -9 $(lsof -i:5001 -t) 2> /dev/null
kill -9 $(lsof -i:3000 -t) 2> /dev/null
ls
chmod +x ./gradlew
sudo ./gradlew startMongo & sudo ./gradlew runBackendLocally & sudo ./gradlew runFrontendLocally && fg