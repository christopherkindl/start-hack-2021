from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.trigger_rule import TriggerRule
from airflow.models import Variable
from airflow.hooks.S3_hook import S3Hook
from airflow.hooks.postgres_hook import PostgresHook

from datetime import datetime
from datetime import timedelta
import logging


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

    import pandas as pd
    import numpy as np
    #import matplotlib.pyplot as plt
    import time
    from bs4 import BeautifulSoup #requires pip install
    import requests
    import re
    from re import sub
    from decimal import Decimal
    import io

    # Machine Learning Pipeline
    log.info('data creation started')
    list1 = [str(i) for i in range(20)]
    list2 = [str(i**2) for i in range(20)]
    log.info('list creation done')
    log.info("Train data creation successfull")

    df = pd.DataFrame(list(zip(list1, list1)), columns=['list1','list2'])
    log.info('df done')
    log.info("Prediction done")

   #Establishing S3 connection
    s3 = S3Hook(kwargs['aws_conn_id'])
    bucket_name = kwargs['bucket_name']

    #creating timestamp

    # from datetime import datetime
    #
    # now = datetime.now() # current date and time

    # date_time = now.strftime("%Y_%m_%d_%HH_%Mm")
    # print("date and time:",date_time)

    #name of the file
    key = Variable.get("get_csv", deserialize_json=True)['key1']+".csv" 

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

    #Establishing connection to S3 bucket
    bucket_name = kwargs['bucket_name']
    key = Variable.get("get_csv", deserialize_json=True)['key1']+".csv"
    s3 = S3Hook(kwargs['aws_conn_id'])
    log.info("Established connection to S3 bucket")


    # Get the task instance
    task_instance = kwargs['ti']
    print(task_instance)


    # Read the content of the key from the bucket
    #csv_bytes_zoopla = s3.read_key(key, bucket_name)
    prediction = s3.read_key(key, bucket_name)

    # Read the CSV
    #clean_zoopla = pd.read_csv(io.StringIO(prediction))#, encoding='utf-8')
    prediction_csv = pd.read_csv(io.StringIO(prediction))#, encoding='utf-8')

    log.info('passing data from S3 bucket')

    # Connect to the PostgreSQL database
    pg_hook = PostgresHook(postgres_conn_id=kwargs["postgres_conn_id"], schema=kwargs['db_name'])
    conn = pg_hook.get_conn()
    cursor = conn.cursor()

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
    for index in range(len(prediction_csv)):
        obj = []

        obj.append([prediction_csv.id[index],
                   prediction_csv.occupancy_rate[index]])

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
