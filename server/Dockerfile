FROM python:3.8

ARG PRIVATE_KEY

# Env variable to specify the path of the private key in the container 
ENV PRIVATE_KEY_PATH "/privateKey/AcademicTeamManagement.pem"

# Save the private key into a file
RUN mkdir privateKey
RUN echo $PRIVATE_KEY | base64 --decode > $PRIVATE_KEY_PATH

RUN echo cat ${PRIVATE_KEY_PATH}

COPY . ./flaskApp
COPY encSecrets encSecrets

WORKDIR /flaskApp

# install pipenv
RUN pip install pipenv 

# install dependencies
RUN pipenv install
RUN pipenv lock

# expose container port 5001
EXPOSE 5001

# start the backend server
CMD ["pipenv", "run", "start-prod"]
