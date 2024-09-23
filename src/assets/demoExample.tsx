export const demoCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings

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

    setResult(json.dumps(
        {'type': 'text', 'data': 'Parameters selected'}
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

    setResult(json.dumps(
        {'type': 'heading', 'data': f'We found {len(hbac.scores_)} clusters'}
    ))

    setResult(json.dumps(
        {'type': 'text', 'data': 'By adapting the "Minimal cluster size" parameter, you can control the number of clusters.'}
    ))

    clusters_array = []
    
    full_df = pd.DataFrame()
    for i in range(hbac.n_clusters_):
        labels = df[hbac.labels_ == i]
        labels['Cluster'] = f'{i}'
        clusters_array.append(labels)
    full_df = pd.concat(clusters_array, ignore_index=True)
    full_df.head()

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
