#!/bin/bash
# First copy default rsa key to vm by
# pbcopy < .ssh/id_rsa.pub
# add this to vm .ssh/authorized_keys 
sudo ssh -i ~/.ssh/id_rsa -L 8543:localhost:8543 ubuntu@192.168.64.5 