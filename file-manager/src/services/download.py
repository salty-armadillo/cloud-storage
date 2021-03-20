import boto3

# URL valid for 5 mins
EXPIRATION=300

s3 = boto3.client('s3')

def get_presigned_url(bucket, filename):
    '''Generates a GET pre-signed url for the given file'''
    url = s3.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': bucket,
            'Key': filename
        },
        ExpiresIn=EXPIRATION
    )

    return url