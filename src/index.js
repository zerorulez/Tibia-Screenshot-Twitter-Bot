const Twitter = require('twitter');
var chokidar = require('chokidar');
const homedir = require('os').homedir();

require('dotenv').config()

let path = homedir + '\\AppData\\Local\\Tibia\\packages\\Tibia\\screenshots'

var watcher = chokidar.watch(path, {ignored: /^\./, persistent: true});

const client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.TOKEN_SECRET
});

const world = 'Serenebra'

watcher.on('ready', () => {

    console.log('Estou de olho pasta de screenshots: ' + path);

    watcher.on('add', path => {
        
        var data = require('fs').readFileSync(path);
        var tweet = ''

        if (path.includes(process.env.CHARACTER_NAME)) {
            if (path.includes('LevelUp')) {
                tweet = '#LevelUp #Tibia #' + world
                postMedia(tweet, data)
            } else if (path.includes('SkillUp')) {
                tweet = '#SkillUp #Tibia #' + world
                // postMedia(tweet, data)
            } else if (path.includes('Achievement')) {
                tweet = '#Achievement #Tibia #' + world
                // postMedia(tweet, data)
            } else if (path.includes('Hotkey')) {
                tweet = '#Tibia #' + world
                postMedia(tweet, data)
            } else if (path.includes('Death')) {
                tweet = '#Death #Tibia #' + world
                postMedia(tweet, data)
            }
        }
    })
})

function postMedia(tweet, data) {
    client.post('media/upload', {media: data}).then( (media) => {
        var status = {
            status: tweet,
            media_ids: media.media_id_string // Pass the media id string
        }

        client.post('statuses/update', status).then( () => {
            console.log('Upload feito com sucesso!');
        })
    })
}
// // ATENÇÃO!!!! ISSO APAGA TODOS OS POSTS.
// client.get('statuses/user_timeline', ({'user_id': '1347961709143728133', count: 200}),function(error, tweet, response) {
//     tweet.map( (t) => {
//         client.post('statuses/destroy', {id: t.id_str}, function(error, data, response) {
//             console.log(data)
//         })
//     })
// })