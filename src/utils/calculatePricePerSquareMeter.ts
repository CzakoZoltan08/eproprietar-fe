const calculatePricePerSquareMeter = (price?: number, surface?: number): number => {
    return price && surface ? Math.round(price / surface) : 0;
};

export default calculatePricePerSquareMeter;