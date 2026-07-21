export { inheritanceDeathPages } from "./inheritance-death";
export { jeonseLeasePages } from "./jeonse-lease";
export { realEstateTradePages } from "./real-estate-trade";
export { debtRehabPages } from "./debt-rehab";
export { corporateBusinessPages } from "./corporate-business";
export { debtCollectionPages } from "./debt-collection";
export { contractDisputePages } from "./contract-dispute";

import { inheritanceDeathPages } from "./inheritance-death";
import { jeonseLeasePages } from "./jeonse-lease";
import { realEstateTradePages } from "./real-estate-trade";
import { debtRehabPages } from "./debt-rehab";
import { corporateBusinessPages } from "./corporate-business";
import { debtCollectionPages } from "./debt-collection";
import { contractDisputePages } from "./contract-dispute";

export const newSituationPages = [
  ...inheritanceDeathPages,
  ...jeonseLeasePages,
  ...realEstateTradePages,
  ...debtRehabPages,
  ...corporateBusinessPages,
  ...debtCollectionPages,
  ...contractDisputePages,
];
