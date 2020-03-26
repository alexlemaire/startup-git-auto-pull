#!/bin/bash

header_print() {
  echo $1
  echo "Tip: you can cancel this operation by pressing CTRL + C"
}

# generate SSH key
header_print "Generating SSH key for GitHub..."
$1 generate-ssh

# generate GPG key
header_print "Generating GPG key for GitHub..."
$1 generate-gpg

# configurate user
header_print "Configurating GitHub user..."
$1 config -g

if [[ $1 != "--noEndMsg" ]]
then
  printf "\nScript ran. You may now close this window if you're done working with it!"
fi
