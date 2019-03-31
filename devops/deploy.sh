#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)

`git remote add backend https://git.heroku.com/triangleflag-api.git && true`
`git remote add front-end https://git.heroku.com/triangleflag.git && true`

current_branch=`git rev-parse --abbrev-ref HEAD`

echo "$ Deploying branch :${bold}${current_branch} ${normal}"

echo "$ ${bold}Deploying Frontend App ${normal}"
git push frontend `git subtree split --prefix  front-end ${current_branch}`:master --force

echo "$ ${bold}Deploying Backend App ${normal}"
git push backend `git subtree split --prefix  back-end ${current_branch}`:master --force
