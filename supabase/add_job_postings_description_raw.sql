alter table public.job_postings
add column if not exists description_raw text;

update public.job_postings
set description_raw = description
where description_raw is null
  and description is not null;
