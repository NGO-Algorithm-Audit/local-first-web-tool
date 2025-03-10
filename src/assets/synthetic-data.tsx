export const pythonCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings
import scipy.stats as stats
from scipy.stats import norm, ks_2samp
from sklearn.preprocessing import LabelEncoder
from synthpop import MissingDataHandler, DataProcessor, CARTMethod
from synthpop.metrics import (
    MetricsReport,
    EfficacyMetrics,
    DisclosureProtection
)

warnings.filterwarnings('ignore')

from io import StringIO


import time
start = time.time()

from js import data
from js import setResult
from js import isDemo
from js import sdgMethod
from js import samples
from js import setOutputData


class GaussianCopulaSynthesizer:
    def __init__(self):
        self.means = None
        self.cov_matrix = None
        self.scaler = None
        self.data_marginals = None

    def fit(self, data):
        """
        Fit the Gaussian Copula model to the given data.
        """
        # Step 1: Store data marginals (quantiles for each feature)
        self.data_marginals = []
        for col in data.columns:
            sorted_data = np.sort(data[col])
            quantiles = np.linspace(0, 1, len(sorted_data))
            self.data_marginals.append((sorted_data, quantiles, col))

        # Step 2: Convert data to normal distribution using CDF (Gaussianization)
        uniform_data = data.rank(pct=True)  # Get percentile rank for each column (empirical CDF)
        gaussian_data = norm.ppf(uniform_data)  # Convert uniform to standard normal

        # Step 3: Fit a multivariate Gaussian to the normalized data
        self.means = gaussian_data.mean(axis=0)
        self.cov_matrix = np.cov(gaussian_data, rowvar=False)

    def sample(self, n_samples):
        """
        Generate synthetic data using the fitted Gaussian Copula model.
        """
        # Step 1: Sample from the multivariate normal distribution
        synthetic_gaussian = np.random.multivariate_normal(self.means, self.cov_matrix, n_samples)

        # Step 2: Convert back to uniform distribution using CDF (normal -> uniform)
        synthetic_uniform = norm.cdf(synthetic_gaussian)

        # Step 3: Map uniform data back to the original marginals
        synthetic_data = pd.DataFrame()
        for i, (sorted_data, quantiles, col) in enumerate(self.data_marginals):
            synthetic_data[col] = np.interp(synthetic_uniform[:, i], quantiles, sorted_data)

        return synthetic_data
    

def evaluate_distribution(real_data, synthetic_data):
    """
    Compare the distribution of each column in the real and synthetic data using
    the Kolmogorov-Smirnov (KS) test.
    """
    results = {}
    for column in real_data.columns:
        real_col = real_data[column].dropna()
        synthetic_col = synthetic_data[column].dropna()

        # Perform the KS test
        ks_stat, p_value = ks_2samp(real_col, synthetic_col)

        # Store the result
        results[column] = {'ks_stat': ks_stat, 'p_value': p_value}
    return results

def evaluate_correlations(real_data, synthetic_data):
    """
    Compare the pairwise correlation matrices of the real and synthetic data.
    """
    real_corr = real_data.corr()
    synthetic_corr = synthetic_data.corr()

    # Compute the difference between the correlation matrices
    corr_diff = np.abs(real_corr - synthetic_corr)
    return corr_diff.mean().mean()  # Average correlation difference

def run_diagnostic(real_data, synthetic_data, target_column):
    """
    Run diagnostics on synthetic data by evaluating distribution, correlations, and
    classification model performance.
    """
    # Step 1: Evaluate distributions
    distribution_results = evaluate_distribution(real_data, synthetic_data)

    # Step 2: Evaluate correlations
    correlation_diff = evaluate_correlations(real_data, synthetic_data)

    # Aggregate results
    diagnostics = {
        'distribution_results': distribution_results,
        'correlation_diff': correlation_diff
    }

    return diagnostics

def run():
    csv_data = StringIO(data)

    admissions_df = pd.read_csv(csv_data, index_col=False)

    # admissions_sub = admissions_df[['sex', 'race1', 'ugpa', 'bar']]
    # real_data = admissions_sub.dropna()
    
    if isDemo: 
        real_data = admissions_df[['sex', 'race1', 'ugpa', 'bar']]
        # real_data = admissions_sub.dropna()    
        setResult(json.dumps({
            'type': 'heading',
            'headingKey': 'syntheticData.demo.heading'
        }))
        setResult(json.dumps({
            'type': 'text',
            'key': 'syntheticData.demo.description'
        }))

        demoData = {
            "syntheticData.demo.data.column.Variable_name": ["syntheticData.demo.data.sex", "syntheticData.demo.data.race1", "syntheticData.demo.data.ugpa", "syntheticData.demo.data.bar"],
            "syntheticData.demo.data.column.Description": [
                "syntheticData.demo.data.column.Description.gender_of_students",
                "syntheticData.demo.data.column.Description.race_of_students",
                "syntheticData.demo.data.column.Description.undergraduate_GPA_student",
                "syntheticData.demo.data.column.Description.Ground_truth_label"
            ],
            "syntheticData.demo.data.column.Values": [
                "syntheticData.demo.data.column.Values.sex",
                "syntheticData.demo.data.column.Values.race",
                "syntheticData.demo.data.column.Values.ugpa",
                "syntheticData.demo.data.column.Values.bar"
            ]
        }

        # Create the DataFrame
        dfDemoData = pd.DataFrame(demoData)

        # Display the DataFrame
        print(dfDemoData)

        setResult(json.dumps({
            'type': 'table', 
            'showIndex': False,
            'translate': True,
            'data': dfDemoData.to_json(orient="records")
        }))

        setResult(json.dumps({
            'type': 'text',
            'key': 'syntheticData.demo.post.description'
        }))

    else:
        admissions_df.reset_index(drop=True, inplace=True)
        real_data = admissions_df
        # real_data = admissions_sub.dropna()

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'syntheticData.dataSetPreview.heading'
    }))
    setResult(json.dumps(
        {'type': 'data-set-preview', 'data': ''}
    ))
    if isDemo:
        real_data['sex'] = real_data['sex'].replace({1: 'male', 2: 'female'})


    print(real_data.isnull().sum())
    
    md_handler = MissingDataHandler()

    # Check the data types
    column_dtypes = md_handler.get_column_dtypes(real_data)


    # if isDemo:
    #    column_dtypes['sex'] = 'categorical'

    print("Column Data Types:", column_dtypes)


    # Detect missingness
    missingness_dict = md_handler.detect_missingness(real_data)
    print("Detected Missingness Type:", missingness_dict)

    df_imputed = md_handler.apply_imputation(real_data, missingness_dict)
    

    print("df_imputed.isnull().sum()", df_imputed.isnull().sum())
    

    metadata = column_dtypes
    processor = DataProcessor(metadata)
    
    # Preprocess the data: transforms raw data into a numerical format
    processed_data = processor.preprocess(real_data)    

    cart = CARTMethod(metadata, smoothing=True, proper=True, minibucket=5, random_state=42)
    cart.fit(processed_data)
    
    synthetic_processed = cart.sample(samples)
    
    print("synthetic_processed (first 5 rows):", synthetic_processed.head())

    synthetic_data = processor.postprocess(synthetic_processed)
    

    # numerical
    # categorical

    print("Synthetic Data (first 5 rows):", synthetic_data.head())

    
    # dtypes_dict = real_data.dtypes.to_dict()
    # dtypes_dict = {k: 'float' if (v == 'float64' or v == 'int64') else 'category' if (v == 'O' or v =='bool') else v for k, v in dtypes_dict.items()}
    

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'syntheticData.columnsInDataset'
    }))
    # print("dtypes_dict:", dtypes_dict)
    

    dataInfo = []
    for column in real_data.columns:
        dataInfo.append({
            'key': column, 
            'value': column_dtypes[column]    
        })

    setResult(json.dumps({
        'type': 'list',
        'list': dataInfo
    }))
        
    setResult(json.dumps({
        'type': 'text',
        'key': 'syntheticData.columnsInDatasetInfo'
    }))

    cloned_real_data = real_data.copy()
    # label_encoders = {}
    # for column in real_data.select_dtypes(include=['object']).columns:
    #    label_encoders[column] = LabelEncoder()
    #    real_data[column] = label_encoders[column].fit_transform(real_data[column])

    # if (sdgMethod == 'cart'):
        # spop = Synthpop(method='cart')
        # spop = Synthpop()
        # spop.fit(real_data, dtypes=dtypes_dict)
        # synthetic_data = spop.generate(k=samples)

    if (sdgMethod == 'gc'):
        # Initialize synthesizer and fit it to the data
        synthesizer = GaussianCopulaSynthesizer()
        synthesizer.fit(real_data)

        # Generate synthetic data
        synthetic_data = synthesizer.sample(samples)

    synth_df_decoded = synthetic_data.copy()
    # for column in synth_df_decoded.columns:
    #    if column in label_encoders:
    #        synth_df_decoded[column] = label_encoders[column].inverse_transform(synth_df_decoded[column])

    # Convert categorical variables to numerical values
    df_encoded = real_data.copy()
    df_encoded['sex'] = df_encoded['sex'].astype('category').cat.codes
    df_encoded['race1'] = df_encoded['race1'].astype('category').cat.codes
    df_encoded['bar'] = df_encoded['bar'].astype('category').cat.codes
    
    synth_df_encoded = synthetic_data.copy()
    synth_df_encoded['sex'] = synth_df_encoded['sex'].astype('category').cat.codes
    synth_df_encoded['race1'] = synth_df_encoded['race1'].astype('category').cat.codes
    synth_df_encoded['bar'] = synth_df_encoded['bar'].astype('category').cat.codes
    
    # Output some results
    print("Original Data (first 5 rows):", real_data.head())
    print("Synthetic Data (first 5 rows):", synthetic_data.head())

    print("Synthetic Data decoded (first 5 rows):", synth_df_decoded.head())

    # Store synthetic data for export
    setOutputData("syntheticData", synthetic_data.to_json(orient='records'))

    # results = run_diagnostic(real_data, synthetic_data, target_column='gpa')  
    # print('Results:', results)
    

    # combine empty synthetic data with original data and with encoded data 
    combined_data = pd.concat((real_data.assign(realOrSynthetic='real'), synthetic_data.assign(realOrSynthetic='synthetic')), keys=['real','synthetic'], names=['Data'])

    setResult(json.dumps({
        'type': 'distribution',
        'real': cloned_real_data.to_json(orient="records"),
        'synthetic': synth_df_decoded.to_json(orient="records"),
        'dataTypes': json.dumps(column_dtypes),
        'combined_data' : combined_data.to_json(orient="records"),
        'realCorrelations': df_encoded.corr().to_json(orient="records"),
        'synthDataCorrelations': synth_df_encoded.corr().to_json(orient="records"),
        'reports' : [            
            {
                'reportType': 'heading',
                'headingKey': 'syntheticData.cartModelTitle' if sdgMethod == 'cart' else 'syntheticData.gaussianCopulaModelTitle'
            },
             {
                'reportType': 'text',
                'textKey': 'syntheticData.cartModelDescription' if sdgMethod == 'cart' else 'syntheticData.gaussianCopulaModelDescription'
            },
            {
                'reportType': 'heading',
                'headingKey': 'syntheticData.evaluationOfGeneratedDataTitle'
            },
            {'reportType': 'univariateDistributionSyntheticData'},
            # {            
            #    'reportType': 'table',
            #    'titleKey': 'syntheticData.diagnosticsTitle',
            #    'showIndex' : False,                
            #    'data': json.dumps([
            #            {
            #                'attribute': key,
            #                'ks_stat': values['ks_stat'],
            #                'p_value': values['p_value']
            #            }
            #            for key, values in results['distribution_results'].items()
            #        ]),
            #    'postContent': json.dumps([{
            #        'contentType' : 'correlationSyntheticData'
            #    }])
            #},
            {'reportType': 'bivariateDistributionSyntheticData'}
        ]
    }))

    setResult(json.dumps({
        'type': 'heading', 
        'headingKey': 'syntheticData.outputDataTitle'        
    }))

    setResult(json.dumps({
        'type': 'table', 
        'showIndex': True,
        'data': synthetic_data.head().to_json(orient="records")
    }))

    setResult(json.dumps({
        'type': 'text',
        'key': 'syntheticData.moreInfo'
    }))

    return 
    

if data != 'INIT':
	run()
`;

/*

    # df_numeric = real_data.apply(pd.to_numeric, errors='coerce')
    # synth_df_numeric = synthetic_data.apply(pd.to_numeric, errors='coerce')

    # 'syntheticCorrelations': np.abs(df_numeric.corr() - synth_df_numeric.corr()).to_json(orient="records"),


# {
            #    'reportType': 'heading',
            #    'headingKey': 'syntheticData.explanatoryDataAnalysisTitle'
            # },
            # {'reportType': 'univariateDistributionRealData'},
            # {'reportType': 'bivariateDistributionRealData'},
            # {'reportType': 'correlationRealData'},
            # {'reportType': 'correlationSynthData'},

*/
