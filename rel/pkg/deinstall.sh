#!/usr/bin/bash

case $2 in
    DEINSTALL)
	;;
    POST-DEINSTALL)
	svcadm disable grafana
	echo "Please beware that custom configurations were not removed."
	;;
esac
