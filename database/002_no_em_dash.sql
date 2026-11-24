-- Removes the em dash character from every project text already in the database.
-- Run once in phpMyAdmin on `jh6rkj_portfolio` (SQL tab). Safe to re-run.
SET NAMES utf8mb4;

UPDATE `projects` SET
  `title`       = REPLACE(REPLACE(`title`,       ' — ', ' - '), '—', '-'),
  `subtitle`    = REPLACE(REPLACE(`subtitle`,    ' — ', ' - '), '—', '-'),
  `category`    = REPLACE(REPLACE(`category`,    ' — ', ' - '), '—', '-'),
  `context`     = REPLACE(REPLACE(`context`,     ' — ', ' - '), '—', '-'),
  `role`        = REPLACE(REPLACE(`role`,        ' — ', ' - '), '—', '-'),
  `tech_stack`  = REPLACE(REPLACE(`tech_stack`,  ' — ', ' - '), '—', '-'),
  `description` = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(`description`, ' — ', ' - '), '—', '-'), '&mdash;', '-'), '&#8212;', '-'), '&#x2014;', '-'),
  `highlights`  = REPLACE(REPLACE(REPLACE(`highlights`, ' — ', ' - '), '—', '-'), '&mdash;', '-');
