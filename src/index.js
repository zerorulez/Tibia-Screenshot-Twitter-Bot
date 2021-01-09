const Twitter = require('twitter');
var chokidar = require('chokidar');

require('dotenv').config()

var watcher = chokidar.watch('C:/Users/zero/AppData/Local/Tibia/packages/Tibia/screenshots', {ignored: /^\./, persistent: true});

const client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.TOKEN_SECRET
});

watcher.on('ready', () => {
    watcher.on('add', path => {
        
        var data = require('fs').readFileSync(path);
        var tweet = ''

        if (path.includes('Lucius Eliron')) {
            if (path.includes('LevelUp')) {
                tweet = '#LevelUp #Tibia'
            } else if (path.includes('SkillUp')) {
                tweet = '#SkillUp #Tibia'
            } else if (path.includes('Achievement')) {
                tweet = '#Achievement #Tibia'
            } else if (path.includes('Hotkey')) {
                tweet = '#Tibia'
            }
        }

        // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {media: data}, function(error, media, response) {
            if (!error) {

                // Lets tweet it
                var status = {
                    status: tweet,
                    media_ids: media.media_id_string // Pass the media id string
                }

                client.post('statuses/update', status, function(error, tweet, response) {
                    if (!error) {
                        console.log(tweet);
                    }
                });

            }
        });
    })
})