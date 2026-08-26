-- Show sold/rented properties on the public site.
--
-- The public read policy only exposed status = 'published', so marking a
-- property as sold removed it from the site entirely. Sold listings are
-- useful as social proof, so they stay readable by anonymous visitors.
-- Drafts and archived properties remain private.
--
-- property_images is already world-readable, so the gallery of a sold
-- listing keeps working without further changes.

drop policy if exists "public read published properties" on properties;
create policy "public read published properties" on properties
  for select using (
    status in ('published', 'sold', 'rented') and deleted_at is null
  );
