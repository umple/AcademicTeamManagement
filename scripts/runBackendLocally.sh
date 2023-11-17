#!/bin/bash

# make sure the private key exists in that path (THIS IS NOT THE SAME AS THE ONE YOU ADD in .env)
export PRIVATE_KEY_PATH=../privateKey/AcademicTeamManagement.pem
export REACT=3000
export MONGO=27017
export FLASK=5001
export ENV=DEV
export MONGODB_INITDB_ROOT_USERNAME=root
export MONGODB_INITDB_ROOT_PASSWORD= #add your password here
export MONGODB_HOST=localhost
export BACKEND_HOST=http://localhost:5001
cd server

pipenv lock
pipenv run start-dev
