export const en = {
    "Let's get started! Fill out the form.":
        'Bienvenue à React et react-i18next',
    shareButton: 'Share',
    exportButton: 'Export to .json',
    getStarted: 'Fill in the form to begin.',
    fileUploadError: 'Please upload a valid csv file.',
    removeButton: 'Remove',
    dropzoneLabel:
        'Drag and drop your csv file here, click to select one of your own files or use the "Demo dataset" button',
    datasetPreview: 'Dataset preview showing the first 5 rows.',
    error: 'Sorry, something went wrong.',
    loadingMessage: 'Setting up environment...',
    mostBiasedCluster: 'Most biased\n cluster',
    cluster: 'Cluster {{value}}',
    exportToPDF: 'Export to pdf',
    exportToJSON: 'Export synthetic data to json',
    downloadButton: 'Download',
    loadingPyodide: 'Loading Python environment...',
    loadingPackages:
        'Loading core packages. On average this takes 10-15 seconds.',
    installingPackages: 'Installing additional packages...',
    biasSettings: {
        exportToPDF: 'Download bias analysis report as pdf',
        exportToJSON: 'Export clusters as json',
        form: {
            fieldsets: {
                data: {
                    title: 'Data',
                    dataSet: 'Dataset',
                    dataSetTooltip: `Preprocess your data such that: 
                    - missing values are removed or replaced;
                    - all columns (except your bias metric column) should have the same datatypes, e.g., numerical or categorical;
                    - the bias metric column is numerical`,
                    performanceMetric: 'Bias metric',
                    performanceMetricTooltip:
                        'Clustering will be performed on the bias metrics. The bias metric should be numerical. Examples of bias metrics are "being classified as high risk" or "selected for an investigation"',
                    dataType: 'Type of data',
                    dataTypeTooltip:
                        'Specify whether the data are categorical or numerical. All columns (except your bias metric column) should have the same data type',
                    categoricalData: 'Categorical data',
                    numericalData: 'Numerical data',
                    filterSelect:
                        'Select a column to show cluster distribution for',
                },
                parameters: {
                    title: 'Parameters',
                    iterations: 'Iterations',
                    minClusterSize: 'Minimal cluster size',
                    performanceInterpretation: {
                        title: 'Bias metric interpretation',
                        lower: 'Lower value of bias metric is better, such as error rate',
                        higher: 'Higher value of bias metric is better, such as accuracy',
                        tooltip:
                            'When error rate or misclassifications are chosen as the bias metric, a lower value is preferred, as the goal is to minimize errors. Conversely, when accuracy or precision is selected as the bias metric, a higher value is preferred, reflecting the aim to maximize performance.',
                    },
                    iterationsTooltip:
                        'Number of times the dataset is split in smaller clusters until the minimal cluster size is reached',
                    minClusterSizeTooltip:
                        'The minimum number of samples per cluster. By default set to 10% of the number of rows in the attached dataset.',
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
                numericDataRequired:
                    'Selected column must contain numerical data for k-means clustering.',
                categoricalDataRequired:
                    'Selected column must contain categorical data for k-modes clustering.',
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
- {tooltip:syntheticData.totalVariationComplement}Total variation (TV) complement{/tooltip}

💯 All values need to be close to 1.0 `,
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
        correlationMatrixDescription: `The matrices below display the pairwise correlations in the original and synthetic data. Green cells represent weak pairwise correlations, while red cells denote strong pairwise correlations. The color patterns in the two matrices should appear identical.`,
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
        testingStatisticalSignificance: `**4. Testing statistical significance for the bias score difference between the most deviating cluster and the rest of the dataset**

- <i class="font-serif">H</i><sub>0</sub>: no difference in bias between the most deviating cluster and the rest of the dataset
- <i class="font-serif">H</i><sub>1</sub>: difference in bias between the most deviating cluster and the rest of the dataset

A two-sided t-test is performed to accept or reject <i class="font-serif">H</i><sub>0</sub>:.

p_value : {{p_val}}
        `,
        dataSetPreview: {
            heading: '0. Preview of real data',
        },
        demo: {
            heading: 'Information about demo dataset',
            description: `As a demo, the [COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) dataset](https://github.com/propublica/compas-analysis/tree/master) is loaded. The dataset contains features about criminal defendants and their risk of recidivism as predicted by the COMPAS algorithm. It includes demographic details such as age, sex, and race, as well as criminal history, charge details, and the predicted risk label. This dataset is as a benchmark for studying algorithmic discrimination. A description of all variables can be found in the table below.

**Variable description**
| Variable name   | Description                                 | Values                                                                 |
|-----------------|---------------------------------------------|------------------------------------------------------------------------|
| age_cat         | Age category                                | Less than 25, 25-45, Greater than 45                                   |
| sex             | Sex                                         | Male, Female                                                           |
| race            | Race                                        | African-American, Asian, Caucasian,  Hispanic, Native American, Other  |
| c_charge_degree | Severity level of the criminal charge       | M: Misdemeanor – Less severe offenses, F: Felony – More serious crimes |
| is_recid        | If defendant reoffended                     | 0: No, 1: Yes                                                          |
| score_text      | Predicted risk label of defendant           | 0: Not high risk, 1: High risk                                         |
| false_positive  | Defendant predicted to reoffend, but didn't | 0: no FP, 1: FP                                                        |


In this example, we analyze which group is most adversely affected by the risk prediction algorithm. We do this by applying the clustering algorithm on the dataset previewed below. The column "is_recid" indicates whether a defendant reoffended or not (1: yes, 0: no). The "score_text" column indicates whether a defendant was predicted to reoffend (1: yes, 0: no). The column "false_positive" (FP) represents cases where a defendant was predicted to reoffended by the algorithm, but didn't do so (1: FP, 0: no FP). A preview of the data can be found below. The column "false_positive" is used as the "bias metric".
`,
        },
        parameters: {
            heading: '1. Parameters selected for clustering',
            iterations: 'Number of iterations: {{value}}',
            minClusterSize: 'Minimal cluster size: {{value}}',
            performanceMetric: 'Performance metric column: {{value}}',
            dataType: 'Data type: {{value}}',
            description: `- Number of iterations: {{iterations}}
- Minimal cluster size: {{minClusterSize}}
- Performance metric column: {{performanceMetric}}
- Data type: {{dataType}}
`,
        },
        clusters: {
            legendMostBiasedCluster: 'Most biased cluster',
            summary:
                'We found {{clusterCount}} clusters. Cluster with most bias consists of {{biasedCount}} datapoints. The uploaded dataset consists of {{totalCount}} datapoints.',
            sizeHint:
                'By adapting the "Minimal cluster size" parameter, the number of clusters can be controlled.',
        },
        biasedCluster: {
            heading: 'In the most biased cluster datapoints have:',
            accordionTitle: 'Features of most biased cluster',
            comparison: {
                less: '{{value}} less {{feature}} than in the rest of the dataset.',
                more: '{{value}} more {{feature}} than in the rest of the dataset.',
                equal: 'equal {{feature}} as in the rest of the dataset.',
            },
            difference: {
                appearance: '{{feature}} : {{value}}',
                deviatingMoreOften:
                    '**{{value}}**: occur in the most deviating cluster **more** often than in the rest of the dataset.',
                deviatingLessOften:
                    '**{{value}}**: occur in the most deviating cluster **less** often than in the rest of the dataset.',
            },
            differenceCategorical: {
                deviatingMoreOften:
                    '**{{feature}}: {{value}}** in the most deviating cluster occurs **more** often than in the rest of the dataset.',
                deviatingLessOften:
                    '**{{feature}}: {{value}}** in the most deviating cluster occurs **less** often than in the rest of the dataset.',
            },
        },
        nodifference: {
            heading:
                'No significant difference in average bias metric between the most biased cluster and the rest of the dataset.',
        },
        distribution: {
            mainHeading: '5. Cluster characteristics',
            heading:
                'The "{{variable}}" variable distribution across the different clusters:',
        },
        splittingDataset: {
            heading: '2. Splitting dataset',
            description: `To reduce the possibility that the clustering method detects noise, the dataset is split in a train (80%) and test dataset (20%). The clustering method is first fitted on the train dataset. Then, the presence of statistically significant bias in the most deviating clusters is evaluated using the test dataset.`,
        },
        clusterinResults: {
            heading: '3. Clustering results',
            description: `
- Number of clusters detected: {{clusterCount}}
            `,
            label: 'Choose cluster to show number of datapoints for',
            valueText: 'Number of datapoints in cluster {{index}}: {{value}}',
        },
        conclusion: `6. Conclusion and bias report`,
        conclusionDescriptionHigherAverage: `From the above figures and statistical tests, it can be concluded that:

The most biased cluster has a statistically significant higher average bias score than the rest of the dataset.        
`,
        conclusionNoSignificance: `From the above figures and statistical tests, it can be concluded that:

No statistically significant difference in average bias score between the most biased cluster and the rest of the dataset.
`,
        moreInformationHeading: `7. More information`,
        moreInformationDescription: `- [Scientific article](https://arxiv.org/pdf/2502.01713)
- [Github repository](https://github.com/NGO-Algorithm-Audit/unsupervised-bias-detection)`,
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
