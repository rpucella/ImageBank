CREATE TABLE IF NOT EXISTS version ( 
  version int 
);

CREATE TABLE IF NOT EXISTS tags (
 uuid text,
 tag text
);

CREATE TABLE IF NOT EXISTS images (
  uuid text,
  mime text,
  image blob,
  content text,
  date_created text,
  date_updated text,
  date_published text,
  draft int  
);
