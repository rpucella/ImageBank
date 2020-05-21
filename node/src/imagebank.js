const dal = require('./dal');
const uuidlib = require('uuid');
const move = require('./move');
const path = require('path');

function inject_link (img) {
    img.link = `/raw/${img.uuid}.${img.extension}`;
    img.text = img.content.join('\n\n');
}

function inject_tags (img, dtags) {
    img.tags = dtags[img.uuid] || [];
}

function group_tags_by_uuid (rows) {
    const result = {};
    for (let r of rows) {
	result[r.uuid] = result[r.uuid] || [];
	result[r.uuid].push(r.tag);
    }
    return result;
}

async function drafts (folder, p) { 
    const offset = (p - 1) * 10
    const results = await new dal.Images(folder).read_all_drafts(offset, 10)
    const tags = await new dal.Tags(folder).read_by_uuids(results.map(r => r.uuid));
    const dtags = group_tags_by_uuid(tags);
    for (let r of results) {
        inject_link(r);
        inject_tags(r, dtags);
    }
    return results;
}

async function count (folder) {
    const count = await new dal.Images(folder).count_all();
    return count.ct;
}

async function count_drafts (folder) {
    const count = await new dal.Images(folder).count_all_drafts();
    return count.ct;
}

async function count_tag (folder, tag) {
    const count = await new dal.Images(folder).count_all_by_tag(tag);
    return count.ct;
}

async function page (folder, p) {
    const offset = (p - 1) * 10
    const results = await new dal.Images(folder).read_all(offset, 10);
    const tags = await new dal.Tags(folder).read_by_uuids(results.map(r => r.uuid));
    const dtags = group_tags_by_uuid(tags);
    for (let r of results) {
        inject_link(r);
        inject_tags(r, dtags);
    }
    return results;
}    

async function tags_all (folder) {
    const tags = new dal.Tags(folder).read_all_tags();
    return tags;
}

async function tag (folder, t, p) { 
    const offset = (p - 1) * 10;
    const results = await new dal.Images(folder).read_all_by_tag(t, offset, 10);
    const tags = await new dal.Tags(folder).read_by_uuids(results.map(r => r.uuid));
    const dtags = group_tags_by_uuid(tags);
    for (let r of results) {
        inject_link(r);
        inject_tags(r, dtags);
    }
    return results;
}

async function image (folder, uuid) {
    const image = await new dal.Images(folder).read(uuid);
    const tags = await new dal.Tags(folder).read_by_uuid(uuid);
    const dtags = group_tags_by_uuid(tags);
    inject_link(image);
    inject_tags(image, dtags);
    return image;
}

async function edit (folder, uuid) {
    const img = await new dal.Images(folder).read(uuid);
    if (!img) {
	return;
    }
    const tags = await new dal.Tags(folder).read_by_uuid(uuid);
    const dtags = group_tags_by_uuid(tags);
    inject_link(img);
    inject_tags(img, dtags);
    return img;
}

async function draft_image (folder, uuid) {
    const img = await new dal.Images(folder).read(uuid);
    if (!img) {
	throw `Can't find UUID ${uuid}`;
    }
    img.draft = true;
    await new dal.Images(folder).update(img);
}

async function publish_image (folder, uuid) {
    const img = await new dal.Images(folder).read(uuid);
    if (!img) {
	throw `Can't find UUID ${uuid}`;
    }
    img.date_published = new Date()
    img.draft = false;
    await new dal.Images(folder).update(img);
}

async function edit_image (folder, uuid, text, tags) {
    const img = await new dal.Images(folder).read(uuid)
    if (!img) {
	throw `Can't find UUID ${uuid}`;
    }
    img.content = text
    await new dal.Images(folder).update(img)
    const tagstable = new dal.Tags(folder)
    await tagstable.delete_all_by_uuid(uuid)
    for (let t of tags) {
        await tagstable.create({'uuid': uuid, 'tag': t});
    }
}

async function add_image (folder, file, filename) {
    const f = filename.trim();
    const uuid = uuidlib.v4();
    const m = f.match(/.*\.([^.]*)$/)
    const extension = m[1];
    if (!extension) {
	throw `Cannot figure out extension of ${f}`;
    }
    await new dal.Images(folder).create({'uuid': uuid,
					 'extension': extension,
					 'content': [],
					 'draft': true});
    move(file, path.join(folder, `${uuid}.${extension}`));
    return uuid;
}
    
module.exports = {
    drafts: drafts,
    page: page,
    tags_all: tags_all,
    tag: tag,
    image: image,
    count: count,
    count_tag: count_tag,
    count_drafts: count_drafts,
    edit: edit,
    edit_image: edit_image,
    add_image: add_image,
    draft_image: draft_image,
    publish_image: publish_image
}
