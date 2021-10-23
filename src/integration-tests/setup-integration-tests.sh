#!/bin/bash
SCRIPT_DIR=`dirname "$0"`
mkdir -p ${SCRIPT_DIR}/image-storage ${SCRIPT_DIR}/resources

export TEST_TEXT_FNAME='test-text-file.txt'
touch ${SCRIPT_DIR}/resources/${TEST_TEXT_FNAME}

export TEST_JPEG_FNAME='test-jpeg-image.jpg'
# curl -o ${SCRIPT_DIR}/resources/${TEST_JPEG_FNAME} https://picsum.photos/400
curl -o ${SCRIPT_DIR}/resources/${TEST_JPEG_FNAME} https://via.placeholder.com/400.jpg