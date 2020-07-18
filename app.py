import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, Response
from datetime import datetime,date
import pandas as pd
from covid import Covid

app = Flask(__name__)
data=[]
covid = Covid()
# all route starts from here
@app.route('/')
@app.route("/home")
def dashboard():
    w_active = covid.get_total_active_cases()
    w_confirmed = covid.get_total_confirmed_cases()
    w_recovered = covid.get_total_recovered()
    w_deaths = covid.get_total_deaths()
    return render_template("home.html")
@app.route("/state", methods=["GET", "POST"])
def state():
    message=""
    state_csv = pd.read_csv('https://api.covid19india.org/csv/latest/state_wise.csv')
    statewise = state_csv.groupby("State").sum()
    try:
        if request.method == "POST":
            state = request.form.get("state")
        result = statewise.loc[state]
        
        data.clear()
        for i in result:
            data.append(int(i))
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
    w_active = covid.get_total_active_cases()
    w_confirmed = covid.get_total_confirmed_cases()
    w_recovered = covid.get_total_recovered()
    w_deaths = covid.get_total_deaths()
    data = covid.get_data()    
    return render_template("world.html",w_active=w_active,w_confirmed=w_confirmed,w_recovered=w_recovered,w_deaths=w_deaths,data=data)

@app.route("/india")
def india():
    state_csv = pd.read_csv('https://api.covid19india.org/csv/latest/state_wise.csv')
    statewise = state_csv.groupby("State").sum()
    total = statewise.loc["Total"]  
    active=total['Active']
    statewise.sort_values(by=['Confirmed'], inplace=True, ascending=False)
    Recovery_rate='%.2f' %((total.Recovered/total.Confirmed)*100)
    Death_rate= '%.2f' %((total.Deaths/total.Confirmed)*100)
    Affect_rate= '%.2f' %((total.Confirmed/1350000000)*100)
    return render_template("india.html",i_active=active,i_confirmed=total.Confirmed,i_recovered=total.Recovered,i_deaths=total.Deaths,Recovery_rate=Recovery_rate,Death_rate=Death_rate,Affect_rate=Affect_rate, data=statewise)

# Main
if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
