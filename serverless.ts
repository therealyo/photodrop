import type { AWS } from '@serverless/typescript';

import { auth } from './src/functions/auth';
import { registration, login, getAlbums } from './src/functions/user';
import { createAlbum, getAlbumData } from './src/functions/album';
import {
    sendOtp,
    verifyOtp,
    setClientData,
    getClient,
    setClientSelfie,
    getClientAlbums
} from './src/functions/client/';
import { handleUpload, getPresignedUrl, addNumbers } from './src/functions/photo';

const serverlessConfiguration: AWS = {
    service: 'photodrop',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin', 'serverless-s3-local'],
    provider: {
        name: 'aws',
        region: 'eu-west-2',
        profile: 'photodrop',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
        }
    },
    functions: {
        auth,
        registration,
        login,
        getAlbums,
        createAlbum,
        getAlbumData,
        sendOtp,
        verifyOtp,
        setClientData,
        setClientSelfie,
        getClient,
        getClientAlbums,
        handleUpload,
        getPresignedUrl,
        addNumbers
    },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node16',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10
        }
    }
};

module.exports = serverlessConfiguration;
