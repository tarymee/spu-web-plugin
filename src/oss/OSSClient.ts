import OSS from '../package/ali-oss/aliyun-oss-sdk.apaas.min.js'
// const OSS = require('../package/ali-oss/aliyun-oss-sdk.apaas.min.js')

import ObsClient from '../package/huaweicloud-obs/esdk-obs-browserjs.3.22.3.min.js'
// const ObsClient = require('../package/huaweicloud-obs/esdk-obs-browserjs.3.22.3.min.js')

// @ts-ignore
import Cos from '../package/cos-js-sdk-v5/cos-js-sdk-v5.min.js'
// const CosClient = require('../package/cos-js-sdk-v5/cos-js-sdk-v5.min.js')

// import '../package/aws-sdk/aws-sdk.min.js'
import 'aws-sdk/dist/aws-sdk.min.js'
// var S3 = require('aws-sdk/clients/s3')
// import S3 from 'aws-sdk/clients/s3'
// import S3 from 'aws-sdk'
// import S3 from 'aws-sdk/dist/aws-sdk.js'
// import * as S3 from 'aws-sdk/dist/aws-sdk.js'
// import AWS from '../package/aws-sdk/aws-sdk.min.js'
// import * as AWS from 'aws-sdk'

const AliClient = OSS
const S3Client = window?.AWS?.S3
// @ts-ignore
const CosClient: any = Cos

export { AliClient, ObsClient, S3Client, CosClient }
