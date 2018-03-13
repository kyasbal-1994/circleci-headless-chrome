files=`find ./$CIRCLE_ARTIFACTS/current/ -name "*.png"`
count=`echo "$files" | wc -l`
COL=5
ROW=$(($count / $COL + 1))
montage -tile ${COL}x${ROW} $files ./$CIRCLE_ARTIFACTS/summary.jpg