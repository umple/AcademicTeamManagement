## Installation

```bash
# Install `pipenv` package manager
$ pip install pipenv

# Create a new virtual environment and `Pipfile`
$ pipenv install

# Install `nodemon` globally to run the server continuously
$ npm install nodemon -g --save

# Activate the virtual machine
$ pipenv shell
```

## Run server

```bash
# Execute the `start-dev` script to use dev environment
$ pipenv run start-dev
```

## Run Unit Tests
```bash
# Execute the `test-unit` script
$ pipenv run test-unit
```

## FAQ

### Environment issues
If you have any issues with your environment, you can use `pipenv install --ignore-pipfile`

### Dependencies graph
To show the packages and their dependencies that are currently installed in the environment, you can use `pipenv graph`

### Update Pipfile.lock
It's worth noting that you need to run `pipenv lock` command after adding or modifying the scripts section in your **Pipfile** to make sure that the scripts are included in the **Pipfile.lock** file.