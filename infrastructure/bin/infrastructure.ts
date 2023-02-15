#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { EventBridgePipeSample } from "../lib/eventbridge-pipes-sample";

const app = new cdk.App();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new EventBridgePipeSample(app, EventBridgePipeSample.name);
