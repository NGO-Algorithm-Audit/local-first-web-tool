export const getLabel = (index: number) => {
    if (index === 0) {
        return 'Most biased';
    }

    return `Cluster ${index}`;
};
