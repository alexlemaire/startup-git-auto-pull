#!/bin/bash

EXEC="$(npm bin -g)/git-assist"

konsole --noclose -e ./scripts/push.sh $EXEC
