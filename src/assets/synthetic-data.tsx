export const pythonCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings
import scipy.stats as stats
from scipy.stats import norm, ks_2samp
from sklearn.preprocessing import LabelEncoder

warnings.filterwarnings('ignore')

from io import StringIO
from unsupervised_bias_detection.clustering import BiasAwareHierarchicalKModes
from unsupervised_bias_detection.clustering import BiasAwareHierarchicalKMeans


from synthpop.processor import Processor

from synthpop import NUM_COLS_DTYPES
from synthpop.processor import NAN_KEY
from synthpop.method import CART_METHOD, METHODS_MAP, NA_METHODS
from synthpop import NUM_COLS_DTYPES
from synthpop.method import EMPTY_METHOD, SAMPLE_METHOD
from synthpop.method import DEFAULT_METHODS_MAP, INIT_METHODS_MAP, CONT_TO_CAT_METHODS_MAP
from synthpop.method import ALL_METHODS, INIT_METHODS, DEFAULT_METHODS, NA_METHODS
from synthpop.processor import NAN_KEY


INIT_STEP = 'init'
PROCESSOR_STEP = 'processor'
FIT_STEP = 'fit'
GENERATE_STEP = 'generate'

NONE_TYPE = type(None)

DENSITY = 'density'

import time
start = time.time()

from js import data
from js import setResult
from js import dataType
from js import isDemo
from js import sdgMethod

INIT_STEP = 'init'
PROCESSOR_STEP = 'processor'
FIT_STEP = 'fit'
GENERATE_STEP = 'generate'

NONE_TYPE = type(None)

DENSITY = 'density'


class Validator:
    def __init__(self, spop):
        self.spop = spop
        self.attributes_types = {'method': (NONE_TYPE, str, list),
                                 'visit_sequence': (NONE_TYPE, np.ndarray, list),
                                 # 'predictor_matrix': (NONE_TYPE,),
                                 'proper': (bool,),
                                 'cont_na': (NONE_TYPE, dict),
                                 'smoothing': (bool, str, dict),
                                 'default_method': (str,),
                                 'numtocat': (NONE_TYPE, list),
                                 'catgroups': (NONE_TYPE, int, dict),
                                 'seed': (NONE_TYPE, int),
                                 'k': (NONE_TYPE, int)}

    def check_init(self):
        step = INIT_STEP

        self.default_method_validator(step=step)
        self.method_validator(step=step)
        self.visit_sequence_validator(step=step)
        # self.predictor_matrix_validator(step=step)
        self.proper_validator(step=step)
        self.cont_na_validator(step=step)
        self.smoothing_validator(step=step)
        self.numtocat_validator(step=step)
        self.catgroups_validator(step=step)
        self.seed_validator(step=step)

    def check_processor(self):
        step = PROCESSOR_STEP

        self.visit_sequence_validator(step=step)
        self.method_validator(step=step)
        self.predictor_matrix_validator(step=step)
        self.smoothing_validator(step=step)

        self.cont_na_validator(step=step)
        self.numtocat_validator(step=step)
        self.catgroups_validator(step=step)

    def check_fit(self):
        step = FIT_STEP

        self.method_validator(step=step)
        self.visit_sequence_validator(step=step)
        self.predictor_matrix_validator(step=step)
        self.smoothing_validator(step=step)

    def check_generate(self):
        step = GENERATE_STEP

        self.k_validator(step=step)

    def check_valid_type(self, attribute_name, return_type=False):
        attribute_type = getattr(self.spop, attribute_name)
        expected_types = self.attributes_types[attribute_name]
        assert isinstance(attribute_type, expected_types)

        if return_type:
            return attribute_type

    def method_validator(self, step=None):
        if step == INIT_STEP:
            # validate method type is allowed
            method_type = self.check_valid_type('method', return_type=True)

            if isinstance(method_type, str):
                # if method type is str
                # validate method is in allowed init methods
                assert self.spop.method in INIT_METHODS

            elif isinstance(method_type, list):
                # if method type is list
                # validate all methods are allowed
                assert all(m in ALL_METHODS for m in self.spop.method)

        if step == PROCESSOR_STEP:
            first_visited_col = self.spop.visit_sequence.index[self.spop.visit_sequence == 0].values[0]

            if self.spop.method is None:
                # if method is not specified
                # for each column set method to default method according to its dtype (method for first visited column is sample_method)
                self.spop.method = [DEFAULT_METHODS_MAP[self.spop.default_method][self.spop.df_dtypes[col]] if col != first_visited_col else SAMPLE_METHOD
                                    for col in self.spop.df_columns]

            elif isinstance(self.spop.method, str):
                # if method type is str
                # for each column set method to the corresponding allowed method according to its dtype (method for first visited column is sample_method)
                self.spop.method = [INIT_METHODS_MAP[self.spop.method][self.spop.df_dtypes[col]] if col != first_visited_col else SAMPLE_METHOD
                                    for col in self.spop.df_columns]

            else:
                # validate method for first visited column with non empty method is sample_method
                for col, visit_order in self.spop.visit_sequence.sort_values().items():
                    col_method = self.spop.method[self.spop.df_columns.index(col)]
                    if col_method != EMPTY_METHOD:
                        assert col_method == SAMPLE_METHOD
                        break
                # assert all(self.spop.method[i] == SAMPLE_METHOD for i, col in enumerate(self.spop.df_columns) if col == first_visited_col)

            # validate all columns have specified methods
            assert len(self.spop.method) == self.spop.n_df_columns
            self.spop.method = pd.Series(self.spop.method, index=self.spop.df_columns)

        if step == FIT_STEP:
            for col in self.spop.method.index:
                if col in self.spop.numtocat:
                    self.spop.method[col] = CONT_TO_CAT_METHODS_MAP[self.spop.method[col]]

                elif col in self.spop.processor.processing_dict[NAN_KEY] and self.spop.df_dtypes[col] in NUM_COLS_DTYPES and self.spop.method[col] in NA_METHODS:
                    # TODO put in a function
                    nan_col_index = self.spop.method.index.get_loc(col)
                    index_list = self.spop.method.index.tolist()
                    index_list.insert(nan_col_index, self.spop.processed_df_columns[nan_col_index])
                    self.spop.method = self.spop.method.reindex(index_list, fill_value=CONT_TO_CAT_METHODS_MAP[self.spop.method[col]])

    def visit_sequence_validator(self, step=None):
        if step == INIT_STEP:
            # validate visit_sequence type is allowed
            visit_sequence_type = self.check_valid_type('visit_sequence', return_type=True)

            if isinstance(visit_sequence_type, np.ndarray):
                # if visit_sequence type is numpy array
                # transform visit_sequence into a list
                self.spop.visit_sequence = [col.item() for col in self.spop.visit_sequence]
                visit_sequence_type = list

            if isinstance(visit_sequence_type, list):
                # if visit_sequence type is list
                # validate all visits are unique
                assert len(set(self.spop.visit_sequence)) == len(self.spop.visit_sequence)
                # validate all visits are either type int or type str
                assert all(isinstance(col, int) for col in self.spop.visit_sequence) or all(isinstance(col, str) for col in self.spop.visit_sequence)

        if step == PROCESSOR_STEP:
            if self.spop.visit_sequence is None:
                # if visit_sequence is not specified
                # visit all columns in a row
                self.spop.visit_sequence = [col.item() for col in np.arange(self.spop.n_df_columns)]

            if isinstance(self.spop.visit_sequence[0], int):
                # if visit_sequence is list of column indices
                # validate every index in visit_sequence is a valid column index
                assert set(self.spop.visit_sequence).issubset(set(np.arange(self.spop.n_df_columns)))
                # transform visit_sequence into a list of column names
                self.spop.visit_sequence = [self.spop.df_columns[i] for i in self.spop.visit_sequence]
            else:
                # validate every column name in visit_sequence is a valid column name
                assert set(self.spop.visit_sequence).issubset(set(self.spop.df_columns))

            self.spop.visited_columns = [col for col in self.spop.df_columns if col in self.spop.visit_sequence]
            self.spop.visit_sequence = pd.Series([self.spop.visit_sequence.index(col) for col in self.spop.visited_columns], index=self.spop.visited_columns)

        if step == FIT_STEP:
            for col in self.spop.visit_sequence.index:
                if col in self.spop.processor.processing_dict[NAN_KEY] and self.spop.df_dtypes[col] in NUM_COLS_DTYPES and self.spop.method[col] in NA_METHODS:
                    visit_step = self.spop.visit_sequence[col]
                    self.spop.visit_sequence.loc[self.spop.visit_sequence >= visit_step] += 1

                    nan_col_index = self.spop.visit_sequence.index.get_loc(col)
                    index_list = self.spop.visit_sequence.index.tolist()
                    index_list.insert(nan_col_index, self.spop.processed_df_columns[nan_col_index])
                    self.spop.visit_sequence = self.spop.visit_sequence.reindex(index_list, fill_value=visit_step)

    def predictor_matrix_validator(self, step=None):
        # if step == INIT_STEP:
        #     # validate predictor_matrix type is allowed
        #     self.check_valid_type('predictor_matrix')

        if step == PROCESSOR_STEP:
            # build predictor_matrix so all previously visited columns are used for the prediction of the currently visited
            self.spop.predictor_matrix = np.zeros([len(self.spop.visit_sequence), len(self.spop.visit_sequence)], dtype=int)
            self.spop.predictor_matrix = pd.DataFrame(self.spop.predictor_matrix, index=self.spop.visit_sequence.index, columns=self.spop.visit_sequence.index)
            visited_columns = []
            for col, _ in self.spop.visit_sequence.sort_values().items():
                self.spop.predictor_matrix.loc[col, visited_columns] = 1
                visited_columns.append(col)

        if step == FIT_STEP:
            for col in self.spop.predictor_matrix:
                if col in self.spop.processor.processing_dict[NAN_KEY] and self.spop.df_dtypes[col] in NUM_COLS_DTYPES and self.spop.method[col] in NA_METHODS:
                    nan_col_index = self.spop.predictor_matrix.columns.get_loc(col)
                    self.spop.predictor_matrix.insert(nan_col_index, self.spop.processed_df_columns[nan_col_index], self.spop.predictor_matrix[col])

                    index_list = self.spop.predictor_matrix.index.tolist()
                    index_list.insert(nan_col_index, self.spop.processed_df_columns[nan_col_index])
                    self.spop.predictor_matrix = self.spop.predictor_matrix.reindex(index_list, fill_value=0)
                    self.spop.predictor_matrix.loc[self.spop.processed_df_columns[nan_col_index]] = self.spop.predictor_matrix.loc[col]

                    self.spop.predictor_matrix.loc[col, self.spop.processed_df_columns[nan_col_index]] = 1

    def proper_validator(self, step=None):
        if step == INIT_STEP:
            # validate proper type is allowed
            self.check_valid_type('proper')

    def cont_na_validator(self, step=None):
        if step == INIT_STEP:
            # validate cont_na type is allowed
            self.check_valid_type('cont_na')

        if step == PROCESSOR_STEP:
            if self.spop.cont_na is None:
                self.spop.cont_na = {}
            else:
                # validate columns in cont_na are valid columns
                assert all(col in self.spop.df_columns for col in self.spop.cont_na)
                # assert all(col in self.spop.visited_columns for col in self.spop.cont_na)
                # validate the type of columns in cont_na are valid types
                assert all(self.spop.df_dtypes[col] in NUM_COLS_DTYPES for col in self.spop.cont_na)
                self.spop.cont_na = {col: col_cont_na for col, col_cont_na in self.spop.cont_na.items() if self.spop.method[col] in NA_METHODS}

    def smoothing_validator(self, step=None):
        if step == INIT_STEP:
            # validate smoothing type is allowed
            self.check_valid_type('smoothing')

        if step == PROCESSOR_STEP:
            if self.spop.smoothing is False:
                self.spop.smoothing = {col: False for col in self.spop.df_columns}
            elif isinstance(self.spop.smoothing, str):
                # if smoothing type is str
                # validate smoothing is 'density'
                assert self.spop.smoothing == DENSITY
                self.spop.smoothing = {col: self.spop.df_dtypes[col] in NUM_COLS_DTYPES for col in self.spop.df_columns}
            else:
                # validate smoothing is 'denisty' for some/all numerical columns and False for all other columns
                assert all((smoothing_method == DENSITY and self.spop.df_dtypes[col] in NUM_COLS_DTYPES) or smoothing_method is False
                           for col, smoothing_method in self.spop.smoothing.items())
                self.spop.smoothing = {col: (self. spop.smoothing.get(col, False) == DENSITY and self.spop.df_dtypes[col] in NUM_COLS_DTYPES) for col in self.spop.df_columns}

        if step == FIT_STEP:
            for col in self.spop.processed_df_columns:
                if col in self.spop.numtocat:
                    self.spop.smoothing[col] = False
                elif col in self.spop.processor.processing_dict[NAN_KEY] and self.spop.df_dtypes[col] in NUM_COLS_DTYPES:
                    self.spop.smoothing[self.spop.processor.processing_dict[NAN_KEY][col]['col_nan_name']] = False

    def default_method_validator(self, step=None):
        if step == INIT_STEP:
            # validate default_method type is allowed
            self.check_valid_type('default_method')

            # validate default_method is in allowed default methods
            assert self.spop.default_method in DEFAULT_METHODS

    def numtocat_validator(self, step=None):
        if step == INIT_STEP:
            # validate numtocat type is allowed
            self.check_valid_type('numtocat')

        if step == PROCESSOR_STEP:
            if self.spop.numtocat is None:
                self.spop.numtocat = []
            else:
                # validate all columns in numtocat are valid columns
                assert all(col in self.spop.df_columns for col in self.spop.numtocat)
                # assert all(col in self.spop.visited_columns for col in self.spop.numtocat)
                # validate all columns in numtocat are numerical columns
                assert all(self.spop.df_dtypes[col] in NUM_COLS_DTYPES for col in self.spop.numtocat)

    def catgroups_validator(self, step=None):
        if step == INIT_STEP:
            # validate catgroups type is allowed
            catgroups_type = self.check_valid_type('catgroups', return_type=True)

            if isinstance(catgroups_type, int):
                # if catgroups type is int
                # validate catgroups is more than 1
                assert self.spop.catgroups > 1

            elif isinstance(catgroups_type, dict):
                # if catgroups type is dict
                # validate the keys in catgroups are the same as the columns in numtocat
                assert set(self.spop.catgroups.keys()) == set(self.spop.numtocat)
                # validate all values in catgroups are type int and more than 1
                assert all((isinstance(col_groups, int) and col_groups > 1) for col_groups in self.spop.catgroups.values())

        if step == PROCESSOR_STEP:
            if self.spop.catgroups is None:
                self.spop.catgroups = {col: 5 for col in self.spop.numtocat}
            elif isinstance(self.spop.catgroups, int):
                self.spop.catgroups = {col: self.spop.catgroups for col in self.spop.numtocat}

    def seed_validator(self, step=None):
        if step == INIT_STEP:
            # validate seed type is allowed
            self.check_valid_type('seed')

    def k_validator(self, step=None):
        if step == GENERATE_STEP:
            # validate k type is allowed
            self.check_valid_type('k')

            if self.spop.k is None:
                self.spop.k = self.spop.n_df_rows

class Synthpop:
    def __init__(self,
                 method=None,
                 visit_sequence=None,
                 # predictor_matrix=None,
                 proper=False,
                 cont_na=None,
                 smoothing=False,
                 default_method=CART_METHOD,
                 numtocat=None,
                 catgroups=None,
                 seed=None):
        # initialise the validator and processor
        self.validator = Validator(self)
        self.processor = Processor(self)

        # initialise arguments
        self.method = method
        self.visit_sequence = visit_sequence
        self.predictor_matrix = None
        self.proper = proper
        self.cont_na = cont_na
        self.smoothing = smoothing
        self.default_method = default_method
        self.numtocat = numtocat
        self.catgroups = catgroups
        self.seed = seed

        # check init
        self.validator.check_init()

    def fit(self, df, dtypes=None):

        self.df_columns = df.columns.tolist()
        self.n_df_rows, self.n_df_columns = np.shape(df)
        self.df_dtypes = dtypes

        # check processor
        self.validator.check_processor()
        # preprocess
        processed_df = self.processor.preprocess(df, self.df_dtypes)
        self.processed_df_columns = processed_df.columns.tolist()
        self.n_processed_df_columns = len(self.processed_df_columns)

        # check fit
        self.validator.check_fit()
        # fit
        self._fit(processed_df)

    def _fit(self, df):
        self.saved_methods = {}

        # train
        self.predictor_matrix_columns = self.predictor_matrix.columns.to_numpy()
        for col, visit_step in self.visit_sequence.sort_values().items():
            print('train_{}'.format(col))

            # initialise the method
            col_method = METHODS_MAP[self.method[col]](dtype=self.df_dtypes[col], smoothing=self.smoothing[col], proper=self.proper, random_state=self.seed)
            # fit the method
            col_predictors = self.predictor_matrix_columns[self.predictor_matrix.loc[col].to_numpy() == 1]
            col_method.fit(X_df=df[col_predictors], y_df=df[col])
            # save the method
            self.saved_methods[col] = col_method

    def generate(self, k=None):
        self.k = k

        # check generate
        self.validator.check_generate()
        # generate
        synth_df = self._generate()
        # postprocess
        processed_synth_df = self.processor.postprocess(synth_df)

        return processed_synth_df

    def _generate(self):
        synth_df = pd.DataFrame(data=np.zeros([self.k, len(self.visit_sequence)]), columns=self.visit_sequence.index)

        for col, visit_step in self.visit_sequence.sort_values().items():
            print('generate_{}'.format(col))

            # reload the method
            col_method = self.saved_methods[col]
            # predict with the method
            col_predictors = self.predictor_matrix_columns[self.predictor_matrix.loc[col].to_numpy() == 1]
            synth_df[col] = col_method.predict(synth_df[col_predictors])

            # change all missing values to 0
            if col in self.processor.processing_dict[NAN_KEY] and self.df_dtypes[col] in NUM_COLS_DTYPES and self.method[col] in NA_METHODS:
                nan_indices = synth_df[self.processor.processing_dict[NAN_KEY][col]['col_nan_name']] != 0
                synth_df.loc[nan_indices, col] = 0

            # map dtype to original dtype (only excpetion if column is full of NaNs)
            if synth_df[col].notna().any():
                synth_df[col] = synth_df[col].astype(self.df_dtypes[col])

        return synth_df

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

    admissions_df = pd.read_csv(csv_data)

    admissions_sub = admissions_df[['sex', 'race1', 'ugpa', 'bar']]
    real_data = admissions_sub.dropna()
    setResult(json.dumps(
            {'type': 'heading', 'data': sdgMethod}
    ))
    if isDemo:
        setResult(json.dumps(
            {'type': 'heading', 'data': '''Demo'''}
        ))
        setResult(json.dumps(
            {'type': 'text', 'data': '''A demo dataset is loaded below. We will now generate synthetic data on the columns: 'sex', 'race1', 'ugpa', 'bar'. We will be using the Gaussian Copula method and evaluate the distribution and correlation differences between the real and synthetic data.'''}
        ))

    setResult(json.dumps(
        {'type': 'data-set-preview', 'data': ''}
    ))


    if (sdgMethod == 'cart'):
        dtypes_dict = real_data.dtypes.to_dict()
        dtypes_dict = {k: 'float' if v == 'float64' else 'category' if v == 'O' else v for k, v in dtypes_dict.items()}
        label_encoders = {}
        for column in real_data.select_dtypes(include=['object']).columns:
            label_encoders[column] = LabelEncoder()
            real_data[column] = label_encoders[column].fit_transform(real_data[column])
        spop = Synthpop(method='cart')

        spop.fit(real_data, dtypes=dtypes_dict)
        synthetic_data = spop.generate(k=1000)

    if (sdgMethod == 'gc'):
        # Initialize synthesizer and fit it to the data
        synthesizer = GaussianCopulaSynthesizer()
        synthesizer.fit(real_data)

        # Generate synthetic data
        synthetic_data = synthesizer.sample(1000)

    # Output some results
    print("Original Data (first 5 rows):", real_data.head())
    print("Synthetic Data (first 5 rows):", synthetic_data.head())

    results = run_diagnostic(real_data, synthetic_data, target_column='gpa')  
    print('Results:', results)
    setResult(json.dumps(
        {'type': 'heading', 'data': 'Diagnostic Results:'}
    ))
    setResult(json.dumps({'type': 'table', 'data': json.dumps([
        {
            'attribute': key,
            'ks_stat': values['ks_stat'],
            'p_value': values['p_value']
        }
        for key, values in results['distribution_results'].items()
    ])}))

    setResult(json.dumps(
        {'type': 'heading', 'data': 'Correlation difference: ' + str(results['correlation_diff']) }
    ))

    setResult(json.dumps(
        {'type': 'heading', 'data': 'Output file:'}
    ))
    setResult(json.dumps({'type': 'table', 'data': synthetic_data.to_json(orient="records")}))

    np.random.seed(42)
    heatmap = np.random.rand(100, 10)

    # Compute the correlation matrix
    correlation_matrix = np.corrcoef(heatmap, rowvar=False)
    setResult(json.dumps({'type': 'heatmap', 'data': correlation_matrix.tolist()}))
    return 
    

if data != 'INIT':
	run()
`;
