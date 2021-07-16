//import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Injectable } from '@nestjs/common';

const projectId = process.env.GCP_PROJECT;
const secretIds = process.env.SECRET_IDS;
/*
if (!projectId) {
  console.log('Please provide: GCP_PROJECT');
  process.exit(1);
}

if (!secretIds) {
  console.log('Please provide: SECRET_IDS');
  process.exit(1);
}
*/
@Injectable()
export class SecretsService {
  secretsObject = {};
  secretIdsArray = secretIds.split(',');
  //client = new SecretManagerServiceClient();

  async getSecrets() {
    /*const client = new SecretManagerServiceClient();
    const projectId = process.env.GCP_PROJECT;
    const secretIds = process.env.SECRET_IDS;
    const secretIdsArray = secretIds.split(',');
    const secretsObject: any = {};
    const promises = [];

    for (const secretId of secretIdsArray) {
      promises.push(getSecret(client, secretsObject, projectId, secretId));
    }

    await Promise.all(promises);
    secretsObject.SECRETS_LOADED = true;
    Object.assign(process.env, secretsObject);
    return secretsObject;
  */
 }
//  return {};
}


const getSecret = async (client, secretsObject, projectId, secretId) => {
/*  const name =
    'projects/' + projectId + '/secrets/' + secretId + '/versions/latest';
  const secrets = await client.accessSecretVersion({ name });
  const secretData = secrets[0].payload.data.toString();
  const secretObject = JSON.parse(secretData);
  Object.assign(secretsObject, secretObject);
  console.log('Secret Manager - ' + secretId);
*/
};
