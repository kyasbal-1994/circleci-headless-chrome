mkdir $CIRCLE_ARTIFACTS/all/
SHA=`cat trigger.json| jq -r .sha`
echo $SHA
aws s3 cp s3://$S3_BUCKET_URL/ss/$SHA $CIRCLE_ARTIFACTS/all  --recursive --acl public-read
files=`find $CIRCLE_ARTIFACTS/all/ -name "*.png"`
count=`echo "$files" | wc -l`
COL=4
ROW=$(($count / $COL + 1))
montage -label '%f' -tile ${COL}x${ROW} -geometry 512x512+20+20 $files $CIRCLE_ARTIFACTS/summary.jpg
aws s3 cp $CIRCLE_ARTIFACTS/summary.jpg s3://$S3_BUCKET_URL/ss/$SHA