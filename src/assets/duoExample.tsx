export const duoCode = `
import random
import requests
import pandas as pd
from io import StringIO
from sklearn.preprocessing import LabelEncoder
from unsupervised_bias_detection.clustering import BiasAwareHierarchicalKModes
import time
start = time.time()

def stat_df_cat(df1, df2, features):
    '''
    For categorical data only: Takes dataframe of cluster 
    with highest bias and dataframe of the rest of the 
    datasets and computes differency in frequency, should 
    return 95% confidence intervals based on Chi2-test in
    the future.
    '''   

    # initialize dictionaries
    diff_dict = {}
    # chi2_dict = {}
    # cramer_dict = {}
    # CI_dict_left = {}
    # CI_dict_right = {}

    # range through features
    for feat in features:
        df1_feat = df1[feat].value_counts()
        df2_feat = df2[feat].value_counts()

        # merge dfs on the feat column
        merged_df = pd.merge(df1_feat, df2_feat, on=feat, suffixes=('_df1', '_df2'))
        merged_df['diff'] = merged_df['count_df1']-merged_df['count_df2']
        diff_dict[feat] = merged_df['diff'].to_dict()

        # # Create a contingency table
        # contingency_table = merged_df[['count_df1', 'count_df2']].values
        # print(contingency_table)

        # # Perform chi-square test
        # chi2_stat, p_value, dof, expected = chi2_contingency(contingency_table)

        # # Calculate Cramér's V
        # n = contingency_table.sum()
        # phi2 = chi2_stat/n
        # r, k = contingency_table.shape
        # cramers_v = np.sqrt(phi2 / min(k-1, r-1))

        # # Compute 95% confidence interval for Cramér's V
        # alpha = 0.05
        # chi2_critical = chi2.ppf(1 - alpha, dof)
        # ci_lower = np.sqrt((phi2 - (chi2_critical / (2*n))) / min(k-1, r-1))
        # ci_upper = np.sqrt((phi2 + (chi2_critical / (2*n))) / min(k-1, r-1))

        # # attach to dictionaries
        # chi2_dict[feat] = p_value
        # cramer_dict[feat]  = cramers_v
        # CI_dict_left[feat] = ci_lower
        # CI_dict_right[feat] = ci_upper
        
    # store results in dataframe
    pd.set_option('display.float_format', lambda x: '%.5f' % x)
    dataframes = [pd.DataFrame(data, index=['Difference']) for key, data in diff_dict.items()]
    cluster_analysis_df = pd.concat(dataframes, axis=1).T
    # cluster_analysis_df = pd.DataFrame([diff_dict['Education'], chi2_dict, CI_dict_left, CI_dict_right]).T
    # cluster_analysis_df.columns = ['difference','p-value','[0.025','0.975]']
    # cluster_analysis_df = cluster_analysis_df.sort_values('p-value',ascending=[True])
    # n_rows = cluster_analysis_df.shape[0]

    # # Get errors; (coef - lower bound of conf interval)
    # cluster_analysis_df['errors'] = cluster_analysis_df['difference'] - cluster_analysis_df['[0.025']
    # cluster_analysis_df = cluster_analysis_df.iloc[0:n_rows,]
    # cluster_analysis_df['num'] = [int(i) for i in np.linspace(n_rows-1,0,n_rows)]

    # cluster_analysis_df = cluster_analysis_df.reset_index()
    
    # return(cluster_analysis_df)
    return(cluster_analysis_df)
    # return(diff_dict, chi2_dict, cramer_dict, CI_dict_left, CI_dict_right)

# 1. fetching CSV from and write it to memory
response = requests.get("https://raw.githubusercontent.com/NGO-Algorithm-Audit/synthetic-data-generation/main/DUO/Table1_SD_20k.csv?token=GHSAT0AAAAAACLHJG7CJJTB5FPGSEYPYZA6ZVD6IPA")
# Check if the request was successful
if response.status_code == 200:
    # Convert the response content to a StringIO object
    csv_data = StringIO(response.text)
    
    df = pd.read_csv(csv_data)
    print(df.head())
    print(df.shape)
    
    # mapping high risk categories to 0 (low metric value) and low risk categories to 1 (high metric value)
    mapping = {6:0, 5:0, 4:1, 3:1, 2:1, 1:1}
    df['Risk category'] = df['Risk category'].map(mapping)
    
    # encode columns values to numerical values
    le1, le2, le3 = LabelEncoder(), LabelEncoder(), LabelEncoder()
    df['Education'] = le1.fit_transform(df['Education'])
    df['Age'] = le2.fit_transform(df['Age'])
    df['Distance'] = le3.fit_transform(df['Distance'])
    
    print(df.head())
    
    features=['Education','Age','Distance']
    X = df[features]
    y = df['Risk category']
    hbac = BiasAwareHierarchicalKModes(n_iter=20, min_cluster_size=750).fit(X, y)
    
    print(hbac.n_clusters_)
    print(hbac.scores_)
    
    # Invert numerical labels back to original categorical labels
    df['Education'] = le1.inverse_transform(df['Education'])
    df['Age'] = le2.inverse_transform(df['Age'])
    df['Distance'] = le3.inverse_transform(df['Distance'])
    
    # cluster with most bias has label 0
    df_most_biased_cluster = df[hbac.labels_ == 0]
    df_other = df[hbac.labels_ != 0]
    
    diff_df = stat_df_cat(df_most_biased_cluster,df_other,features=features)
    print(diff_df)
    print(diff_df.index)
    print(diff_df['Difference'])
    
    print('It took', time.time()-start, 'seconds.')
else:
    print(f"Failed to fetch data: {response.status_code}")
`