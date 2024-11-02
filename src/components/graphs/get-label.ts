export const getLabel = (index: number) => {
    if (index === 0) {
        return 'Most biased\ncluster';
    }

    return `Cluster ${index}`;
};
