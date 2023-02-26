# ssh-keygen -t ed25519 -C "hdml@gmail.com"
git config core.sshCommand "$(which ssh) -i ~/.ssh/hdml.github"
git config user.name "hdml"
git config user.email "hdml.github@gmail.com"