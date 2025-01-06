const formatRooms = (rooms: number | null | undefined): string | null => {
    if (!rooms) return null;
    return `${rooms} ${rooms > 1 ? "camere" : "camera"}`;
    };
  
  export default formatRooms;