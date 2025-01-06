function capitalizeFirstLetter(str: string): string {
    if (!str) return ""; // Handle empty or undefined strings gracefully
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default capitalizeFirstLetter;