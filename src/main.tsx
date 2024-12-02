// Learn more at developers.reddit.com/docs
import { Devvit } from "@devvit/public-api";
import { TicTacToe } from "./components/TicTacToe.js";

Devvit.addCustomPostType({
    name: "Tic Tac Toe",
    render: (context) => {
        return <TicTacToe context={context} />;
    },
});

Devvit.configure({
    redditAPI: true,
});

Devvit.addMenuItem({
    label: "Add my post",
    location: "subreddit",
    forUserType: "moderator",
    onPress: async (_event, context) => {
        const { reddit, ui } = context;
        const subreddit = await reddit.getCurrentSubreddit();
        await reddit.submitPost({
            title: "Tic Tac Toe",
            subredditName: subreddit.name,
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text size="large">Loading ...</text>
                </vstack>
            ),
        });
        await ui.showToast("Post created successfully!");
    },
});

export default Devvit;
