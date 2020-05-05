# qse-middleware
Middleware Layer for Quicksight embedding. Creates an endpoint to retrieve a unique embed URL, which is required for embedding
a QuickSight dashboard. The example also includes an endpoint for pulling RSS XML from Google news. For an example
front end that uses both endpoints see https://github.com/SDEPro/aws-codepipeline-s3-codedeploy-linux

## Usage
The `/qs-embed` endpoint requires the Amazon QuickSight Embedding SDK. Install it with:

```shell
    npm install amazon-quicksight-embedding-sdk
```
This project assumes that:
- you've created a dashboard for embedding, set the security appropriately and have the 
ID of the dashboard.
- you have an AWS `accessKeyId` and `secretAccess Key` for an account with appropriate permissions for getting an embed URL

You'll also need your AWS Account ID.

With these values, set the following environment variables on the server where the `/qs-embed` endpoint lives:

- AKI: `accessKeyId`
- SAK: `secretAccessKey`
- AWSAccountId: `AWSAccountId`
- DashboardId: `DashboardId`

For more information about the embedding process see: `https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-dashboards.html`
The embedding SDK can be found at: `https://github.com/awslabs/amazon-quicksight-embedding-sdk`

The `/qs-embed` endpoint requires no arguments or parameters. If everything is setup properly it will return an embeddable URL that
the caller can include in the `options` passed to `embedDashboard`.

