import { elementIsVisible } from "./elementIsVisible"

export function getVisibleImages(): HTMLImageElement[] {
  // document.getElementsByTagName("img")
  return Array.from(document.images)
    .filter((img) => elementIsVisible(img))
    .sort((a, b) => {
      const areaA = a.clientWidth * a.clientHeight;
      const areaB = b.clientWidth * b.clientHeight;

      if (areaA === areaB) {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
      }
      
      return areaB - areaA; // For getting biggest first.
    });
}
