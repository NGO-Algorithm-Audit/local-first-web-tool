export const demoCode = `
import random
import requests
import pandas as pd
from io import StringIO
from unsupervised_bias_detection.clustering import BiasAwareHierarchicalKModes
import time
start = time.time()

# 1. fetching CSV from and write it to memory
response = requests.get("https://raw.githubusercontent.com/NGO-Algorithm-Audit/unsupervised-bias-detection/master/classifiers/BERT_disinformation_classifier/test_pred_BERT.csv")
# Check if the request was successful
if response.status_code == 200:
    # Convert the response content to a StringIO object
    csv_data = StringIO(response.text)
    
    df = pd.read_csv(csv_data)
    print(df.head())
    
    X = df[['length', '#URLs', '#mentions', '#hashs', 'verified', '#followers', 'user_engagement', 'sentiment_score']]
    y = df['pred_label']
    hbac = BiasAwareHierarchicalKModes(n_iter=20, min_cluster_size=20).fit(X, y)
    print(hbac.n_clusters_)
    print(hbac.scores_)
    
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
    
    print('graphs, but no graphs')
    print(full_df.groupby('Cluster')['length'].value_counts().unstack())
    print(full_df.groupby('Cluster')['#URLs'].value_counts().unstack())
    print(full_df.groupby('Cluster')['#mentions'].value_counts().unstack())
    print(full_df.groupby('Cluster')['#hashs'].value_counts().unstack())
    print(full_df.groupby('Cluster')['verified'].value_counts().unstack())
    print(full_df.groupby('Cluster')['#followers'].value_counts().unstack())
    print(full_df.groupby('Cluster')['user_engagement'].value_counts().unstack())
    print(full_df.groupby('Cluster')['sentiment_score'].value_counts().unstack())

    print('It took', time.time()-start, 'seconds.')
else:
    print(f"Failed to fetch data: {response.status_code}")
`