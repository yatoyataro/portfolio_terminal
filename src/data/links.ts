import { profile } from "./profile";

export interface Link {
  label: string;
  url: string;
}

/** Links shown in the "02 // CONNECTION" sidebar panel. Single source: profile.ts.
 *  The EMAIL_CLIENT link disappears once a form service is configured (profile.formEndpoint),
 *  matching the email hiding in HomeSection and UplinkSection. */
const emailLink: Link[] = profile.formEndpoint
  ? []
  : [{ label: "EMAIL_CLIENT", url: `mailto:${profile.email}` }];

export const sidebarLinks: Link[] = [
  ...emailLink,
  { label: "GITHUB_SYNC", url: profile.github },
  { label: "LINKEDIN_CONNECT", url: profile.linkedin },
];
