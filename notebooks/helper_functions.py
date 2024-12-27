import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import norm, ks_2samp
from sklearn.preprocessing import LabelEncoder

"""Get the data type for each column in the attached data set"""
def data_type(df):
    # get data type for each column
    dtypes_dict = df.dtypes.to_dict()

    # replace 'float64' with 'float' and 'O' with 'category'
    new_dict = {k: 'float' if v == 'float64' else 'category' if v == 'O' else v for k, v in dtypes_dict.items()}
    return(new_dict)

"""Encode columns with categoric data to numeric values"""
def encode_data(df):
    label_encoders = {}
    df_encoded = df.copy()
    for column in df.select_dtypes(include=['object']).columns:
        label_encoders[column] = LabelEncoder()
        df_encoded[column] = label_encoders[column].fit_transform(df[column])
    return df_encoded, label_encoders

"""Plot the univariate distribution of the attached dataset, categorical labels are preserved in the visualization"""
def univariate_hist(df,dtypes_dict,Comparison=False):
    for column in df.columns:
        if column == 'realOrSynthetic':
            continue
        if dtypes_dict[column] == 'float':
            plt.figure(figsize=(8, 5))

            if Comparison == False:
                sns.histplot(data=df,
                            x=column,
                            stat="count",
                            palette='Set2')
            else:   
                sns.histplot(data=df,
                            x=column,
                            stat="count",
                             palette='Set2',
                            hue='Data')
        
            # adjust y-axis labels for large numbers
            if df[column].value_counts().max() > 10000:
                plt.gca().yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x/1000:.0f}k'))

        else:
            plt.figure(figsize=(8, 5))

            if Comparison == False:
                sns.histplot(data=df,
                            x=column,
                            stat="count",
                            palette='Set2')
            else:   
                sns.histplot(data=df,
                            x=column,
                            stat="count",
                            palette='Set2',
                            hue='Data')
            
            # adjust y-axis labels for large numbers
            if df[column].value_counts().max() > 10000:
                plt.gca().yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x/1000:.0f}k'))
        
    plt.show()

"""Plot the bivariate distribution of the attached dataset. Distinguishes three types of plots: 1) both categorical variables, 2) both numerical variables and 3) either cateogrical or numerical variables. Categorical labels are preserved in the visualization"""
def bivariate_plot(df, combined_data, dtypes_dict,Comparison=False):
    n_columns = len(df.columns)
    for i in range(n_columns):
        for j in range(n_columns):
            column_name1 = df.columns[i]
            column_name2 = df.columns[j]

            if i >= j:
                continue

            else:
                plt.figure(figsize=(8, 5))

                # if columns are both categorical show countplot 
                if dtypes_dict[column_name1] == 'category' and dtypes_dict[column_name2] == 'category':

                    if Comparison==False:
                        sns.countplot(data=df, 
                                    x=column_name1, 
                                    hue=column_name2, 
                                    palette='Set2'
                                    )
                        plt.title(f'Distribution plot of {column_name1} and {column_name2}')

                    else:
                        sns.catplot(x=column_name2,
                            hue="Data",
                            col=column_name1,
                            data=combined_data,
                            kind="count",
                            palette='Set2')

                    # adjust y-axis labels for large numbers
                    if df[column_name2].value_counts().max() > 10000:
                        plt.gca().yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x/1000:.0f}k'))

                # if one of the columns is categorical and the other is not, show violinplot
                elif dtypes_dict[column_name1] == 'category' or dtypes_dict[column_name2] == 'category':
                    sns.violinplot(data=combined_data, 
                                   x=column_name1, 
                                   y=column_name2, 
                                   hue='realOrSynthetic',
                                   inner='quart',
                                   split=True,
                                   palette='Set2',
                                   linewidth=1.5
                                   )
                    for line in plt.gca().lines:
                        line.set_linestyle('--')
                        line.set_color('white')
                    plt.legend().set_visible(False)
                    plt.title(f'Distribution plot of {column_name1} and {column_name2}')

                # if both columns are numerical, show scatter plot
                else:
                    sns.scatterplot(data=df, x=column_name1, y=column_name2)
                    plt.title(f'Distribution plot of {column_name1} and {column_name2}')

                    # adjust y-axis labels for large numbers
                    if df[column_name2].value_counts().max() > 10000:
                        plt.gca().yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x/1000:.0f}k'))

"""Class for Gaussian Copula Synthesizer"""
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