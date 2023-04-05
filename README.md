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

1) First create a `.env` file locally. Please refer to the file `.env.template` for all the variables that need to be added.
2) There are three secrets, please ask one of the code owners for these secrets to add them to your `.env` file

3) Copy the `mongo-init.js` into `~/`

```
cp ./mongo-init.js ~/mongo-init.js
```

4) Run docker compose up

```sh
docker compose up
```

### Managing the private key

The PRIVATE_KEY in the .env file needs to be base64 encoded

```
$(cat <<location of the pem file>> | base64)
```


