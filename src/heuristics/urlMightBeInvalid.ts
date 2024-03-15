
// some heuristics about which kind of URLs are probably not garment
const wrongKeywords = [
  "Clickandcollect",
  "Clickandreserve",
  "paiement3X",
  "Newsletter",
  "Bannière",
  "Paypal",
].map(x => x.trim().toLowerCase())

/**
 * Try to determine if the URL is a good candidate or not for a garment image
 * 
 * @param url 
 */
export function urlMightBeInvalid(url: string) {

  // we skip data-uri since "normal" e-commerce websites will always use some kind of CDN
  // data uri since they are usually reserved to ads, trackers etc
  // it would look back in the index, too
  if (url.startsWith("data:")) {
    return true
  }

  for (const keyword of wrongKeywords) {
    if (url.toLowerCase().includes(keyword)) {
      return true
    }
  }

  return false
}