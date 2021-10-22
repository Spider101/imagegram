#!/bin/bash
mkdir -p image-storage resources
export TEST_JPEG_FNAME='test-jpeg-image.jpg'
curl -o resources/${TEST_JPEG_FNAME} http://lorempixel.com/400/200