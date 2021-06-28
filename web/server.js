const express = require('express');
const imagebank = require('../core/imagebank');
const path = require('path');
const busboy = require('express-busboy');

let _FOLDER = null;
let _EXPECTED_VERSION = 2;

const app = express();
const DEFAULT_PORT = 8501

busboy.extend(app, {
    upload: true,
    path: '/tmp/imagebank-upload'
});

async function run (folder, port) {
    _FOLDER = folder;
    if (!_FOLDER.startsWith('/')) {
	_FOLDER = path.join(process.cwd(), _FOLDER);
    }
    const version = await imagebank.version(_FOLDER);
    if (version !== _EXPECTED_VERSION) {
	console.log(`Wrong DB version - expected ${_EXPECTED_VERSION} but found ${version}`);
	console.log('Aborting');
    } else {
	app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
    }
}

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})

app.get('/api/draft/:p', async (req, res) => {
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

app.get('/api/new/:p', async (req, res) => {
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

app.get('/api/page/:p', async (req, res) => {
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

app.get('/api/tag', async (req, res) => {
    const results = await imagebank.tags_all(_FOLDER);
    res.json({ tags: results })
});

app.get('/api/tag/:tag/:p', async (req, res) => {
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

app.get('/api/image/:uuid', async (req, res) => {
    const result = await imagebank.image(_FOLDER, req.params.uuid);
    res.json({ image: result });
});

app.get('/api/raw/:path', (req, res) => {
    res.sendFile(path.join(_FOLDER, req.params.path));
});

app.get('/api/edit/:uuid', async (req, res) => {
    const result = await imagebank.edit(_FOLDER, req.params.uuid);
    if (result) {
	res.send({ image: result });
    }
    else {
	res.status(404).send(`No such UUID to edit: ${req.params.uuid}`);
    }
});

app.post('/api/post/add', async (req, res) => {
    const upload = req.files.file;
    const filename = upload.filename;
    const file = upload.file;
    const uuid = await imagebank.add_image(_FOLDER, file, filename);
    res.send(JSON.stringify({ uid: uuid }));
});

app.post('/api/post/add-url', async (req, res) => {
  const url = req.body.url
  const uuid = await imagebank.add_image_url(_FOLDER, url);
  res.send(JSON.stringify({ uid: uuid }));
});

app.post('/api/post/delete', async (req, res) => {
    const uuid = req.body.uid
    await imagebank.delete_image(_FOLDER, uuid)
    res.send(JSON.stringify({ uid: uuid }));
});

app.post('/api/post/edit', async (req, res) => {
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

app.post('/api/post/draft', async (req, res) => {
    const uuid = req.body.uid;
    await imagebank.draft_image(_FOLDER, uuid);
    res.send(JSON.stringify({ uid: uuid }));
});

app.post('/api/post/publish', async (req, res) => {
    const uuid = req.body.uid;
    await imagebank.publish_image(_FOLDER, uuid);
    res.send(JSON.stringify({ uid: uuid }));
});

app.use(express.static(path.join(__dirname + '/../react/build')))

// anything that doesn't match the above gets redirected to react-router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../react/build/index.html'))
})

if (process.argv.length > 3) {
  run(process.argv[2], +process.argv[3])
}
else if (process.argv.length > 2) { 
  run(process.argv[2], DEFAULT_PORT)
}
else {
  console.log(`USAGE: imagebank <folder> <port=${DEFAULT_PORT}>`);
}
