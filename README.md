# Imagegram

## Overview

This is a simple application exposing a REST API to manage posts made by users which include images and comments. The users can create their own account, create new posts from their account and even add comments on various posts, including their own. Each post consists of a caption and an image and the user can access all the posts in the application via a single endpoint. Finally, to safeguard the user's privacy, they are also given the capability of deactivating their account which also deletes all data (posts and comments) associated with their account.

## Prerequisites

You must have Docker installed on your computer. You can follow these [instructions](https://www.docker.com/products/docker-desktop) to have it quickly installed. You must also have a `.env` created at the root of the repository. Please add the following environment variables to this file:

```console
ENV=development

PATH_TO_UPLOADS=<relative path to folder for storing uploaded images>
```

## Getting Started

Once you have Docker setup. Run the following commands on your terminal to spin up the containers that will compose the application.

```console
docker-compose build
docker-compose up
```

To verify the application is running, you can hit the following endpoint to perform a `healtcheck`:

```console
curl --location --request GET 'localhost:3001/healthcheck'
```

Thereafter, you can interact with the application on the following endpoints:

* POST `/accounts` to create new accounts
* DELETE `/accounts/:accountId` to delete an account and all post and comment data associated with it
* POST `/posts` to create new posts
* GET `/posts` to fetch all posts in the application
* POST `/comments` to add new comments on posts

You can find more information on how to build the respective cURL calls by following the OpenAPI spec found [here](src/api/openapi.yaml)

To stop the application, simply hit `Cmd/Ctrl + C` to kill the containers.