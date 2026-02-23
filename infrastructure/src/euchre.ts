import * as cdk from "aws-cdk-lib";
import { EuchreClientStack } from "./euchre-client";
import { EuchreServerStack } from "./euchre-server";

const euchreApp = new cdk.App();

new EuchreClientStack(euchreApp, "EuchreClientStack");
new EuchreServerStack(euchreApp, "EuchreServerStack");
