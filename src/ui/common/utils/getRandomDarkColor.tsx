export const getRandomDarkColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60;
    const lightness = Math.floor(Math.random() * 30) + 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
