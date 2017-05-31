#!/bin/bash

for filename in $(ls *.pcd);
do
	line=$(wc -l $filename);
	echo $line;
done; 
