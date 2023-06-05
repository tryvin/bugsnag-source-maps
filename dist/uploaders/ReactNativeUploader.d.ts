/// <reference types="node" />
import http from 'http';
import { Logger } from '../Logger';
interface CommonUploadOpts {
    apiKey: string;
    platform: 'ios' | 'android';
    dev: boolean;
    appVersion?: string;
    codeBundleId?: string;
    appVersionCode?: string;
    appBundleVersion?: string;
    overwrite?: boolean;
    projectRoot?: string;
    endpoint?: string;
    requestOpts?: http.RequestOptions;
    logger?: Logger;
    idleTimeout?: number;
    ignoreUploadErrors?: boolean;
}
interface UploadSingleOpts extends CommonUploadOpts {
    sourceMap: string;
    bundle: string;
}
export declare function uploadOne({ apiKey, sourceMap, bundle, platform, dev, appVersion, codeBundleId, appVersionCode, appBundleVersion, idleTimeout, overwrite, projectRoot, endpoint, requestOpts, logger, ignoreUploadErrors, ...unknownArgs }: UploadSingleOpts): Promise<void>;
interface FetchUploadOpts extends CommonUploadOpts {
    bundlerUrl?: string;
    bundlerEntryPoint?: string;
}
export declare function fetchAndUploadOne({ apiKey, platform, dev, appVersion, codeBundleId, appVersionCode, appBundleVersion, idleTimeout, overwrite, projectRoot, endpoint, requestOpts, bundlerUrl, bundlerEntryPoint, logger, ignoreUploadErrors, ...unknownArgs }: FetchUploadOpts): Promise<void>;
export {};
