/// <reference types="node" />
import http from 'http';
import { Logger } from '../Logger';
interface UploadSingleOpts {
    apiKey: string;
    sourceMap: string;
    bundleUrl: string;
    bundle?: string;
    appVersion?: string;
    codeBundleId?: string;
    overwrite?: boolean;
    projectRoot?: string;
    endpoint?: string;
    detectAppVersion?: boolean;
    idleTimeout?: number;
    requestOpts?: http.RequestOptions;
    logger?: Logger;
    ignoreUploadErrors?: boolean;
}
export declare function uploadOne({ apiKey, bundleUrl, bundle, sourceMap, appVersion, codeBundleId, idleTimeout, overwrite, projectRoot, endpoint, detectAppVersion, requestOpts, logger, ignoreUploadErrors, ...unknownArgs }: UploadSingleOpts): Promise<void>;
interface UploadMultipleOpts {
    apiKey: string;
    baseUrl: string;
    directory: string;
    appVersion?: string;
    codeBundleId?: string;
    overwrite?: boolean;
    projectRoot?: string;
    endpoint?: string;
    detectAppVersion?: boolean;
    idleTimeout?: number;
    requestOpts?: http.RequestOptions;
    logger?: Logger;
    ignoreUploadErrors?: boolean;
}
export declare function uploadMultiple({ apiKey, baseUrl, directory, appVersion, codeBundleId, idleTimeout, overwrite, detectAppVersion, projectRoot, endpoint, requestOpts, logger, ignoreUploadErrors, ...unknownArgs }: UploadMultipleOpts): Promise<void>;
export {};
