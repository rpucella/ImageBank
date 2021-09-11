const dal = require('./dal');
const create = require('./create');
const uuidlib = require('uuid');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

function inject_link (img) {
  img.link = `/raw/${img.uuid}`
  img.text = img.content.join('\n\n')
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

async function version (folder) {
  const v = await new dal.Version(folder).read();
  return v.version;
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

async function drafts_new (folder, p) { 
  const offset = (p - 1) * 16
  const results = await new dal.Images(folder).read_all_new(offset, 16)
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

async function count_new (folder) {
  const count = await new dal.Images(folder).count_all_new();
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
  console.log('uuid =', uuid)
  const image = await new dal.Images(folder).read(uuid);
  const previous = await new dal.Images(folder).read_previous(uuid);
  const next = await new dal.Images(folder).read_next(uuid);
  const tags = await new dal.Tags(folder).read_by_uuid(uuid);
  const dtags = group_tags_by_uuid(tags);
  console.log('image =', image)
  inject_link(image);
  inject_tags(image, dtags);
  image.previous = previous?.uuid;
  image.next = next?.uuid;
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
  const f = filename.trim()
  const uuid = uuidlib.v4()
  const m = f.match(/.*\.([^.]*)$/)
  const extension = m[1]
  let contentType
  if (extension === 'jpeg' || extension === 'jpg') {
    contentType = 'image/jpeg'
  }
  else if (extension === 'png') {
    contentType = 'image/png'
  }
  else {
    console.log(`Unrecognized extension ${extension}`)
    throw `Unrecognized extension ${extension}`
  }
  // process filename!
  const image = fs.readFileSync(file)
  await new dal.Images(folder).create({'uuid': uuid,
				       'mime': contentType,
                                       'image': image,
				       'content': [],
				       'draft': true});
  return uuid;
}

async function downloadImage(url, p) {
  const writer = fs.createWriteStream(p)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })
  response.data.pipe(writer)
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function add_image_url (folder, url) {
  const uuid = uuidlib.v4()
  const {headers} = await axios.head(url)
  const contentType = headers['content-type']
  if (contentType !== 'image/jpeg' && contentType !== 'image/png') {
    console.log(`Unrecognized MIME type ${contentType}`)
    throw `Unrecognized MIME type ${contentType}`
  }
  // TODO - don't bother downloading to a file!
  const p = path.join(folder, `${uuid}.${extension}`)
  await downloadImage(url, p)
  await new dal.Images(folder).create({'uuid': uuid,
				       'mime': contentType,
                                       'image': null,
				       'content': [],
				       'draft': true})
  return uuid
}

async function delete_image (folder, uuid) {
  await new dal.Tags(folder).delete_all_by_uuid(uuid)
  const img = await new dal.Images(folder).read(uuid)
  await new dal.Images(folder).delete(uuid)
}

async function create_db(folder, version) {
  await create.create_db(folder)
  await new dal.Version(folder).create({
    version: version
  })
}

module.exports = {
  version: version,
  drafts: drafts,
  drafts_new: drafts_new,
  page: page,
  tags_all: tags_all,
  tag: tag,
  image: image,
  count: count,
  count_tag: count_tag,
  count_drafts: count_drafts,
  count_new: count_new,
  edit: edit,
  edit_image: edit_image,
  add_image: add_image,
  delete_image: delete_image,
  draft_image: draft_image,
  publish_image: publish_image,
  create_db: create_db,
  add_image_url: add_image_url
}
