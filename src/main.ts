import fs from 'node:fs';
import path from 'node:path';
import { debug, setFailed } from '@actions/core';
import { CloudFormationClient } from '@aws-sdk/client-cloudformation';

import {
  getCloudFormationParameters,
  updateCloudFormationStack,
} from './cloudformation.js';
import {
  checkIsValidGitHubEvent,
  logChanges,
  logOutputParameters,
} from './github.js';
import { getInputs } from './inputs.js';

export async function run(): Promise<void> {
  try {
    checkIsValidGitHubEvent();

    const inputs = getInputs();

    debug(`Inputs:\n${JSON.stringify(inputs, null, 2)}`);

    let cfTemplateBody;
    if (inputs.template.length > 0) {
      cfTemplateBody = fs.readFileSync(path.resolve(inputs.template), 'utf8');
    }

    const cloudFormationClient = new CloudFormationClient({
      region: inputs.region,
    });

    const cfParameters = getCloudFormationParameters(inputs.parameters);

    debug(
      `CloudFormation Parameters:\n${JSON.stringify(cfParameters, null, 2)}`
    );

    const result = await updateCloudFormationStack(
      cloudFormationClient,
      inputs.stackName,
      inputs.applyChangeSet,
      inputs.capabilities,
      cfTemplateBody,
      inputs.templateUrl,
      cfParameters
    );

    logOutputParameters(result.stack?.Outputs || []);
    logChanges(result.changes);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error);
    } else {
      setFailed('Unknown error');
    }
  }
}

void run();
