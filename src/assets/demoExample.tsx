export const demoCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings
import scipy.stats as stats

warnings.filterwarnings('ignore')

from io import StringIO
from unsupervised_bias_detection.clustering import BiasAwareHierarchicalKModes
from unsupervised_bias_detection.clustering import BiasAwareHierarchicalKMeans
import time
start = time.time()

from js import data
from js import setResult
from js import iter
from js import clusters
from js import targetColumn
from js import dataType


def diffDataframe(df, features, type=None, cluster1=None, cluster2=None):
    '''
    Creates difference dataframe, for numerical and categorical 
    data: Takes dataframe of two clusters of interest and 
    computes difference in means. Default to analyze most deviating 
    cluster vs rest of the dataset, except specified otherwise.
    '''   

    # Cluster comparison (optional)
    if cluster1 != None and cluster2 != None:
        # Dataframes
        df1 = df[df['Cluster'] == cluster1]
        df2 = df[df['Cluster'] == cluster2]

    # Default (most biased vs rest of dataset)
    else:
        # Dataframes
        df1 = df[df['Cluster'] == 0]
        df2 = df[df['Cluster'] != 0]

    # Number of datapoints in clusters
    n_df1 = df1.shape[0]
    n_df2 = df2.shape[0]

    # Initialize dictionaries
    diff_dict = {}
    CI_dict = {}

    # range through features
    for feat in features:
        # Samples
        sample1 = df1[feat]
        sample2 = df2[feat]

        # numercial data
        if type == 'Numerical':
            # Mean per sample
            mean1 = np.mean(sample1)
            mean2 = np.mean(sample2)

            # Difference in sample means
            diff = mean1 - mean2

            # Store results in dict
            diff_dict[feat] = diff

        # categorical data
        else:
            # get all values for categorical feature
            freq1 = sample1.value_counts()
            freq2 = sample2.value_counts()

            # difference in sample freqs
            diff = freq1 - freq2

            # Store results in dict
            diff_dict[feat] = diff

        # # Standard deviation per sample
        # std1 = np.std(sample1, ddof=1)  # ddof=1 for sample standard deviation
        # std2 = np.std(sample2, ddof=1)

        # # Standard error of the difference
        # SE = np.sqrt((std1**2 / n_df1) + (std2**2 / n_df2))

        # # Degrees of freedom for the t-distribution
        # degree_fr = n_df1 + n_df2 - 2

        # # Determine the critical value (t-value) for a 95% confidence interval
        # t_critical = stats.t.ppf(1 - 0.025, degree_fr)  # 95% confidence -> alpha = 0.05, two-tailed

        # # Margin of error
        # ME = t_critical * SE

        # # Confidence intervals
        # lower_bound = diff - ME
        # upper_bound = diff + ME

        # # store confidence interval
        # CI_dict[feat] = (lower_bound, upper_bound)

        # store numerical results in dataframe
        if type == 'Numerical':
            # Store results in dataframe
            pd.set_option('display.float_format', lambda x: '%.5f' % x)
            diff_df = pd.DataFrame.from_dict(diff_dict, orient='index', columns=['Difference'])
            # diff_df.columns = ['lower CI', 'upper CI']
            # diff_df['diff sample means'] = diff_df.index.map(diff_dict)
            
        # store numerical results in dataframe
        else:
            # Store results in dataframe
            diff_df = pd.DataFrame()
            pd.set_option('display.float_format', lambda x: '%.5f' % x)

            # range through all values per feature and concatenate to dataframe
            for _, value in diff_dict.items():
                df_temp = pd.DataFrame(value)
                diff_df = pd.concat([diff_df,df_temp], axis=0,)

            # replace Nan with 0
            diff_df = diff_df.fillna(0)

            # rename columns
            diff_df.columns = ['Difference']   

    return(diff_df)

def run():
    csv_data = StringIO(data)

    df = pd.read_csv(csv_data)

    
    emptycols = df.columns[df.isnull().any()].tolist()
    features = [col for col in df.columns if (col not in emptycols) and (col != targetColumn) and (not col.startswith('Unnamed'))]
    
    ## for feature in features:
    ##    setResult(json.dumps(
    ##        {'type': 'heading', 'data': f'feature {feature}'}
    ##    ))

    X = df[features]
    y = df[targetColumn]

    if dataType == 'numeric':
        hbac = BiasAwareHierarchicalKMeans(n_iter=iter, min_cluster_size=clusters).fit(X, y)
    else:
        hbac = BiasAwareHierarchicalKModes(n_iter=iter, min_cluster_size=clusters).fit(X, y)

    cluster_df = pd.DataFrame(hbac.scores_, columns=['Cluster scores'])

    df['Cluster'] = hbac.labels_

    setResult(json.dumps(
        {'type': 'heading', 'data': 'Parameters selected'}
    ))
    setResult(json.dumps(
        {'type': 'text', 'data': f'Number of iterations: {iter}'}
    ))
    setResult(json.dumps(
        {'type': 'text', 'data': f'Minimal cluster size: {clusters}'}
    ))
    setResult(json.dumps(
        {'type': 'text', 'data': f'Performance metric column: {targetColumn}'}
    ))
    setResult(json.dumps(
        {'type': 'text', 'data': f'Data type: {dataType}'}
    ))
    setResult(json.dumps(
        {'type': 'text', 'data': ''}
    ))


    df_most_biased_cluster = df[hbac.labels_ == 0]
    df_other = df[hbac.labels_ != 0]

    setResult(json.dumps(
        {'type': 'heading', 'data': f'We found {hbac.n_clusters_} clusters. Cluster with most bias consists of {len(df_most_biased_cluster)} datapoints. The uploaded dataset consists of {df.shape[0]} datapoints.'}
    ))


    setResult(json.dumps(
        {'type': 'text', 'data': 'By adapting the "Minimal cluster size" parameter, you can control the number of clusters.'}
    ))

    setResult(json.dumps(
        {'type': 'text', 'data': ''}
    ))

    clusters_array = []

    
    
    full_df = pd.DataFrame()
    for i in range(hbac.n_clusters_):
        labels = df[hbac.labels_ == i]
        labels['Cluster'] = f'{i}'
        clusters_array.append(labels)
    full_df = pd.concat(clusters_array, ignore_index=True)
    full_df.head()

    setResult(json.dumps(
        {'type': 'heading', 'data': 'In the most biased cluster datapoints have:'}
    ))

    if dataType == 'numeric':
        diff_df = diffDataframe(df, features, type='Numerical')
        for feat in features:
            diff = diff_df.loc[feat,"Difference"].round(2)
                
            if diff < 0:
                setResult(json.dumps(
                    {'type': 'text', 'data': f'{abs(diff)} less {feat} than in the rest of the dataset.'}
                ))
            elif diff > 0:
                setResult(json.dumps(
                    {'type': 'text', 'data': f'{diff} more {feat} than in the rest of the dataset.'}
                ))
            elif diff == 0:
                setResult(json.dumps(
                    {'type': 'text', 'data': f'equal {feat} as in the rest of the dataset.'}
                ))
    else:
        diff_df = diffDataframe(df, features, type='Categorical')
        for feat in features:
            values = df[feat].unique().tolist()
            for value in values:
                diff = diff_df.loc[value,"Difference"].round(2)     
                         
                if (isinstance(diff, float)):
                    if diff < 0:
                        setResult(json.dumps(
                            {'type': 'text', 'data': f'{abs(diff)} less {value} than in the rest of the dataset.'}
                        ))
                    elif diff > 0:
                        setResult(json.dumps(
                            {'type': 'text', 'data': f'{diff} more {value} than in the rest of the dataset.'}
                        ))
                    elif diff == 0:
                        setResult(json.dumps(
                            {'type': 'text', 'data': f'equal {value} as in the rest of the dataset.'}
                        ))
        

    if dataType == 'numeric':
        for col in full_df.columns:
            if col != targetColumn and col != 'Cluster' and col != "":
                setResult(json.dumps(
                    {'type': 'heading', 'data': f'The "{col}" variable distribution across the different clusters:'}
                ))

                setResult(json.dumps(
                    {'type': 'barchart', 'title': col, 'data': full_df.groupby('Cluster')[col].mean().to_json(orient='records')}
                ))
    else:
        for col in full_df.columns:
            if col != targetColumn and col != 'Cluster' and col != "" and col in features:
                setResult(json.dumps(
                    {'type': 'heading', 'data': f'The "{col}" variable distribution across the different clusters:'}
                ))

                setResult(json.dumps(
                    {'type': 'histogram', 'title': col, 'data': full_df.groupby('Cluster')[col].value_counts().unstack().to_json(orient='records')}
                ))

if data != 'INIT':
	run()
`;

/*

                setResult(json.dumps(
                    {'type': 'text', 'data': f'DIFF: {type(diff)} {diff} '}
                ))  

            if (isinstance(diff, int)):
                if diff < 0:
                    setResult(json.dumps(
                        {'type': 'text', 'data': f'{abs(diff)} less {value} than in the rest of the dataset.'}
                    ))
                elif diff > 0:
                    setResult(json.dumps(
                        {'type': 'text', 'data': f'{diff} more {value} than in the rest of the dataset.'}
                    ))
                elif diff == 0:
                    setResult(json.dumps(
                        {'type': 'text', 'data': f'equal {value} as in the rest of the dataset.'}
                    ))

"Traceback (most recent call last):
  File "/lib/python312.zip/_pyodide/_base.py", line 574, in eval_code_async
    await CodeRunner(
  File "/lib/python312.zip/_pyodide/_base.py", line 394, in run_async
    coroutine = eval(self.code, globals, locals)
                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<exec>", line 266, in <module>
  File "<exec>", line 230, in run
  File "/lib/python3.12/site-packages/pandas/core/generic.py", line 1576, in __nonzero__
    raise ValueError(
ValueError: The truth value of a Series is ambiguous. Use a.empty, a.bool(), a.item(), a.any() or a.all().
"

for feat in features:
    values = df[feat].unique().tolist()
    for value in values:
        diff = diff_df.loc[value,"Difference"].round(2)
        if diff < 0:
            setResult(json.dumps(
                {'type': 'text', 'data': f'{abs(diff)} less {value} than in the rest of the dataset.'}
            ))
        elif diff > 0:
            setResult(json.dumps(
                {'type': 'text', 'data': f'{diff} more {value} than in the rest of the dataset.'}
            ))
        elif diff == 0:
            setResult(json.dumps(
                {'type': 'text', 'data': f'equal {value} as in the rest of the dataset.'}
            ))



    setResult(json.dumps(
        {'type': 'heading', 'data': f'We found {len(hbac.scores_)} clusters, with the following scores:'}
    ))
        
    setResult(json.dumps(
        {'type': 'table', 'data': cluster_df.to_json(orient='records')}
    ))


    df_cluster0 = df[hbac.labels_ == 0]
    df_cluster1 = df[hbac.labels_ == 1]
    df_cluster2 = df[hbac.labels_ == 2]
    df_cluster3 = df[hbac.labels_ == 3]
    df_cluster4 = df[hbac.labels_ == 4]

    df_cluster0['Cluster'] = '0'
    df_cluster1['Cluster'] = '1'
    df_cluster2['Cluster'] = '2'
    df_cluster3['Cluster'] = '3'
    df_cluster4['Cluster'] = '4'

    full_df = pd.concat([df_cluster0, df_cluster1, df_cluster2, df_cluster3, df_cluster4], ignore_index=True)
    full_df.head()

## for kmeans, instead of value_counts().unstack() do:  mean()    .plot.barh()

## setResult(json.dumps(
##     {'type': 'table', 'data': full_df.groupby('Cluster')['length'].value_counts().unstack().to_json(orient='records')}
## ))

setResult(json.dumps(
    {'type': 'histogram', 'title': col, 'data': full_df.groupby('Cluster')[col].value_counts().unstack().to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "{col}" variable distribution across the different clusters:'}
))

setResult(json.dumps(
{'type': 'histogram', 'title': col, 'data': full_df.groupby('Cluster')[col].value_counts().unstack().fillna(0).to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "URLs" variable distribution across the different clusters:'}
))

setResult(json.dumps(
    {'type': 'histogram', 'title': 'URLs', 'data': full_df.groupby('Cluster')['#URLs'].value_counts().unstack().to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "mention" variable distribution across the different clusters:'}
))

setResult(json.dumps(
    {'type': 'histogram', 'title': 'Mentions', 'data': full_df.groupby('Cluster')['#mentions'].value_counts().unstack().to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "hashs" variable distribution across the different clusters:'}
))

setResult(json.dumps(
    {'type': 'histogram', 'title': 'Hashs', 'data': full_df.groupby('Cluster')['#hashs'].value_counts().unstack().to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "verified" variable distribution across the different clusters:'}
))

setResult(json.dumps(
    {'type': 'histogram', 'title': 'Verified', 'data': full_df.groupby('Cluster')['verified'].value_counts().unstack().to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "followers" variable distribution across the different clusters:'}
))

setResult(json.dumps(
    {'type': 'histogram', 'title': 'Followers', 'data': full_df.groupby('Cluster')['#followers'].value_counts().unstack().to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "user_engagement" variable distribution across the different clusters:'}
))

setResult(json.dumps(
    {'type': 'histogram', 'title': 'User engagement', 'data': full_df.groupby('Cluster')['user_engagement'].value_counts().unstack().to_json(orient='records')}
))

setResult(json.dumps(
    {'type': 'heading', 'data': f'The "sentiment-score" variable distribution across the different clusters:'}
))

setResult(json.dumps(
    {'type': 'histogram', 'title': 'Sentiment score', 'data': full_df.groupby('Cluster')['sentiment_score'].value_counts().unstack().to_json(orient='records')}
))
*/
