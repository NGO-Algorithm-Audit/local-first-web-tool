export const demoCode = `
import random
import pandas as pd
from io import StringIO
from unsupervised_bias_detection.clustering import BiasAwareHierarchicalKModes
import time

start = time.time()


from js import data
from js import setResult
from js import iter
from js import clusters

if data != 'INIT':
	setResult('Parameters:')
	setResult('Iterations:', iter)
	setResult('Clusters:', clusters)
	setResult('')

	csv_data = StringIO(data)

	df = pd.read_csv(csv_data)
	setResult(df.head())

	X = df[['length', '#URLs', '#mentions', '#hashs', 'verified', '#followers', 'user_engagement', 'sentiment_score']]
	y = df['pred_label']
	hbac = BiasAwareHierarchicalKModes(n_iter=iter, min_cluster_size=clusters).fit(X, y)
	setResult(hbac.n_clusters_)
	setResult(hbac.scores_)

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


	setResult('')
	setResult('graphs, but no graphs')
	setResult('')
	setResult(full_df.groupby('Cluster')['length'].value_counts().unstack())
	setResult(full_df.groupby('Cluster')['#URLs'].value_counts().unstack())
	setResult(full_df.groupby('Cluster')['#mentions'].value_counts().unstack())
	setResult(full_df.groupby('Cluster')['#hashs'].value_counts().unstack())
	setResult(full_df.groupby('Cluster')['verified'].value_counts().unstack())
	setResult(full_df.groupby('Cluster')['#followers'].value_counts().unstack())
	setResult(full_df.groupby('Cluster')['user_engagement'].value_counts().unstack())
	setResult(full_df.groupby('Cluster')['sentiment_score'].value_counts().unstack())

	setResult('It took', time.time()-start, 'seconds.')
`;
