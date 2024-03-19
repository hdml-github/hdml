[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Master Branch](https://github.com/hdml-github/hdml/actions/workflows/master.yml/badge.svg)](https://github.com/hdml-github/hdml/actions/workflows/master.yml)

## Setting up

```bash
# create the project catalog
mkdir ~/hdml-github
cd ~/hdml-github

# clone repo
git clone git@github.com:hdml-github/hdml.git
cd hdml

# configure ssh key to the repository (optional)
git config core.sshCommand "$(which ssh) -i ~/.ssh/privatekey"
git config user.name "username"
git config user.email "username@gmail.com"

# install dependencies
npm i
npm run bootstrap

# build project locally
npm run compile_all
npm run develop:build
cp ~/hdml-github/hdml/packages/elements/bin/ ~/hdml-github/hdml/packages/charts/bin
```

## Run development environment

```bash
cd ~/hdml-github/hdml
npm run develop:up
```

## Run singleton service

```bash
cd ~/hdml-github/hdml/packages/service
npm run singleton
```

## Run test web application

```bash
cd ~/hdml-github/hdml/packages/charts
npm run web
```

## Open application

http://localhost:8000/