export const demoCode = `
import random
import json
import pandas as pd
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

    X = df.drop(columns=[targetColumn])
    y = df[targetColumn]

    if dataType == 'numeric':
        hbac = BiasAwareHierarchicalKMeans(n_iter=iter, min_cluster_size=clusters).fit(X, y)
    else:
        hbac = BiasAwareHierarchicalKModes(n_iter=iter, min_cluster_size=clusters).fit(X, y)

    cluster_df = pd.DataFrame(hbac.scores_, columns=['Cluster scores'])

    setResult(json.dumps(
        {'type': 'heading', 'data': f'We found {len(hbac.scores_)} clusters, with the following scores:'}
    ))


    setResult(json.dumps(
        {'type': 'table', 'data': cluster_df.to_json(orient='records')}
    ))

    setResult(json.dumps(
        {'type': 'text', 'data': 'By adapting the "Minimal cluster size" parameter, you can control the number of clusters.'}
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

    for col in full_df.columns:
        if col != targetColumn and col != 'Cluster' and col != "":
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
