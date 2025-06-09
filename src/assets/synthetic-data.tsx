export const pythonCode = `
import random
import json
import pandas as pd
import numpy as np
import warnings
import scipy.stats as stats
from scipy.stats import norm, ks_2samp
from sklearn.preprocessing import LabelEncoder
from synthpop import MissingDataHandler, DataProcessor, CARTMethod, GaussianCopulaMethod
from synthpop.metrics import (
    MetricsReport,
    EfficacyMetrics,
    DisclosureProtection
)

warnings.filterwarnings('ignore')

from io import StringIO


import time
start = time.time()

from js import data
from js import setResult
from js import isDemo
from js import sdgMethod
from js import samples
from js import setOutputData
from js import nanTreatment


def run():
    csv_data = StringIO(data)

    admissions_df = pd.read_csv(csv_data, index_col=False)
    print("nanTreatment:", nanTreatment)
    # admissions_sub = admissions_df[['sex', 'race1', 'ugpa', 'bar']]
    # real_data = admissions_sub.dropna()
    
    if isDemo: 
        real_data = admissions_df[['sex', 'race1', 'ugpa', 'bar']]
        # real_data = admissions_sub.dropna()    
        setResult(json.dumps({
            'type': 'heading',
            'headingKey': 'syntheticData.demo.heading'
        }))
        setResult(json.dumps({
            'type': 'text',
            'key': 'syntheticData.demo.description'
        }))

        demoData = {
            "syntheticData.demo.data.column.Variable_name": ["syntheticData.demo.data.sex", "syntheticData.demo.data.race1", "syntheticData.demo.data.ugpa", "syntheticData.demo.data.bar"],
            "syntheticData.demo.data.column.Description": [
                "syntheticData.demo.data.column.Description.gender_of_students",
                "syntheticData.demo.data.column.Description.race_of_students",
                "syntheticData.demo.data.column.Description.undergraduate_GPA_student",
                "syntheticData.demo.data.column.Description.Ground_truth_label"
            ],
            "syntheticData.demo.data.column.Values": [
                "syntheticData.demo.data.column.Values.sex",
                "syntheticData.demo.data.column.Values.race",
                "syntheticData.demo.data.column.Values.ugpa",
                "syntheticData.demo.data.column.Values.bar"
            ]
        }

        # Create the DataFrame
        dfDemoData = pd.DataFrame(demoData)

        # Display the DataFrame
        print(dfDemoData)

        setResult(json.dumps({
            'type': 'table', 
            'showIndex': False,
            'translate': True,
            'data': dfDemoData.to_json(orient="records")
        }))

        setResult(json.dumps({
            'type': 'text',
            'key': 'syntheticData.demo.post.description'
        }))

    else:
        admissions_df.reset_index(drop=True, inplace=True)
        real_data = admissions_df
        # real_data = admissions_sub.dropna()

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'syntheticData.dataSetPreview.heading'
    }))
    setResult(json.dumps(
        {'type': 'data-set-preview', 'data': ''}
    ))

    if isDemo:
        real_data['sex'] = real_data['sex'].replace({1: 'male', 2: 'female'})

    print(real_data.isnull().sum())
    
    md_handler = MissingDataHandler()

    # Check the data types
    column_dtypes = md_handler.get_column_dtypes(real_data)


    print("Column Data Types:", column_dtypes)


    # Detect missingness
    missingness_dict = md_handler.detect_missingness(real_data)
    print("Detected Missingness Type:", missingness_dict)

    missingness_dict_df = pd.DataFrame(list(missingness_dict.items()), columns=['key', 'value'])
    missingness_dict_df = missingness_dict_df.rename(columns={'key': 'Column', 'value': 'Missing data type'})

    df_imputed = md_handler.apply_imputation(real_data, missingness_dict)
    

    print("df_imputed.isnull().sum()", df_imputed.isnull().sum())
    

    metadata = column_dtypes
    processor = DataProcessor(metadata)
    
    # Preprocess the data: transforms raw data into a numerical format
    processed_data = processor.preprocess(df_imputed)    

    if (sdgMethod == 'cart'):
        cart = CARTMethod(metadata, smoothing=True, proper=True, minibucket=5, random_state=42)
        cart.fit(processed_data)
        synthetic_processed = cart.sample(samples)

    if (sdgMethod == 'gc'):
        gc = GaussianCopulaMethod(metadata)
        gc.fit(processed_data)
        synthetic_processed = gc.sample(samples)

    print("synthetic_processed (first 5 rows):", synthetic_processed.head())

    synthetic_data = processor.postprocess(synthetic_processed)
    

    # numerical
    # categorical

    print("Synthetic Data (first 5 rows):", synthetic_data.head())
    

    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'syntheticData.columnsInDataset'
    }))
    # print("dtypes_dict:", dtypes_dict)
    

    dataInfo = []
    for column in df_imputed.columns:
        dataInfo.append({
            'key': column, 
            'value': column_dtypes[column]    
        })

    setResult(json.dumps({
        'type': 'list',
        'list': dataInfo
    }))
        
    setResult(json.dumps({
        'type': 'text',
        'key': 'syntheticData.columnsInDatasetInfo'
    }))

    cloned_real_data = df_imputed.copy()
 
    synth_df_decoded = synthetic_data.copy()

    # Convert categorical variables to numerical values
    df_encoded = df_imputed.copy()
    synth_df_encoded = synthetic_data.copy()
    
    for column in column_dtypes:
        if column_dtypes[column] == 'categorical':
            df_encoded[column] = df_encoded[column].astype('category').cat.codes
            synth_df_encoded[column] = synth_df_encoded[column].astype('category').cat.codes
    
    # Output some results
    print("Original Data (first 5 rows):", df_imputed.head())
    print("Synthetic Data (first 5 rows):", synthetic_data.head())

    print("Synthetic Data decoded (first 5 rows):", synth_df_decoded.head())

    # Store synthetic data for export
    setOutputData("syntheticData", synthetic_data.to_json(orient='records'))

    report = MetricsReport(df_imputed, synthetic_data, metadata)
    report_df = report.generate_report()    
    print('report_df:', report_df)

    

    # combine empty synthetic data with original data and with encoded data 
    combined_data = pd.concat((df_imputed.assign(realOrSynthetic='real'), synthetic_data.assign(realOrSynthetic='synthetic')), keys=['real','synthetic'], names=['Data'])

    metrics_list = []

    # Loop through column_dtypes
    for column in column_dtypes:
        if column_dtypes[column] == 'categorical':
            reg_efficacy = EfficacyMetrics(task='classification', target_column=column)
        else:
            reg_efficacy = EfficacyMetrics(task='regression', target_column=column)
        

        reg_metrics = reg_efficacy.evaluate(df_imputed, synthetic_data)
        reg_metrics['dataType'] = column_dtypes[column]
    
        # Append the column name and its metrics as a dictionary
        reg_metrics['column'] = column  # Add column name to the metrics dictionary
        
        metrics_list.append(reg_metrics)

    # Convert list of dictionaries to DataFrame
    metrics_df = pd.DataFrame(metrics_list)
    
    front_columns = ['column', 'dataType']
    other_columns = [col for col in metrics_df.columns if col not in front_columns]
    metrics_df = metrics_df[front_columns + other_columns]

    dp = DisclosureProtection(df_imputed, synthetic_data)
    dp_score = dp.score()
    dp_report = dp.report()

    dp_report_df = pd.DataFrame(dp_report, index=[0])

    print("=== Disclosure Protection ===")
    print(f"Score: {dp_score:.3f}")
    print("Detailed Report:", dp_report)


    setResult(json.dumps({
        'type': 'distribution',
        'real': cloned_real_data.to_json(orient="records"),
        'synthetic': synth_df_decoded.to_json(orient="records"),
        'dataTypes': json.dumps(column_dtypes),
        'combined_data' : combined_data.to_json(orient="records"),
        'realCorrelations': df_encoded.corr().to_json(orient="records"),
        'synthDataCorrelations': synth_df_encoded.corr().to_json(orient="records"),
        'reports' : [ 
            {
                'reportType': 'heading',
                'headingKey': 'syntheticData.handlingMissingDataTitle' 
            },
            {
                'reportType': 'text',
                'textKey': 'syntheticData.handlingMissingDataDescription'
            },            
            {            
                'reportType': 'table',
                'titleKey': 'syntheticData.handlingMissingDataTableTitle',
                'showIndex' : False,    
                'data': missingness_dict_df.to_json(orient="records"),
                'noTableBelowTable': True                                            
            },
            {
                'reportType': 'text',
                'textKey': 'syntheticData.missingData',
                'noHTML': True
            },
            {
                'reportType': 'heading',
                'headingKey': 'syntheticData.cartModelTitle' if sdgMethod == 'cart' else 'syntheticData.gaussianCopulaModelTitle'
            },           
            {
                'reportType': 'text',
                'textKey': 'syntheticData.cartModelDescription' if sdgMethod == 'cart' else 'syntheticData.gaussianCopulaModelDescription'
            },
            {
                'reportType': 'heading',
                'headingKey': 'syntheticData.evaluationOfGeneratedDataTitle'
            },
            {
                'reportType': 'heading2',
                'headingKey': 'syntheticData.distributionsTitle'
            },
            {'reportType': 'univariateDistributionSyntheticData'},
            {'reportType': 'bivariateDistributionSyntheticData'},
            {
                'reportType': 'heading2',
                'headingKey': 'syntheticData.diagnosticsReportTitle'
            },            
            {            
                'reportType': 'table',
                'titleKey': 'syntheticData.diagnosticsTitle',
                'showIndex' : False,   
                'preContent' : [{
                    'contentType': 'text',
                    'textKey': 'syntheticData.diagnosticsReportDescription'    
                }],
                'data': report_df.to_json(orient="records"),                                           
            },
            {            
                'reportType': 'correlationSyntheticData',
                'titleKey': 'syntheticData.correlationMatrixTitle',
                'preContent' : [{
                    'contentType': 'text',
                    'textKey': 'syntheticData.correlationMatrixDescription'    
                }],                    
            },
            {
                'reportType': 'table',
                'titleKey': 'syntheticData.efficacyMetricsTitle',
                'showIndex' : False,
                'preContent' : [{
                    'contentType': 'text',
                    'textKey': 'syntheticData.efficacyMetricsDescription'
                }],
                'data': metrics_df.to_json(orient="records"),                
            },
            {
                'reportType': 'table',
                'titleKey': 'syntheticData.disclosureProtectionTitle',
                'showIndex' : False,
                'preContent' : [{
                    'contentType': 'text',
                    'textKey': 'syntheticData.disclosureProtectionDescription'
                },{
                    'contentType': 'text',
                    'text': f"Score: {dp_score:.3f}"
                }],
                'data': dp_report_df.to_json(orient="records"),                
            }                       
        ]
    }))

    setResult(json.dumps({
        'type': 'heading', 
        'headingKey': 'syntheticData.outputDataTitle'        
    }))

    setResult(json.dumps({
        'type': 'table', 
        'showIndex': True,
        'data': synthetic_data.head().to_json(orient="records")
    }))


    setResult(json.dumps({
        'type': 'heading',
        'headingKey': 'syntheticData.moreInfoTitle'
    }))

    setResult(json.dumps({
        'type': 'text',
        'key': 'syntheticData.moreInfo'
    }))

    return 
    

if data != 'INIT':
	run()
`;

/*

    # df_numeric = df_imputed.apply(pd.to_numeric, errors='coerce')
    # synth_df_numeric = synthetic_data.apply(pd.to_numeric, errors='coerce')

    # 'syntheticCorrelations': np.abs(df_numeric.corr() - synth_df_numeric.corr()).to_json(orient="records"),


# {
            #    'reportType': 'heading',
            #    'headingKey': 'syntheticData.explanatoryDataAnalysisTitle'
            # },
            # {'reportType': 'univariateDistributionRealData'},
            # {'reportType': 'bivariateDistributionRealData'},
            # {'reportType': 'correlationRealData'},
            # {'reportType': 'correlationSynthData'},

*/
