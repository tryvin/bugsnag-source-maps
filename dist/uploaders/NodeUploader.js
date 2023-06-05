"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadOne = void 0;
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const Logger_1 = require("../Logger");
const File_1 = __importDefault(require("../File"));
const Request_1 = __importDefault(require("../Request"));
const FormatErrorLog_1 = __importDefault(require("./lib/FormatErrorLog"));
const ApplyTransformations_1 = __importDefault(require("./lib/ApplyTransformations"));
const ReadBundleContent_1 = __importDefault(require("./lib/ReadBundleContent"));
const ReadSourceMap_1 = __importDefault(require("./lib/ReadSourceMap"));
const ParseSourceMap_1 = __importDefault(require("./lib/ParseSourceMap"));
const DetectAppVersion_1 = __importDefault(require("./lib/DetectAppVersion"));
const InputValidators_1 = require("./lib/InputValidators");
const EndpointUrl_1 = require("./lib/EndpointUrl");
const UPLOAD_PATH = '/sourcemap';
function validateOneOpts(opts, unknownArgs) {
    InputValidators_1.validateRequiredStrings(opts, ['apiKey', 'sourceMap', 'projectRoot', 'endpoint']);
    InputValidators_1.validateOptionalStrings(opts, ['bundle', 'appVersion', 'codeBundleId']);
    InputValidators_1.validateBooleans(opts, ['overwrite', 'detectAppVersion', 'ignoreUploadErrors']);
    InputValidators_1.validateObjects(opts, ['requestOpts', 'logger']);
    InputValidators_1.validateNoUnknownArgs(unknownArgs);
}
function uploadOne(_a) {
    var { apiKey, bundle, sourceMap, appVersion, codeBundleId, idleTimeout, overwrite = false, projectRoot = process.cwd(), endpoint = EndpointUrl_1.DEFAULT_UPLOAD_ORIGIN, detectAppVersion = false, requestOpts = {}, logger = Logger_1.noopLogger, ignoreUploadErrors = false } = _a, unknownArgs = __rest(_a, ["apiKey", "bundle", "sourceMap", "appVersion", "codeBundleId", "idleTimeout", "overwrite", "projectRoot", "endpoint", "detectAppVersion", "requestOpts", "logger", "ignoreUploadErrors"]);
    return __awaiter(this, void 0, void 0, function* () {
        validateOneOpts({
            apiKey,
            bundle,
            sourceMap,
            appVersion,
            codeBundleId,
            overwrite,
            projectRoot,
            endpoint,
            detectAppVersion,
            requestOpts,
            logger,
            ignoreUploadErrors
        }, unknownArgs);
        logger.info(`Preparing upload of node source map for "${bundle}"`);
        let url;
        try {
            url = EndpointUrl_1.buildEndpointUrl(endpoint, UPLOAD_PATH);
        }
        catch (e) {
            logger.error(e);
            if (!ignoreUploadErrors) {
                throw e;
            }
            else {
                return;
            }
        }
        const [sourceMapContent, fullSourceMapPath] = yield ReadSourceMap_1.default(sourceMap, projectRoot, logger);
        const [bundleContent, fullBundlePath] = yield ReadBundleContent_1.default(bundle, projectRoot, sourceMap, logger);
        const sourceMapJson = ParseSourceMap_1.default(sourceMapContent, sourceMap, logger);
        const transformedSourceMap = yield ApplyTransformations_1.default(fullSourceMapPath, sourceMapJson, projectRoot, logger);
        if (detectAppVersion) {
            try {
                appVersion = yield DetectAppVersion_1.default(projectRoot, logger);
            }
            catch (e) {
                logger.error(e.message);
                if (!ignoreUploadErrors) {
                    throw e;
                }
                else {
                    return;
                }
            }
        }
        logger.debug(`Initiating upload to "${url}"`);
        const start = new Date().getTime();
        try {
            yield Request_1.default(url, {
                type: 2 /* Node */,
                apiKey,
                appVersion,
                codeBundleId,
                minifiedUrl: bundle.replace(/\\/g, '/'),
                minifiedFile: new File_1.default(fullBundlePath, bundleContent),
                sourceMap: new File_1.default(fullSourceMapPath, JSON.stringify(transformedSourceMap)),
                overwrite: overwrite
            }, requestOpts, { idleTimeout });
            logger.success(`Success, uploaded ${sourceMap} and ${bundle} to ${url} in ${(new Date()).getTime() - start}ms`);
        }
        catch (e) {
            if (e.cause) {
                logger.error(FormatErrorLog_1.default(e), e, e.cause);
            }
            else {
                logger.error(FormatErrorLog_1.default(e), e);
            }
            if (!ignoreUploadErrors) {
                throw e;
            }
            else {
                return;
            }
        }
    });
}
exports.uploadOne = uploadOne;
function validateMultipleOpts(opts, unknownArgs) {
    InputValidators_1.validateRequiredStrings(opts, ['apiKey', 'directory', 'projectRoot', 'endpoint']);
    InputValidators_1.validateOptionalStrings(opts, ['appVersion', 'codeBundleId']);
    InputValidators_1.validateBooleans(opts, ['overwrite', 'detectAppVersion', 'ignoreUploadErrors']);
    InputValidators_1.validateObjects(opts, ['requestOpts', 'logger']);
    InputValidators_1.validateNoUnknownArgs(unknownArgs);
}
function uploadMultiple(_a) {
    var { apiKey, directory, appVersion, codeBundleId, idleTimeout, overwrite = false, projectRoot = process.cwd(), endpoint = EndpointUrl_1.DEFAULT_UPLOAD_ORIGIN, detectAppVersion = false, requestOpts = {}, logger = Logger_1.noopLogger, ignoreUploadErrors = false } = _a, unknownArgs = __rest(_a, ["apiKey", "directory", "appVersion", "codeBundleId", "idleTimeout", "overwrite", "projectRoot", "endpoint", "detectAppVersion", "requestOpts", "logger", "ignoreUploadErrors"]);
    return __awaiter(this, void 0, void 0, function* () {
        validateMultipleOpts({
            apiKey,
            directory,
            appVersion,
            codeBundleId,
            overwrite,
            projectRoot,
            endpoint,
            detectAppVersion,
            requestOpts,
            logger,
            ignoreUploadErrors
        }, unknownArgs);
        logger.info(`Preparing upload of node source maps for "${directory}"`);
        let url;
        try {
            url = EndpointUrl_1.buildEndpointUrl(endpoint, UPLOAD_PATH);
        }
        catch (e) {
            logger.error(e);
            if (!ignoreUploadErrors) {
                throw e;
            }
            else {
                return;
            }
        }
        logger.debug(`Searching for source maps "${directory}"`);
        const absoluteSearchPath = path_1.default.resolve(projectRoot, directory);
        const sourceMaps = yield new Promise((resolve, reject) => {
            glob_1.default('**/*.map', { ignore: '**/node_modules/**', cwd: absoluteSearchPath }, (err, files) => {
                if (err)
                    return reject(err);
                resolve(files);
            });
        });
        if (sourceMaps.length === 0) {
            logger.warn('No source maps found.');
            return;
        }
        logger.debug(`Found ${sourceMaps.length} source map(s):`);
        logger.debug(`  ${sourceMaps.join(', ')}`);
        if (detectAppVersion) {
            try {
                appVersion = yield DetectAppVersion_1.default(projectRoot, logger);
            }
            catch (e) {
                logger.error(e.message);
                if (!ignoreUploadErrors) {
                    throw e;
                }
                else {
                    return;
                }
            }
        }
        let n = 0;
        for (const sourceMap of sourceMaps) {
            n++;
            logger.info(`${n} of ${sourceMaps.length}`);
            const [sourceMapContent, fullSourceMapPath] = yield ReadSourceMap_1.default(sourceMap, absoluteSearchPath, logger);
            const sourceMapJson = ParseSourceMap_1.default(sourceMapContent, fullSourceMapPath, logger);
            const bundlePath = sourceMap.replace(/\.map$/, '');
            let bundleContent, fullBundlePath;
            try {
                [bundleContent, fullBundlePath] = yield ReadBundleContent_1.default(bundlePath, absoluteSearchPath, sourceMap, logger);
            }
            catch (e) {
                // ignore error – it's already logged out
            }
            const transformedSourceMap = yield ApplyTransformations_1.default(fullSourceMapPath, sourceMapJson, projectRoot, logger);
            logger.debug(`Initiating upload to "${url}"`);
            const start = new Date().getTime();
            try {
                yield Request_1.default(url, {
                    type: 2 /* Node */,
                    apiKey,
                    appVersion,
                    codeBundleId,
                    minifiedUrl: path_1.default.relative(projectRoot, path_1.default.resolve(absoluteSearchPath, bundlePath)).replace(/\\/g, '/'),
                    minifiedFile: (bundleContent && fullBundlePath) ? new File_1.default(fullBundlePath, bundleContent) : undefined,
                    sourceMap: new File_1.default(fullSourceMapPath, JSON.stringify(transformedSourceMap)),
                    overwrite: overwrite
                }, requestOpts, { idleTimeout });
                const uploadedFiles = (bundleContent && fullBundlePath) ? `${sourceMap} and ${bundlePath}` : sourceMap;
                logger.success(`Success, uploaded ${uploadedFiles} to ${url} in ${(new Date()).getTime() - start}ms`);
            }
            catch (e) {
                if (e.cause) {
                    logger.error(FormatErrorLog_1.default(e), e, e.cause);
                }
                else {
                    logger.error(FormatErrorLog_1.default(e), e);
                }
                if (!ignoreUploadErrors) {
                    throw e;
                }
                else {
                    return;
                }
            }
        }
    });
}
exports.uploadMultiple = uploadMultiple;
//# sourceMappingURL=NodeUploader.js.map