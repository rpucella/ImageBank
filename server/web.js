const express = require('express');
const imagebank = require('../core/imagebank');
const path = require('path');
const busboy = require('express-busboy');
const nunjucks = require('nunjucks');

let _FOLDER = null;
let _EXPECTED_VERSION = 2;

const app = express();
const port = 8501

busboy.extend(app, {
    upload: true,
    path: '/tmp/imagebank-upload'
});

async function run (folder) {
    _FOLDER = folder;
    if (!_FOLDER.startsWith('/')) {
	_FOLDER = path.join(process.cwd(), _FOLDER);
    }
    const version = await imagebank.version(_FOLDER);
    if (version !== _EXPECTED_VERSION) {
	console.log(`Wrong DB version - expected ${_EXPECTED_VERSION} but found ${version}`);
	console.log('Aborting');
    } else {
	console.log(`Folder: ${_FOLDER}`);
	app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
    }
}

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})

// app.get('/', (req, res) => {
//     res.redirect('/page/1');
// });

// app.get('/draft/', async (req, res) => {
//     res.redirect('/draft/1');
// });

app.get('/draft/:p', async (req, res) => {
    const p = parseInt(req.params.p) || 0;
    if (p < 1) {
	res.redirect('/draft');
    }
    else {
	const count = await imagebank.count_drafts(_FOLDER);
	const results = await imagebank.drafts(_FOLDER, p);
	const total_pages = Math.trunc((count - 1) / 10) + 1;
	res.send({ pagetitle: `Drafts`, images: results, page: p, total: total_pages, base: 'draft'});
    }
});

app.get('/note/', async (req, res) => {
    res.redirect('/note/1');
});

app.get('/note/:p', async (req, res) => {
    const p = parseInt(req.params.p) || 0;
    if (p < 1) {
	res.redirect('/note');
    }
    else {
	const count = await imagebank.count_notes(_FOLDER);
	const results = await imagebank.notes(_FOLDER, p);
	const total_pages = Math.trunc((count - 1) / 10) + 1;
	res.send(nunjucks.render('notes.nj', { notes: results, page: p, total: total_pages, base: 'note'}));
    }
});

app.post('/post/new-note', async (req, res) => {
    const uuid = await imagebank.new_note(_FOLDER);
    res.send(JSON.stringify({ uuid: uuid }));
});

app.post('/post/save-note', async (req, res) => {
    const uuid = req.body.uuid;
    let text = req.body.text;
    text = text.replace(/\r/g, '').split('\n\n').map(t => t.trim());
    await imagebank.save_note(_FOLDER, uuid, text);
    res.send(JSON.stringify({ uuid: uuid }));
});


// app.get('/new/', async (req, res) => {
//     res.redirect('/new/1');
// });

app.get('/new/:p', async (req, res) => {
    const p = parseInt(req.params.p) || 0;
    if (p < 1) {
	res.redirect('/new');
    }
    else {
	const count = await imagebank.count_new(_FOLDER);
	const results = await imagebank.drafts_new(_FOLDER, p);
	const total_pages = Math.trunc((count - 1) / 16) + 1;
	res.json({ pagetitle: `New`, images: results, page: p, total: total_pages, base: 'new'});
    }
});

// app.get('/page', (req, res) => {
//     res.redirect('/page/1');
// });

app.get('/page/:p', async (req, res) => {
    const p = parseInt(req.params.p) || 0;
    if (p < 1) {
	res.redirect('/page');
    }
    else {
	const count = await imagebank.count(_FOLDER);
	const results = await imagebank.page(_FOLDER, p);
	const total_pages = Math.trunc((count - 1) / 10) + 1;
	res.json({pagetitle: `Published`, images: results, page: p, total: total_pages, base: 'page'});
    }
});

app.get('/tag', async (req, res) => {
    const results = await imagebank.tags_all(_FOLDER);
    res.json({ tags: results })
});

// app.get('/tag/:tag', (req, res) => {
//     res.redirect(`/tag/${req.params.tag}/1`);
// });

app.get('/tag/:tag/:p', async (req, res) => {
    const tag = req.params.tag || '';
    const p = parseInt(req.params.p) || 0;
    if (p < 1) {
	res.redirect('/tag/' + tag);
    }
    else { 
	const count = await imagebank.count_tag(_FOLDER, tag);
	const results = await imagebank.tag(_FOLDER, tag, p);
	const total_pages = Math.trunc((count - 1) / 10) + 1;
	res.json({ pagetitle: `Tag: ${tag}`, images: results, page: p, total: total_pages, base: `tag/${tag}`});
    }
});

app.get('/image/:uuid', async (req, res) => {
    const result = await imagebank.image(_FOLDER, req.params.uuid);
    res.json({ image: result });
});

app.get('/raw/:path', (req, res) => {
    res.sendFile(path.join(_FOLDER, req.params.path));
});

app.get('/add', (req, res) => {
    res.send(nunjucks.render('add.nj'));
});

app.get('/edit/:uuid', async (req, res) => {
    const result = await imagebank.edit(_FOLDER, req.params.uuid);
    if (result) {
	res.send({ image: result });
    }
    else {
	res.status(404).send(`No such UUID to edit: ${req.params.uuid}`);
    }
});

app.post('/post/add', async (req, res) => {
    const upload = req.files.file;
    const filename = upload.filename;
    const file = upload.file;
    const uuid = await imagebank.add_image(_FOLDER, file, filename);
    res.send(JSON.stringify({ uid: uuid }));
});

app.post('/post/edit', async (req, res) => {
    const uuid = req.body.uid;
    let text = req.body.text;
    let tags = req.body.tags;
    if (tags) {
        tags = tags.split(' ;; ');
    }
    else {
	tags = [];
    }
    text = text.replace(/\r/g, '').split('\n\n').map(t => t.trim());
    await imagebank.edit_image(_FOLDER, uuid, text, tags);
    res.send(JSON.stringify({ uid: uuid }));
});

app.post('/post/draft', async (req, res) => {
    const uuid = req.body.uid;
    await imagebank.draft_image(_FOLDER, uuid);
    res.send(JSON.stringify({ uid: uuid }));
});

app.post('/post/publish', async (req, res) => {
    const uuid = req.body.uid;
    await imagebank.publish_image(_FOLDER, uuid);
    res.send(JSON.stringify({ uid: uuid }));
});

app.get('/kill', (req, res) => {
    process.exit();
});

app.use('/static', express.static(path.join(__dirname, 'static')));


if (process.argv.length > 2) {
    run(process.argv[2]);
}
else {
    console.log('USAGE: imagebank <folder>');
}
