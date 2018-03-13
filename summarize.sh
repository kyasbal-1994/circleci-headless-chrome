mkdir $CIRCLE_ARTIFACTS/all/
SHA=`cat trigger.json| jq -r .sha`
echo $SHA
aws s3 cp s3://$S3_BUCKET_URL/ss/$SHA $CIRCLE_ARTIFACTS/all  --recursive --acl public-read
files=`find $CIRCLE_ARTIFACTS/all/ -name "*.png"`
count=`echo "$files" | wc -l`
COL=5
ROW=$(($count / $COL + 1))
montage -tile ${COL}x${ROW} $files $CIRCLE_ARTIFACTS/summary.jpg
aws s3 cp $CIRCLE_ARTIFACTS/summary.jpg s3://$S3_BUCKET_URL/ss/$SHA