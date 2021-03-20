import boto3

s3 = boto3.resource('s3')

def fetch_filenames(bucket):
    '''Returns list of all files in the given bucket'''
    s3Bucket = s3.Bucket(bucket)
    
    files = []
    for file in s3Bucket.objects.all():
        files.append(file.key)
    
    return files