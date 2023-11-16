# DevOps

## Deploy the docker compose

1) First create a `.env` file locally. Please refer to the file `.env.template` for all the variables that need to be added.
2) There are three secrets, please ask one of the code owners for these secrets to add them to your `.env` file

3) (If you are on macOS) Copy the `init-mongo.js` into `~/`

```
cp ./init-mongo.js ~/init-mongo.js
```

4) Run docker compose down to remove all the images and stop all the containers running

If you do not want to remove the attached mongodb volume:

```sh
docker compose down --rmi all
```

If you want to remove the attached volume 

```sh
docker compose down --rmi all -v
```
5) Run docker compose up with the --no-deps flags to rebuild the images 

```sh
docker compose up -d
```

### Troubleshooting the deployment

Flask (503):

- The issue is quite possible with mongo
- Run the following code to hard-reset the system (NOTE: This should be done with extreme care and ONLY WHEN NECESSARY as it deletes volumes)

``` sh
docker compose down --rmi all -v 
```

### Managing the private key

The PRIVATE_KEY in the .env file needs to be base64 encoded

```
$(cat <<location of the pem file>> | base64)
```

### Backup a Mongo Container

#### The following section describes how to backup the mongodb container 

1) Export the variable in the .env to the terminal

```
set -a
source .env
set +a
```

2) Start the backup
```
mongodump --host=localhost:$MONGO -u=$MONGODB_INITDB_ROOT_USERNAME -p=$MONGODB_INITDB_ROOT_PASSWORD -d=$MONGODB_INITDB_DATABASE -o="<Backup location>"
```


#### The following commands describe how to restore the backup

1) Export the variable in the .env to the terminal

```
set -a
source .env
set +a
```

2) Start the backup restoration
```
mongorestore --host=localhost:$MONGO -u=$MONGODB_INITDB_ROOT_USERNAME -p=$MONGODB_INITDB_ROOT_PASSWORD
```