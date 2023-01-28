FROM python:3.8

WORKDIR /server

# Copy the code of the server directory to /server of the machine
COPY . .

# install pipenv
RUN pip install pipenv 

RUN pipenv install

#Expose container port 5000
EXPOSE 5000

CMD ["pipenv", "run", "start-prod"]
