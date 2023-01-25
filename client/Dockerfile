FROM node:latest

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
