files=`find ./ss/current/ -name "*.png"`
count=`echo "$files" | wc -l`
COL=5
ROW=$(($count / $COL + 1))
montage -tile ${COL}x${ROW} $files ./ss/summary.jpg