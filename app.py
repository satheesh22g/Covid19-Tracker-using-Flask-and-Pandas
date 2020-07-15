import os
from flask import Flask, session, render_template, request, redirect, url_for, flash, jsonify, Response
from datetime import datetime,date
import pandas as pd

app = Flask(__name__)
data=[]
world_total_cases=pd.read_csv('https://covid.ourworldindata.org/data/ecdc/total_cases.csv')
world_deaths = pd.read_csv('https://covid.ourworldindata.org/data/ecdc/total_deaths.csv')
# all route starts from here
@app.route('/')
@app.route("/home")
def dashboard():

    return render_template("home.html", home=True)
@app.route("/state", methods=["GET", "POST"])
def state():
    state_csv = pd.read_csv('https://api.covid19india.org/csv/latest/state_wise.csv')
    statewise = state_csv.groupby("State").sum()
    try:
        if request.method == "POST":
            state = request.form.get("state")
        result = statewise.loc[state]
        
        data.clear()
        for i in result:
            data.append(int(i))
    
    except:
        flash("No Data Found")
        return render_template("home.html")
    return render_template("home.html",data1=data,state=state)

@app.route("/country", methods=["GET", "POST"])
def country():
    country_csv = pd.read_csv('https://covid.ourworldindata.org/data/ecdc/total_cases.csv')
    countrywise = country_csv.groupby("date").sum()
    if request.method == "POST":
        country = request.form.get("country")
        data=countrywise.loc[str(date.today()),country]
        return render_template("home.html",data2=data,country=country)
# Main
if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
