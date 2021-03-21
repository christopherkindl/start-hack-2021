from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.trigger_rule import TriggerRule
from airflow.models import Variable
from airflow.hooks.S3_hook import S3Hook
from airflow.hooks.postgres_hook import PostgresHook

from datetime import datetime
from datetime import timedelta
import logging


import pandas as pd

#import datetime

from statsmodels.tsa.arima_model import ARIMA
import matplotlib.pyplot as plt
from pmdarima import auto_arima
import math
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn import preprocessing

import pandas as pd
import numpy as np

from matplotlib import pyplot as plt

from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.seasonal import seasonal_decompose 

from statsmodels.tsa.holtwinters import SimpleExpSmoothing   

from statsmodels.tsa.holtwinters import ExponentialSmoothing
from fbprophet import Prophet


import time


log = logging.getLogger(__name__)


# =============================================================================
# 1. Set up the main configurations of the dag
# =============================================================================
# now = datetime.now() # current date and time
# date_time = now.strftime("%Y_%m_%d_%HH")
# print("date and time:",date_time)

default_args = {
    'start_date': datetime(2021, 3, 8),
    'owner': 'Airflow',
    'filestore_base': '/tmp/airflowtemp/',
    'email_on_failure': True,
    'email_on_retry': False,
    'aws_conn_id': "aws_default_starthackathon",
    'bucket_name': Variable.get("ml_pipeline", deserialize_json=True)['bucket_name'],
    'postgres_conn_id': 'starthackathon_christopherkindl',
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    'db_name': Variable.get("housing_db", deserialize_json=True)['db_name']
}


dag = DAG('ml_pipeline',
          description='machine learning pipeling for start hackathon 2021',
          schedule_interval='@weekly',
          catchup=False,
          default_args=default_args,
          max_active_runs=1)

# =============================================================================
# 2. Define different functions
# =============================================================================

# Creating schema if inexistant
def create_schema(**kwargs):
    pg_hook = PostgresHook(postgres_conn_id=kwargs['postgres_conn_id'], schema=kwargs['db_name'])
    conn = pg_hook.get_conn()
    cursor = conn.cursor()
    log.info('Initialised connection')
    sql_queries = """
    CREATE SCHEMA IF NOT EXISTS sbb_schema;
    DROP TABLE IF EXISTS sbb_schema.prediction;
    CREATE TABLE IF NOT EXISTS sbb_schema.prediction(
        "id" numeric,
        "occupancy_rate" numeric
    );
    """

    cursor.execute(sql_queries)
    conn.commit()
    log.info("Created Schema and Tables")

def ml_train_prediction(**kwargs):

    tickets['start'] = pd.to_datetime(tickets['start'])
    tickets['end'] = pd.to_datetime(tickets['end'])

    tickets['start'] = tickets['start'].apply(lambda x: x.replace(tzinfo=None))
    tickets['end'] = tickets['end'].apply(lambda x: x.replace(tzinfo=None))

    TOTAL_SPACE = 180

    #############################################
    # Tickets Processing

    tickets = tickets.sort_values(by="start") 

    def rounder(t):
        if t.minute >= 30:
            try:
                return t.replace(second=0, microsecond=0, minute=0, hour=t.hour+1)
            except ValueError:
                #return t.replace(day=t.day+1, second=0, microsecond=0, minute=0, hour=0)
                t = t.replace(second=0, microsecond=0, minute=0, hour=0)
                t = t+timedelta(hours=24)
                return t
        else:
            return t.replace(second=0, microsecond=0, minute=0)

    d = {}
    for row in range(len(tickets)):
        
        td = tickets.iloc[row][1] - tickets.iloc[row][0]
        hours = td.total_seconds() / 3600
        
        start = rounder(tickets.iloc[row][0])
        for hour in range(int(hours+1)):
            if start+timedelta(hours=hour) in d:
                d[start+timedelta(hours=hour)] += 1
            else:
                d[start+timedelta(hours=hour)] = 1

    tickets_conv = pd.DataFrame(d.items(), columns=['date', 'occupancy_rate'])

    # Occupancy dataset from ticket sales
    tickets_conv['occupancy_rate'] = (tickets_conv['occupancy_rate'] / TOTAL_SPACE)*100

    tickets_conv = tickets_conv.groupby("date").mean()

    #############################################

    #############################################
    # True occupancy processing

    true_occ['Datum'] = pd.to_datetime(true_occ['Datum'])

    true_occ = true_occ.rename(columns={'Datum': 'date', 'BELEGUNGSQUOTE (%)': 'occupancy_rate'})

    true_occ['date'] = true_occ['date'].apply(lambda x: x.replace(tzinfo=None))

    true_occ = true_occ.sort_values(by="date")
    true_occ = true_occ.groupby("date").mean()

    #############################################



    #############################################
    # Add Gaussian Noise to simulate user inputs

    mu, sigma = 0, 5 
    # creating a noise with the same dimension as the dataset (2,2) 
    noise = np.random.normal(mu, sigma, [len(true_occ),1]) 

    user_input = true_occ + noise
    ##########################################

    #############################################
    # Fill missing dates

    user_input = user_input.reset_index()
    i = 1
    while user_input.iloc[i]['date'] < user_input.iloc[-1]['date']:
        if user_input.iloc[i]['date'] != user_input.iloc[i-1]['date']+timedelta(hours=1):
            line = pd.DataFrame({"date": user_input.iloc[i-1]['date']+timedelta(hours=1),"occupancy_rate": user_input["occupancy_rate"].quantile(.25)}, index=[i])
            user_input = pd.concat([user_input.iloc[:i], line, user_input.iloc[i:]]).reset_index(drop=True)
        i+=1


    tickets_conv = tickets_conv.reset_index()
    i = 1
    while tickets_conv.iloc[i]['date'] < tickets_conv.iloc[-1]['date']:
        if tickets_conv.iloc[i]['date'] != tickets_conv.iloc[i-1]['date']+timedelta(hours=1):
            line = pd.DataFrame({"date": tickets_conv.iloc[i-1]['date']+timedelta(hours=1),"occupancy_rate": tickets_conv.iloc[i-1]['occupancy_rate']}, index=[i])
            tickets_conv = pd.concat([tickets_conv.iloc[:i], line, tickets_conv.iloc[i:]]).reset_index(drop=True)
        i+=1

    user_input = user_input.groupby("date").mean()
    tickets_conv = tickets_conv.groupby("date").mean()

    #############################################

    #############################################
    # Create training data

    start = max(user_input.index[0], tickets_conv.index[0])
    end = min(user_input.index[-1], tickets_conv.index[-1])

    user_input_train = user_input[start:end]
    tickets_train = tickets_conv[start:end]

    train_data = (user_input_train*0.7)+(tickets_train*5*0.3)

    #############################################

    #############################################
    # Create training data

    train_data['occupancy_rate'] = train_data['occupancy_rate'].apply(lambda x: 0 if x < 0 else x)
    #train_data['occupancy_rate'] = train_data['occupancy_rate'].apply(lambda x: 100.0 if x > 100.0 else x)

    train_data_hw = train_data.iloc[:]
    train_data['occupancy_rate'] = train_data['occupancy_rate'].apply(lambda x: 0.5 if x == 0 else x)

    #train_hw = ExponentialSmoothing(train_data_hw['occupancy_rate'],
    #                                            trend=None,seasonal='mul',seasonal_periods=24).fit()

    #pred = train_hw.forecast(7*24)

    model = Prophet()
    model.fit(train_data_hw.reset_index().rename(columns={'date':'ds', 'occupancy_rate': 'y'}))

    # Create dummy test set
    ds = []
    sdate = train_data_hw.index[-1]
    for i in range(1,(24*7)+1):
        ds.append(sdate+timedelta(hours=i))

    y = [0]*(24*7)
    inp = pd.DataFrame({'ds':ds, 'y':y})

    pred = model.predict(inp)

    x = pred['yhat'].values #returns a numpy array
    min_max_scaler = preprocessing.MinMaxScaler()
    x_scaled = min_max_scaler.fit_transform(x.reshape(-1, 1))

    df = pd.DataFrame(x_scaled)

    out = pd.DataFrame({'date':inp.ds, 'occupancy_rate':df[0]})


    ############# Model Output

    # Occupancy dataset from ticket sales
    tickets_conv['occupancy_rate'] = (tickets_conv['occupancy_rate'] / TOTAL_SPACE)*100

    #Adjusting "None values to be NaN for df
    df = df.replace(r'None', np.NaN)
    # df = df.where(pd.notnull(df), None)
    log.info("Scraping succesful")


    #Establishing S3 connection
    s3 = S3Hook(kwargs['aws_conn_id'])
    bucket_name = kwargs['bucket_name']


    #name of the file
    key = Variable.get("housing_webscraping_get_csv", deserialize_json=True)['key1']+".csv" 

    # Prepare the file to send to s3
    csv_buffer_zoopla = io.StringIO()
    #Ensuring the CSV files treats "NAN" as null values
    zoopla_csv=df.to_csv(csv_buffer_zoopla, index=False)

    # Save the pandas dataframe as a csv to s3
    s3 = s3.get_resource_type('s3')

    # Get the data type object from pandas dataframe, key and connection object to s3 bucket
    data = csv_buffer_zoopla.getvalue()

    print("Saving CSV file")
    object = s3.Object(bucket_name, key)

    # Write the file to S3 bucket in specific path defined in key
    object.put(Body=data)

    log.info('Finished saving the scraped data to s3')

    return
## DUMMMY TEST

# Saving file to postgreSQL database




def save_result_to_postgres_db(**kwargs):

    import pandas as pd
    import io

    # #Establishing connection to S3 bucket
    # bucket_name = kwargs['bucket_name']
    # key = Variable.get("get_csv", deserialize_json=True)['key1']+".csv"
    # s3 = S3Hook(kwargs['aws_conn_id'])
    # log.info("Established connection to S3 bucket")


    # # Get the task instance
    # task_instance = kwargs['ti']
    # print(task_instance)


    # # Read the content of the key from the bucket
    # #csv_bytes_zoopla = s3.read_key(key, bucket_name)
    # prediction = s3.read_key(key, bucket_name)

    # # Read the CSV
    # #clean_zoopla = pd.read_csv(io.StringIO(prediction))#, encoding='utf-8')
    # prediction_csv = pd.read_csv(io.StringIO(prediction))#, encoding='utf-8')

    # log.info('passing data from S3 bucket')

    # # Connect to the PostgreSQL database
    # pg_hook = PostgresHook(postgres_conn_id=kwargs["postgres_conn_id"], schema=kwargs['db_name'])
    # conn = pg_hook.get_conn()
    # cursor = conn.cursor()

    log.info('Initialised connection')

    #Required code for clearing an error related to int64
    import numpy
    from psycopg2.extensions import register_adapter, AsIs
    def addapt_numpy_float64(numpy_float64):
        return AsIs(numpy_float64)
    def addapt_numpy_int64(numpy_int64):
        return AsIs(numpy_int64)
    register_adapter(numpy.float64, addapt_numpy_float64)
    register_adapter(numpy.int64, addapt_numpy_int64)

    log.info('Loading row by row into database')
    # #Removing NaN values and converting to NULL:

    #clean_zoopla = clean_zoopla.where(pd.notnull(clean_zoopla), None)

    s = """INSERT INTO sbb_schema.prediction(id, occupancy_rate) VALUES (%s, %s)"""
    for index in range(len(df)):
        obj = []

        obj.append([df.id[index],
                    df.occupancy_rate[index]])

        cursor.executemany(s, obj)
        conn.commit()

    log.info('Finished saving the to postgres database')




# =============================================================================
# 3. Set up the main configurations of the dag
# =============================================================================

create_schema = PythonOperator(
    task_id='create_schema',
    python_callable=create_schema,
    op_kwargs=default_args,
    provide_context=True,
    dag=dag,
)
ml_train_prediction = PythonOperator(
    task_id='ml_task',
    provide_context=True,
    python_callable=ml_train_prediction,
    op_kwargs=default_args,
    dag=dag,

)


save_result_to_postgres_db = PythonOperator(
    task_id='save_result_to_postgres_db',
    provide_context=True,
    python_callable=save_result_to_postgres_db,
    trigger_rule=TriggerRule.ALL_SUCCESS,
    op_kwargs=default_args,
    dag=dag,

)




# =============================================================================
# 4. Indicating the order of the dags
# =============================================================================

create_schema >> ml_train_prediction >> save_result_to_postgres_db
