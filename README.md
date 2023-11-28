# Academic Team Management

The `Academic Team Management` application is used to automate many of the facilities of managing a large class of multi-person groups and supports the following use cases:

1. Creating lists of projects with a title, description, and other metadata 
2. Importing lists of students from Excel
3. Enabling students to form teams, express interest in projects, express an interest in being matched with other students, etc... 
4. Allowing the professor and TAs to communicate with students using chat
5. Allowing the professor and TAs to take notes about progress, presentations, etc...
6. Exporting the data to Excel sheets
7. Allowing the professor or TAs to input grades

The application is expected to be open-source and allow other professors from different educational institutions to adopt it as their project management system.

For more information check the [general](./docs/general/README.md) and [design](./docs/design/README.md) documents.

## Development

### Prerequisites
Make sure to have these technologies installed in your system

    1. Docker
    2. NodeJs
    3. Python


### Building

#### Locally

For local development, try to build each service individually

```sh
# Build the database first
$ ./gradlew startMongo

# Build the server, make sure to add the password of the DB in the ./scripts/runBackendTests.sh file
$ ./gradlew runBackendLocally

# Build the frontend
$ ./gradlew runFrontendLocally

```

#### Production

For prod development, build using all the services using docker-compose
```sh
# To start the app
$ ./gradlew composeUp

# To stop the app
$ ./gradlew composeDown
```

### Testing

#### Backend Unit Tests

```sh
# Unit tests
$ ./gradlew runUnitTests
```

#### Frontend Unit Tests

```sh
# Unit tests
$ ./gradlew runReactUnitTests
```

#### End-To-End Tests

```sh
# E2E tests
$ ./gradlew runEndToEndTests

```

### Linting

You can lint the code locally.

```sh
$ ./gradlew runReactLint
```

### Deployment
See [DevOps](./docs/devops/README.md) section for more information