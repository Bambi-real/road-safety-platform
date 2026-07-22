-- Allow logged-in users to upload files into the report-images bucket
create policy "authenticated users can upload report images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'report-images');

-- Allow anyone to view uploaded report images
create policy "anyone can view report images"
on storage.objects for select
using (bucket_id = 'report-images');
