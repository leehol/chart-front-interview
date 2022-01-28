import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import './App.css';
import {Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {List} from "antd";

const TextPart = ({ dataPoint, ...props }) => {
    return (
        <>
            <div>
                <h2>Total number of cases on <b>{moment(dataPoint?.dateChecked).format('LL')}</b></h2>
            </div>
            <div style={{marginTop: 16}}>
                <h3>Positive: <b>{dataPoint?.positive.toLocaleString()}</b></h3>
                <h3>Negative: <b>{dataPoint?.negative.toLocaleString()}</b></h3>
            </div>
        </>
    )
}

const ChartPart = ({ setDataPoint, list, ...props }) => {
    return (
        <>
            <LineChart width={730} height={250} data={list} onClick={(e) => setDataPoint(e.activePayload[0]?.payload)}>
                <XAxis dataKey={"dateChecked"} tickFormatter={(date) => moment(date).format('ll')}/>
                <YAxis hide />
                <Legend />
                <Tooltip labelFormatter={(value) => moment(value).format('LL')}
                         formatter={(value) => value.toLocaleString()}
                />
                <Line type="monotone" dataKey="positive" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="negative" stroke="#82ca9d" dot={false} />
            </LineChart>
        </>
    )
}

function App() {
    const [list, setList] = useState();
    const [dataPoint, setDataPoint] = useState();

    const fetchRequest = () => {
        const BASE_URL = "https://api.covidtracking.com/v1/us/daily.json";
        axios.get(BASE_URL)
            .then(res => {
                setList(res.data.slice(0,100).reverse())
                setDataPoint(res.data[0])
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchRequest()
    }, [])

    return (
        <div className="App">
            <h1><b>COVID19 Tracker</b></h1>
            <div style={{marginTop: 32}}>
                {list && <ChartPart list={list} setDataPoint={setDataPoint} />}
            </div>
            <div style={{marginTop: 64}}>
                {dataPoint && <TextPart dataPoint={dataPoint} />}
            </div>
        </div>
    );
}

export default App;
