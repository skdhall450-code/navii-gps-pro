# SEO check cleanup and contact correction — 19 November 2026

Inspected all 19 open PR heads and the latest 20 workflow runs before changes. Sixteen open heads had successful latest checks; three had failed latest checks. Current main 29a11316, SEO drafts #139/#140 and the broader website drafts #108/#134 were green. Skipped IndexNow runs after draft CI are not failures or submissions. The earlier H20P preview failure was followed by a successful corrected run.

## Failed task disposition

| PR | Observed failure | Action and remaining scope |
| --- | --- | --- |
| #3 | September build: undefined allCities; branch conflicts with current main | Closed as obsolete. Current route inventory and West India rendered checks cover 100 cities with sitemap, canonical and regional/state discovery. Branch and failed run 34360985444 retained; no merge. |
| #16 | September SEO source check: publishedLocations accessed before initialization | Archived at the user's request to remove failed tasks. The device activation feature is **not completed or deployed** and can be resumed by reopening its preserved branch. Failed run 35433514834 retained. |
| #102 | Three no-explicit-any errors, plus undefined POST handler references identified by existing #104 | Fast-forwarded only its feature branch to tested fix c8573eea from #104, after verifying a one-commit descendant and one-file diff. Fresh CI 44451630869 must be recorded in #102. No email/API write, backend or main change. |

PR #139's unchanged head 16fd1330 has successful CI 44081321757. Updated its handoff to distinguish completed technical checks from pending release, and reconcile #138's separate publication. It is not a failed task.

## Priority enquiry correction in existing PR #140

Owner confirmed 7717394007 as the only NAVII contact number. The live /contact page still displays 88997 29705 for sales, and source call links/business schema use +918899729705 while WhatsApp already uses the confirmed number. This is a contact consistency/conversion defect; no lost-call count is known.

Replace the stale sales phone in public headers, footers, contact/product/software/local-guide calls, legal/director contact labels and Organization contactPoints with +917717394007 (display +91 77173 94007). Keep WhatsApp intent, existing URLs/canonicals, form processing, customer data and backend settings intact. Existing #108/#134 changes do not implement this correction.

Update existing contact assertions to the owner's single-number instruction. Extend the existing isolated Home/mobile browser journeys to verify that every rendered call href and business-schema telephone agrees on the homepage, all five priority guides and contact form page. Do not place calls, send WhatsApp messages or submit enquiries.

Final validation and workflow links are recorded in PR #140 to avoid an extra documentation-only CI run. Earlier success 44449863376 remains evidence for the previous mobile/layout candidate, not automatic approval of this new phone correction.

## Completion boundaries

- Technical readiness, publication, search visibility, Search Console average position and actual enquiries are separate states.
- No fresh authorized Search Console export; rankings and enquiry conversion remain unverified.
- #140 and #139 remain draft under the explicit no-main/no-production release hold. No database, service or infrastructure routing change, IndexNow submission, paid spend or outreach.
- Cleanup closes or fixes active tasks; historical failed logs and source branches are retained, not relabelled successful.
- Next: verify the latest #102/#140 CI, then review remaining buyer-information gaps. Production verification requires explicit release authorization.
