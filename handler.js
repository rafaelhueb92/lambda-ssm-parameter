"use strict";

const ssm = new (require("aws-sdk/clients/ssm"))();

const httpResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body, null, 2),
});

module.exports.getParameter = async (event) => {
  try {
    const testkey = await ssm
      .getParameters({
        Names: ["/my-app/testKey"],
        WithDecryption: true,
      })
      .promise();

    return httpResponse(200, {
      message: "Your testKey was retrivied",
      key: testkey.Parameters[0].Value,
    });
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
