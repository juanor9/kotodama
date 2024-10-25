export const getRarityColor = (rarity: number): string => {
  switch (rarity) {
    case 1:
      return "#b0bec5"; // Common
    case 2:
      return "#8bc34a"; // Uncommon
    case 3:
      return "#03a9f4"; // Rare
    case 4:
      return "#9c27b0"; // Epic
    case 5:
      return "#ffc107"; // Legendary
    default:
      return "#ffffff";
  }
};
