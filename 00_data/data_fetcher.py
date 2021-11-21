import argparse
import datetime
import json
import os
import time
import pandas as pd
import pycurl

TMP_DIR_NAME = './tmp'

def fetch_data(_dir, _lot_name, _year, _month, force=False):

    # All the parking lot IDs
    parking_ids = {'lenzburg': 2607, 'burgdorf': 2608, 'rapperswil': 2740, 'rotkreuz': 2738}

    if _lot_name not in parking_ids:
        print("Could not find the parking '{}'. Aborting...".format(_lot_name))
        exit()

    # If force is set to false and file already exists => exit
    if not force and os.path.exists('{}/{}_{}_{}.csv'.format(_dir, _lot_name, _year, month)):
        print("\tFile already exists [{}_{}]".format(year, month))
        return
    else:
        print("\tpulling {}_{}".format(year, month))

    # API Key and desired parking lot
    API_KEY = "L1th3y6hCg9W1LrnKrWIZDRzO8gJxUu2DlUK6SYZuuE="
    PARKING_ID = parking_ids[_lot_name]

    # Fetch payload
    with open('request.json', 'r') as f:
        payload = json.load(f)

    # year, month, day, hour [0-24], minute, seconds
    start_time = int(time.mktime(datetime.datetime(_year, _month, 1, 0).timetuple()))
    end_time = int(time.mktime(datetime.datetime(_year, (_month % 12) + 1, 1, 0).timetuple()))

    # Set it to the query payload
    payload['query_filter']['start'] = start_time
    payload['query_filter']['end'] = end_time
    payload['query_filter']['parking_lot_ids'] = [PARKING_ID]

    '''
    2020 <= year <= 2021
    1 <= month <= 12
    1 <= day <= number of days in the given month and year
    0 <= hour < 24
    '''

    ####################################
    ######### FETCH DATA - API #########
    ####################################

    crl = pycurl.Curl() 

    # Set URL value
    request_url = 'https://api.parking-pilot.com/analysis/parking-operations/csv?apikey={}'.format(API_KEY)
    crl.setopt(crl.URL, request_url)

    # Set headers
    crl.setopt(crl.HTTPHEADER, ['accept: */*', 'Content-Type: application/json'])

    # Set payload
    crl.setopt(crl.POSTFIELDS, json.dumps(payload))

    # Write bytes that are utf-8 encoded
    filename = '{}_{}_{}.csv'.format(_lot_name, _year, month)
    with open(_dir + '/' + filename, 'wb') as f:
        crl.setopt(crl.WRITEFUNCTION, f.write)
        crl.perform()
        crl.close()

    return filename

def merge_data(_dir, _files, _storage_file):
    df = pd.DataFrame({
        'arrival_local': [],
        'departure_local': []
    })

    for file in _files:
        temp_df = pd.read_csv(os.path.join(_dir, file), sep=';',
                        header=None, names=['parking_space_id', 'arrival_unix_seconds', 'departure_unix_seconds', 'arrival_local', 'departure_local'],
                        skiprows=1, usecols=[1,2,3,5,6])
        df = df.append(temp_df, ignore_index=True)

    df.to_csv(_storage_file, ';')
    

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Fetch parking data from parking-pilot.com')
    parser.add_argument('-l', '--location', action='store', nargs=1, default=['burgdorf'], type=str)
    parser.add_argument('-k', '--keep', action='store_true')

    args = parser.parse_args()

    # Parameters
    lot_name = args.location[0]

    print("Fetching data for '{}'".format(lot_name.upper()))

    remove_tmp = False

    # create temporary data folder if it doesn't exists already
    if not os.path.exists(TMP_DIR_NAME):
        print('Creating temporary directory {}'.format(TMP_DIR_NAME))
        os.mkdir(TMP_DIR_NAME)
        remove_tmp = True
    else:
        print('Using existing directory {}'.format(TMP_DIR_NAME))

    # iterate over the desired date range
    files_created = []
    for year in [2020, 2021]:
        for month in range(1, 13, 1):
            files_created.append(fetch_data(TMP_DIR_NAME, lot_name, year, month, force=False))

    # merge the data files
    merge_data(TMP_DIR_NAME, files_created, './{}_merged.csv'.format(lot_name))

    # delete all temporary files
    if not args.keep:
        for f in files_created:
            if f == None:
                continue

            print('Deleting file {}'.format(f))
            os.remove(os.path.join(TMP_DIR_NAME, f))
    else:
        print("Temporary files saved to folder './{}'".format(TMP_DIR_NAME))

    # if we created the temporary directory, delete it as well
    if remove_tmp and not args.keep:        
        os.removedirs(TMP_DIR_NAME)
        print('Deleted temporary folder {}.'.format(TMP_DIR_NAME))

    print('File saved: ./{}_merged.csv'.format(lot_name))
