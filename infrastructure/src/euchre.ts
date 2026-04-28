import * as cdk from "aws-cdk-lib";
import { EuchreClientStack } from "./euchre-client";
import { EuchreServerStack } from "./euchre-server";

const euchreApp = new cdk.App();
const euchreAppEnviornment = {
    region: "us-east-2",
    account: "881490088681",
};

new EuchreClientStack(euchreApp, "EuchreClientStack", {
    env: euchreAppEnviornment,
});

new EuchreServerStack(euchreApp, "EuchreServerStack", {
    env: euchreAppEnviornment,
});
