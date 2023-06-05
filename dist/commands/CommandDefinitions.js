"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonCommandDefs = void 0;
exports.commonCommandDefs = [
    { name: 'api-key', type: String, description: 'your project\'s API key {bold required}' },
    { name: 'overwrite', type: Boolean, description: 'replace existing source maps uploaded with the same version' },
    { name: 'no-overwrite', type: Boolean, description: 'prevent replacement of existing source maps uploaded with the same version' },
    { name: 'project-root', type: String, description: 'the top level directory of your project (defaults to the current directory)' },
    { name: 'endpoint', type: String, description: 'customize the endpoint for Bugsnag On-Premise' },
    { name: 'quiet', type: Boolean, description: 'less verbose logging' },
    { name: 'code-bundle-id', type: String },
    { name: 'idle-timeout', type: Number, description: 'idle timeout for HTTP requests in minutes' }
];
//# sourceMappingURL=CommandDefinitions.js.map