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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function addSources(sourceMapPath, sourceMap, projectRoot, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug('Ensuring sourcesContent field is populated');
        if (!sourceMap || typeof sourceMap !== 'object')
            return sourceMap;
        const maybeSourceMap = sourceMap;
        if (maybeSourceMap.sections) {
            for (const section of maybeSourceMap.sections) {
                if (section.map)
                    yield addSourcesContent(sourceMapPath, section.map, projectRoot, logger);
            }
        }
        else {
            yield addSourcesContent(sourceMapPath, maybeSourceMap, projectRoot, logger);
        }
        return maybeSourceMap;
    });
}
exports.default = addSources;
function addSourcesContent(sourceMapPath, map, projectRoot, logger) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = map.sources) === null || _a === void 0 ? void 0 : _a.length) === ((_b = map.sourcesContent) === null || _b === void 0 ? void 0 : _b.length)) {
            return map;
        }
        const sourcesContent = [];
        if (map.sources && map.sources.length) {
            const sources = map.sources;
            for (const p of sources) {
                let source = null;
                try {
                    // don't look up sources for virtual webpack files
                    if (!/^webpack:\/\/(.*)\/webpack/.test(p)) {
                        const absoluteSourcePath = path_1.default.resolve(path_1.default.dirname(sourceMapPath), p.replace(/webpack:\/\/.*\/\.\//, `${projectRoot}/`));
                        source = yield fs_1.promises.readFile(absoluteSourcePath, 'utf-8');
                    }
                }
                catch (e) {
                    logger.warn(`No source found for "${p}" when searching relative to the source map "${sourceMapPath}"`);
                }
                sourcesContent.push(source);
            }
            map.sourcesContent = sourcesContent;
        }
    });
}
//# sourceMappingURL=AddSources.js.map