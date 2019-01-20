#!/bin/bash

mysql -uroot -p$MYSQL_ROOT_PASSWORD < schema.sql
mysql -uroot -p$MYSQL_ROOT_PASSWORD < data_load.sql
