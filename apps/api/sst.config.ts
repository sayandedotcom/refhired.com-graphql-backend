/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "api",
      removalPolicy: input?.stage === "production" ? "retain" : "remove",
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2("Api");
    api.route("POST /graphql", {
      handler: "lambda.handler",
    });

    // const api = new sst.aws.AppSync("MyApi", {
    //   schema: "schema.graphql",
    // });
    // const lambdaDS = api.addDataSource({
    //   name: "lambda",
    //   lambda: "lambda.main",
    // });

    return {
      api: api.url,
    };
  },
});
