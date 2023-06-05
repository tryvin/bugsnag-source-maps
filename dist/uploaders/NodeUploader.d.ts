/// <reference types="node" />
import http from 'http';
import { Logger } from '../Logger';
interface UploadSingleOpts {
    apiKey: string;
    sourceMap: string;
    bundle: string;
    appVersion?: string;
    codeBundleId?: string;
    overwrite?: boolean;
    projectRoot?: string;
    endpoint?: string;
    detectAppVersion?: boolean;
    requestOpts?: http.RequestOptions;
    logger?: Logger;
    idleTimeout?: number;
    ignoreUploadErrors?: boolean;
}
export declare function uploadOne({ apiKey, bundle, sourceMap, appVersion, codeBundleId, idleTimeout, overwrite, projectRoot, endpoint, detectAppVersion, requestOpts, logger, ignoreUploadErrors, ...unknownArgs }: UploadSingleOpts): Promise<void>;
interface UploadMultipleOpts {
    apiKey: string;
    directory: string;
    appVersion?: string;
    codeBundleId?: string;
    overwrite?: boolean;
    projectRoot?: string;
    endpoint?: string;
    detectAppVersion?: boolean;
    requestOpts?: http.RequestOptions;
    logger?: Logger;
    idleTimeout?: number;
    ignoreUploadErrors?: boolean;
}
export declare function uploadMultiple({ apiKey, directory, appVersion, codeBundleId, idleTimeout, overwrite, projectRoot, endpoint, detectAppVersion, requestOpts, logger, ignoreUploadErrors, ...unknownArgs }: UploadMultipleOpts): Promise<void>;
export {};
