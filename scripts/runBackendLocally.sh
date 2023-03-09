#!/bin/bash

# make sure the private key exists in that path (THIS IS NOT THE SAME AS THE ONE YOU ADD in .env)
export PRIVATE_KEY_PATH=../privateKey/AcademicTeamManagement.pem
export REACT=3001
export FLASK=5001

cd server

pipenv lock
pipenv run start-dev
