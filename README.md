# Academic Team Management

The `Academic Team Management` application is used to automate many of the facilities of managing a large class of multi-person groups and supports the following use cases:

1. Creating lists of projects with a title, description, and other metadata 
2. Importing lists of students from Excel
3. Enabling students to form teams, express interest in projects, express an interest in being matched with other students, etc... 
4. Allowing the professor and TAs to communicate with students using chat
5. Allowing the professor and TAs to take notes about progress, presentations, etc...
6. Exporting the data to Excel sheets
7. Allowing the professor or TAs to input grades

The application is expected to be open-source and allow other professors from different educational institutions to adapt it as their project management system.

For more information check the [general](./docs/general/README.md) and [design](./docs/design/README.md) documents.

## Development

### Prerequisites

    1. (Technologies TBD)
    2. (Technologies TBD)

### Linting

You can lint the code locally.

```sh

```

### Building

```sh

```

### Testing

#### Unit Tests

```sh
# Unit tests
$ ./gradlew runUnitTests
```

#### Integration Tests

```sh

```

#### Deploy the docker compose

1) First you need to get the private key and save it somewhere locally. You can ask someone on the team to give you the pem file
2) Make sure you are in the main directory of the project
3) Now that you have the file you need to add a base64 encoded .env variable (MAKE SURE YOU DON'T PUSH THAT FILE WITH PK in there)
```sh
echo PRIVATE_KEY="$(cat <<location of the pem file>> | base64)" >> .env
```
4) Run docker compose up

```sh
docker compose up
```