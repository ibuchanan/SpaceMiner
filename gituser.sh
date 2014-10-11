#!/bin/sh

pkill ssh-agent
eval `ssh-agent -s`

if [ "$1" = "d" ]
then
 git config user.email "dsaldric@gmail.com" 
 git config user.name "dsaldric"
 ssh-add ../keys/dsaldric.key 
elif [ "$1" = "m" ] 
then
 git config user.email "michael.azogu@gmail.com" 
 git config user.name "doomsday87"
 ssh-add ../keys/michael.azogu.key
elif [ "$1" = "j" ] 
then
 git config user.email "josh.gough@versionone.com"
 git config user.name "joshgough"
 ssh-add ../keys/joshgough.key
else 
 echo "Don't recognize $1. Maybe you need to add it to the script?"
fi