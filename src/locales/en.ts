export const en = {
    "Let's get started! Fill out the form.":
        'Bienvenue à React et react-i18next',
    shareButton: 'Share',
    exportButton: 'Export to .json',
    getStarted: 'Fill in the form to begin.',
    fileUploadError: 'Please upload a valid csv file.',
    removeButton: 'Remove',
    dropzoneLabel:
        'Drag and drop your csv file here, click to select a local file or use the "Demo dataset" button',
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
        dataType: {
            numeric: 'Numeric',
            categorical: 'Categorical',
        },
        exportToPDF: 'Download bias analysis report as pdf',
        exportToJSON: 'Export clusters as json',
        form: {
            fieldsets: {
                data: {
                    title: 'Data',
                    dataSet: 'Dataset',
                    dataSetTooltip: `Preprocess your data such that: 
                    - missing values are removed or replaced;
                    - all columns (except your outcome label column) should have the same datatypes, e.g., numerical or categorical;
                    - the outcome label column is numerical`,
                    performanceMetric: 'Outcome label',
                    performanceMetricTooltip:
                        'Clustering will be performed on the outcome labels. The outcome label should be numerical. Examples of outcome labels are "being classified as high risk" or "selected for an investigation"',
                    dataType: 'Type of data',
                    dataTypeTooltip:
                        'Specify whether the data are categorical or numerical. All columns (except your outcome label column) should have the same data type',
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
                        title: 'Outcome label interpretation',
                        lower: 'Lower value of outcome label is better, such as error rate',
                        higher: 'Higher value of outcome label is better, such as accuracy',
                        tooltip:
                            'When error rate or misclassifications are chosen as the outcome label, a lower value is preferred, as the goal is to minimize errors. Conversely, when accuracy or precision is selected as the outcome label, a higher value is preferred, reflecting the aim to maximize performance. Selected for an investigation or a false positive is consiered as disadvantageous, so for this outcome label a lower value is preferred',
                    },
                    iterationsTooltip:
                        'Number of times the dataset is split in smaller clusters. Can terminate early if the minimum cluster size is reached',
                    minClusterSizeTooltip:
                        'The minimum number of samples per cluster. By default set to 1% of the number of rows in the attached dataset.',
                },
            },
            errors: {
                csvRequired: 'Please upload a csv file.',
                targetColumnRequired: 'Please select a outcome label.',
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
            description:
                "Use our demo dataset if you don't have a dataset at hand",
        },
    },
    syntheticData: {
        demo: {
            heading: 'Information about demo dataset',
            description:
                'A subset of the [Law School Admission Bar](https://www.kaggle.com/datasets/danofer/law-school-admissions-bar-passage)* dataset is used as a demo. Synthetic data will be generated for the following variables:',
            'post.description':
                '<br> The CART method is used to generate the synthetic data. CART generally produces high quality synthetic data, but might not work well on datasets with categorical variables with 20+ categories. Use Gaussian Copula in those cases.\n  \n*The original paper can be found [here](https://files.eric.ed.gov/fulltext/ED469370.pdf)',
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
                sourceDataset: 'Input',
                dataSet: 'Dataset',
                dataSetTooltip: `Only categorical, numerical, or time series data can be processed. Datasets may contain a maximum of 8 columns, must have a header with column names and don't require an index column`,
                sdgMethod: {
                    title: 'Method',
                    cart: 'CART',
                    gc: 'Gaussian Copula',
                    tooltip:
                        'By default, the CART method is used to generate synthetic data. CART generally produces higher quality synthetic data, but might not work well on datasets with categorical variables with 20+ categories. Use Gaussian Copula in those cases',
                },
                nanTreatment: {
                    title: 'NaN values treatment',
                    drop: 'Drop rows with NaN values',
                    impute: 'Impute NaN values',
                    tooltip:
                        "When using Gaussian Copula, you can choose how to handle missing values (NaN values) in your dataset. 'Drop rows with NaN values' removes them completely, while 'Imputate NaN values' replaces them with mean values for numerical columns and mode values for categorical columns",
                },
                samples: 'Number of synthetic datapoints',
            },
            actions: {
                tryItOut: 'Demo dataset',
                runGeneration: 'Start synthetic data generation',
                analyzing: 'Analyzing...',
                initializing: 'Initialising...',
            },
        },
        demoCard: {
            title: 'Try it out!',
            description: 'No dataset at hand? Use our demo dataset',
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
            heading: '0. Preview of data',
        },
        columnsInDataset: '1. Data types detection',
        handlingMissingDataTitle: '2. Handling missing data',
        handlingMissingDataDescription: 'Handling missing data description',
        handlingMissingDataTableTitle: 'Columns with missing data',
        _explanatoryDataAnalysisTitle: '2. Explanatory data analysis',
        cartModelTitle: '3. Method: CART model',
        gaussianCopulaModelTitle: '3. Method: Gaussian Copula model',
        cartModelDescription:
            'The CART (Classification and Regression Trees) method generates synthetic data by learning patterns from real data through a decision tree that splits data into homogeneous groups based on feature values. It predicts averages for numerical data and assigns the most common category for categorical data, using these predictions to create new synthetic points.\n \n {{samples}} synthetic data points are generated.',
        evaluationOfGeneratedDataTitle: '4. Evaluation of generated synthetic data',
        distributionsTitle: '4.1 Distributions',
        diagnosticsReportTitle: '4.2. Diagnostic report',
        diagnosticsTitle: 'Diagnostic Results',
        diagnosticsReportDescription: `For each column, diagnostic results are computed for the quality of the generated synthetic data. The computed metrics depend on the type of data.

For numerical or datetime columns the following metrics are computed:
- {tooltip:syntheticData.missingValueSimilarity}Missing value similarity{/tooltip}
- {tooltip:syntheticData.rangeCoverage}Range coverage{/tooltip}
- {tooltip:syntheticData.boundaryAdherenc}Boundary adherence{/tooltip}
- {tooltip:syntheticData.statisticSimilarity}Statistic similarity{/tooltip}
- {tooltip:syntheticData.kolmogorovSmirnovComplement}Kolmogorov–Smirnov (KS) complement{/tooltip}

For categorical columns the following metrics are computed:
- {tooltip:syntheticData.missingValueSimilarity}Missing value similarity{/tooltip}
- {tooltip:syntheticData.categoryCoverage}Category coverage{/tooltip}
- {tooltip:syntheticData.categoryAdherence}Category adherence{/tooltip}
- {tooltip:syntheticData.totalVariationComplement}Total variation (TV) complement{/tooltip}

💯 For high-quality synthetic data, all values should be close to 1.0, but at least higher than 0.85.`,
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
        correlationMatrixDescription: `The matrices below display the pairwise correlations in the original and synthetic data. Green cells represent weak pairwise correlations, while red cells denote strong pairwise correlations. The color patterns in the two matrices should appear roughly similar.`,
        efficacyMetricsTitle: 'Efficacy metrics',
        efficacyMetricsDescription: `Efficacy metrics compare real and synthetic datasets for predictive tasks. The idea is to train a predictive model on synthetic data and evaluate the model's performance on real data. The type of efficacy metric depends on the task:

For regression (when the target is numerical):
- {tooltip:syntheticData.meanSquaredError}Mean squared error (MSE){/tooltip}
- {tooltip:syntheticData.meanAbsoluteError}Mean Absolute Error (MAE){/tooltip}
- {tooltip:syntheticData.R2}R² Score{/tooltip}

For classification (when the target is categorical):
- {tooltip:syntheticData.accuracyScore}Accuracy Score{/tooltip}
- {tooltip:syntheticData.weightedF1Score}Weighted F1 Score{/tooltip}`,
        disclosureProtectionTitle: 'Privacy metrics',
        disclosureProtectionDescription: `The *disclosure protection metric* measures the proportion of synthetic data points that closely resemble real data points (within a predefined threshold), posing a risk of traceability to personal data. A low 'risk\_rate' and a high 'disclosure\_protection\_rate' indicate effective protection against the unintentional exposure of personal data.`,
        outputDataTitle: '5. Download synthetic data and evaluation report',
        outputDataDescription: 'Preview of generated synthetic data:',
        moreInfoTitle: '6. More information',
        meanSquaredError:
            'Average squared difference between predicted and actual values, quantifying the accuracy of a model’s predictions by penalizing larger errors more heavily',
        meanAbsoluteError:
            'Average magnitude of the errors between predicted and actual values, providing a straightforward assessment of model accuracy without emphasizing large errors',
        R2: 'Quantifies how well a model’s predictions match the actual data by measuring the proportion of variance in the target variable explained by the model',
        accuracyScore:
            'Measures the proportion of correctly predicted instances out of the total instances, providing an overall assessment of a model’s performance in classification tasks',
        weightedF1Score:
            'Harmonic mean of precision and recall, calculated for each class and weighted by the class’s support (number of true instances), providing a balanced performance measure for imbalanced datasets',
        correlationDifference:
            'Correlation difference: {{correlationDifference}}',
        univariateText:
            '<br>The figures below display the distribution for each variable. The synthetic data are of high quality when the distributions are roughly the same.',
        bivariateText:
            'The figures below display the differences in distributions for a combination of two variables. For comparing two categorical variables, bar charts are plotted. For comparing a numerical and a categorical variables, a so called [violin plot](https://en.wikipedia.org/wiki/Violin_plot) is shown. For comparing two numercial variables, a [LOESS plot](https://en.wikipedia.org/wiki/Local_regression) is created. For all plots holds: the synthetic data is of high quality when the shape of the distributions are roughly the same.',
        moreInfo:
            'Do you want to learn more about synthetic data?\n  \n  \n  \n- [python-synthpop on Github](https://github.com/NGO-Algorithm-Audit/python-synthpop)\n- [local-first web app on Github](https://github.com/NGO-Algorithm-Audit/local-first-web-tool/tree/main)\n- [Synthetic Data: what, why and how?](https://royalsociety.org/-/media/policy/projects/privacy-enhancing-technologies/Synthetic_Data_Survey-24.pdf)\n- [Knowledge Network Synthetic Data](https://online.rijksinnovatiecommunity.nl/groups/399-kennisnetwerk-synthetischedata/welcome) (Dutch public organizations)\n- [Synthetic data portal of Dutch Executive Agency for Education](https://duo.nl/open_onderwijsdata/footer/synthetische-data.jsp) (DUO)\n- [CART: synthpop resources](https://synthpop.org.uk/resources.html)\n- [Gaussian Copula - Synthetic Data Vault](https://docs.sdv.dev/sdv)',
        missingData: `For {tooltip:syntheticData.missingDataMARTooltip}Missing At Random (MAR){/tooltip} and {tooltip:syntheticData.missingDataMNARTooltip}Missing Not At Random (MNAR){/tooltip} data, 
missing data are imputed. For {tooltip:syntheticData.missingDataMCARTooltip}Missing Completely At Random (MCAR){/tooltip}, missing data is removed.\n \n More information about the concepts MCAR, MAR en MNAR can be found in the book [Flexible Imputation of Missing Data](https://stefvanbuuren.name/fimd/sec-MCAR.html) by prof. Stef van Buuren, Utrecht University.`,
        missingDataMARTooltip: `**MAR (Missing At Random)**:
- The probability of data being missing is related to the observed data but not the missing data itself. The missingness can be predicted by other variables in the dataset;
- Example: students' test scores are missing, but the missingness is related to their attendance records;
- MAR data are imputed`,
        missingDataMNARTooltip: `**MNAR (Missing Not At Random)**:
- The probability of data being missing is related to the missing data itself. There is a systematic pattern to the missingness that is related to the unobserved data;
- Example: patients with more severe symptoms are less likely to report their symptoms, leading to missing data that is related to the severity of the symptoms;
- MNAR data are imputed`,
        missingDataMCARTooltip: `**MCAR (Missing Completely At Random)**:
- The probability of data being missing is completely independent of both observed and unobserved data. There is no systematic pattern to the missingness;
- Example: a survey respondent accidentally skips a question due to a printing error;
- MCAR data are removed`,
    },

    biasAnalysis: {
        testingStatisticalSignificance: `**5. Testing cluster differences wrt. outcome labels**

- <i class="font-serif">H</i><sub>0</sub>: no difference in outcome labels between the most deviating cluster and the rest of the dataset
- <i class="font-serif">H</i><sub>1</sub>: difference in outcome labels between the most deviating cluster and the rest of the dataset

A two-sided t-test is performed to accept or reject <i class="font-serif">H</i><sub>0</sub>:.

{tooltip:biasAnalysis.p_valueTooltip}p_value{/tooltip} : {{p_val}} 
        `,
        p_valueTooltip: `p_value tooltip`,
        dataSetPreview: {
            heading: '1. Preview of data',
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


<br>

In this example, we analyze which group is most adversely affected by the risk prediction algorithm. We do this by applying the clustering algorithm on the dataset previewed below. The column "is_recid" indicates whether a defendant reoffended or not (1: yes, 0: no). The "score_text" column indicates whether a defendant was predicted to reoffend (1: yes, 0: no). The column "false_positive" (FP) represents cases where a defendant was predicted to reoffended by the algorithm, but didn't do so (1: FP, 0: no FP). A preview of the data can be found below. The column "false_positive" is used as the outcome label.
`,
        },
        parameters: {
            heading: '2. Parameters selected for clustering',
            iterations: 'Number of iterations: {{value}}',
            minClusterSize: 'Minimal cluster size: {{value}}',
            performanceMetric: 'Outcome label: {{value}}',
            dataType: 'Data type: {{value}}',
            description: `- Number of iterations: {{iterations}}
- Minimal cluster size: {{minClusterSize}}
- Outcome label: {{performanceMetric}}
- Data type: {{dataType}}
`,
        },
        distributionOfFeaturesAcrossClustersAccordeonTitle:
            'Features per cluster',
        numericalVariableDistributionAcrossClustersAccordeonTitle:
            'Distribution of numerical variables across clusters',
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
                deviatingMoreOften: `**{{value}}**: occur in the most deviating cluster **more** often than in the rest of the dataset.
`,
                deviatingLessOften: `**{{value}}**: occur in the most deviating cluster **less** often than in the rest of the dataset.
`,
            },
            differenceCategorical: {
                feature: '- {{feature}}',
                deviatingMoreOften: `  - **{{value}}** in the most deviating cluster occurs **more** often than in the rest of the dataset.`,
                deviatingLessOften: `  - **{{value}}** in the most deviating cluster occurs **less** often than in the rest of the dataset.`,
            },
        },
        nodifference: {
            heading:
                'No significant difference in average uitkomstlabel between the most biased cluster and the rest of the dataset.',
        },
        distribution: {
            mainHeading: '6. Cluster differences wrt. features',
            heading: '"{{variable}}" distribution per cluster:',
        },
        splittingDataset: {
            heading: '3. Splitting dataset',
            description: `To reduce the possibility that the clustering method detects noise, the dataset is split in a train (80%) and test dataset (20%). The clustering method is first fitted on the train dataset. Then, the presence of statistically significant signal in the most deviating cluster is evaluated using the test dataset.`,
        },
        clusterinResults: {
            heading: '4. Clustering results',
            description: `
- Number of clusters detected: {{clusterCount}}
            `,
            label: 'Choose cluster to show number of datapoints for',
            valueText: 'Number of datapoints in cluster {{index}}: {{value}}',
        },
        higherAverage: `The most deviating cluster has statistically significant different outcome labels than the rest of the dataset.`,
        noSignificance: `No statistically significant difference in outcome labels between the most biased cluster and the rest of the dataset.`,

        conclusion: `7. Conclusion and bias report`,
        conclusionDescription: `From the above figures and statistical tests, it can be concluded that:`,

        moreInformationHeading: `8. More information`,
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
