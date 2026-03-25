alter table public.job_postings
add column if not exists company_logo_url text;

update public.job_postings
set company_logo_url = 'https://logos-api.apistemic.com/domain:' || company_domain
where company_logo_url is null
  and company_domain is not null;
