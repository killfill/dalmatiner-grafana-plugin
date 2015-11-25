#!/usr/bin/bash

case $2 in
    PRE-INSTALL)

        ;;
    POST-INSTALL)
	echo Importing service ...
	svccfg import /opt/local/fifo-grafana/manifest.xml
        if [ ! -f /opt/local/fifo-grafana/conf/custom.ini ]; then
            cp /opt/local/fifo-grafana/conf/custom.ini.example /opt/local/fifo-grafana/conf/custom.ini
        fi
        ;;
esac
