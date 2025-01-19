export const Test = () => (
    <GroupBarChart
        yAxisLabel={'count'}
        data={[
            {
                name: 'test1',
                values: [
                    {
                        name: 'testa',
                        value: 2,
                    },
                    {
                        name: 'testb',
                        value: 3,
                    },
                ],
            },
            {
                name: 'test2',
                values: [
                    {
                        name: 'testa',
                        value: 2,
                    },
                    {
                        name: 'testb',
                        value: 3,
                    },
                ],
            },
            {
                name: 'test3',
                values: [
                    {
                        name: 'testa',
                        value: 4,
                    },
                    {
                        name: 'testb',
                        value: 2,
                    },
                ],
            },
        ]}
        title={`testa vs testb`}
    />
);
