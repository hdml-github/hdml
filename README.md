[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Master Branch](https://github.com/hdml-github/hdml/actions/workflows/master.yml/badge.svg)](https://github.com/hdml-github/hdml/actions/workflows/master.yml)

## Setting up

```bash
# install node-gyp
npm install -g node-gyp

# install flatbuffers (cmake required: `brew install cmake`)
cd /
mkdir flatc
git clone --depth 1 --branch v23.1.4 https://github.com/google/flatbuffers.git flatc
cd flatc && cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release && make
ln -s /flatc/flatc /usr/local/bin/flatc
chmod +x /flatc/flatc

# generate ssh key for the project and add it to the Github account
ssh-keygen -t ed25519 -C "hdml.github@gmail.com" -f ~/.ssh/hdml.github -N ""

# create the project catalog
mkdir ~/hdml-github
cd ~/hdml-github

# clone and configure repo
curl -o- https://raw.githubusercontent.com/hdml-github/hdml/chore/packages/git.init.sh | bash

# manually (optional)
# git clone git@github.com:hdml-github/hdml.git
# cd hdml
# git config core.sshCommand "$(which ssh) -i ~/.ssh/privatekey"
# git config user.name "username"
# git config user.email "username@gmail.com"

# install dependencies
npm i

# build project locally
npm run build
npm run develop:build
cp ~/hdml-github/hdml/packages/elements/bin/* ~/hdml-github/hdml/packages/charts/bin
mkdir ~/hdml-github/hdml/.workdir/.log
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