#!/bin/bash

# Local Environment variables 
export REACT_APP_FLASK=5001
export REACT_APP_BACKEND_URL="http://localhost:${REACT_APP_FLASK}"
export REACT_APP_BACKEND_HOST=http://localhost:5001

cd client

npm install --force
npm run start
