import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

const port = 8080;

interface IFrameProps {
    frame?: string;
    imageUrl: string;
    buttons?: string[];
    postUrl?: string;
}

function generateFarcasterFrameMetaTag({ frame, imageUrl, postUrl, buttons }: IFrameProps): string {
    // Default to vNext
    if (!frame) {
        frame = "vNext"
    }
    // Ensure there are at most four buttons
    if (buttons && buttons.length > 4) {
        throw new Error("Maximum of four buttons are allowed per frame.");
    }

    // Generate Open Graph tags for image, redirect, and buttons
    let metaTag = `<meta property="fc:frame" content="${frame ? frame : "vNext"}" />\n`;
    metaTag += `<meta property="fc:frame:image" content="${imageUrl}" />\n`;

    if (buttons) {
        buttons.forEach((button, index) => {
            metaTag += `<meta property="fc:frame:button:${index + 1}" content="${button}" />\n`;
        });
    }

    // post URL if exists
    if (postUrl) {
        metaTag += `<meta property="fc:frame:post_url" content="${postUrl}" /> \n`
    }

    return metaTag;
}

function frameGenerator(frameProps: IFrameProps): string {
    const metaTag = generateFarcasterFrameMetaTag(frameProps);

    const html = `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Sheep Counter</title>
                <meta property="og:title" content="Sheep Counter" />
                <meta property="og:image" content="${frameProps.imageUrl}" />
                ${metaTag}
            </head>
            <body>
                <img src="${frameProps.imageUrl}" alt="Frame Image" />
                <div id="counter">0</div>
                <button id="countButton">Count</button>

                <script>
                    let count = 0;
                    document.getElementById('countButton').addEventListener('click', () => {
                        count++;
                        document.getElementById('counter').textContent = count;
                    });
                </script>
            </body>
        </html>
    `;
    return html;
}

app.get('/frame', (req, res) => {

    const frameProps: IFrameProps = {
        imageUrl: 'https://i.imgur.com/tpSgwjH.png',
        buttons: ['Count'],
    };

    res.status(200).send(frameGenerator(frameProps));
});

app.post('/frame', (req, res) => {

    console.log(req.body)

    const frameProps: IFrameProps = {
        imageUrl:  'https://i.imgur.com/tpSgwjH.png',
        buttons: ['Count'],

    };
    
    res.status(200).send(frameGenerator(frameProps));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
