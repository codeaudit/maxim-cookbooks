import { ChatBedrockConverse } from "@langchain/aws";
import { Maxim } from "@maximai/maxim-js";
import { MaximLangchainTracer } from "@maximai/maxim-js-langchain";

import "dotenv/config";


async function main() {
    const repoId = process.env.MAXIM_LOG_REPO_ID!;
    const maxim = new Maxim({
        apiKey: process.env.MAXIM_API_KEY!,
    });
    const logger = await maxim.logger({ id: repoId });
    const query = "Hi Bedrock, what is 3 + 5?";
    const maximTracer = new MaximLangchainTracer(logger);

    const llm = new ChatBedrockConverse({
        region: process.env.BEDROCK_AWS_REGION ?? "us-east-1",
        credentials: {
            secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
            accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
        },
        model: "anthropic.claude-3-haiku-20240307-v1:0",
        temperature: 0,
        topP: 1,
        callbacks: [maximTracer],
        metadata: {
            maxim: { generationName: "generation", generationTags: { test: "bedrock" } },
        },
    });

    await llm.invoke(query);

    await maxim.cleanup();
}

main();