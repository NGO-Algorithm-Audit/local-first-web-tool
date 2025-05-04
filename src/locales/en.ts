export const en = {
    "Let's get started! Fill out the form.":
        'Bienvenue à React et react-i18next',
    shareButton: 'Share',
    exportButton: 'Export to .json',
    getStarted: "Fill in the form to begin.",
    fileUploadError: 'Please upload a valid csv file.',
    removeButton: 'Remove',
    dropzoneLabel:
        'Drag and drop your csv file here, or click to select a file',
    datasetPreview: 'Dataset preview showing the first 5 rows.',
    error: 'Sorry, something went wrong.',
    loadingMessage: 'Setting up environment...',
    mostBiasedCluster: 'Most biased\n cluster',
    cluster: 'Cluster {{value}}',
    exportToPDF: 'Export to pdf',
    exportToJSON: 'Export synthetic data to json',
    downloadButton: 'Download',
    loadingPyodide: 'Loading Python environment...',
    loadingPackages: 'Loading core packages...',
    installingPackages: 'Installing additional packages...',
    biasSettings: {
        exportToPDF: 'Download bias analysis report as pdf',
        exportToJSON: 'Export clusters as json',
        form: {
            fieldsets: {
                data: {
                    title: 'Data',
                    dataSet: 'Dataset',
                    performanceMetric: 'Bias metric',
                },
                parameters: {
                    title: 'Parameters',
                    iterations: 'Iterations',
                    minClusterSize: 'Minimal cluster size',
                    performanceInterpretation: {
                        title: 'Bias metric interpretation',
                        lower: 'Lower value of bias metric is better, e.g., error rate',
                        higher: 'Higher value of bias metric is better, e.g., accuracy',
                    },
                },
            },
            errors: {
                csvRequired: 'Please upload a csv file.',
                targetColumnRequired: 'Please select a bias metric.',
                dataTypeRequired: 'Please select a data type.',
                noNumericColumns:
                    'No numeric columns found. Please upload a valid dataset.',
                analysisError: 'Error while analysing',
                noData: 'No data loaded',
            },
            actions: {
                tryItOut: 'Demo dataset',
                runAnalysis: 'Run analysis',
                analyzing: 'Analyzing...',
                initializing: 'Initialising...',
                selectColumn: 'Select a column',
            },
        },
        demoCard: {
            title: 'Try it out!',
            description: 'Alternatively, use our demo dataset.',
        },
    },
    syntheticData: {
        demo: {
            heading: 'Information about demo dataset',
            description:
                'A subset of the [Law School Admission Bar](https://www.kaggle.com/datasets/danofer/law-school-admissions-bar-passage)* dataset is used as a demo. Synthetic data will be generated for the following variables:',
            'post.description':
                'The CART method is used to generate the synthetic data. CART generally produces high quality synthetic data, but might not work well on datasets with categorical variables with 20+ categories. Use Gaussian Copula in those cases.\n  \n*The original paper can be found [here](https://files.eric.ed.gov/fulltext/ED469370.pdf)',
            'data.column.Variable_name': 'Variable name',
            'data.sex': 'sex',
            'data.race1': 'race1',
            'data.ugpa': 'ugpa',
            'data.bar': 'bar',

            'data.column.Description': 'Description',

            'data.column.Description.gender_of_students': 'gender of students',
            'data.column.Description.race_of_students': 'race of students',
            'data.column.Description.undergraduate_GPA_student':
                'undergraduate GPA of student (average course grades)',
            'data.column.Description.Ground_truth_label':
                'Ground truth label indicating whether or not the student passed the bar',

            'data.column.Values': 'Values',

            'data.column.Values.sex': '1 (male), 2 (female)',
            'data.column.Values.race': 'asian, black, hispanic, white, other',
            'data.column.Values.ugpa': '1-4',
            'data.column.Values.bar':
                'passed 1st time, passed 2nd time, failed, non-graduated',
        },
        exportToPDF: 'Download evaluation report as pdf',
        exportToJSON: 'Download synthetic data as json',
        exportToCSV: 'Download synthetic data as csv',
        form: {
            errors: {
                csvRequired: 'Please upload a csv file.',
                analysisError: 'Error while analysing',
                columnsCountError: 'File may contain a maximum of 8 columns.',
            },
            fieldset: {
                sourceDataset: 'Source data',
                sdgMethod: {
                    title: 'Method',
                    cart: 'CART',
                    gc: 'Gaussian Copula',
                    tooltip:
                        'By default, the CART method is used to generate synthetic data. CART generally produces higher quality synthetic data, but might not work well on datasets with categorical variables with 20+ categories. Use Gaussian Copula in those cases.',
                },
                nanTreatment: {
                    title: 'NaN values treatment',
                    drop: 'Drop rows with NaN values',
                    impute: 'Impute NaN values',
                    tooltip:
                        'When using Gaussian Copula, you can choose how to handle missing values (NaN values) in your dataset. Dropping rows with NaN values removes them completely, while imputation replaces them with mean values for numerical columns and mode values for categorical columns.',
                },
                samples: 'Number of synthetic datapoints',
            },
            actions: {
                tryItOut: 'Try it out',
                runGeneration: 'Run synthetic data generation',
                analyzing: 'Analyzing...',
                initializing: 'Initialising...',
            },
        },
        demoCard: {
            title: 'Try it out!',
            description: 'No dataset at hand? Use our demo dataset.',
        },
        columnsInDatasetInfo:
            'If the detected data types are incorrect, please change this locally in the source dataset before attaching it to the web app.',
        univariateCharts: 'Univariate distributions',
        bivariateDistributionRealData: 'Bivariate distribution',
        univariateDistributionSyntheticData: 'Univariate distribution',
        bivariateDistributionSyntheticData: 'Bivariate distribution',
        correlationRealdata: 'Correlation matrix',
        correlationSyntheticData: 'Correlation matrix',
        dataSetPreview: {
            heading: '0. Preview of real data',
        },
        columnsInDataset: '1. Data types detection',
        handlingMissingDataTitle: '2. Handling missing data',
        handlingMissingDataDescription: 'Handling missing data description',
        handlingMissingDataTableTitle: 'Columns with missing data',
        _explanatoryDataAnalysisTitle: '2. Explanatory data analysis',
        cartModelTitle: '3. Method: CART model',
        gaussianCopulaModelTitle: '3. Method: Gaussian Copula model',
        cartModelDescription:
            'The CART (Classification and Regression Trees) method generates synthetic data by learning patterns from real data through a decision tree that splits data into homogeneous groups based on feature values. It predicts averages for numerical data and assigns the most common category for categorical data, using these predictions to create new synthetic points.',
        evaluationOfGeneratedDataTitle: '4. Evaluation of generated data',
        distributionsTitle: '4.1 Distributions',
        diagnosticsReportTitle: '4.2. Diagnostic Report',
        diagnosticsTitle: 'Diagnostic Results',
        diagnosticsReportDescription: `For each column, diagnostic results are computed for the quality of the generated synthetic data. The computed metrics depend on the type of data.

For numerical (or datetime) columns the following metrics are computed:
- {tooltip:syntheticData.missingValueSimilarity}Missing value similarity{/tooltip}
- {tooltip:syntheticData.rangeCoverage}Range coverage{/tooltip}
- {tooltip:syntheticData.boundaryAdherenc}Boundary adherence{/tooltip}
- {tooltip:syntheticData.statisticSimilarity}Statistic similarity{/tooltip}
- {tooltip:syntheticData.kolmogorovSmirnovComplement}Kolmogorov–Smirnov (KS) complement{/tooltip}

For categorical (or boolean) columns the following metrics are computed:
- {tooltip:syntheticData.missingValueSimilarity}Missing value similarity{/tooltip}
- {tooltip:syntheticData.categoryCoverage}Category coverage{/tooltip}
- {tooltip:syntheticData.categoryAdherence}Category adherence{/tooltip}
- {tooltip:syntheticData.totalVariationComplement}Total variation (TV) complement{/tooltip}`,
        missingValueSimilarity:
            'Compares whether the synthetic data has the same proportion of missing values as the real data for a given column',
        rangeCoverage:
            'Measures whether a synthetic column covers the full range of values that are present in a real column',
        boundaryAdherenc:
            'Measures whether a synthetic column respects the minimum and maximum values of the real column. It returns the percentage of synthetic rows that adhere to the real boundaries',
        statisticSimilarity:
            'Measures the similarity between real column and a synthetic column by comparing the mean, standard deviation and median',
        kolmogorovSmirnovComplement:
            'Computes the similarity of a real and synthetic numerical column in terms of the column shapes, i.e., the marginal distribution or 1D histogram of the column.',
        categoryCoverage:
            'Measures whether a synthetic column covers all the possible categories that are present in a real column',
        categoryAdherence:
            'Measures whether a synthetic column adheres to the same category values as the real data',
        totalVariationComplement:
            'Computes the similarity of a real and synthetic categorical column in terms of the column shapes, i.e., the marginal distribution or 1D histogram of the column.',
        correlationMatrixTitle: 'Correlation matrix',
        correlationMatrixDescription: `The matrix below illustrates the differences in pairwise correlations between variables in the original and synthetic data. 
Green cells signify that the pairwise correlation was accurately captured, with 0 representing the best possible score. Red cells indicate poor capture of the pairwise correlation.`,
        efficacyMetricsTitle: 'Efficacy metrics',
        efficacyMetricsDescription: `Efficacy metrics comparing real and synthetic datasets for downstream predictive tasks. The idea is to train a predictive model on synthetic data and evaluate its performance on real data. The type of metrics computed depends on the task:

For regression (when the target is numerical):
- Mean Squared Error (MSE)
- Mean Absolute Error (MAE)
- R^2 Score

For classification (when the target is categorical/boolean):
- Accuracy Score
- Weighted F1 Score`,
        disclosureProtectionTitle: 'Privacy metrics',
        disclosureProtectionDescription: `A class to compute the disclosure protection metric for synthetic data. This metric measures the proportion of synthetic records that are too similar (within a defined threshold) to real records, posing a disclosure risk.`,
        outputDataTitle: '5. Generated synthetic data',
        moreInfoTitle: '6. More information',
        correlationDifference:
            'Correlation difference: {{correlationDifference}}',
        univariateText:
            '{{samples}} synthetic data points are generated using CART. The figures below display the value frequency for each variable. The synthetic data is of high quality when the frequencies are approximately the same.',
        bivariateText:
            'The figures below display the differences in value frequency for a combination of variables. For comparing two categorical variables, bar charts are plotted. For comparing a numerical and a categorical variables, a so called [violin plot](https://en.wikipedia.org/wiki/Violin_plot) is shown. For comparing two numercial variables, a [LOESS plot](https://en.wikipedia.org/wiki/Local_regression) is created. For all plots holds: the synthetic data is of high quality when the shape of the distributions in the synthetic data equal the distributions in the real data.',
        moreInfo:
            'Do you want to learn more about synthetic data?\n  \n  \n  \n- [python-synthpop on Github](https://github.com/NGO-Algorithm-Audit/python-synthpop)\n- [local-first web app on Github](https://github.com/NGO-Algorithm-Audit/local-first-web-tool/tree/main)\n- [Synthetic Data: what, why and how?](https://royalsociety.org/-/media/policy/projects/privacy-enhancing-technologies/Synthetic_Data_Survey-24.pdf)\n- [Knowledge Network Synthetic Data](https://online.rijksinnovatiecommunity.nl/groups/399-kennisnetwerk-synthetischedata/welcome) (for Dutch public organizations)\n- [Synthetic data portal of Dutch Executive Agency for Education](https://duo.nl/open_onderwijsdata/footer/synthetische-data.jsp) (DUO)\n- [CART: synthpop resources](https://synthpop.org.uk/resources.html)\n- [Gaussian Copula - Synthetic Data Vault](https://docs.sdv.dev/sdv)',
        missingData: `For {tooltip:syntheticData.missingDataMARTooltip}Missing At Random (MAR){/tooltip} and {tooltip:syntheticData.missingDataMNARTooltip}Missing Not At Random (MNAR){/tooltip} data, 
we recommend to impute the missing data. For {tooltip:syntheticData.missingDataMCARTooltip}Missing Completely At Random (MCAR){/tooltip}, we recommend to remove the missing data.`,
        missingDataMARTooltip: `**MAR (Missing At Random)**:
- The probability of data being missing is related to the observed data but not the missing data itself.
- The missingness can be predicted by other variables in the dataset.
- Example: Students' test scores are missing, but the missingness is related to their attendance records.
- Recommendation: impute missing data.`,
        missingDataMNARTooltip: `**MNAR (Missing Not At Random)**:
- The probability of data being missing is related to the missing data itself. 
- There is a systematic pattern to the missingness that is related to the unobserved data.
- Example: Patients with more severe symptoms are less likely to report their symptoms, leading to missing data that is related to the severity of the symptoms.
- Recommendation: impute missing data.`,
        missingDataMCARTooltip: `**MCAR (Missing Completely At Random)**:
- The probability of data being missing is completely independent of both observed and unobserved data. 
- There is no systematic pattern to the missingness.
- Example: A survey respondent accidentally skips a question due to a printing error.
- Recommendation: remove missing data.`,
    },

    biasAnalysis: {
        demo: {
            heading: 'Information about demo dataset',
            description:
                'As a demo, the [Twitter15](https://www.dropbox.com/scl/fi/flgahafqckxtup2s9eez8/rumdetect2017.zip?dl=0&e=1&file_subpath=%2Frumor_detection_acl2017%2Ftwitter15&rlkey=b7v86v3q1dpvcutxqk0xi7oej) dataset is loaded below. The dataset contains features of tweets and the prediction of a BERT-based misinformation classifier whether the tweet is fake news or not. False positive classifications are marked as FP. The FP column indicates that a tweet is falsy accused by the misinformation detection algorithm to be fake news. The FP metric will be used as a performance metric to measure bias is this use case.\n  \n&nbsp;&nbsp;\n\n In this example, we will examine what type of tweets are more/less often classified by misinformation detection algorithm as fake news.',
        },
        parameters: {
            heading: 'Parameters selected for clustering',
            iterations: 'Number of iterations: {{value}}',
            minClusterSize: 'Minimal cluster size: {{value}}',
            performanceMetric: 'Performance metric column: {{value}}',
            dataType: 'Data type: {{value}}',
        },
        clusters: {
            summary:
                'We found {{clusterCount}} clusters. Cluster with most bias consists of {{biasedCount}} datapoints. The uploaded dataset consists of {{totalCount}} datapoints.',
            sizeHint:
                'By adapting the "Minimal cluster size" parameter, the number of clusters can be controlled.',
        },
        biasedCluster: {
            heading: 'In the most biased cluster datapoints have:',
            accordionTitle:
                'Open details to view feature comparisons to the rest of the dataset',
            comparison: {
                less: '{{value}} less {{feature}} than in the rest of the dataset.',
                more: '{{value}} more {{feature}} than in the rest of the dataset.',
                equal: 'equal {{feature}} as in the rest of the dataset.',
            },
        },
        distribution: {
            heading:
                'The "{{variable}}" variable distribution across the different clusters:',
        },
    },
    heatmap: {
        realdata: 'Correlation matrix of attached data',
        syntheticdata:
            'Absolute difference in correlation matrix, i.e., |attached data - synthetic data|',
        synthData: 'Correlation matrix of synthetic data',
    },
    distribution: {
        distributionFor: 'Distribution for',
        countFor: 'Distribution for',
        frequency: 'Frequency',
        syntheticData: 'Synthetic data',
        realData: 'Real data',
        percentage: 'Percentage of dataset',
        by: 'by',
        distributionOf: 'Distribution of',
    },
};
