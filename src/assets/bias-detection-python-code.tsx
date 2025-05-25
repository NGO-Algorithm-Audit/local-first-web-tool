export const pythonCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings
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
        targetColumn = "score_text"
        dataType = "categorical"
        # Select relevant columns
        columns_of_interest = ["age_cat", "sex", "race", "c_charge_degree", "is_recid", "score_text"]
        filtered_df = df[columns_of_interest]

        features = columns_of_interest

        # Drop rows with missing values
        filtered_df = filtered_df.dropna()

        filtered_df["score_text"] = filtered_df["score_text"].map(lambda x: 1 if x == "High" else 0)
        filtered_df["is_recid"] = filtered_df["is_recid"].astype("category")

        encoder = OrdinalEncoder()
        filtered_df[filtered_df.columns] = encoder.fit_transform(filtered_df)
    else:
        filtered_df = df
    
        
    # split the data into training and testing sets
    train_df, test_df = train_test_split(filtered_df, test_size=0.2, random_state=42)
    X_train = train_df.drop(columns=[targetColumn])
    y_train = train_df[targetColumn]

    # remove the bias metric from the test set to prevent issues with decoding
    X_test = test_df.drop(columns=[targetColumn])


    scaleY = 1
    if higherIsBetter == 1:
        scaleY = -1;

    X = df[features]
    y = scaleY * df[targetColumn]

    if dataType == 'numeric':
        hbac = BiasAwareHierarchicalKMeans(bahc_max_iter=iterations, bahc_min_cluster_size=clusterSize).fit(X, y)
    else:
        hbac = BiasAwareHierarchicalKModes(bahc_max_iter=iterations, bahc_min_cluster_size=clusterSize).fit(X_train, y_train)
    
    
    cluster_df = pd.DataFrame(hbac.scores_, columns=['Cluster scores'])

    num_zeros = np.sum(hbac.labels_ == 0)
    print(f"Number of datapoints in most deviating cluster: {num_zeros}/{train_df.shape[0]}")


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
        'type': 'data-set-preview',
        'data': ''
    }))

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'biasAnalysis.parameters.heading'
    }))


    # Parameter information
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.iterations',
        'params': {'value': iterations}
    }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.minClusterSize',
        'params': {'value': clusterSize}
    }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.performanceMetric',
        'params': {'value': targetColumn}
    }))
    setResult(json.dumps({
        'type': 'text',
        'key': 'biasAnalysis.parameters.dataType',
        'params': {'value': dataType}
    }))
    setResult(json.dumps({
        'type': 'text',
        'data': ''
    }))

    y_test = hbac.predict(X_test.to_numpy())
    # decode X_test using the encoder
    decoded_X_test = test_df.copy()
    decoded_X_test = encoder.inverse_transform(test_df)

    # display the decoded DataFrame
    decoded_X_test = pd.DataFrame(decoded_X_test, columns=test_df.columns)
    decoded_X_test

    decoded_X_test["cluster_label"] = y_test
    
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
