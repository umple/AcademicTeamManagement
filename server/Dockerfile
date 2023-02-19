FROM python:3.8

ARG PRIVATE_KEY

# Env variable to specify the path of the private key in the container 
ENV PRIVATE_KEY_PATH "/privateKey/AcademicTeamManagement.pem"

# Save the private key into a file
RUN mkdir privateKey
RUN echo $PRIVATE_KEY | base64 --decode > $PRIVATE_KEY_PATH

COPY . ./flaskApp
COPY encSecrets encSecrets

WORKDIR /flaskApp

# install pipenv
RUN pip install pipenv 

RUN pipenv install

CMD ["pipenv", "run", "start-prod"]
