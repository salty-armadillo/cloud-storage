import boto3

# URL valid for 5 mins
EXPIRATION=300

s3 = boto3.client('s3')

def get_presigned_url(bucket, filename):
    '''Generates a POST pre-signed url for the given file'''
    response = s3.generate_presigned_post(
                bucket,
                filename,
                Fields=None,
                Conditions=None,
                ExpiresIn=EXPIRATION
            )

    return response