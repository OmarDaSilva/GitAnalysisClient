export default function getMarkerPosition(eventDate, dateKeys) {
    const eventIndex = dateKeys.indexOf(eventDate);
    const totalDates = dateKeys.length ;
  
    return ((eventIndex + 1) / totalDates) * 100;
  }