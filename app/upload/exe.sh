#!/bin/bash

for i in `ls *.pcd`;
do
data=$(head -n 1 $i);
awk 'BEGIN {print "'$i'", ":", "'$data'"}'
done;
