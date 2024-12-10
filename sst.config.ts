/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "refhired.com",
      removalPolicy: input?.stage === "production" ? "retain" : "remove",
    };
  },
  async run() {
    // const infra = await import("./infra/sst-v3");
    const api = new sst.aws.ApiGatewayV2("Api");
    //
    api.route("POST /graphql", {
      handler: "apps/api/lambda.ts",
    });

    return {
      api: api.url,
    };
  },
});
