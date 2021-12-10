import fs from 'node:fs';
import path from 'node:path';
import { setFailed } from '@actions/core';
import { CloudFormationClient } from '@aws-sdk/client-cloudformation';

import {
  getCloudFormationParameters,
  updateCloudFormationStack,
} from './cloudformation.js';
import { checkIsValidGitHubEvent, isPullRequestClosed } from './github.js';
import { getInputs } from './inputs.js';
import { debug } from 'node:console';

export async function run(): Promise<void> {
  try {
    checkIsValidGitHubEvent();

    const inputs = getInputs();

    const cfTemplateBody = fs.readFileSync(
      path.resolve(inputs.template),
      'utf8'
    );

    const cloudFormationClient = new CloudFormationClient({
      region: inputs.region,
    });

    if (isPullRequestClosed) {
      if (inputs.preview) {
        // FIXME
        // const changeSetId = '1234';
        // await deleteChangeSet(
        //   cloudFormationClient,
        //   inputs.stackName,
        //   changeSetId
        // );
      }
    } else {
      const cfParameters = getCloudFormationParameters(inputs.parameters);

      debug(`Parsed params: ${JSON.stringify(cfParameters, null, 2)}`);

      await updateCloudFormationStack(
        cloudFormationClient,
        inputs.stackName,
        inputs.token,
        inputs.preview,
        cfTemplateBody,
        cfParameters
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('Unknown error');
    }
  }
}

void run();
