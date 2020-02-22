#!/bin/bash
cd /home/ec2-user/code-test-pets/

npm run prod-start >code_test_pets_log.log 2>&1 &
