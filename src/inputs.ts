import { getInput } from '@actions/core';

export function getInputs() {
  const stackName = getInput('stack-name', {
    required: true,
    trimWhitespace: true,
  });

  const region = getInput('aws-region', {
    required: true,
    trimWhitespace: true,
  });

  const template =
    getInput('template', {
      required: false,
      trimWhitespace: true,
    }) || undefined;

  const templateUrl =
    getInput('template-url', {
      required: false,
      trimWhitespace: true,
    }) || undefined;

  const parameters = getInput('parameters', {
    required: false,
    trimWhitespace: true,
  });

  const capabilities = getInput('capabilities', {
    required: false,
    trimWhitespace: true,
  });

  const applyChangeSet =
    getInput('apply-change-set', {
      required: true,
      trimWhitespace: true,
    }).toLowerCase() === 'true';

  return {
    stackName,
    region,
    template,
    templateUrl,
    applyChangeSet,
    parameters,
    capabilities,
  };
}
