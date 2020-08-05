import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, Response
from datetime import datetime,date
import pandas as pd
from covid import Covid
# import matplotlib.pyplot as plt
# from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import jinja2
import numpy as np

# plt.style.use('ggplot')

app = Flask(__name__)
data=[]
covid = Covid()
state_csv = pd.read_csv('https://api.covid19india.org/csv/latest/state_wise.csv')
statewise = state_csv.groupby("State").sum()
statewise['Death_Rate'] = (statewise['Deaths']/statewise['Confirmed'])*100
statewise['Recovery_Rate'] = (statewise['Recovered']/statewise['Confirmed'])*100
data = covid.get_data()

# corona_dataset_csv = pd.read_csv('https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv')
# corona_dataset_csv.drop(['Lat','Long'],axis=1,inplace=True)
# corona_dataset_aggregated = corona_dataset_csv.groupby("Country/Region").sum()
# all route starts from here
@app.route('/')
@app.route("/home")
def dashboard():
    return render_template("home.html")
@app.route("/state", methods=["GET", "POST"])
def state():
    message=""
    try:
        if request.method == "POST":
            state = request.form.get("state")
        result = statewise.loc[state]
        
        data.clear()
        for i in result:
            data.append((i))
        if data is not None:
            return render_template("home.html",data1=data,state=state)
        else:
            message="Invalid State"
            return render_template("home.html",message=message)    
    except:
        message="Invalid State"
        return render_template("home.html",message=message)
    return render_template("home.html",data1=data,state=state,message=message)

@app.route("/country", methods=["GET", "POST"])
def country():
    try:
        if request.method == "POST":
            country = request.form.get("country")
            data=covid.get_status_by_country_name(country)
            return render_template("home.html",data2=data,country=country)
    except:
        message="Invalid Country"
        return render_template("home.html",message=message)
    return render_template("home.html",data1=data,state=state,message=message)
@app.route("/world")
def world():
    return render_template("world.html",w_active=covid.get_total_active_cases(),w_confirmed=covid.get_total_confirmed_cases(),w_recovered=covid.get_total_recovered(),w_deaths=covid.get_total_deaths(),data=data)

@app.route("/india")
def india():
    total = statewise.loc["Total"]  
    active=total['Active']
    statewise.sort_values(by=['Confirmed'], inplace=True, ascending=False)
    Recovery_rate= '%.2f' %total.Recovery_Rate
    Death_rate= '%.2f' %total.Death_Rate
    Affect_rate= '%.2f' %((total.Confirmed/1350000000)*100)
    # x=corona_dataset_aggregated.loc['India'].diff().plot()
    # x.savefig('/static/images/new_plot.png')
    return render_template("india.html",i_active=active,i_confirmed=total.Confirmed,i_recovered=total.Recovered,i_deaths=total.Deaths,Recovery_rate=Recovery_rate,Death_rate=Death_rate,Affect_rate=Affect_rate, data=statewise)

    
# Main
if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.jinja_env.cache = {}
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
