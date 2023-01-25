FROM python:3.8-slim-buster

WORKDIR /server

# Copy the code of the server directory to /server of the machine
COPY . .

# install flask
RUN pip install flask

#Expose container port 5000
EXPOSE 5000

CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0"]