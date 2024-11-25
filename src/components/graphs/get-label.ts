export const getLabel = (index: number) => {
    if (index === 0) {
        return { key: 'mostBiasedCluster' };
    }

    return { key: 'cluster', params: { value: index } };
};
