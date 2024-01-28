# Release

Last Update: 1/27/2024

To create a new release for the application, you need to do the following steps:
- Make sure you are in the `main` branch, in the project root path
- Pull the latest changes for the `main` branch
- create a new tag follwing this pattern `v*.*.*` a.k.a the Semantic Versioning https://medium.com/fiverr-engineering/major-minor-patch-a5298e2e1798
- Push the new tag using `git push origin <tag-name>`
- Wait for the release to go through the pipeline
- Once the release is sucessful, create a release note with that tag