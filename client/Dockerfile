FROM node:latest

# Dynamically set the API endpoint, defaults to 5001
ARG APP=5001
ENV BACKEND_URL="http://localhost:${APP}"

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
