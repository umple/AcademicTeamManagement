#!/bin/bash

# Local Environment variables 
export REACT_APP_FLASK=5001
export REACT_APP_BACKEND_URL="http://localhost:${REACT_APP_FLASK}"

cd client

npm install --force
npm run start
