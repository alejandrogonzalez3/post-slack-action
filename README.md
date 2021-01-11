# GitHub Action: Post Slack Message (Git Event)

This action send a event notification to a specific Slack channel.

## Inputs

| param            | required | purpose                                       |
|:-----------------|:---------|-----------------------------------------------|
|`event`           | ✓        | Event to notify                               |
|`job-status`      | ✓        | Specifies the final job state                 |
|`slack-bot-token` | ✓        | Bot token chosen to "write" in the channel    |
|`channel`         | ✓        | Channel where the message will be sended      |

## Usage

```
- name: Slack message Action
    uses: ./ # Uses an action in the root directory
    id: Slack Action
    with:
        event: ${{ toJson(github.event) }}
        job-status: ${{ job.status }}
        slack-bot-token: ${{ secrets.AHO_SLACK_TOKEN }}
        channel: proba
```