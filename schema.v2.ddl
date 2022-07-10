CREATE TABLE IF NOT EXISTS version ( 
  version int 
);

CREATE TABLE IF NOT EXISTS tags (
 uuid text,
 tag text
);

CREATE TABLE IF NOT EXISTS images (
  uuid text,
  extension text,
  content text,
  date_created text,   -- was `timestamp`
  date_updated text,
  date_published text,
  draft int
);

CREATE TABLE IF NOT EXISTS notes (
  uuid text,
  content text,
  date_updated text
);


-- v1
-- 
-- CREATE TABLE IF NOT EXISTS images (
--   uuid text,
--   extension text,
--   content text,
--   ordinal int, 
--   timestamp text,
--   draft int
-- );


