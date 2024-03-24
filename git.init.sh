#!/bin/bash

# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

# ssh-keygen -t ed25519 -C "hdml.github@gmail.com" -f ~/.ssh/hdml.github -N ""

ssh-agent bash -c 'ssh-add ~/.ssh/hdml.github; git clone git@github.com:hdml-github/hdml.git'
cd hdml
git config core.sshCommand "$(which ssh) -i ~/.ssh/hdml.github"
git config user.name "hdml"
git config user.email "hdml.github@gmail.com"