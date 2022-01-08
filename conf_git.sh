# ssh-keygen -t ed25519 -C "hdml.github@gmail.com"
git config core.sshCommand "$(which ssh) -i ~/.ssh/hdml"
git config user.name "hdml-github"
git config user.email "hdml.github@gmail.com"