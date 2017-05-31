#!/bin/bash

point_line=$1 
range=$2
pcd_file=$3
down_range=$[$point_line-$range]
up_range=$[$point_line+$range]
sum=0.0;
for depth in $(awk -v down=$down_range -v up=$up_range '{if(NR>down && NR<up) print $3}' $pcd_file);
do
	sum=$(echo "$sum+$depth" | bc)
done
average_depth=$(echo "scale=5; $sum/$range/2.0" | bc)
echo $average_depth
#echo $sum
