import { AnyThreadChannel, Message } from "discord.js";
import { openai } from "../lib/openai";
import { type QuackerAIThreads, prisma, getLatestAppConfig } from "database";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { setTimeout } from "timers/promises";
import { DuckClient } from "../types";

const createThreads: (
  discordThread: string
) => Promise<QuackerAIThreads> = async (discordThread: string) => {
  console.log(`Creating AI Thread for ${discordThread}`);

  const aiThreadRes = await openai.beta.threads.create();
  const prismaRes = await prisma.quackerAIThreads.create({
    data: {
      threadAIID: aiThreadRes.id,
      threadDiscordChannelID: discordThread,
    },
  });

  console.log(`AI Thread (${aiThreadRes.id}) created.`);

  return prismaRes;
};

const getThreads: (
  discordThread: string
) => Promise<QuackerAIThreads | null> = async (discordThread: string) => {
  return await prisma.quackerAIThreads.findFirst({
    where: {
      threadDiscordChannelID: discordThread,
    },
  });
};

const addMessageToThread: (
  message: Message<boolean>,
  aiThread: string
) => Promise<void> = async (message: Message<boolean>, aiThread: string) => {
  console.log(
    `Adding message (\"${message.content}\") to AI thread ${aiThread}`
  );

  await openai.beta.threads.messages.create(aiThread, {
    role: "user",
    content: `<@${message.author.id}> ${message.content}`,
  });

  console.log(`Message added to AI thread ${aiThread}`);
};

const startRun: (aiThread: string) => Promise<Run> = async (
  aiThread: string
) => {
  const appConfig = await getLatestAppConfig();

  console.log(`Starting run of AI thread ${aiThread}`);

  return await openai.beta.threads.runs.create(aiThread, {
    assistant_id: appConfig.AIID,
  });
};

const waitForRunCompletion: (
  aiThread: string,
  runID: string
) => Promise<void> = async (aiThread: string, runID: string) => {
  let waitAttempts: number = 15;

  console.log(`Waiting for AI thread ${aiThread} to finish run ${runID}`);

  while (waitAttempts > 0) {
    const res = await openai.beta.threads.runs.retrieve(aiThread, runID);

    if (
      res.status == "cancelled" ||
      res.status == "completed" ||
      res.status == "failed"
    ) {
      console.log(
        `AI thread ${aiThread} finished run ${runID} with status ${res.status}`
      );

      return;
    } else {
      if (waitAttempts % 3 == 0) {
        console.log(
          `Waiting for AI thread ${aiThread} to finish run ${runID} (Remaining wait attempts: ${waitAttempts})`
        );
      }

      await setTimeout(3e3);
      waitAttempts--;
    }
  }

  throw new Error("AI took too long to respond!");
};

const getNewMessages: (
  oldMessage: Message<boolean>,
  aiThread: string
) => Promise<Array<string>> = async (
  oldMessage: Message<boolean>,
  aiThread: string
) => {
  console.log(`Getting messages for AI thread ${aiThread}`);
  const messages = await openai.beta.threads.messages.list(aiThread);

  let newMessages: Array<string> = [];

  console.log(`Sorting messages for AI thread ${aiThread}`);

  // OpenAI gives us the newest message first, so we go in reverse order
  let reachedLastMessage: boolean = false;
  for (let i = messages.data.length - 1; i >= 0; i--) {
    const message = messages.data[i];

    if (message.content[0].type != "text") {
      console.error(
        `Received ${message.content[0].type}, which isn't supported!`
      );
      continue;
    }

    if (
      message.content[0].text.value ==
      `<@${oldMessage.author.id}> ${oldMessage.content}`
    ) {
      reachedLastMessage = true; // Reached the message that triggered this run
      continue;
    }

    if (reachedLastMessage) {
      newMessages.push(message.content[0].text.value);
    }
  }

  console.log(`Sorted new messages for AI thread ${aiThread}`);

  return newMessages;
};

const handleNewAIThread = async (discordThread: AnyThreadChannel<boolean>) => {
  console.log(`Joining thread ${discordThread.id} (${discordThread.name})`);
  await discordThread.join();

  const threads = await createThreads(discordThread.id);

  for (
    let i = 0;
    i < (discordThread.client as DuckClient).delayedMessages.length;
    i++
  ) {
    const message = (discordThread.client as DuckClient).delayedMessages[i];

    if (message.channelId != discordThread.id) {
      continue;
    }

    const typingPromise = message.channel.sendTyping();

    console.log(`Found delayed message, sending to AI`);

    (discordThread.client as DuckClient).delayedMessages.splice(i, 1);

    await addMessageToThread(message, threads.threadAIID);

    const run = await startRun(threads.threadAIID);

    await waitForRunCompletion(threads.threadAIID, run.id);

    const newMessages = await getNewMessages(message, threads.threadAIID);

    await typingPromise;

    newMessages.forEach((msg) => {
      message.channel.send(msg);
    });

    break;
  }
};

const handleNewAIMessage = async (discordMessage: Message<boolean>) => {
  const typingPromise = discordMessage.channel.sendTyping();

  const threads = await getThreads(discordMessage.channelId);
  if (threads == null) {
    console.error(
      `getThreads returned null for discordThread ${discordMessage.channelId}`
    );
    discordMessage.channel.send({
      content:
        "Sorry, Quacker is not available right now. Please try again later",
    });
    return;
  }

  await addMessageToThread(discordMessage, threads.threadAIID);
  const run = await startRun(threads.threadAIID);
  await waitForRunCompletion(threads.threadAIID, run.id);

  const newMessages = await getNewMessages(discordMessage, threads.threadAIID);

  await typingPromise;

  newMessages.forEach((msg) => {
    discordMessage.channel.send(msg);
  });

  return;
};

export {
  createThreads,
  getThreads,
  addMessageToThread,
  startRun,
  waitForRunCompletion,
  getNewMessages,
  handleNewAIThread,
  handleNewAIMessage,
};
