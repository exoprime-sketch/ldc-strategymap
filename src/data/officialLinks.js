import OFFICIAL_LINK_WHITELIST from "../../official_link_whitelist_asean.json";
import { collectAllowedHosts, flattenWhitelistLinks } from "../lib/urlSafety.js";

export { OFFICIAL_LINK_WHITELIST };

export const ALLOWED_EXTERNAL_HOSTS =
  collectAllowedHosts(OFFICIAL_LINK_WHITELIST);

export const WHITELIST_LINK_ROWS =
  flattenWhitelistLinks(OFFICIAL_LINK_WHITELIST);

