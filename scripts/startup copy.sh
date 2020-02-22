#!/bin/bash
cd /home/ec2-user/weather_ui/

npm run prod-start >weather_ui_log.log 2>&1 &
