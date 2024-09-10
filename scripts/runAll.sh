systemctl start docker
kill -9 $(lsof -i:5001 -t) 2> /dev/null
kill -9 $(lsof -i:3000 -t) 2> /dev/null
sudo gradle startMongo & sh scripts/runBackendLocally.sh & sudo gradle runFrontendLocally && fg
