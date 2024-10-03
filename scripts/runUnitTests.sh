#!/bin/bash

cd server

export PRIVATE_KEY_PATH=../privateKey/AcademicTeamManagement.pem
export REACT=3000
export MONGO=27017
export FLASK=5001
export ENV=DEV
export MONGODB_INITDB_ROOT_USERNAME=root
export MONGODB_INITDB_ROOT_PASSWORD=pass
export MONGODB_HOST=localhost
export BACKEND_HOST=http://localhost:5001

pipenv run test-unit