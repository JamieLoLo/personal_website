import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'

async function getRdsPassword() {
  const client = new SecretsManagerClient({ region: process.env.AWS_REGION })
  const command = new GetSecretValueCommand({
    SecretId: process.env.RDS_SECRET_NAME,
  })

  try {
    const data = await client.send(command)
    if (data.SecretString) {
      const secret = JSON.parse(data.SecretString)
      return secret.password
    }
  } catch (error) {
    console.error('Error retrieving secret:', error)
  }
}

export default getRdsPassword
