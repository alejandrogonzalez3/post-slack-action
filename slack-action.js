const core = require("@actions/core");
const github = require("@actions/github");
const https = require("https");

try {
  const status = core.getInput("job-status");
  let state = status === "success" ? "SUCCESS" : status === "failure" ? "FAILURE" : "CANCELLED";
  let color = status === "success" ? "#2e993e" : status === "failure" ? "#bd0f26" : "#d29d0c";
  let event;
  switch (github.context.eventName) {
    case "push":
      event = "Push";
      break;
    case "pull_request":
      event = "Pull Request"
      break;
    case "deployment":
      event = "Deploy"
      break;
    default:
      event = github.context.eventName
  };
  let branch = github.context.ref.split("/").splice(-1)[0];

  let eventInfo = core.getInput("event");
  let content = github.context.payload.pull_request !== undefined ? `Pull Request #${github.context.payload.pull_request.number} : ${github.context.payload.pull_request.html_url}  on *${branch}* branch`
  : `Commit: ${JSON.parse(eventInfo).head_commit.url} on *${branch}* branch`; 

  const postData = JSON.stringify({
    channel: `${core.getInput("channel")}`,
    attachments: [
      {
        color: color,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${state}*`
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "image",
                image_url: `https://github.com/${github.context.actor}.png`,
                alt_text: "images"
              },
              {
                type: "mrkdwn",
                text: `*Author:* ${github.context.actor}`
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${content}`
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "image",
                image_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                alt_text: "images"
              },
              {
                type: "mrkdwn",
                text: `<https://github.com/${github.context.repo.owner}/${github.context.repo.repo}| ${github.context.repo.repo}>`
              }
            ]
          }
        ],
      },
    ],
  });

  let options = {
    hostname: "slack.com",
    port: 443,
    path: "/api/chat.postMessage",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length,
      Authorization: `Bearer ${core.getInput("slack-bot-token")}`,
      Accept: "application/json",
    },
  };

  let req = https.request(options, (res) => {
    res.setEncoding("utf8");
  });

  req.write(postData);
  req.end();
} catch (error) {
  core.setFailed(error.message);
}