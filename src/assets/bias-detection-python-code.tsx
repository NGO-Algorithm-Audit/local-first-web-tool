export const pythonCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings
from scipy.stats import ttest_ind
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

def diffDataframe(df, features, type=None, cluster1=None, cluster2=None):
    '''
    Creates difference dataframe, for numerical and categorical 
    data: Takes dataframe of two clusters of interest and 
    computes difference in means. Default to analyze most deviating 
    cluster vs rest of the dataset, except specified otherwise.
    '''   
    # Cluster comparison (optional)
    if cluster1 != None and cluster2 != None:
        df1 = df[df['Cluster'] == cluster1]
        df2 = df[df['Cluster'] == cluster2]
    else:
        df1 = df[df['Cluster'] == 0]
        df2 = df[df['Cluster'] != 0]

    n_df1 = df1.shape[0]
    n_df2 = df2.shape[0]

    diff_dict = {}
    CI_dict = {}

    for feat in features:
        sample1 = df1[feat]
        sample2 = df2[feat]

        if type == 'Numerical':
            mean1 = np.mean(sample1)
            mean2 = np.mean(sample2)
            diff = mean1 - mean2
            diff_dict[feat] = diff
        else:
            freq1 = sample1.value_counts()
            freq2 = sample2.value_counts()
            diff = freq1 - freq2
            diff_dict[feat] = diff

        if type == 'Numerical':
            pd.set_option('display.float_format', lambda x: '%.5f' % x)
            diff_df = pd.DataFrame.from_dict(diff_dict, orient='index', columns=['Difference'])
        else:
            diff_df = pd.DataFrame()
            pd.set_option('display.float_format', lambda x: '%.5f' % x)

            for _, value in diff_dict.items():
                df_temp = pd.DataFrame(value)
                diff_df = pd.concat([diff_df,df_temp], axis=0,)

            diff_df = diff_df.fillna(0)
            diff_df.columns = ['Difference']   

    return(diff_df)

def run():
    csv_data = StringIO(data)
    df = pd.read_csv(csv_data)
    
    emptycols = df.columns[df.isnull().any()].tolist()
    features = [col for col in df.columns if (col not in emptycols) and (col != targetColumn) and (not col.startswith('Unnamed'))]
    
    if isDemo:
        bias_metric = "false_positive"
        localDataType = "categorical"
        localIterations = 20

        print (f"Using demo parameters: bias_metric={bias_metric}, targetColumn={targetColumn}, dataType={localDataType}, iterations={iterations}")

        # Select relevant columns
        columns_of_interest = ["age_cat", "sex", "race", "c_charge_degree", "is_recid", "score_text"]
        filtered_df = df[columns_of_interest]

        features = columns_of_interest

        # Drop rows with missing values
        filtered_df = filtered_df.dropna()

        filtered_df["score_text"] = filtered_df["score_text"].map(lambda x: 1 if x == "High" else 0)
        filtered_df["is_recid"] = filtered_df["is_recid"].astype("category")
        
        filtered_df[bias_metric] = ((filtered_df["is_recid"] == 0) & (filtered_df["score_text"] == 1)).astype(int)

        encoder = OrdinalEncoder()
        filtered_df[filtered_df.columns] = encoder.fit_transform(filtered_df)
    else:
        filtered_df = df
        bias_metric = targetColumn
        localDataType = dataType
        localIterations = iterations

        if (dataType == 'numeric'):
            # Convert all columns to numeric
            filtered_df = filtered_df.astype('float64')
    

    df_no_bias_metric = filtered_df.drop(columns=[bias_metric])
    if df_no_bias_metric.dtypes.nunique() == 1:
        print('consistent data')
    else:
        print('not all columns in the provided dataset have the same data type')    
    
        
    # split the data into training and testing sets
    train_df, test_df = train_test_split(filtered_df, test_size=0.2, random_state=42)
    X_train = train_df.drop(columns=[bias_metric])

    scaleY = 1
    if localDataType == 'numeric':
        if higherIsBetter == 1:
            scaleY = -1;


    # bias metric is negated because HBAC implementation in the package assumes that higher bias metric is better
    y_train = train_df[bias_metric] * higherIsBetter

    # remove the bias metric from the test set to prevent issues with decoding later
    X_test = test_df.drop(columns=[bias_metric])

    if isDemo:
        localClusterSize = X_train.shape[0]*0.01
    else:
        localClusterSize = clusterSize


    
    if localDataType == 'numeric':
        # X = df[features]
        # y = scaleY * df[bias_metric]
        hbac = BiasAwareHierarchicalKMeans(bahc_max_iter=localIterations, bahc_min_cluster_size=localClusterSize).fit(X_train, y_train)
    else:
        hbac = BiasAwareHierarchicalKModes(bahc_max_iter=localIterations, bahc_min_cluster_size=localClusterSize).fit(X_train, y_train)
    
    
    cluster_df = pd.DataFrame(hbac.scores_, columns=['Cluster scores'])

    num_zeros = np.sum(hbac.labels_ == 0)
    print(f"Number of datapoints in most deviating cluster: {num_zeros}/{train_df.shape[0]}")
    print(f"Number of clusters: {hbac.n_clusters_}")

    clusterCount = hbac.n_clusters_
    numZeros = num_zeros 
    totalRecords = train_df.shape[0]

    # df['Cluster'] = hbac.labels_

    

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
       'type': 'data-set-preview',
       'data': ''
    }))

    # setResult(json.dumps({
    #    'type': 'table', 
    #    'showIndex': True,
    #    'data': filtered_df.head().to_json(orient="records")
    # }))
    

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.parameters.heading'
    }))


    # Parameter information
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.iterations',
        'params': {'value': localIterations}
    }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.minClusterSize',
        'params': {'value': localClusterSize}
    }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.performanceMetric',
        'params': {'value': bias_metric}
    }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.dataType',
        'params': {'value': localDataType}
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
        'type': 'text',
        'data': ''
    }))

    y_test = hbac.predict(X_test.to_numpy())

    decoded_X_test = test_df.copy()
    
    if isDemo:
        # decode X_test using the encoder
        decoded_X_test = encoder.inverse_transform(test_df)
    

    # display the decoded DataFrame
    decoded_X_test = pd.DataFrame(decoded_X_test, columns=test_df.columns)
    print(decoded_X_test)

    decoded_X_test["cluster_label"] = y_test
    
    # setResult(json.dumps({
    #    'type': 'table', 
    #    'showIndex': True,
    #    'data': decoded_X_test.head().to_json(orient="records")
    # }))
    
    decoded_X_test["cluster_label"] = y_test

    # setResult(json.dumps({
    #    'type': 'table', 
    #    'showIndex': True,
    #    'data': decoded_X_test.head().to_json(orient="records")
    # }))
    
    most_biased_cluster_df = decoded_X_test[decoded_X_test["cluster_label"] == 0]
    rest_df = decoded_X_test[decoded_X_test["cluster_label"] != 0]

    # Convert score_text to numeric
    bias_metric_most_biased = pd.to_numeric(most_biased_cluster_df[bias_metric])
    bias_metric_rest = pd.to_numeric(rest_df[bias_metric])

    # Perform independent two-sample t-test (two-sided: average bias metric in most_biased_cluster_df ≠ average bias metric in rest_df)
    t_stat, p_val = ttest_ind(bias_metric_most_biased, bias_metric_rest, alternative='two-sided')

    print(f"T-statistic: {t_stat}")
    print(f"p-value: {p_val}")

    if p_val < 0.05:
        print("The most biased cluster has a significantly higher average bias metric than the rest of the dataset.")
    else:
        print("No significant difference in average bias metric between the most biased cluster and the rest of the dataset.")
        setResult(json.dumps({
                'type': 'heading',
                'headingKey': 'biasAnalysis.nodifference.heading',                            
            }))    

    # TODO Show UI-text 7

    
    # visualize the clusters   
    
    # Group by cluster_label and count the occurrences
    cluster_counts = decoded_X_test["cluster_label"].value_counts()
    print(f"cluster_counts: {cluster_counts}")

    if p_val < 0.05:
        # Create subplots for each column
        columns_to_analyze = decoded_X_test.columns[:-1]  # Exclude 'cluster_label' column
        rows = (len(columns_to_analyze) + 2) // 3  # Calculate the number of rows needed
        print(f"rows: {rows}")

        for i, column in enumerate(columns_to_analyze):
            print(f"Analyzing column: {column}")

            grouped_data = decoded_X_test.groupby(["cluster_label", column]).size().unstack(fill_value=0)
            percentages = grouped_data.div(grouped_data.sum(axis=1), axis=0) * 100
            
            print(percentages.T)
            
            print("------ grouped_data start ------")
            print(grouped_data)

            print("------ grouped_data columns ------")

            # print category values
            category_values = grouped_data.columns.tolist()
            print(category_values)

            print("------ grouped_data end ------")


            setResult(json.dumps({
                'type': 'heading',
                'headingKey': 'biasAnalysis.distribution.heading',            
                'params': {'variable': column}
            }))

            setResult(json.dumps({
                'type': 'histogram',
                'title': column,
                'categories': category_values,
                'data': percentages.T.to_json(orient='records')
            }))

    
    return

    df_most_biased_cluster = df[hbac.labels_ == 0]
    df_other = df[hbac.labels_ != 0]

    # Cluster summary
    setResult(json.dumps({
        'type': 'heading',
        'key': 'biasAnalysis.clusters.summary',
        'params': {
            'clusterCount': hbac.n_clusters_,
            'biasedCount': len(df_most_biased_cluster),
            'totalCount': df.shape[0]
        }
    }))

    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.clusters.sizeHint'
    }))

    setResult(json.dumps({
        'type': 'text',
        'data': ''
    }))

    clusters_array = []
    full_df = pd.DataFrame()
    for i in range(hbac.n_clusters_):
        labels = df[hbac.labels_ == i]
        labels['Cluster'] = f'{i}'
        clusters_array.append(labels)
    full_df = pd.concat(clusters_array, ignore_index=True)
    full_df.head()

    setOutputData("mostBiasedCluster", df_most_biased_cluster.to_json(orient='records'))
    setOutputData("otherClusters", df_other.to_json(orient='records'))

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.biasedCluster.heading'
    }))

    if dataType == 'numeric':
        diff_df = diffDataframe(df, features, type='Numerical')
        comparisons = []

        for feat in features:
            diff = diff_df.loc[feat,"Difference"].round(2)
                
            if diff < 0:
                comparisons.append({
                    'key': 'biasAnalysis.biasedCluster.comparison.less',
                    'params': {
                        'value': abs(diff),
                        'feature': feat
                    }
                })
            elif diff > 0:
                comparisons.append({
                    'key': 'biasAnalysis.biasedCluster.comparison.more',
                    'params': {
                        'value': diff,
                        'feature': feat
                    }
                })
            elif diff == 0:
                comparisons.append({
                    'key': 'biasAnalysis.biasedCluster.comparison.equal',
                    'params': {
                        'feature': feat
                    }
                })

        setResult(json.dumps({
            'type': 'accordion',
            'titleKey': 'biasAnalysis.biasedCluster.accordionTitle',
            'comparisons': comparisons
        }))
    else:
        diff_df = diffDataframe(df, features, type='Categorical')
        comparisons = []
        
        for feat in features:
            values = df[feat].unique().tolist()
            for value in values:
                diff = diff_df.loc[value,"Difference"].round(2)     
                         
                if (isinstance(diff, float)):
                    if diff < 0:
                        comparisons.append({
                            'key': 'biasAnalysis.biasedCluster.comparison.less',
                            'params': {
                                'value': abs(diff),
                                'feature': value
                            }
                        })
                    elif diff > 0:
                        comparisons.append({
                            'key': 'biasAnalysis.biasedCluster.comparison.more',
                            'params': {
                                'value': diff,
                                'feature': value
                            }
                        })
                    elif diff == 0:
                        comparisons.append({
                            'key': 'biasAnalysis.biasedCluster.comparison.equal',
                            'params': {
                                'feature': value
                            }
                        })

        setResult(json.dumps({
            'type': 'accordion',
            'titleKey': 'biasAnalysis.biasedCluster.accordionTitle',
            'comparisons': comparisons
        }))

    if dataType == 'numeric':
        for col in full_df.columns:
            if col != targetColumn and col != 'Cluster' and col != "":
                setResult(json.dumps({
                    'type': 'heading',
                    'headingKey': 'biasAnalysis.distribution.heading',
                    'params': {'variable': col}
                }))

                setResult(json.dumps({
                    'type': 'barchart',
                    'title': col,
                    'data': full_df.groupby('Cluster')[col].mean().to_json(orient='records')
                }))
    else:
        for col in full_df.columns:
            if col != targetColumn and col != 'Cluster' and col != "" and col in features:
                setResult(json.dumps({
                    'type': 'heading',
                    'headingKey': 'biasAnalysis.distribution.heading',
                    'params': {'variable': col}
                }))

                setResult(json.dumps({
                    'type': 'histogram',
                    'title': col,
                    'data': full_df.groupby('Cluster')[col].value_counts().unstack().to_json(orient='records')
                }))

if data != 'INIT':
    run()
`;
