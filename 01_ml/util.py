import pandas as pd
import numpy as np
from matplotlib import dates
import matplotlib.pyplot as plt


def timeseries_plot(y, color, y_label):
    # y is Series with index of datetime
    days = dates.DayLocator()
    dfmt_minor = dates.DateFormatter('%m-%d')
    weekday = dates.WeekdayLocator(byweekday=(), interval=1)

    fig, ax = plt.subplots()
    ax.xaxis.set_minor_locator(days)
    ax.xaxis.set_minor_formatter(dfmt_minor)

    ax.xaxis.set_major_locator(weekday)
    ax.xaxis.set_major_formatter(dates.DateFormatter('\n\n%a'))

    ax.set_ylabel(y_label)
    ax.plot(y.index, y, color)
    fig.set_size_inches(12, 8)
    plt.tight_layout()
    plt.savefig(y_label + '.png', dpi=300)
    plt.show()


def split(df, label=None):
    X = df[[ #'date_only',
             'hour',
             'day_of_week',
             'quarter',
             'month',
             'day_of_year',
             'day_of_month',
             'week_of_year',
             'temperature',
             'weather',
             'holiday',
             't-7',
             't-3',
             't-2',
             't-1']]
    if label:
        y = df[label]
        return X, y
    return X



def config_plot():
    plt.style.use('seaborn-paper')
#    plt.rcParams.update({'axes.prop_cycle': cycler(color='jet')})
    plt.rcParams.update({'axes.titlesize': 20})
    plt.rcParams['legend.loc'] = 'best'
    plt.rcParams.update({'axes.labelsize': 22})
    plt.rcParams.update({'xtick.labelsize': 16})
    plt.rcParams.update({'ytick.labelsize': 16})
    plt.rcParams.update({'figure.figsize': (10, 6)})
    plt.rcParams.update({'legend.fontsize': 20})
    return 1
