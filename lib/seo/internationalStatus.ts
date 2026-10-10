// International guides are enabled following the approved restart.
// Change this shared switch to control robots and sitemap membership together.
export const internationalSeoEnabled = true;

export const internationalRobots = internationalSeoEnabled
  ? { index: true, follow: true }
  : { index: false, follow: true };
