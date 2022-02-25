import * as icons from '@/assets/regionIcons';

export default function mapRegionToIcon(region) {
   const formattedRegion = region.replace(/\s+/g, '').toLowerCase();
   return icons[formattedRegion];
}
