# Post to Slack javascript action

This action send a message to a specific Slack channel. 

## Inputs

### `job-status`

**Required** Specify the final job state.

### `slack-bot-token`

**Required** Bot token chosen to "write" in the channel.

### `channel`

**Required** Channel where the message will be sended.

## Example usage

- name: Slack message Action
    uses: ./ # Uses an action in the root directory
    id: Slack Action
    with:
        event: ${{ toJson(github.event) }}
        job-status: ${{ job.status }}
        slack-bot-token: ${{ secrets.AHO_SLACK_TOKEN }}
        channel: trabenet-notifications