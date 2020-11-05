"use strict";

const ssm = new (require("aws-sdk/clients/ssm"))();
const kms = new (require("aws-sdk/clients/kms"))();

module.exports.getParameter = async (event) => {
  try {
    const testkeyEncrypt = await ssm
      .getParameters({
        Names: ["/my-app/testKey"],
      })
      .promise()

    console.log("Encrypted value", testkeyEncrypt.Parameters[0].Value);

    const testkey = await kms
      .decrypt({ CiphertextBlob: testkeyEncrypt.Parameters[0].Value })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Your testKey was retrivied",
          testkey,
        },
        null,
        2
      ),
    };
  } catch (ex) {
    console.error(`Error`, ex);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Error on retrieve parameter",
        },
        null,
        2
      ),
    };
  }
};
