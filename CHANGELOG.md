# CHANGELOG
All notable changes in this project will be documented in this file

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0) and this project adheres to [Semantic Version](http://semver.org/spec/v2.0.0.html)

## 1.10.0
### Added
- Changelog file to track changes across versions
- Github action to automatically tag commits on merging PRs

## 1.9.0
### Added
- _DockerFile_ and _docker-compose.yml_ to dockerize the application
- _README_ file to provide context around the usage of the application

### Changed
- Connection string being used for connecting to _MongoDB_ cluster to include a fallback to a local server, if any

## 1.8.0
### Added
- Middleware to check for existence of a _Post_ entity before creating a _Comment_ entity on it.
- `mongoose` middleware for deleting all comments on a _Post_ entity being deleted regardless of which user created it originally
- `eslint` devDependency to help isolate and fix linting issues

### Changed
- Image upload middleware logic to store uploaded images only in the `.jpg` format
- `mongoose` middleware to delete stored image associated with _Post_ entity being deleted

## 1.7.0
### Added
- New endpoint for fetching all _Posts_ in the application
- New section in the API documentation for the new endpoint, including `Internal Server Error` response section
- `mongoose-paginate-v2` dependency to aid ease of fetching sorted and paginated records from the _MongoDB_ cluster
- Service layer logic to leverage the new dependency to return paginated records while populating the two most recent child _Comment_ entities (limit of 2) created on each post

### Changed
- Interface and `mongoose` schema for _Post_ entity to include a list of references to the _Comment_ entities created on it.
- Interface and `mongoose` schema for _Post_ entity to include a derived property (secondary index) to keep track of the number of comments created on it

## 1.6.0
### Added
- Middleware to process and store uploaded images with a filter for whitelisted extensions

### Changed
- Interface and `mongoose` schema for _Post_ entity to remove sub-document list for _Comment_ entity
- Interface and `mongoose` schema for _Post_ entity to add field for image file-name/key
- Route for creating new posts to include new middleware
- Controller logic in `createPostHandler` to return a _422_ response code if the image could not be uploaded due to incorrect file extension used 
- API documentation to match the new response body expected on the `POST /posts` endpoint

## 1.5.0
### Added
- Middleware on `/posts` and `/comments` routes to authorize requests on the basis of the presence of a valid `X-Account-Id` header

### Changed
- API documentation to add a security scheme describing the use of the `X-Account-Id` header

## 1.4.0
### Added
- New endpoint for deleting a user's account along with any data tied to that account
- `mongoose` middleware for deleting posts and comments tied to an account when that account is being deleted
- New section in the API documentation for the new endpoint

### Fixed
- Import paths unnecessarily starting with an extra `./` due to a bug with the VS Code auto-import functionality

## 1.3.0
### Added
- New endpoint for creating new comments on posts
- `mongoose` schema for saving the new comment data with a reference to the parent post to the _MongoDB_ cluster
- New section in the API documentation for the new endpoint

## 1.2.0
### Added
- New endpoint for creating new posts belonging to an account (without the capability to upload images)
- Interface and `mongoose` schema for saving the new post data to the _MongoDB_ cluster
- New section in the API documentation for the new endpoint
- Interface for document representing the _Comment_ entity

### Changed
- Param name used in the `createAccount` method to match the entity being processed

### Removed
- Unused imports

## 1.1.0
### Added
- New endpoint for creating new accounts
- OpenAPI 3.0 documentation for the new endpoint
- Interface and `mongoose` schema for saving the new account data to the _MongoDB_ cluster

## 1.0.0
### Added
- Initial scaffolding to run a bare-bones express server locally
- New healthcheck endpoint used for verifying that the server is up and running
- `mongoose` dependencies and DAO layer for connecting to remote/local _MongoDB_ server