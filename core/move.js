const fs = require('fs');

const renameFile = (path, newPath) => 
      new Promise((res, rej) => {
	  fs.rename(path, newPath, (err, data) =>
		    err
		    ? rej(err)
		    : res(data));
      });

const copyFile = (path, newPath) =>
      new Promise((res, rej) => {
	  const readStream = fs.createReadStream(path),
		writeStream = fs.createWriteStream(newPath, {});

	  readStream.on("error", rej);
	  writeStream.on("error", rej);
	  writeStream.on("finish", res);
	  readStream.pipe(writeStream);
      });

const unlinkFile = path => 
      new Promise((res, rej) => {
	  fs.unlink(path, (err, data) =>
		    err
		    ? rej(err)
		    : res(data));
      });

const moveFile = (path, newPath) =>
      renameFile(path, newPath)
      .catch(e => {
	  if (e.code !== "EXDEV")
              throw new e;

	  else
              return copyFile(path, newPath)
              .then(() => unlinkFile(path));
      });


module.exports = moveFile;
