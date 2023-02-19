FROM node:latest

# Dynamically set the API endpoint, defaults to 5001
ARG BACKEND_URL
ARG APP

ENV REACT_APP_FLASK $APP
ENV REACT_APP_BACKEND_URL $BACKEND_URL


# Set the workdir was client
WORKDIR /client

# copy the content of the local client folder to the container's client folder
COPY . .

# installing dependencies 
RUN npm install --force

# expose container port 3000
EXPOSE 3000

#start the server
CMD ["npm", "start"]
