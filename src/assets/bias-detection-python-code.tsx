export const pythonCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings
from scipy.stats import ttest_ind
from scipy.stats import chi2_contingency
import scipy.stats as stats
from sklearn.preprocessing import OrdinalEncoder
from sklearn.model_selection import train_test_split

warnings.filterwarnings('ignore')

from io import StringIO
from unsupervised_bias_detection.cluster import BiasAwareHierarchicalKModes
from unsupervised_bias_detection.cluster import BiasAwareHierarchicalKMeans
import time
start = time.time()

from js import data
from js import setResult
from js import setOutputData
from js import iterations
from js import clusterSize
from js import targetColumn
from js import dataType
from js import higherIsBetter
from js import isDemo
from js import dataTypeText

def t_test_on_cluster(test_df, bias_score, cluster_label):

    # Prepare results dictionary
    t_test_results = {}

    comparisons = []

    cluster_df = test_df[test_df["cluster_label"] == cluster_label]
    rest_df = test_df[test_df["cluster_label"] != cluster_label]

    for var in test_df.drop(columns=[bias_score, "cluster_label"]).columns:
        # values in both partitions
        values_cluster = cluster_df[var]
        values_rest = rest_df[var]

        # means per partition
        mean_cluster = cluster_df[var].mean()
        mean_rest = rest_df[var].mean()
        diff = mean_cluster - mean_rest

        # Perform two-sided t-test
        t_stat, p_val = ttest_ind(values_cluster, values_rest, equal_var=False)
        t_test_results[var] = {''
            't_stat': t_stat, 
            'p_val': p_val,
            "direction": "higher" if diff > 0 else "lower"
        }

    # print if any statistically significant differences in means for most deviating cluster and the rest of the dataset was found or not
    if any(res['p_val'] < 0.05 for res in t_test_results.values()):
        print(f"Statistically significant differences in means found:")
    else:
        print(f"No statistically significant differences in means found.")

    # if significant differences were found, print the variables with their differences
    for var, res in t_test_results.items():
        
        if res['p_val'] < 0.05:
            direction = res['direction']
            if direction == "higher":
                print(f"{var}: occur in the most deviating cluster more often than in the rest of the dataset.")
                comparisons.append({
                            'key': 'biasAnalysis.biasedCluster.difference.deviatingMoreOften',
                            'params': {
                                'value': var,
                                'feature': "",
                            }
                        })
            else:
                print(f"{var}: occur in the most deviating cluster less often than in the rest of the dataset.")
                comparisons.append({
                            'key': 'biasAnalysis.biasedCluster.difference.deviatingLessOften',
                            'params': {
                                'value': var,
                                'feature': "",
                            }
                        })
        else:
            continue

    return comparisons

def chi2_test_on_cluster(decoded_X_test, bias_score, cluster_label):

    comparisons = []
    # prepare results dictionary
    chi2_results = {}

    cluster_df = decoded_X_test[decoded_X_test["cluster_label"] == cluster_label]
    rest_df = decoded_X_test[decoded_X_test["cluster_label"] != cluster_label]

    for column in decoded_X_test.drop(columns=[bias_score, "cluster_label"]).columns:
        for value in list(decoded_X_test[column].unique()):
            
            # create a 2x2 contingency table for this value: rows = [cluster_label, rest], columns = [value present, value absent]
            cluster_count = (cluster_df[column] == value).sum()
            rest_count = (rest_df[column] == value).sum()
            cluster_not = (cluster_df[column] != value).sum()
            rest_not = (rest_df[column] != value).sum()

            # create the contingency table
            if cluster_count != 0 and rest_count != 0 and cluster_not != 0 and rest_not != 0:
                contingency_table = np.array([[cluster_count, cluster_not],
                                            [rest_count, rest_not]])
            
            
                # calculate the difference in proportions
                cluster_perc = cluster_count / (cluster_df[column] == value).shape[0]
                rest_perc = rest_count / (rest_df[column] == value).shape[0]
                diff = cluster_perc - rest_perc

                # perform Chi-squared test
                chi2, p, dof, _ = chi2_contingency(contingency_table)
                chi2_results[(column, value)] = {
                    "chi2": chi2,
                    "p_val": p,
                    "dof": dof,
                    "observed": contingency_table,
                    "diff": diff,
                    "direction": "higher" if diff > 0 else "lower",
                    "abs_perc_dev": np.abs(cluster_count / (cluster_count + rest_count) - rest_count / (cluster_count + rest_count)) * 100
                }
            else:
                print(f"Skipping Chi-squared test for {column} = {value} due to zero counts in contingency table.")

    # print if any statistically significant differences in most deviating cluster vs the rest of the dataset was found or not
    if any(res['p_val'] < 0.05 for res in chi2_results.values()):
        print(f"Statistically significant differences in frequency found:")
    else:
        print(f"91mNo statistically significant differences in means found.")

    # if significant differences were found, print the variables with their differences
    current_column = ""

    for var, res in chi2_results.items():
        if (current_column != var[0]):
            current_column = var[0]
            if res['p_val'] < 0.05:
                comparisons.append({
                        'key': 'biasAnalysis.biasedCluster.differenceCategorical.feature',
                        'params': {
                            'feature': var[0],
                        }
                    })

        if res['p_val'] < 0.05:
            direction = res['direction']
            if direction == "higher":
                print(f"{var[0]}: '{var[1]}' in the most deviating cluster occurs more often than in the rest of the dataset.")
                comparisons.append({
                    'key': 'biasAnalysis.biasedCluster.differenceCategorical.deviatingMoreOften',
                    'params': {
                        'value': var[1],
                        'feature': var[0],
                    }
                })
            else:
                print(f"{var[0]}: '{var[1]}' in the most deviating cluster occurs less often than in the rest of the dataset.")
                comparisons.append({
                    'key': 'biasAnalysis.biasedCluster.differenceCategorical.deviatingLessOften',
                    'params': {
                        'value': var[1],
                        'feature': var[0],
                    }
                })
        else:
            continue
    
    return comparisons

def run():
    csv_data = StringIO(data)
    df = pd.read_csv(csv_data)
    
    emptycols = df.columns[df.isnull().any()].tolist()
    features = [col for col in df.columns if (col not in emptycols) and (col != targetColumn) and (not col.startswith('Unnamed'))]
    
    if isDemo:
        bias_score = "false_positive"
        localDataType = "categorical"
        localIterations = iterations # 20

        print (f"Using demo parameters: bias_score={bias_score}, targetColumn={targetColumn}, dataType={localDataType}, iterations={iterations}")

        # Select relevant columns
        columns_of_interest = ["age_cat", "sex", "race", "c_charge_degree", "is_recid", "score_text"]
        filtered_df = df[columns_of_interest]

        features = columns_of_interest

        # Drop rows with missing values
        filtered_df = filtered_df.dropna()

        filtered_df["score_text"] = filtered_df["score_text"].map(lambda x: 1 if x == "High" else 0)
        filtered_df["is_recid"] = filtered_df["is_recid"].astype("category")
        
        filtered_df[bias_score] = ((filtered_df["is_recid"] == 0) & (filtered_df["score_text"] == 1)).astype(int)

        
    else:
        filtered_df = df
        bias_score = targetColumn
        localDataType = dataType
        localIterations = iterations
        print (f"Using parameters: bias_score={bias_score}, targetColumn={targetColumn}, dataType={localDataType}, iterations={localIterations}")

        if (dataType == 'numeric'):
            # Convert all columns to numeric
            filtered_df = filtered_df.astype('float64')

    preview_data = filtered_df.head(5)

    print(f"localDataType: {localDataType}")

    if localDataType == 'categorical':
        encoder = OrdinalEncoder()
        filtered_df[filtered_df.columns] = encoder.fit_transform(filtered_df).astype("int64")
    
    print("filtered_df.dtypes:")
    print(filtered_df.dtypes)

    df_no_bias_score = filtered_df.drop(columns=[bias_score])
    if df_no_bias_score.dtypes.nunique() == 1:
        print('consistent data')
    else:
        print('not all columns in the provided dataset have the same data type')    
    
        
    # split the data into training and testing sets
    train_df, test_df = train_test_split(filtered_df, test_size=0.2, random_state=42)
    X_train = train_df.drop(columns=[bias_score])

    scaleY = 1
    if higherIsBetter == 0:
        scaleY = -1;

    

    # bias metric is negated because HBAC implementation in the package assumes that higher bias metric is better
    y_train = train_df[bias_score] * scaleY

    # remove the bias metric from the test set to prevent issues with decoding later
    X_test = test_df.drop(columns=[bias_score])

    # display the shapes of the resulting datasets
    print(f"Training set shape: {train_df.shape}")
    print(f"Testing set shape: {test_df.shape}")
    print(f"X_train shape: {X_train.shape}")

    if isDemo:
        localClusterSize = clusterSize # X_train.shape[0]*0.01
    else:
        localClusterSize = clusterSize

    localClusterSize = int(localClusterSize)

    print(f"Using local iterations: {localIterations}")
    print(f"Using cluster size: {localClusterSize}")
    print(f"Using bias metric: {bias_score}")
    
    
    if localDataType == 'numeric':
        hbac = BiasAwareHierarchicalKMeans(bahc_max_iter=localIterations, bahc_min_cluster_size=localClusterSize).fit(X_train, y_train)
    else:
        hbac = BiasAwareHierarchicalKModes(bahc_max_iter=localIterations, bahc_min_cluster_size=localClusterSize).fit(X_train, y_train)
    
    
    cluster_df = pd.DataFrame(hbac.scores_, columns=['Cluster scores'])

    n_most_bias = np.sum(hbac.labels_ == 0) # number of datapoints in the most deviating cluster ... user should be able to select the cluster to analyze
    # print(f"Number of datapoints in most deviating cluster: {n_most_bias}/{train_df.shape[0]}")
    print(f"Number of clusters: {hbac.n_clusters_}")
    print(f"Bias metric scores: {hbac.scores_}")


    clusterCount = hbac.n_clusters_
    numZeros = n_most_bias
    totalRecords = train_df.shape[0]

    # df['Cluster'] = hbac.labels_

    biasInClusters = []
    for i in range(clusterCount):
        biasInClusters.append( int(np.sum(hbac.labels_ == i)))    
    

    if isDemo:
        setResult(json.dumps({
            'type': 'heading',
            'headingKey': 'biasAnalysis.demo.heading'
        }))
        setResult(json.dumps({
            'type': 'text',
            'key': 'biasAnalysis.demo.description'
        }))

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.dataSetPreview.heading'
    }))


    setResult(json.dumps({
        'type': 'table', 
        'showIndex': True,
        'data': preview_data.to_json(orient="records")
    }))
    

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.parameters.heading'
    }))


    # Parameter information    
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.description',
        'params': {
            'iterations': localIterations,
            'minClusterSize': localClusterSize,
            'performanceMetric': bias_score,
            'dataType': dataTypeText,
            'higherIsBetter': 'biasAnalysis.higherIsBetter' if higherIsBetter else 'biasAnalysis.lowerIsBetter'
        }
    }))
    setResult(json.dumps({
        'type': 'text',
        'data': ''
    }))


    setResult(json.dumps({
            'type': 'heading',
            'headingKey': 'biasAnalysis.splittingDataset.heading'
        }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.splittingDataset.description'
    }))
    setResult(json.dumps({
        'type': 'text',
        'data': ''
    }))


    setResult(json.dumps({
            'type': 'heading',
            'headingKey': 'biasAnalysis.clusterinResults.heading'
        }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.clusterinResults.description',
        'params': {
            'numZeroes': int(numZeros),
            'totalRecords': int(totalRecords),
            'clusterCount': clusterCount
        }
    }))

    setResult(json.dumps({
        'type': 'TextValueSelect',
        'key': 'biasAnalysis.clusterinResults.description',
        'defaultIndex': 0,
        'labelKey': 'biasAnalysis.clusterinResults.label',
        'valueKey' : 'biasAnalysis.clusterinResults.valueText',
        'values': biasInClusters
    }))
    setResult(json.dumps({
        'type': 'text',
        'data': ''
    }))

    y_test = hbac.predict(X_test.to_numpy())

    decoded_X_test = test_df.copy()

    print("y_test:")
    print(y_test)
    print("test_df:")
    print(test_df)

    if localDataType == 'categorical':
        # decode X_test using the encoder
        decoded_X_test = encoder.inverse_transform(test_df)
    

    # display the decoded DataFrame
    decoded_X_test = pd.DataFrame(decoded_X_test, columns=test_df.columns)
    print(decoded_X_test)
    
    
    decoded_X_test["cluster_label"] = y_test

    # ----
    
    if localDataType == 'numeric':
        test_df["cluster_label"] = y_test
        most_biased_cluster_df = test_df[test_df["cluster_label"] == 0]
        rest_df = test_df[test_df["cluster_label"] != 0]
    else:
        most_biased_cluster_df = decoded_X_test[decoded_X_test["cluster_label"] == 0]
        rest_df = decoded_X_test[decoded_X_test["cluster_label"] != 0]

    # Convert score_text to numeric
    bias_score_most_biased = pd.to_numeric(most_biased_cluster_df[bias_score])
    bias_score_rest = pd.to_numeric(rest_df[bias_score])

    
    

    # Perform independent two-sample t-test (two-sided: average bias metric in most_biased_cluster_df ≠ average bias metric in rest_df)
    t_stat, p_val = ttest_ind(bias_score_most_biased, bias_score_rest, alternative='two-sided')

    print(f"T-statistic: {t_stat}")
    print(f"p-value: {p_val}")
   
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.testingStatisticalSignificance',
        'params': {
            'p_val': "{:.3f}".format(p_val)
        }
    }))

    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.higherAverage' if p_val < 0.05 else 'biasAnalysis.noSignificance'
    }))

    if p_val < 0.05:
        print("The most biased cluster has a significantly higher average bias metric than the rest of the dataset.")
    else:
        print("No significant difference in average bias metric between the most biased cluster and the rest of the dataset.")
        # setResult(json.dumps({
        #        'type': 'heading',
        #        'headingKey': 'biasAnalysis.nodifference.heading',                            
        #    }))    

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.distribution.mainHeading'
    }))
        

    # visualize the clusters

    # Group by cluster_label and count the occurrences
    cluster_counts = decoded_X_test["cluster_label"].value_counts()
    print(f"cluster_counts: {cluster_counts}")


    if localDataType == 'numeric':
        # Calculate mean per cluster for each variable
        means = test_df.groupby("cluster_label").mean()

        # Calculate overall mean for each variable (excluding cluster_label)
        variables = X_test.columns.tolist()
        overall_means = test_df[variables].mean()

        dropdownCategories = []
        for i, column in enumerate(X_test.columns):
            if column != bias_score:
                dropdownCategories.append(column)

        # Plot bar charts for each variable, showing means for each cluster and overall mean as red line
        n_vars = len(variables)
        n_cols = 2
        n_rows = int(np.ceil(n_vars / n_cols))

        charts = []

        for i, var in enumerate(variables):
            
            #setResult(json.dumps({
            #    'type': 'heading',
            #    'headingKey': 'biasAnalysis.distribution.heading',            
            #    'params': {'variable': var}
            #}))
            print(f"means: {var}")
            print(overall_means[var])
            print(means[var])
            print(f"========================")
            

            charts.append({
                    'yAxisLabel': 'distribution.frequency',
                    'type': 'clusterNumericalVariableDistribution',
                    'headingKey': 'biasAnalysis.distribution.heading',  
                    'title': var,
                    'meanValue': overall_means[var],
                    'data': means[var].to_json(orient='records'),
                    'params': {'variable': var},
                    'selectFilterGroup' : var,
                    'defaultFilter': X_test.columns[0]
                })

        setResult(json.dumps({
                'type': 'clusterNumericalVariableDistributionAccordeon',
                'clusterCount': clusterCount,
                'charts': charts,
                'values': dropdownCategories,
                'titleKey': "biasAnalysis.numericalVariableDistributionAcrossClustersAccordeonTitle",
                'defaultValue': X_test.columns[0]
            }))
 
    if p_val < 0.05:

        if localDataType == 'numeric':
            # see above for the code 
            print("Statistically significant differences in means found.")
        else:
            # Create subplots for each column
            columns_to_analyze = [col for col in decoded_X_test.columns if col not in [bias_score, "cluster_label"]]


            rows = (len(columns_to_analyze) + 2) // 3  # Calculate the number of rows needed
            print(f"rows: {rows}")

            dropdownCategories = []
            for i, column in enumerate(columns_to_analyze):
                dropdownCategories.append(column)

            charts = []    

            for i, column in enumerate(columns_to_analyze):
                print(f"Analyzing column: {column}")

                grouped_data = decoded_X_test.groupby(["cluster_label", column]).size().unstack(fill_value=0)
                percentages = grouped_data.div(grouped_data.sum(axis=1), axis=0) * 100
                
                category_values = grouped_data.columns.tolist()

                means = []
                overall_counts = decoded_X_test[column].value_counts(normalize=True) * 100
                for cat_value, avg_pct in overall_counts.items():
                    means.append({
                        'category': cat_value,
                        'mean': avg_pct
                    })

                
                charts.append({
                    'type': 'clusterCategorieDistribution',
                    'headingKey': 'biasAnalysis.distribution.heading',  
                    'title': column,
                    'categories': category_values,
                    'data': percentages.T.to_json(orient='records'),
                    'selectFilterGroup' : column,
                    'params': {'variable': column},
                    'defaultFilter': columns_to_analyze[0],
                    'means': means,
                    'isViridis': True,
                    'yAxisLabel': 'distribution.frequency'
                })



            setResult(json.dumps({
                'type': 'clusterCategorieDistributionAccordeon',
                'clusterCount': clusterCount,
                'charts': charts,
                'values': dropdownCategories,
                'titleKey': "biasAnalysis.distributionOfFeaturesAcrossClustersAccordeonTitle",
                'defaultValue': columns_to_analyze[0]                
            }))

    df_most_biased_cluster = most_biased_cluster_df
    df_other = rest_df
    
    setOutputData("mostBiasedCluster", df_most_biased_cluster.to_json(orient='records'))
    setOutputData("otherClusters", df_other.to_json(orient='records'))


    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.conclusion'
    }))

    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.conclusionDescription'
    }))
        
    # Calculate the difference in percentage for each category value between cluster 0 and the entire dataset
    diff_percentages = {}

    # Select only cluster 0
    cluster_0 = decoded_X_test[decoded_X_test["cluster_label"] == 0]

    if (localDataType == 'numeric'):
        
        comparisons = t_test_on_cluster(test_df, bias_score, cluster_label=0)

        setResult(json.dumps({
            'type': 'accordion',
            'titleKey': 'biasAnalysis.biasedCluster.accordionTitle',
            'comparisons': comparisons
        }))
    else:
        comparisons = chi2_test_on_cluster(decoded_X_test, bias_score, cluster_label=0)
    
        setResult(json.dumps({
            'type': 'accordion',
            'titleKey': 'biasAnalysis.biasedCluster.accordionTitle',
            'comparisons': comparisons,
            'className': 'biasAnalysis-biasedClusterAccordion'
        }))


    

    setResult(json.dumps({
        'type': 'export-button',
    }))


    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.moreInformationHeading'
    }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.moreInformationDescription'
    }))

    return

if data != 'INIT':
    run()
`;
